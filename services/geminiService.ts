import { GoogleGenAI, Type } from "@google/genai";
import { TarotAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSituation = async (userInput: string): Promise<TarotAnalysisResult> => {
  const model = "gemini-2.5-flash"; // Optimized for speed and reasoning

  const response = await ai.models.generateContent({
    model,
    contents: `
      Действуй как профессиональный таролог и юнгианский психоаналитик. 
      Проанализируй следующий запрос пользователя: "${userInput}".
      
      1. Выбери ОДНУ карту из Старших Арканов Таро (колода "Путь Героя"), которая наиболее точно отражает суть ситуации.
      2. Опиши психологический архетип этой карты.
      3. Дай глубокую, персональную психологическую трактовку ситуации через призму этой карты.
      4. Сформулируй краткий совет.
      5. Создай детальный промпт для генерации изображения (на английском), который смешивает классическую иконографию этой карты с элементами ситуации пользователя. Стиль: мистический реализм, мрачное фэнтези, кинематографичное освещение.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cardName: { type: Type.STRING },
          archetype: { type: Type.STRING },
          interpretation: { type: Type.STRING },
          advice: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
        required: ["cardName", "archetype", "interpretation", "advice", "imagePrompt"],
      },
      systemInstruction: "Ты — эмпатичный, мудрый наставник. Твой тон глубокий, спокойный и поддерживающий. Избегай банальностей.",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Не удалось получить ответ от оракула.");
  
  return JSON.parse(text) as TarotAnalysisResult;
};

export const generateTarotImage = async (imagePrompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image"; // Efficient image generation

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: imagePrompt + " tarot card style, ornate border, masterpiece, highly detailed, 8k resolution, dramatic lighting" }
        ]
      },
      config: {
        // No specific image config needed for 2.5-flash-image defaults usually work well for 1:1
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Изображение не было сгенерировано.");
  } catch (error) {
    console.error("Image generation error:", error);
    // Fallback or re-throw
    throw error;
  }
};
