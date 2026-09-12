import OpenAI from "openai";
import { fetchGithubProjects } from "./githubFetcher.js";
import { getLinkedInProfile } from "./linkedinProfile.js";
import { logChatMessage } from "./chatLogger.js";
import { applyCors, isOriginAllowed, enforceRateLimit, rejectRateLimited, sanitizeProjects } from "./guards.js";
import { buildSiteGuide, SITE_SECTION_IDS, sectionName } from "./siteGuide.js";

const SITE_GUIDE = buildSiteGuide();

const openAiKey = globalThis.process?.env?.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openAiKey,
});

const CONTEXT_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_PROJECTS_IN_PROMPT = 25;
const MAX_DESCRIPTION_CHARS = 220;
let cachedPromptContext = {
    value: null,
    expiresAt: 0,
};

/**
 * Build a readable context string from the LinkedIn profile data.
 */
function buildLinkedInContext(profile) {
    let context = `\n--- LinkedIn Profile ---\n`;
    context += `Headline: ${profile.headline}\n`;
    context += `Stats: ${profile.stats}\n`;
    context += `Summary: ${profile.summary}\n`;

    if (profile.workExperience?.length > 0) {
        context += `\nWork Experience:\n`;
        profile.workExperience.forEach(exp => {
            context += `  - ${exp.title} at ${exp.company} (${exp.dates})${exp.location ? `, ${exp.location}` : ""}\n`;
            if (exp.description) context += `    ${exp.description}\n`;
        });
    }

    if (profile.education?.length > 0) {
        context += `\nEducation:\n`;
        profile.education.forEach(edu => {
            context += `  - ${edu.degree} from ${edu.school} (${edu.dates}), GPA: ${edu.gpa}\n`;
            if (edu.honors?.length) context += `    Honors: ${edu.honors.join("; ")}\n`;
            if (edu.activities?.length) context += `    Activities: ${edu.activities.join(", ")}\n`;
            if (edu.relevantCoursework?.length) context += `    Coursework: ${edu.relevantCoursework.join(", ")}\n`;
            if (edu.description) context += `    ${edu.description}\n`;
        });
    }

    if (profile.skills?.length > 0) {
        context += `\nSkills: ${profile.skills.join(", ")}\n`;
    }

    if (profile.certifications?.length > 0) {
        context += `\nCertifications & Programs:\n`;
        profile.certifications.forEach(cert => {
            context += `  - ${cert.name} by ${cert.issuer} (${cert.date})\n`;
        });
    }

    if (profile.honorsAndAwards?.length > 0) {
        context += `\nHonors & Awards:\n`;
        profile.honorsAndAwards.forEach(h => {
            context += `  - ${h.title} — ${h.issuer} (${h.date})\n`;
            if (h.description) context += `    ${h.description}\n`;
        });
    }

    if (profile.organizations?.length > 0) {
        context += `\nClubs & Organizations:\n`;
        profile.organizations.forEach(org => {
            context += `  - ${org.role} @ ${org.name} (${org.dates})\n`;
            if (org.description) context += `    ${org.description}\n`;
        });
    }

    if (profile.volunteerAndLeadership?.length > 0) {
        context += `\nLeadership & Volunteering:\n`;
        profile.volunteerAndLeadership.forEach(v => {
            context += `  - ${v.role} at ${v.organization} (${v.dates})\n`;
            if (v.description) context += `    ${v.description}\n`;
        });
    }

    if (profile.languages?.length > 0) {
        context += `\nLanguages: ${profile.languages.map(l => `${l.language} (${l.proficiency})`).join(", ")}\n`;
    }

    if (profile.recentActivity?.length > 0) {
        context += `\nRecent Activity & Highlights:\n`;
        profile.recentActivity.forEach(a => context += `  - ${a}\n`);
    }

    return context;
}

// Handshake context is parked. api/handshakeProfile.js still holds the data,
// but the profile is no longer actively maintained, so LinkedIn is the single
// source of truth for the assistant. To switch it back on, re-import
// getHandshakeProfile and rebuild a context string here.

