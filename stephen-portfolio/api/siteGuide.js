/**
 * What's on the portfolio page, for the chat assistant.
 *
 * The assistant used to know Stephen's profile and projects but nothing about
 * the page it sits on. Asked "how do I reach out to Stephen?", it suggested
 * LinkedIn while the Email Draft Assistant was on screen right behind the chat.
 *
 * Each section's `id` is what the model writes after `---GOTO---`; the chat
 * turns it into a button that scrolls there. Mirrors `SITE_SECTIONS` in
 * `src/data/siteSections.js`, kept separate like the credentials and
 * experience lists (`api/` deploys to Vercel, `src/` builds with Vite), so add
 * a section in both places.
 */
export const SITE_SECTIONS = [
    {
        id: "home",
        name: "Top of the page",
        description: "Stephen's name, a status bar (current focus: AI/ML/DL and backend engineering), and three big buttons: LinkedIn, GitHub, and Resume, which opens his resume.",
    },
    {
        id: "about",
        name: "About Me",
        description: "A photo slideshow and a short bio: DePauw CS and Honor Scholar, Tech & Design Lead for DePauw's GDG, Aspire Leaders Program alumnus.",
    },
    {
        id: "skills",
        name: "Skills",
        description: "An interactive skill network showing which tools went into each project. On a computer: hover a node to trace its connections, drag nodes around. On a phone: tap a project to light up its stack, or tap a tool to see which projects used it.",
    },
    {
        id: "projects",
        name: "Projects",
        description: "One card per project (the project list below). Each card has a Demo button that opens an interactive simulated demo right on the page, a Live Site button when the project is deployed, and a Code button to its GitHub repo when the repo is public — MoNiCa.Ai's is private, so its Code button is disabled.",
    },
    {
        id: "experience",
        name: "Experience",
        description: "A timeline of Stephen's roles, newest first — research, tech work, and campus jobs.",
    },
    {
        id: "credentials",
        name: "Honors & Certifications",
        description: "Cards for his honors and certifications; some have a \"Show credential\" link to verify them.",
    },
    {
        id: "contact-assistant",
        name: "Email Draft Assistant",
        description: "Near the bottom of the page. The visitor types what they want to say (and their name, optionally), clicks \"Generate Custom Drafts\", picks one of the drafts it writes, and \"Send to Stephen\" opens it in their own email app, already addressed to him. The best way to reach him.",
    },
];

export const SITE_SECTION_IDS = new Set(SITE_SECTIONS.map((s) => s.id));

export function sectionName(id) {
    return SITE_SECTIONS.find((s) => s.id === id)?.name ?? null;
}

/** The page layout as prompt text, top to bottom. */
export function buildSiteGuide() {
    const sections = SITE_SECTIONS
        .map((s) => `- ${s.id} — ${s.name}: ${s.description}`)
        .join("\n");

    return `${sections}
- Footer (very bottom, no GOTO): LinkedIn, GitHub and email icons. The envelope opens a blank email to Stephen.
- Always on screen: the navbar at the top (Home, About, Skills, Projects, Experience, Honors & Certs, and a light/dark theme toggle; on a phone they're behind the menu button), and you — the AI Assistant, opened from the button in the bottom-right corner.`;
}
