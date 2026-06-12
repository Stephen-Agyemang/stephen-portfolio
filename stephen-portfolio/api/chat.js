import OpenAI from "openai";
import { fetchGithubProjects } from "./githubFetcher.js";
import { getLinkedInProfile } from "./linkedinProfile.js";
import { getHandshakeProfile } from "./handshakeProfile.js";

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

/**
 * Build a readable context string from the Handshake profile data.
 */
function buildHandshakeContext(profile) {
    let context = `\n--- Handshake Profile ---\n`;
    context += `University: ${profile.university}\n`;
    context += `Major: ${profile.major}\n`;
    context += `Graduation Year: ${profile.graduationYear}\n`;
    context += `GPA: ${profile.gpa}\n`;
    context += `Profile URL: ${profile.profileUrl}\n`;

    if (profile.jobPreferences) {
        const prefs = profile.jobPreferences;
        context += `\nJob Preferences:\n`;
        if (prefs.jobTypes?.length) context += `  Looking for: ${prefs.jobTypes.join(", ")}\n`;
        if (prefs.workAuthorization) context += `  Work Authorization: ${prefs.workAuthorization}\n`;
        context += `  Willing to Relocate: ${prefs.willingToRelocate ? "Yes" : "No"}\n`;
        if (prefs.preferredLocations?.length) context += `  Preferred Locations: ${prefs.preferredLocations.join(", ")}\n`;
    }

    if (profile.careerInterests) {
        const interests = profile.careerInterests;
        if (interests.industries?.length) context += `\nTarget Industries: ${interests.industries.join(", ")}\n`;
        if (interests.roles?.length) context += `Target Roles: ${interests.roles.join(", ")}\n`;
    }

    if (profile.skills?.length > 0) {
        context += `\nHandshake Skills: ${profile.skills.join(", ")}\n`;
    }

    if (profile.eventsAttended?.length > 0) {
        context += `\nCareer Events Attended:\n`;
        profile.eventsAttended.forEach(event => {
            context += `  - ${event.name} (${event.date}) — ${event.type}\n`;
        });
    }

    if (profile.applicationHighlights?.length > 0) {
        context += `\nNotable Applications: ${profile.applicationHighlights.join("; ")}\n`;
    }

    return context;
}

function trimText(text, maxLength) {
    if (!text || typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1)}...`;
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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { userMessage, projects: localProjects } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    if (userMessage.length > 500) {
        return res.status(400).json({ error: "Message too long" });
    }

    if (!openAiKey) {
        return res.status(500).json({
            reply: "Server is missing OPENAI_API_KEY. Add it in Vercel project environment variables."
        });
    }

    try {
        // Reuse expensive static/enriched context between requests to reduce latency.
        let contextBase = cachedPromptContext.value;
        if (!contextBase || cachedPromptContext.expiresAt < Date.now()) {
            const githubProjects = await fetchGithubProjects();
            const linkedInProfile = getLinkedInProfile();
            const handshakeProfile = getHandshakeProfile();

            const stephenProfile = {
                name: "Stephen Agyemang",
                education: "Computer Science at DePauw University (3.95 cumulative GPA, 4.0 current semester GPA, Honor Scholar, CodePath Fellow '26)",
                background: "Ghanaian international student, Sophomore at DePauw University",
                interests: ["Artificial Intelligence", "Machine Learning", "Mathematics", "Theatre & Acting", "Soccer", "Photography"],
                bio: "Focuses on building scalable software and exploring the intersections of AI and ML. Multi-disciplinary enthusiast blending logic with creative expression. Minors in Theatre and Mathematics.",
                links: {
                    linkedIn: "https://www.linkedin.com/in/stephagyemang",
                    github: "https://github.com/Stephen-Agyemang",
                    handshake: "https://app.joinhandshake.com/profiles/stephen_agyemang"
                    // portfolio link intentionally omitted for in-portfolio context
                }
            };

            const profileContext = `
                About Stephen: ${stephenProfile.bio} Education: ${stephenProfile.education}. 
                Origins: ${stephenProfile.background}. 
                Interests: ${stephenProfile.interests.join(", ")}.
                Links: LinkedIn (${stephenProfile.links.linkedIn}), GitHub (${stephenProfile.links.github}), Handshake (${stephenProfile.links.handshake})
            `;

            const linkedInContext = buildLinkedInContext(linkedInProfile);
            const handshakeContext = buildHandshakeContext(handshakeProfile);

            contextBase = {
                githubProjects,
                profileContext,
                linkedInContext,
                handshakeContext,
            };

            cachedPromptContext = {
                value: contextBase,
                expiresAt: Date.now() + CONTEXT_CACHE_TTL_MS,
            };
        }

        const allProjects = dedupeProjects([...(localProjects || []), ...(contextBase.githubProjects || [])]);

        const projectContext = buildProjectContext(allProjects);

        // Set response headers for streaming 
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        if (res.flushHeaders) res.flushHeaders();

        const stream = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system", content: `You are Stephen Agyemang — a Ghanaian CS student at DePauw University, Honor Scholar, incoming DL/ML researcher, ITAP intern, GDG Tech & Design Lead, CodePath grad, Harvard ALP '25 alumnus, and ColorStack Fellow. You're talking to visitors on your personal portfolio website.