function trimText(text, maxLength) {
    if (!text || typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1)}...`;
}

const PROJECT_KEYWORDS = [
    "project", "build", "built", "work", "skill", "experience", "code",
    "github", "intern", "fridgejam", "monica", "zork", "api", "stack",
    "language", "tech", "react", "python", "java", "backend", "frontend",
    "ml", "ai", "demo", "portfolio", "repo", "resume"
];

function needsProjectContext(message) {
    const lower = message.toLowerCase();
    return PROJECT_KEYWORDS.some(kw => lower.includes(kw));
}

function dedupeProjects(projects = []) {
    const seen = new Set();
    const deduped = [];

    for (const p of projects) {
        const name = p?.name?.trim();
        if (!name) continue;
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(p);
    }

    return deduped;
}

function buildProjectContext(projects) {
    return projects
        .slice(0, MAX_PROJECTS_IN_PROMPT)
        .map((p) => {
            const desc = trimText(p.description || "", MAX_DESCRIPTION_CHARS);
            const skills = Array.isArray(p.skills) ? p.skills.slice(0, 10).join(", ") : "";
            return `Name: ${p.name}, Description: ${desc || "N/A"}, Skills: ${skills || "N/A"}`;
        })
        .join("\n---\n");
}

export default async function handler(req, res) {
    applyCors(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Browsers are blocked by CORS above, but that costs nothing server-side.
    // Rejecting a disallowed Origin here is what actually prevents another site
    // from burning tokens by embedding this endpoint.
    const origin = req.headers?.origin;
    if (origin && !isOriginAllowed(origin)) {
        return res.status(403).json({ error: "Origin not allowed" });
    }

    const { userMessage, projects: localProjects, section } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    // The section the visitor had on screen when they asked. Only a known id
    // gets through, so the field can't carry text into the prompt.
    const visitorSection = SITE_SECTION_IDS.has(section) ? sectionName(section) : null;

    if (userMessage.length > 500) {
        return res.status(400).json({ error: "Message too long" });
    }

    const rateLimit = await enforceRateLimit(req, "chat");
    if (!rateLimit.allowed) {
        return rejectRateLimited(res, rateLimit);
    }

    if (!openAiKey) {
        return res.status(500).json({
            reply: "Server is missing OPENAI_API_KEY. Add it in Vercel project environment variables."
        });
    }

    try {
        // Reuse expensive static/enriched context between requests to reduce latency.
        let contextBase = cachedPromptContext.value;
        const cacheExpired = !contextBase || cachedPromptContext.expiresAt < Date.now();
        if (cacheExpired) {
            // Skip the GitHub network call for casual messages (greetings, chitchat)
            // that clearly won't need project info — saves ~500ms-1s on cold starts.
            const githubProjects = needsProjectContext(userMessage)
                ? await fetchGithubProjects()
                : (contextBase?.githubProjects ?? []);
            const linkedInProfile = getLinkedInProfile();

            const stephenProfile = {
                name: "Stephen Agyemang",
                education: "Computer Science at DePauw University (3.97 GPA, Honor Scholar, Bonner Scholar, CodePath Fellow '26)",
                background: "Ghanaian international student, rising Junior at DePauw University",
                currentSemester: "Fall 2026 — back on campus and focused on coursework: Calculus II, the Honor Scholar seminar, Computer Systems, and Algorithmic Foundations of Computation. The summer 2026 ML research position wrapped in August 2026.",
                interests: ["Artificial Intelligence", "Machine Learning", "Mathematics", "Theatre & Acting", "Soccer", "Photography"],
                bio: "Focuses on building scalable software and exploring the intersections of AI and ML. Multi-disciplinary enthusiast blending logic with creative expression. Mathematics and Theatre are his intended minors — not yet declared.",
                links: {
                    linkedIn: "https://www.linkedin.com/in/stephagyemang",
                    github: "https://github.com/Stephen-Agyemang"
                    // portfolio link intentionally omitted for in-portfolio context
                }
            };

            const profileContext = `
                About Stephen: ${stephenProfile.bio} Education: ${stephenProfile.education}. 
                Origins: ${stephenProfile.background}. 
                Right now: ${stephenProfile.currentSemester}
                Interests: ${stephenProfile.interests.join(", ")}.
                Links: LinkedIn (${stephenProfile.links.linkedIn}), GitHub (${stephenProfile.links.github})
            `;

            const linkedInContext = buildLinkedInContext(linkedInProfile);

            contextBase = {
                githubProjects,
                profileContext,
                linkedInContext,
            };

            cachedPromptContext = {
                value: contextBase,
                expiresAt: Date.now() + CONTEXT_CACHE_TTL_MS,
            };
        }

        const allProjects = dedupeProjects([
            ...sanitizeProjects(localProjects),
            ...(contextBase.githubProjects || []),
        ]);

        const projectContext = buildProjectContext(allProjects);

        const stream = await client.chat.completions.create({
            model: "gpt-5.6-luna",
            messages: [
                {
                    role: "system", content: `You are Stephen Agyemang — a Ghanaian CS student at DePauw University, Honor Scholar and Bonner Scholar, undergraduate machine learning researcher over summer 2026, GDG Tech & Design Lead, CodePath grad, Harvard ALP '25 alumnus, and a ColorStack student member. You're talking to visitors on your personal portfolio website.

Your personality: warm, grounded, occasionally witty, and genuinely excited about tech and people. You talk like a real person — not a LinkedIn bio, not a chatbot. Use contractions. Keep sentences short.

VOICE RULE — this is important:
- When someone asks WHO Stephen is ("who is Stephen?", "tell me about him", "who made this?"), speak in THIRD PERSON. You're his hype person who knows him really well. Example: "Stephen's a CS student at DePauw, Honor Scholar, ML researcher — basically someone who builds cool stuff and can't stop."
- For everything else (his projects, skills, experience, goals, opinions), speak in FIRST PERSON as Stephen. Example: "I built FridgeJam for the GDG Coding Jam — it lets you scan your fridge and get AI-generated recipes."
- Never open with "I am Stephen" or "I'm Stephen" — it feels robotic and off.

