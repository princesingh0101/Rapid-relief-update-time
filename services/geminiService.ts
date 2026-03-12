import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// NOTE: In a real app, never expose API keys on client side without proxy. 
// For this demo, we assume the environment variable is injected by the bundler or framework.

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToHealthAssistant = async (message: string, history: string[]): Promise<string> => {
  if (!ai) {
    return "I'm sorry, my brain (API Key) is missing. Please configure it to chat!";
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: `
            You are RapidRelief's smart health assistant. 
            Context: The user is browsing an online medicine store.
            Previous conversation summary: ${history.join('\n')}
            User Query: ${message}
            
            Instructions:
            1. Be helpful, empathetic, and professional.
            2. Suggest OTC (Over-the-Counter) categories if applicable, but strictly advice consulting a doctor for serious symptoms.
            3. Keep answers concise (under 100 words).
            4. If the user asks for a product, check if it matches general categories like 'Tablets', 'Syrups', 'First Aid'.
          ` }]
        }
      ]
    });

    return response.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently offline. Please try again later.";
  }
};