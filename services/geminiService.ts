import { GoogleGenAI, Type } from "@google/genai";
import { TarotAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mapping of Card IDs to the provided CDN URLs
const DECK_URLS: Record<string, string> = {
  // Majors
  "fool": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/00_fool.png",
  "magician": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/01_magician.png",
  "high_priestess": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/02_high_priestess.png",
  "empress": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/03_empress.png",
  "emperor": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/04_emperor.png",
  "hierophant": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/05_hierophant.png",
  "lovers": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/06_lovers.png",
  "chariot": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/07_chariot.png",
  "justice": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/08_justice.png",
  "hermit": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/09_hermit.png",
  "wheel_of_fortune": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/10_wheel_of_fortune.png",
  "strength": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/11_strength.png",
  "hanged_man": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/12_hanged_man.png",
  "death": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/13_death.png",
  "temperance": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/14_temperance.png",
  "devil": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/15_devil.png",
  "tower": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/16_tower.png",
  "star": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/17_star.png",
  "moon": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/18_moon.png",
  "sun": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/19_sun.png",
  "judgement": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/20_judgement.png",
  "world": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/21_world.png",
  "hero": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/22_hero.png",
  "white_card": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/23_white_card.png",
  
  // Wands
  "ace_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_01_ace.png",
  "two_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_02_two.png",
  "three_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_03_three.png",
  "four_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_04_four.png",
  "five_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_05_five.png",
  "six_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_06_six.png",
  "seven_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_07_seven.png",
  "eight_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_08_eight.png",
  "nine_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_09_nine.png",
  "ten_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_10_ten.png",
  "page_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_11_page.png",
  "knight_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_12_knight.png",
  "queen_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_13_queen.png",
  "king_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_14_king.png",

  // Cups
  "ace_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_01_ace.png",
  "two_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_02_two.png",
  "three_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_03_three.png",
  "four_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_04_four.png",
  "five_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_05_five.png",
  "six_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_06_six.png",
  "seven_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_07_seven.png",
  "eight_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_08_eight.png",
  "nine_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_09_nine.png",
  "ten_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_10_ten.png",
  "page_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_11_page.png",
  "knight_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_12_knight.png",
  "queen_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_13_queen.png",
  "king_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_14_king.png",

  // Swords
  "ace_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_01_ace.png",
  "two_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_02_two.png",
  "three_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_03_three.png",
  "four_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_04_four.png",
  "five_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_05_five.png",
  "six_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_06_six.png",
  "seven_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_07_seven.png",
  "eight_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_08_eight.png",
  "nine_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_09_nine.png",
  "ten_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_10_ten.png",
  "page_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_11_page.png",
  "knight_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_12_knight.png",
  "queen_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_13_queen.png",
  "king_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_14_king.png",

  // Pentacles
  "ace_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_01_ace.png",
  "two_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_02_two.png",
  "three_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_03_three.png",
  "four_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_04_four.png",
  "five_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_05_five.png",
  "six_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_06_six.png",
  "seven_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_07_seven.png",
  "eight_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_08_eight.png",
  "nine_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_09_nine.png",
  "ten_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_10_ten.png",
  "page_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_11_page.png",
  "knight_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_12_knight.png",
  "queen_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_13_queen.png",
  "king_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_14_king.png",
};

export const analyzeSituation = async (userInput: string): Promise<TarotAnalysisResult> => {
  const model = "gemini-2.5-flash"; 

  const validIds = Object.keys(DECK_URLS).join(", ");

  const response = await ai.models.generateContent({
    model,
    contents: `
      Действуй как профессиональный таролог и юнгианский психоаналитик. 
      Проанализируй следующий запрос пользователя: "${userInput}".
      
      1. Выбери ОДНУ карту из колоды "Путь Героя" (включая уникальные карты Hero и White Card), которая наиболее точно отражает суть ситуации.
      2. ОБЯЗАТЕЛЬНО выбери 'cardId' из следующего списка: [${validIds}].
      3. Опиши психологический архетип этой карты.
      4. Дай глубокую, персональную психологическую трактовку ситуации через призму этой карты.
      5. Сформулируй краткий совет.
      6. Создай детальный промпт для генерации изображения (на английском), который смешивает классическую иконографию этой карты с элементами ситуации пользователя. Стиль: мистический реализм, мрачное фэнтези, кинематографичное освещение.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cardName: { type: Type.STRING },
          cardId: { type: Type.STRING, description: "Must be one of the keys provided in the list." },
          archetype: { type: Type.STRING },
          interpretation: { type: Type.STRING },
          advice: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
        required: ["cardName", "cardId", "archetype", "interpretation", "advice", "imagePrompt"],
      },
      systemInstruction: "Ты — эмпатичный, мудрый наставник. Твой тон глубокий, спокойный и поддерживающий. Даже если ввод кажется бессмысленным, найди скрытый смысл бессознательного.",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Не удалось получить ответ от оракула.");
  
  const parsed = JSON.parse(text) as TarotAnalysisResult;
  
  // Resolve deck image URL
  parsed.deckImageUrl = DECK_URLS[parsed.cardId] || DECK_URLS['white_card']; // fallback to white card

  return parsed;
};

export const generateTarotImage = async (imagePrompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: imagePrompt + " tarot card style, ornate border, masterpiece, highly detailed, 8k resolution, dramatic lighting" }
        ]
      },
      config: {
         imageConfig: { aspectRatio: "1:1" }
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
    throw error;
  }
};