You have all your LinkedIn data and project details available as context below. Use it naturally, like you'd answer a friend's question — not like you're reading from a resume.

CORE RULES:

1. Match the visitor's energy exactly.
   - Pure greeting ("hi", "hey", "hello", "sup", "what's up", etc.) → reply with just a greeting back. Literally "hey!" or "hey, what's up?" — that's it. Do NOT volunteer a bio, a list of topics, or anything about Stephen. Wait for them to actually ask something.
   - One-word or one-sentence message → one sentence back, nothing more.
   - Casual question → casual, brief answer.
   - Thoughtful question → thoughtful but still concise answer.

2. Answer the question first, every time. Don't warm up with filler. Just answer.

3. Keep it short. Simple questions: 1-2 sentences. Detailed questions: 3 sentences max. Never write a paragraph when a sentence will do.

4. Sound human. No "Certainly!", "Great question!", "I'd be happy to", or "Feel free to ask". No bullet lists unless the visitor specifically asked for a breakdown.

5. Never volunteer information that wasn't asked for. The visitor will ask if they want to know. Projects, skills, experience — only bring these up when directly asked.

6. You know this page — see SITE GUIDE below. When the answer lives somewhere on it, say exactly where and what to click, and add a GOTO line (see Response format) so they get a button that takes them there. If they're already looking at it, tell them it's right there. No raw links unless asked.

7. Don't repeat yourself across a conversation. If you said something once, don't say it again.

8. On off-topic questions (random trivia, other people, unrelated topics), keep it light and very brief — one sentence — then gently bring it back only if it's natural, not forced.

9. Highlights you can share naturally when asked:
   - FridgeJam was featured at the very first GDG Coding Jam by GDG leadership — you were the first project ever demoed.
   - You're an Honor Scholar — DePauw's most selective academic track.
   - 3.97 GPA. You spent summer 2026 as an undergraduate ML researcher on Transformer-based monocular 3D human pose estimation — that position ended in August 2026. This fall you are back on campus focused on coursework: Calculus II, the Honor Scholar seminar, Computer Systems, and Algorithmic Foundations of Computation.
   - You play soccer, do theatre and acting (Acting I & II, Voice and Movement at DePauw), photography, piano, and guitar — not just a coder. Mathematics and Theatre are your INTENDED minors; you have not declared them yet, so never call them your current minors.
   - Ghanaian, international student, first-gen adjacent — you've worked hard to be here.
   - You have two real technical focuses: (1) AI/ML/DL research and (2) Backend SWE. Backend means distributed systems, cloud infrastructure, REST APIs, Spring Boot, FastAPI, Docker, Kubernetes — you're actively exploring all of this. Don't lump it all under "full-stack" — backend is its own thing for you and you care about it seriously.

10. Never invent specifics that aren't in the context below (dates, job duties, project details, etc.). If someone asks something the context doesn't cover, say you're not sure or that you don't have that detail — don't guess or make something up just to sound complete. If you're caught contradicting yourself, just say so plainly and correct it instead of doubling down.

11. Asked how to reach, contact, email, message or hire Stephen: the Email Draft Assistant is the best way — say in a sentence what it does — and LinkedIn is the other. GOTO contact-assistant. Never describe a feature or button the SITE GUIDE doesn't list.

Response format:
Write your conversational reply first.
Then, ONLY if projects are relevant, add:
---PROJECTS---
Project A, Project B
Then, ONLY if sending them to one place on the page would help, add:
---GOTO---
one section id from the SITE GUIDE, or one project's exact name to go to its card

SITE GUIDE — this page, top to bottom (id — name: what's there):
${SITE_GUIDE}`
                },
                { role: "user", content: `Context:\n${contextBase.profileContext}\n\n${contextBase.linkedInContext}\n\nProjects:\n${projectContext}\n\n${visitorSection ? `The visitor is looking at: ${visitorSection}\n\n` : ""}User Message: "${userMessage}"` }
            ],
            max_completion_tokens: 220,
            stream: true,
        });

        // Headers are only committed once the OpenAI stream is confirmed, so
        // failures above this point can still return a normal JSON error.
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        if (res.flushHeaders) res.flushHeaders();

        let replyText = "";
        try {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    replyText += content;
                    res.write(content);
                }
            }
        } catch (streamError) {
            // Headers are already sent as text/event-stream at this point, so
            // we can't switch to a JSON error response — write a plain-text
            // fallback into the stream instead of going silent.
            console.error("AI Stream Error:", streamError);
            res.write("\n\n[AI is taking a break, try again.]");
        }
        await logChatMessage(userMessage, replyText);
        res.end();
    } catch (error) {
        // Log full error details for debugging
        console.error("AI Error:", error);
        let errorMsg = "AI is taking a break, try again.";
        if (error?.status || error?.name === "APIError") {
            // OpenAI SDK v6 exposes status/message on the thrown error.
            errorMsg = `OpenAI API Error: ${error.status || 500}`;
            if (error.message) {
                errorMsg += ` - ${error.message}`;
            }
        } else if (error.message) {
            errorMsg = error.message;
        }
        res.status(500).json({
            reply: errorMsg
        });
    }
}
