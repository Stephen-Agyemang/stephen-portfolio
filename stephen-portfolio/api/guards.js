import crypto from "node:crypto";
import { pipeline, pipelineDetached, redisAvailable } from "./upstash.js";

const env = globalThis.process?.env ?? {};

const DEFAULT_ORIGINS = [
    "https://stephenagyemang.com",
    "https://www.stephenagyemang.com",
    "https://stephagyemang-portfolio.web.app",
    "https://stephagyemang-portfolio.firebaseapp.com",
    "https://stephen-vite.vercel.app",
    "http://localhost:5173",
];

const configuredOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const ALLOWED_ORIGINS = new Set(configuredOrigins.length ? configuredOrigins : DEFAULT_ORIGINS);

/**
 * Per-IP quotas. `burst` stops someone hammering the endpoint in a loop;
 * `daily` stops a slow drip that would otherwise run all day unnoticed.
 * A genuine visitor asking questions never approaches either.
 */
const LIMITS = {
    chat: { burst: { max: 8, windowMs: 60_000 }, dailyMax: 60 },
    email: { burst: { max: 4, windowMs: 60_000 }, dailyMax: 20 },
};

/**
 * Absolute ceiling across every caller. This is the only guard that bounds
 * worst-case spend when an attacker rotates IPs, so it is the one that
 * actually caps the bill.
 */
const GLOBAL_DAILY_MAX = Number(env.AI_DAILY_REQUEST_CAP) || 1000;

/** In-memory fallback, and a fast path that avoids a network round trip for
 *  callers already known to be over quota on this instance. Resets on cold
 *  start and is per-instance, which is why Redis backs it. */
const memoryBuckets = new Map();

function utcDay() {
    return new Date().toISOString().slice(0, 10);
}

function secondsUntilUtcMidnight() {
    const now = new Date();
    const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    return Math.max(1, Math.ceil((midnight - now.getTime()) / 1000));
}

