/**
 * Places on the page the chat assistant can send a visitor to, in page order.
 *
 * When the answer to a question lives somewhere on the page, the API ends its
 * reply with `---GOTO---` and one of these ids (or a project's name), and the
 * chat turns it into a button that scrolls there. The chat also reports which
 * of these the visitor is looking at when they ask, so the assistant can say
 * "you're already on it".
 *
 * Mirrors `SITE_SECTIONS` in `api/siteGuide.js`, which describes the same
 * places to the model. Kept as two lists for the same reason as
 * `credentials.js` — `api/` deploys to Vercel while `src/` builds with Vite —
 * so add a section in both places.
 *
 * `id` is the section's DOM id. `label` finishes the button's "Go to …".
 * `aliases` catch the model naming a place loosely instead of by id.
 */
export const SITE_SECTIONS = [
    { id: "home", label: "the top of the page", aliases: ["top", "top-of-the-page", "hero", "intro"] },
    { id: "about", label: "About Me", aliases: ["about-me", "bio"] },
    { id: "skills", label: "Skills", aliases: ["skill-graph", "skills-graph", "skill-network"] },
    { id: "projects", label: "Projects", aliases: [] },
    { id: "experience", label: "Experience", aliases: ["timeline"] },
    { id: "credentials", label: "Honors & Certifications", aliases: ["honors", "certifications", "certs", "honors-certifications", "honors-certs"] },
    { id: "contact-assistant", label: "the Email Draft Assistant", aliases: ["contact", "email", "email-assistant", "email-draft-assistant"] },
];
