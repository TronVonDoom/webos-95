
// Fix: Use correct imports from @google/genai as per current SDK guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { TriviaQuestion } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Chat with a 90s Persona
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      // Added instruction to disable markdown
      systemInstruction: "You are 'Radical Rob', a cool, slang-using teenager from 1996. You love grunge music, skateboards, SNES games, and dial-up internet. Use 90s slang like 'tubular', 'as if', 'phat', 'fly'. Keep responses relatively short and conversational. Do not use markdown formatting (no asterisks, bold, or italics), use plain text only.",
      temperature: 0.8,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text || "Whoops, my modem disconnected!";
};

// 2. Generate Pixel Art
export const generatePixelArt = async (prompt: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `Generate a pixel art image, 16-bit style, retro video game aesthetic, solid background. Prompt: ${prompt}`
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Pixel generation failed", error);
    throw error;
  }
};
