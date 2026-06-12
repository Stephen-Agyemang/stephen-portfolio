
export async function chatWithAIStream(userMessage, projects, onChunk) {
    const res = await fetch("https://stephen-vite.vercel.app/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userMessage, projects })
    });

    if (!res.body) throw new Error ("No response body");

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
        
        if(value) {
            const chunk = decoder.decode(value);
            if (chunk) {
                buffered += chunk;
                flush();
            }
        }
    }

    flush(true);
}

export async function generateEmailDrafts(userIntent) {
    const res = await fetch("https://stephen-vite.vercel.app/api/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userIntent }),
    });
    
    return res.json();
} 
