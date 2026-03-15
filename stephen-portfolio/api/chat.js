import OpenAI from "openai";
import { fetchGithubProjects } from "./githubFetcher.js";
import { getLinkedInProfile } from "./linkedinProfile.js";
import { getHandshakeProfile } from "./handshakeProfile.js";

const openAiKey = globalThis.process?.env?.OPENAI_API_KEY || globalThis.process?.env?.VITE_OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openAiKey,
});

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
        // Fetch latest projects from GitHub
        const githubProjects = await fetchGithubProjects();

        // Merge local projects with GitHub projects, removing duplicates by name
        const allProjects = [...(localProjects || [])];
        githubProjects.forEach(ghProject => {
            if (!allProjects.find(lp => lp.name.toLowerCase() === ghProject.name.toLowerCase())) {
                allProjects.push(ghProject);
            }
        });

        // Get LinkedIn and Handshake profile data
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

        const projectContext = allProjects.map(p =>
            `Name: ${p.name}, Description: ${p.description}, Skills: ${p.skills.join(", ")}`
        ).join("\n---\n");

        const profileContext = `
            About Stephen: ${stephenProfile.bio} Education: ${stephenProfile.education}. 
            Origins: ${stephenProfile.background}. 
            Interests: ${stephenProfile.interests.join(", ")}.
            Links: LinkedIn (${stephenProfile.links.linkedIn}), GitHub (${stephenProfile.links.github}), Handshake (${stephenProfile.links.handshake})
        `;

        // Build enriched context from LinkedIn and Handshake
        const linkedInContext = buildLinkedInContext(linkedInProfile);
        const handshakeContext = buildHandshakeContext(handshakeProfile);

        // Set response headers for streaming 
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        if (res.flushHeaders) res.flushHeaders();

        const stream = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system", content: `You are Stephen Agyemang's personal portfolio AI assistant.
          Your goal is to chat with visitors, answer questions about Stephen's background, education, interests, professional experience, and career goals — and prioritize his projects when technical skills are mentioned.
          
          Stephen is a software engineer. You have access to his profile, projects, LinkedIn data, and Handshake career data below.
          
          Rules:
          1. **Be Conversational**: If the user says "Hi" or "How are you?", reply normally and politely.
          2. **Personal Inquiries**: If they ask about Stephen's education, background, or interests, use the "About Stephen" section and LinkedIn/Handshake data to provide helpful, enthusiastic answers.
          3. **Professional Experience**: If they ask about work experience, internships, or career history, reference Stephen's LinkedIn experience data. If no experience entries are listed yet, mention he is actively building his professional experience.
          4. **Career Goals & Job Search**: If they ask about what Stephen is looking for (internships, jobs, career goals), use the Handshake data to describe his target roles, industries, and preferences. Mention his Handshake profile if relevant.
          5. **Skills & Qualifications**: When asked about skills, combine information from LinkedIn skills, Handshake skills, and project technologies to give a comprehensive answer.
          6. **Project Matching**: If the user asks about specific skills or projects (e.g. "Does he know Java?"), answer them AND provide a list of matching projects using the "---PROJECTS---" delimiter format.
          7. **Connect**: If they want to talk to him or see his code, mention his GitHub profile link. For career/job-related connections, mention Handshake. Always provide clickable links. Do NOT share Stephen's LinkedIn profile link — it is used only as an internal data source. Don't list all links at once — pick the most relevant one(s). Do NOT mention the portfolio website if the user is already on the portfolio.
          8. **Tone**: Professional, friendly, educational, and enthusiastic.
          9. **No Repetition**: Do not repeat the same information more than once.
          10. **Conciseness**: Keep responses SHORT — 2-3 sentences max for simple questions, 4-5 for complex ones. Never write paragraphs. Use bullet points if listing multiple things. Be direct and punchy, not verbose. Do not ramble or repeat context the user already knows.
          11. **Data Awareness**: If certain profile sections are empty (no experience listed, no certifications, etc.), don't mention them. Focus on what IS available.
          
          Response Format:
           First, provide your conversational response. 
          Then, if there are matching projects, add exactly "---PROJECTS---" on a new line followed by a comma-separated list of the exact project names.
          
          Example:
            I'd love to help! Stephen has several React projects. He also enjoys playing soccer when he's not coding!
            ---PROJECTS---
            Project A, Project B`
                },
                { role: "user", content: `Context:\n${profileContext}\n\n${linkedInContext}\n\n${handshakeContext}\n\nProjects:\n${projectContext}\n\nUser Message: "${userMessage}"` }
            ],
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
