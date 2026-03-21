import axios from 'axios';

export const generateChatResponse = async (messages, isMockMode, customApiKey = null) => {
    // Use the provided key or fallback to the one in .env
    const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = isMockMode
        ? "You are PrepMate, an expert placement mock interviewer. Ask ONE interview question at a time related to OS, DBMS, CN, HR, or DSA. Wait for the user to answer. After the user answers, give concise, constructive feedback on their answer, and then ask the NEXT question. Do not provide a long list of questions. Keep it interactive and realistic.\n\nFORMAT REQUIREMENTS:\n- If stating a new question, start with **Question:**\n- If providing feedback or answer, start with **Answer:**\n- If giving a formatting tip, start with **💡 Interview Tip:**"
        : "You are PrepMate, an expert placement assistant helping students prepare for interviews in OS, DBMS, CN, HR, and DSA. Always give structured, clear, interview-focused answers. Use bullet points, short examples, and interview tips. Be concise but extremely helpful.\n\nFORMAT REQUIREMENTS:\n- When stating a question, start with **Question:**\n- When providing an explanation, start with **Answer:**\n- When giving a tip, start with **💡 Interview Tip:**";

    const formattedMessages = messages.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    if (!apiKey) {
        // Fallback Mock response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    role: 'bot',
                    content: isMockMode
                        ? "That's a good attempt! However, you should also mention X and Y to make your answer complete. Let's move on. Can you explain what happens when you type a URL in the browser?"
                        : "This is a simulated response. Please add your Gemini API Key in the `.env` file or Settings.\n\n**Example Tip:** Always structure your answers using the STAR method (Situation, Task, Action, Result) for behavioral questions."
                });
            }, 1500);
        });
    }

    try {
        const response = await axios.post(
            GEMINI_API_URL,
            {
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: formattedMessages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        return {
            role: 'bot',
            content: replyText
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(error.response?.data?.error?.message || "Failed to connect to the AI service. Please check your API key.");
    }
};
