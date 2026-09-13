import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function main(prompt) {
    try {
        const interaction = await client.interactions.create({
            model: "gemini-3.5-flash-lite",

            input: prompt,

            tools: [
                {
                    type: "google_search",
                },
            ],

            generation_config: {
                max_output_tokens: 2048,
                thinking_level: "minimal",
            },
        });

        return interaction.output_text;

    } catch (error) {
        console.error("Gemini error:", error);
        throw error;
    }
}

export default main;