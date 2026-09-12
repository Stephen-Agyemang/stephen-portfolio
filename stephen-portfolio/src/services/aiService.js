const API_BASE = "https://stephen-vite.vercel.app";

const FALLBACK_ERROR = "Something went wrong. Give it a moment and try again.";
const TIMEOUT_ERROR = "That took too long to come back. Give it another try.";

/**
 * The API runs as a serverless function, so the first request after an idle
 * period pays a cold start. That is slow but legitimate — the ceiling is set
 * well past it, and only a genuinely stuck request should trip it.
 */
const CONNECT_TIMEOUT_MS = 45_000;

/** Once tokens are flowing, a long gap between them means the stream died. */
const STALL_TIMEOUT_MS = 20_000;

/** Pulls the server's human-readable message out of a failed response. */
async function readErrorMessage(res) {
    try {
        const data = await res.json();
        return data?.error || FALLBACK_ERROR;
    } catch {
        return FALLBACK_ERROR;
    }
}

function isAbort(error) {
    return error?.name === "AbortError" || error?.name === "TimeoutError";
}

/** Timeouts and dropped connections are worth a resend; a rate limit is not. */
function retryableError(message, cause) {
    const error = new Error(message, { cause });
    error.retryable = true;
    return error;
}

/**
 * Streams a chat reply.
 *
 * `onStatus` reports connection phase so the UI can distinguish "warming up"
 * from "hung" — without it, a cold start is visually identical to a dead
 * request and reads as the assistant being broken.
 */
export async function chatWithAIStream(userMessage, projects, onChunk, { onStatus } = {}) {
    const controller = new AbortController();
    let timer = setTimeout(() => controller.abort(), CONNECT_TIMEOUT_MS);

    const resetStallTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => controller.abort(), STALL_TIMEOUT_MS);
    };

    try {
        onStatus?.("connecting");

        const res = await fetch(`${API_BASE}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userMessage, projects }),
            signal: controller.signal
        });

        // Rate-limit and validation failures return JSON, not a stream. Without this
        // the error body would be piped straight into the chat bubble as raw text.
        if (!res.ok) {
            const error = new Error(await readErrorMessage(res));
            // A 5xx is the server tripping; a 429 or 400 would say the same thing again.
            error.retryable = res.status >= 500;
            throw error;
        }

        if (!res.body) throw new Error("No response body");

        onStatus?.("streaming");
        resetStallTimer();

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let buffered = "";
        let lastFlushAt = 0;
        const FLUSH_INTERVAL_MS = 60;

        const flush = (force = false) => {
            const now = Date.now();
            if (!buffered) return;
            if (!force && now - lastFlushAt < FLUSH_INTERVAL_MS) return;

            onChunk(buffered);
            buffered = "";
            lastFlushAt = now;
        };

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;

            if (value) {
                resetStallTimer();
                const chunk = decoder.decode(value);
                if (chunk) {
                    buffered += chunk;
                    flush();
                }
            }
        }

        flush(true);
    } catch (error) {
        if (isAbort(error)) throw retryableError(TIMEOUT_ERROR, error);
        // fetch rejects with a TypeError when the connection drops, and its raw
        // message ("Load failed", "Failed to fetch") means nothing to a visitor.
        if (error instanceof TypeError) throw retryableError(FALLBACK_ERROR, error);
        throw error;
    } finally {
        clearTimeout(timer);
        onStatus?.("done");
    }
}

export async function generateEmailDrafts(userIntent) {
    try {
        const res = await fetch(`${API_BASE}/api/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userIntent }),
            signal: AbortSignal.timeout(CONNECT_TIMEOUT_MS)
        });

        if (!res.ok) throw new Error(await readErrorMessage(res));

        return res.json();
    } catch (error) {
        if (isAbort(error)) throw new Error(TIMEOUT_ERROR);
        throw error;
    }
}
