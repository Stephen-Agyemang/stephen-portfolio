/**
 * Project cards rendered by the Projects grid.
 *
 * `image` is an optional screenshot shown as the card's feed band. Files live
 * in `public/projects/` and are referenced by URL, not imported — a missing
 * file falls back to the offline-feed placeholder instead of breaking the
 * build, so screenshots can land one at a time.
 *
 * Only `name`, `description`, and `skills` survive `sanitizeProjects()` in
 * `api/guards.js`, so fields added here never reach the chat API.
 */
export const projects = [
    {
        id: "monica",
        image: "/projects/monica.webp",
        name: "MoNiCa.Ai",
        private: true,
        tagline: "Voice-Native AI Interviewer with an Execution-Verified Code Judge",
        description: "A real-time voice interview platform. A LiveKit agent runs the whole loop over WebRTC — Silero VAD → Deepgram streaming STT → LLM → ElevenLabs TTS → Tavus avatar — with per-turn voice-to-voice latency instrumented end to end. In technical mode it doesn't read your code and guess: it runs it, in a self-hosted gVisor sandbox, against test cases it proved consistent before you ever saw the problem.",
        link: "https://github.com/Stephen-Agyemang/MoNiCa.Ai",
        // Repo isn't publicly reachable yet, so the Code button renders disabled.
        // Delete this line to turn the link back on — `link` above is still correct.
        codeDisabled: true,
        skills: ["React 19", "FastAPI", "Python", "asyncio", "WebRTC", "LiveKit", "Deepgram", "ElevenLabs", "Tavus", "gVisor", "Terraform", "AWS ECS Fargate", "Kubernetes", "PostgreSQL", "Redis"],
        demoType: "interview-simulation"
    },
    {
        id: "zork",
        image: "/projects/zork.webp",
        name: "Zork v2",
        tagline: "Full-Stack Campus Text Adventure",
        description: "A full-stack, terminal-style text adventure set across DePauw's campus. Players complete quests, manage inventory and hunger, race timed challenges, and save high scores to global and campus-only leaderboards — all backed by a Spring Boot REST API with session-isolated game state, so multiple players run independent games at once.",
        link: "https://github.com/Stephen-Agyemang/Zork-v2",
        liveUrl: "https://zork-v2.onrender.com",
        skills: ["Java 21", "Spring Boot", "Spring Data JPA", "PostgreSQL", "React", "Vite", "REST API", "Docker", "Maven", "GitHub Actions", "JUnit"],
        demoType: "zork-hud"
    },
    {
        id: "fridgejam",
        image: "/projects/fridgejam.webp",
        name: "FridgeJam",
        tagline: "Multimodal AI Leftovers Recipe Scanner",
        description: "An AI-powered cooking companion built for the GDG Coding Jam that turns leftover ingredients into personalized recipes. Uses Gemini's multimodal vision to scan fridge photos, then generates dietary-aware recipes, macro estimates, a 7-day meal planner, and exportable cookbook PDFs — wrapped in a cozy retro UI with a Firestore leaderboard mini-game.",
        link: "https://github.com/Stephen-Agyemang/FridgeJam",
        liveUrl: "https://fridgejam.web.app",
        skills: ["Gemini AI", "FastAPI", "Python", "JavaScript", "HTML5", "CSS3", "Firebase", "Docker", "Google Cloud Run"],
        demoType: "chef-assistant"
    },
    {
        id: "portfolio",
        image: "/projects/portfolio.webp",
        name: "Portfolio Website",
        tagline: "AI-Powered Engineer Portfolio",
        description: "A personal portfolio website built with React and Vite, featuring a glassmorphic background layer, custom CSS animations, an AI-powered email draft assistant that generates personalized outreach, and an intelligent chatbot assistant using OpenAI's GPT-4 API to help visitors query experience through natural dialogue.",
        link: "https://github.com/Stephen-Agyemang/stephen-portfolio",
        liveUrl: "https://stephenagyemang.com",
        skills: ["React", "Vite", "JavaScript", "HTML", "CSS3", "OpenAI API", "Upstash Redis", "Prompt Engineering", "Web Analytics"],
        demoType: "portfolio-dashboard"
    },
    {
        id: "fintracker",
        image: "/projects/fintracker.webp",
        name: "FinTracker",
        tagline: "AI-Powered Personal Finance Dashboard",
        description: "A polished personal-finance app for tracking cash flow, budgets, and spending habits in one place. Its FastAPI and SQLite backend supports Plaid bank syncing or CSV imports, while a context-aware Gemini or Claude advisor streams data-grounded insights. FinTracker also detects recurring charges, normalizes subscription costs, and helps users act with cancellation links and AI-written emails.",
        link: "https://github.com/Stephen-Agyemang/FinTracker",
        skills: ["FastAPI", "Python", "SQLite", "JavaScript", "Plaid", "Gemini", "Claude", "Chart.js"],
        demoType: "financial-ledger"
    }
];
