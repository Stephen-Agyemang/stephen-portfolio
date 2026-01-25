import OpenAI from 'openai';

// Lazy initialization to prevent app crash if API key is missing
let openaiClient = null;

function getOpenAIClient() {
    if (openaiClient) return openaiClient;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API Key is missing. Please add OPENAI_API_KEY to your environment variables.");
    }

    openaiClient = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
    return openaiClient;
}

/**
 * Generates email subject lines and body drafts based on user intent.
 * @param {string} userIntent - The user's description of what they want to say.
 * @returns {Promise<Object>} - Returns an object with drafts.
 */
export async function generateEmailDrafts(userIntent) {
    try {
        const client = getOpenAIClient();
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert professional communication assistant. 
          Your goal is to help a user draft an outreach email to Stephen Agyemang, a software developer.
          Based on the user's raw intent, generate 2 distinct options:
          1. "Polished Professional": Formal, concise, and business-ready. Sign off with "[Your Name]".
          2. "Friendly & Direct": Casual but professional, getting straight to the point. Sign off with "[Your Name]".
          
          Return the response in strictly valid JSON format with the following structure:
          {
            "options": [
              { "style": "Polished Professional", "subject": "Subject line here", "body": "Email body here...\\n\\nBest regards,\\n[Your Name]" },
              { "style": "Friendly & Direct", "subject": "Subject line here", "body": "Email body here...\\n\\nBest,\\n[Your Name]" }
            ]
          }`
                },
                {
                    role: "user",
                    content: `Here is what I want to say to Stephen: "${userIntent}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        return content.options;
    } catch (error) {
        console.error("Error generating email drafts:", error);
        throw error;
    }
}

/**
 * Finds projects that match a user's natural language query.
 * @param {string} query - The user's search query (e.g. "I need a React dev")
 * @param {Array} projects - List of project objects
 * @returns {Promise<Array>} - Returns list of matching project names or IDs.
 */
/**
 * Chats with the AI assistant about projects or general inquiries.
 * @param {string} userMessage - The user's message.
 * @param {Array} projects - List of project objects
 * @returns {Promise<Object>} - Returns { reply: string, matches: Array }
 */
export async function findMatchingProjects(userMessage, projects) {
    try {
        const projectContext = projects.map(p =>
            `Name: ${p.name}, Description: ${p.description}, Skills: ${p.skills.join(", ")}, Link: ${p.link}`
        ).join("\n---\n");

        const client = getOpenAIClient();
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are Stephen Agyemang's personal portfolio AI assistant.
          Your goal is to chat with visitors, answer questions about Stephen, and recommend his projects when relevant.
          
          Stephen is a software developer. You have access to his projects list below.
          
          Rules:
          1. **Be Conversational**: If the user says "Hi" or "How are you?", reply normally and politely.
          2. **Answer Questions**: If they ask "Who is Stephen?", summarize him based on the successful projects he has built (Python, Java, React).
          3. **Project Matching**: If the user asks about specific skills or projects (e.g. "Does he know Java?"), answer them AND provided a list of matching projects in the "matches" array.
          4. **No Match?**: If they ask for something he hasn't done (e.g. "C++"), be honest but friendly. "He hasn't uploaded any C++ projects yet, but he is quick to learn!"
          5. **Tone**: Professional, friendly, and enthusiastic.
          
          Response Format (Strict JSON):
          {
            "reply": "Your conversational response goes here...",
            "matches": ["Exact Project Name 1", "Exact Project Name 2"] (optional, can be empty array)
          }`
                },
                {
                    role: "user",
                    content: `User Message: "${userMessage}"\n\nStephen's Projects:\n${projectContext}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        return {
            reply: content.reply || "I'm having trouble thinking right now.",
            matches: content.matches || []
        };
    } catch (error) {
        console.error("Error talking to AI:", error);
        return { reply: "Sorry, I'm having trouble connecting to my brain right now.", matches: [] };
    }
}
