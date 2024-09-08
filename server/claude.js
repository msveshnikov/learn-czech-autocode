import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config({ override: true });

export const getTextClaude = async (prompt) => {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });
    const model = 'claude-3-haiku-20240307';

    const messages = [
        {
            role: 'user',
            content: [{ type: 'text', text: prompt }]
        }
    ];

    let response = await getResponse();
    return response?.content?.[0]?.text;

    async function getResponse() {
        return anthropic.messages.create({
            model,
            system: 'You are a Czech language teacher. Keep your responses concise and focused on teaching Czech to Russian speakers.',
            max_tokens: 150,
            temperature: 0.7,
            messages
        });
    }
};

export const speakToTeacher = async (userMessage) => {
    const prompt = `User: ${userMessage}\nTeacher: `;
    return getTextClaude(prompt);
};
