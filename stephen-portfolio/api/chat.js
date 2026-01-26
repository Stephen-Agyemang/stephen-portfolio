import OpenAI from "openai";
import { fetchGithubProjects } from "./githubFetcher.js";

const client = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

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

        const stephenProfile = {
            name: "Stephen Agyemang",
            education: "Computer Science at DePauw University (3.95 GPA, Honor Scholar)",
            background: "Ghanaian international student",
            interests: ["Artificial Intelligence", "Machine Learning", "Mathematics", "Theatre & Acting", "Soccer"],
            bio: "Focuses on building scalable software and exploring the intersections of AI and ML. Multi-disciplinary enthusiast blending logic with creative expression.",
            links: {
                linkedIn: "https://www.linkedin.com/in/stephen-agyemang/",
                github: "https://github.com/Stephen-Agyemang"
            }
        };

        const projectContext = allProjects.map(p =>
            `Name: ${p.name}, Description: ${p.description}, Skills: ${p.skills.join(", ")}`
        ).join("\n---\n");

        const profileContext = `
            About Stephen: ${stephenProfile.bio} Education: ${stephenProfile.education}. 
            Origins: ${stephenProfile.background}. 
            Interests: ${stephenProfile.interests.join(", ")}.
            Links: LinkedIn (${stephenProfile.links.linkedIn}), GitHub (${stephenProfile.links.github})
        `;

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
          Your goal is to chat with visitors, answer questions about Stephen's background, education, and interests, but prioritize his projects when technical skills are mentioned.
          
          Stephen is a software engineer. You have access to his profile and projects list below.
          
          Rules:
          1. **Be Conversational**: If the user says "Hi" or "How are you?", reply normally and politely.
          2. **Personal Inquiries**: If they ask about Stephen's education, background, or interests, use the "About Stephen" section to provide helpful, enthusiastic answers.
          3. **Project Matching**: If the user asks about specific skills or projects (e.g. "Does he know Java?"), answer them AND provide a list of matching projects using the "---PROJECTS---" delimiter format.
          4. **Connect**: If they want to talk to him or see his profile, mention his LinkedIn or GitHub links not both and consider mentioning github first provided in the context. A clickable link should be provided.
          5. **Tone**: Professional, friendly, educational,and enthusiastic.
          
          Response Format:
           First, provide your conversational response. 
          Then, if there are matching projects, add exactly "---PROJECTS---" on a new line followed by a comma-separated list of the exact project names.
          
          Example:
          "I'd love to help! Stephen has several React projects. He also enjoys playing soccer when he's not coding!
          ---PROJECTS---
          Project A, Project B"`
                },
                { role: "user", content: `Context:\n${profileContext}\n\nProjects:\n${projectContext}\n\nUser Message: "${userMessage}"` }
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
        console.error("AI Error:", error);
        res.status(500).json({
            reply: "AI is taking a break, try again."
        });
    }
}
