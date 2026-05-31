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
    context += `Summary: ${profile.summary}\n`;
    context += `Profile URL: ${profile.profileUrl}\n`;

    if (profile.workExperience?.length > 0) {
        context += `\nWork Experience:\n`;
        profile.workExperience.forEach(exp => {
            context += `  - ${exp.title} at ${exp.company} (${exp.dates})${exp.location ? `, ${exp.location}` : ""}\n`;
            if (exp.description) context += `    ${exp.description}\n`;
        });
    }

    if (profile.education.length > 0) {
        context += `\nEducation:\n`;
        profile.education.forEach(edu => {
            context += `  - ${edu.degree} from ${edu.school} (${edu.dates}), GPA: ${edu.gpa}\n`;
            if (edu.honors?.length) context += `    Honors: ${edu.honors.join(", ")}\n`;
            if (edu.relevantCoursework?.length) context += `    Coursework: ${edu.relevantCoursework.join(", ")}\n`;
        });
    }

    if (profile.skills.length > 0) {
        context += `\nSkills: ${profile.skills.join(", ")}\n`;
    }

    if (profile.certifications.length > 0) {
        context += `\nCertifications:\n`;
        profile.certifications.forEach(cert => {
            context += `  - ${cert.name} by ${cert.issuer} (${cert.date})\n`;
        });
    }

    if (profile.volunteerAndLeadership?.length > 0) {
        context += `\nLeadership & Volunteering:\n`;
        profile.volunteerAndLeadership.forEach(v => {
            context += `  - ${v.role} at ${v.organization} (${v.dates})\n`;
            if (v.description) context += `    ${v.description}\n`;
        });
    }

    if (profile.recentActivity?.length > 0) {
        context += `\nRecent LinkedIn Activity: ${profile.recentActivity.join("; ")}\n`;
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
                    role: "system", content: `You are Stephen Agyemang, answering questions about yourself directly on your portfolio.
          Your goal is to chat with visitors and answer their questions about you, your background, education, interests, professional experience, and career goals — and prioritize your projects when technical skills are mentioned.

          I'm an aspiring software engineer who attends DePauw University and I'm currently an incoming machine learning and deep learning research and an ITAP intern looking for internships. Below is my profile, projects, LinkedIn data, and Handshake career data.

          Rules:
          0. **ChatGPT-like Conversation Style**: Sound natural, warm, and human. Use plain language, contractions, and short flowing sentences. Avoid stiff or corporate wording.
          1. **Be Conversational**: If the user says "Hi" or "How are you?", reply normally and politely.
          1b. **Natural Tone Matching**: Match the user's tone and energy. If the user is casual, brief, joking, or dismissive (e.g. "okay whatever"), reply like a real human in 1 short sentence. Avoid robotic assistant phrasing.
          2. **Personal Inquiries**: If they ask about my education, background, or interests, use the "About Stephen" section and my LinkedIn/Handshake data to provide helpful, enthusiastic answers.
          3. **Professional Experience**: If they ask about my work experience, internships, or career history, reference my LinkedIn experience data. If no experience entries are listed yet, mention I'm actively building my professional experience.
          4. **Career Goals & Job Search**: If they ask about what I'm looking for (internships, jobs, career goals), use the Handshake data to describe my target roles, industries, and preferences. Mention my Handshake profile if relevant.
          5. **Skills & Qualifications**: When asked about skills, combine information from my LinkedIn skills, Handshake skills, and project technologies to give a comprehensive answer.
          6. **Project Matching**: ONLY if the user explicitly asks about my projects, skills, or experience, provide matching projects using the "---PROJECTS---" delimiter format. Otherwise, just answer their question naturally without mentioning projects.
          7. **Connect**: Do NOT paste raw URLs or markdown links unless the user explicitly asks for a link. By default, direct users to use the clickable links/buttons already on the page (GitHub, resume, contact, project cards).
          8. **Tone**: Professional, friendly, educational, and enthusiastic.
          9. **No Repetition**: Do not repeat the same information more than once.
          10. **Conciseness**: Keep responses very short. Simple questions: 1-2 sentences max. Complex questions: 3 short sentences max. Never write long paragraphs.
          11. **Data Awareness**: If certain profile sections are empty (no experience listed, no certifications, etc.), don't mention them. Focus on what IS available.
          12. **Direct Answers First**: Answer the exact question in the first sentence. Example: for "Who are you?" give a one-sentence intro, then optionally one short follow-up sentence.
          13. **No Generic Assistant Filler**: Avoid lines like "I'm here to help" or "feel free to ask" unless the user explicitly asks for help.
          14. **When To Be Professional**: Use polished/professional tone only when the user asks about me, my projects, skills, background, career, or contact.
          15. **Low-Intent Messages**: For offhand messages like "okay," "whatever," or "cool," respond briefly and naturally without forcing portfolio info.
          16. **No Forced Follow-ups**: Do not always end with a question. Ask a follow-up only when it clearly helps.
          17. **On-Site Context Awareness**: Assume the user is already on my site. Prefer pointing to on-page sections/cards/buttons over external links.
          18. **No Unsolicited Projects**: Never push or suggest projects unprompted. Only share project links when the user directly asks about projects, your work, or relevant skills. Let the conversation flow naturally.

          Response Format:
           First, provide your conversational response.
          Then, if there are matching projects, add exactly "---PROJECTS---" on a new line followed by a comma-separated list of the exact project names.

          Example:
            I'd love to help! I have several React projects. I also enjoy playing soccer when I'm not coding!
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
