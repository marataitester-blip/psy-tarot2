const OpenAI = require("openai");

// URL Mapping for the Deck
const DECK_URLS = {
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
  "ace_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_01_ace.png",
  "two_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_02_two.png",
  "three_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_03_three.png",
  "four_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_04_four.png",
  "five_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_05_five.png",
  "six_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_06_six.png",
  "seven_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_07_seven.png",
  "eight_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_08_eight.png",
  "nine_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_09_nine.png",
  "ten_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_10_ten.png",
  "page_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_11_page.png",
  "knight_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_12_knight.png",
  "queen_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_13_queen.png",
  "king_of_wands": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/wands_14_king.png",
  "ace_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_01_ace.png",
  "two_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_02_two.png",
  "three_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_03_three.png",
  "four_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_04_four.png",
  "five_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_05_five.png",
  "six_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_06_six.png",
  "seven_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_07_seven.png",
  "eight_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_08_eight.png",
  "nine_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_09_nine.png",
  "ten_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_10_ten.png",
  "page_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_11_page.png",
  "knight_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_12_knight.png",
  "queen_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_13_queen.png",
  "king_of_cups": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/cups_14_king.png",
  "ace_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_01_ace.png",
  "two_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_02_two.png",
  "three_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_03_three.png",
  "four_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_04_four.png",
  "five_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_05_five.png",
  "six_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_06_six.png",
  "seven_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_07_seven.png",
  "eight_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_08_eight.png",
  "nine_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_09_nine.png",
  "ten_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_10_ten.png",
  "page_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_11_page.png",
  "knight_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_12_knight.png",
  "queen_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_13_queen.png",
  "king_of_swords": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/swords_14_king.png",
  "ace_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_01_ace.png",
  "two_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_02_two.png",
  "three_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_03_three.png",
  "four_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_04_four.png",
  "five_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_05_five.png",
  "six_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_06_six.png",
  "seven_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_07_seven.png",
  "eight_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_08_eight.png",
  "nine_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_09_nine.png",
  "ten_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_10_ten.png",
  "page_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_11_page.png",
  "knight_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_12_knight.png",
  "queen_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_13_queen.png",
  "king_of_pentacles": "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/pentacles_14_king.png",
};

module.exports = async function handler(req, res) {
  // Set explicit timeouts for the Serverless Function
  res.setHeader('Cache-Control', 'no-store');

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is missing in Vercel Settings" });
  }

  const { userInput } = req.body;
  if (!userInput) {
    return res.status(400).json({ error: "User input is required" });
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  try {
    const validIds = Object.keys(DECK_URLS).join(", ");
    
    // Using a fast, free model as requested
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: `Ты — экзистенциальный психолог и эксперт по юнгианскому анализу. Ты используешь Таро не для гадания, а как проективную систему архетипов для работы с подсознанием. Твоя цель: проанализировать запрос клиента и подобрать карту-архетип, которая лучше всего отражает его состояние. Тон ответа: глубокий, аналитический, поддерживающий, без эзотерической "воды", с использованием понятий: Тень, Персона, Самость, Бессознательное.
          
          ВАЖНО: Верни ответ СТРОГО в формате JSON. Не пиши никакого markdown, только чистый JSON объект.

          Структура JSON:
          { 
            "cardName": "Название карты (на русском)", 
            "cardId": "Один ID строго из этого списка: [${validIds}]",
            "archetype": "Название Архетипа (на русском)",
            "interpretation": "Психологический разбор ситуации через призму этого архетипа (3-4 предложения).", 
            "advice": "Краткий совет-инсайт (1 предложение)",
            "imagePrompt": "Описание для генерации картинки на английском: Surrealism, abstract art showing [Symbol of Card] merged with human silhouette, psychological depth, dark background, gold accents, cinematic lighting, 8k" 
          }`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponseContent = completion.choices[0].message.content;
    let parsed;
    try {
        parsed = JSON.parse(aiResponseContent);
    } catch (e) {
        // Fallback cleanup if model returns markdown ticks
        const cleaned = aiResponseContent.replace(/```json/g, '').replace(/```/g, '');
        parsed = JSON.parse(cleaned);
    }

    // 1. Attach Deck Image
    parsed.deckImageUrl = DECK_URLS[parsed.cardId] || DECK_URLS['white_card'];

    // 2. Generate Personal Image URL using Pollinations (Fast, No Key needed)
    // We encode the prompt to be URL safe.
    parsed.generatedImageUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(parsed.imagePrompt) + '?nologo=true&private=true&enhance=true';

    res.status(200).json(parsed);

  } catch (error) {
    console.error("OpenRouter/Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze situation." });
  }
};