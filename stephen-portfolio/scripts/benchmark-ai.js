#!/usr/bin/env node
/* eslint-disable no-undef */
import OpenAI from "openai";

// Usage: OPENAI_API_KEY=... node scripts/benchmark-ai.js

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("Missing OPENAI_API_KEY in environment. Set OPENAI_API_KEY before running.");
    process.exit(1);
}

const client = new OpenAI({ apiKey });

async function runBenchmark() {
    console.log("Starting AI streaming benchmark (measures time-to-first-token)...\n");

    const start = Date.now();

    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a concise assistant used for a latency benchmark. Reply in one short sentence." },
            { role: "user", content: "Performance test: please reply with a short acknowledgement." }
        ],
        stream: true,
        max_tokens: 60,
    });

    let firstTokenAt = null;
    try {
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content && firstTokenAt === null) {
                firstTokenAt = Date.now();
                console.log(`First token received after ${firstTokenAt - start} ms`);
                break; // we only need the first token timing
            }
        }
    } catch (err) {
        console.error("Error while streaming:", err);
        process.exit(2);
    }

    if (!firstTokenAt) console.log("No tokens received within stream.");

    // Optionally measure full completion time (non-streamed fallback)
    const totalElapsed = Date.now() - start;
    console.log(`Elapsed since request start: ${totalElapsed} ms`);
}

runBenchmark().catch(err => {
    console.error(err);
    process.exit(1);
});