/** Hashed so raw visitor IPs are never persisted. */
function clientFingerprint(req) {
    const forwarded = req.headers?.["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "")
        .split(",")[0]
        .trim()
        || req.headers?.["x-real-ip"]
        || req.socket?.remoteAddress
        || "unknown";

    return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function isOriginAllowed(origin) {
    return Boolean(origin) && ALLOWED_ORIGINS.has(origin);
}

/**
 * Reflects an allowed Origin instead of sending `*`. Browsers will refuse
 * cross-site calls from anywhere not on the list.
 */
export function applyCors(req, res) {
    const origin = req.headers?.origin;

    if (isOriginAllowed(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function consumeMemory(key, limits) {
    const now = Date.now();
    const day = utcDay();
    const entry = memoryBuckets.get(key);

    if (!entry || entry.day !== day) {
        memoryBuckets.set(key, { day, dayCount: 1, windowStart: now, windowCount: 1 });
        return { allowed: true };
    }

    if (entry.dayCount >= limits.dailyMax) {
        return { allowed: false, reason: "daily", retryAfter: secondsUntilUtcMidnight() };
    }

    const inWindow = now - entry.windowStart < limits.burst.windowMs;

    if (inWindow && entry.windowCount >= limits.burst.max) {
        const retryAfter = Math.ceil((entry.windowStart + limits.burst.windowMs - now) / 1000);
        return { allowed: false, reason: "burst", retryAfter: Math.max(1, retryAfter) };
    }

    entry.dayCount += 1;
    entry.windowStart = inWindow ? entry.windowStart : now;
    entry.windowCount = inWindow ? entry.windowCount + 1 : 1;

    return { allowed: true };
}

/**
 * Fixed-window counters in Redis.
 *
 * The old Firestore version read-then-wrote inside a transaction. `INCR` is
 * already atomic, so the counter is bumped first and judged afterwards — which
 * means the returned value is the count *including* this request, and the
 * comparisons below use `>` where the transaction used `>=`.
 *
 * Keys carry the window or day in their name and expire on their own, so
 * nothing has to be swept by hand the way the old `rateLimits` collection did.
 */
async function consumeRedis(bucket, fingerprint, limits) {
    const now = Date.now();
    const day = utcDay();
    const windowIndex = Math.floor(now / limits.burst.windowMs);
    const dayTtl = secondsUntilUtcMidnight();
    const windowTtl = Math.ceil(limits.burst.windowMs / 1000) + 1;

    const burstKey = `rl:${bucket}:${fingerprint}:w:${windowIndex}`;
    const dailyKey = `rl:${bucket}:${fingerprint}:d:${day}`;
    const globalKey = `rl:global:${day}`;

    const [burstCount, , dailyCount, , globalCount] = await pipeline([
        ["INCR", burstKey],
        ["EXPIRE", burstKey, String(windowTtl)],
        ["INCR", dailyKey],
        ["EXPIRE", dailyKey, String(dayTtl)],
        ["INCR", globalKey],
        ["EXPIRE", globalKey, String(dayTtl)],
    ]);

    /**
     * Counting happens before judging, so a caller rejected on a per-IP rule
     * has already consumed global quota. Handing it back matters: otherwise a
     * burst attacker could drain the daily spend cap without a single request
     * ever reaching OpenAI.
     */
    const refundGlobal = () => pipelineDetached([["DECR", globalKey]]);

    if (globalCount !== null && globalCount > GLOBAL_DAILY_MAX) {
        return { allowed: false, reason: "global", retryAfter: dayTtl };
    }

    if (dailyCount !== null && dailyCount > limits.dailyMax) {
        refundGlobal();
        return { allowed: false, reason: "daily", retryAfter: dayTtl };
    }

    if (burstCount !== null && burstCount > limits.burst.max) {
        refundGlobal();
        const windowEndsAt = (windowIndex + 1) * limits.burst.windowMs;
        return {
            allowed: false,
            reason: "burst",
            retryAfter: Math.max(1, Math.ceil((windowEndsAt - now) / 1000)),
        };
    }

    return { allowed: true };
}

/**
 * Applies the per-IP and global quotas for an endpoint.
 *
 * Fails open on Redis errors: a persistence outage should degrade to the
 * in-memory limiter rather than take the site's chatbot down. The in-memory
 * check runs first so a caller already over quota on this instance costs
 * nothing to reject.
 */
export async function enforceRateLimit(req, bucket) {
    const limits = LIMITS[bucket];
    if (!limits) return { allowed: true };

    const fingerprint = clientFingerprint(req);
    const memoryResult = consumeMemory(`${bucket}_${fingerprint}`, limits);
    if (!memoryResult.allowed) return memoryResult;

    if (!redisAvailable) return memoryResult;

    try {
        return await consumeRedis(bucket, fingerprint, limits);
    } catch (error) {
        console.error("Rate limit check failed, falling back to in-memory:", error);
        return { allowed: true };
    }
}

/** Writes the 429 response, including Retry-After so clients can back off. */
export function rejectRateLimited(res, result) {
    const messages = {
        burst: "You're sending messages a bit fast — give it a moment.",
        daily: "You've hit today's message limit. Try again tomorrow.",
        global: "The assistant is taking a break for today. Try again tomorrow.",
    };

    res.setHeader("Retry-After", String(result.retryAfter ?? 60));
    return res.status(429).json({ error: messages[result.reason] || messages.burst });
}

/**
 * Caps the client-supplied project payload. Without this, `buildProjectContext`
 * bounds the number of projects but not the length of each name or skill, so a
 * crafted body could inflate the prompt far beyond the intended size.
 */
export function sanitizeProjects(projects, { maxProjects = 25, maxFieldChars = 300 } = {}) {
    if (!Array.isArray(projects)) return [];

    const clamp = (value) => (typeof value === "string" ? value.slice(0, maxFieldChars) : "");

    return projects.slice(0, maxProjects).map((p) => ({
        name: clamp(p?.name),
        description: clamp(p?.description),
        skills: Array.isArray(p?.skills) ? p.skills.slice(0, 10).map(clamp) : [],
    }));
}

/**
 * Caps the conversation so far, which the chat sends so the assistant can
 * follow up on its own answers. Keeps the last `maxMessages` turns, clips each
 * to `maxChars`, and lets only plain user/assistant text through — any other
 * role or shape in the body is dropped rather than handed to the model. The
 * caps bound what one request can cost: ten turns of at most 1,000 characters.
 */
export function sanitizeHistory(history, { maxMessages = 10, maxChars = 1000 } = {}) {
    if (!Array.isArray(history)) return [];

    return history
        .filter((m) => (m?.role === "user" || m?.role === "assistant")
            && typeof m.content === "string"
            && m.content.trim())
        .slice(-maxMessages)
        .map((m) => ({ role: m.role, content: m.content.slice(0, maxChars) }));
}