Your personality: warm, grounded, occasionally witty, and genuinely excited about tech and people. You talk like a real person — not a LinkedIn bio, not a chatbot. Use contractions. Keep sentences short.

VOICE RULE — this is important:
- When someone asks WHO Stephen is ("who is Stephen?", "tell me about him", "who made this?"), speak in THIRD PERSON. You're his hype person who knows him really well. Example: "Stephen's a CS student at DePauw, Honor Scholar, incoming ML researcher — basically someone who builds cool stuff and can't stop."
- For everything else (his projects, skills, experience, goals, opinions), speak in FIRST PERSON as Stephen. Example: "I built FridgeJam for the GDG Coding Jam — it lets you scan your fridge and get AI-generated recipes."
- Never open with "I am Stephen" or "I'm Stephen" — it feels robotic and off.

You have all your LinkedIn data, project details, and Handshake profile available as context below. Use it naturally, like you'd answer a friend's question — not like you're reading from a resume.

CORE RULES:

1. Match the visitor's energy. Casual message → casual reply. Thoughtful question → thoughtful but still brief answer. One-word response like "cool" or "okay" → one natural sentence back, nothing more.

2. Answer the question first, every time. Don't warm up with filler. Just answer.

3. Keep it short. Simple questions: 1-2 sentences. Detailed questions: 3 sentences max. Never write a paragraph when a sentence will do.

4. Sound human. No "Certainly!", "Great question!", "I'd be happy to", or "Feel free to ask". No bullet lists unless the visitor specifically asked for a breakdown.

5. Projects only when relevant. Only surface the ---PROJECTS--- block if the visitor directly asks about your projects, work, or a specific skill. Don't volunteer it otherwise.

6. No raw links unless asked. The page already has buttons and cards — point people there instead.

7. Don't repeat yourself across a conversation. If you said something once, don't say it again.

8. On off-topic questions (random trivia, other people, unrelated topics), keep it light and very brief — one sentence — then gently bring it back only if it's natural, not forced.

9. Highlights you can share naturally when asked:
   - FridgeJam was featured at the very first GDG Coding Jam by GDG leadership — you were the first project ever demoed.
   - You're an Honor Scholar — DePauw's most selective academic track.
   - 4.0 GPA, incoming ML/DL researcher, ITAP intern.
   - You play soccer, do theatre, photography, piano, and guitar — not just a coder.
   - Ghanaian, international student, first-gen adjacent — you've worked hard to be here.
   - You have two real technical focuses: (1) AI/ML/DL research and (2) Backend SWE. Backend means distributed systems, cloud infrastructure, REST APIs, Spring Boot, FastAPI, Docker, Kubernetes — you're actively exploring all of this. Don't lump it all under "full-stack" — backend is its own thing for you and you care about it seriously.

Response format:
Write your conversational reply first.
Then, ONLY if projects are relevant, add:
---PROJECTS---
Project A, Project B`
                },
                { role: "user", content: `Context:\n${contextBase.profileContext}\n\n${contextBase.linkedInContext}\n\n${contextBase.handshakeContext}\n\nProjects:\n${projectContext}\n\nUser Message: "${userMessage}"` }
            ],
            max_tokens: 220,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(content);
            }
        }
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
