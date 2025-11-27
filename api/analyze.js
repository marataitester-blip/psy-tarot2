// api/analyze.js - ВЕРСИЯ БЕЗ БИБЛИОТЕК (NATIVE FETCH)
export const config = {
  runtime: 'edge', // Используем Edge Runtime (быстрее и надежнее для Vercel)
};

export default async function handler(req) {
  // Настраиваем заголовки (CORS), чтобы сайт видел ответ
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Если это просто проверка связи (OPTIONS) - отвечаем ОК
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // 1. Проверяем ключ
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      throw new Error("Ключ API не найден в настройках Vercel");
    }

    // 2. Получаем текст от клиента
    const { userRequest } = await req.json();

    // 3. Формируем запрос к OpenRouter (Llama 3 Free)
    // Мы делаем это вручную, без библиотеки openai
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mirmag.app", 
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты — экзистенциальный психолог и эксперт по Таро. Верни ответ СТРОГО в формате JSON: { \"card_name\": \"Название карты (RU)\", \"interpretation\": \"Психологический инсайт (RU, 2-3 фразы)\", \"image_prompt\": \"Surrealism, abstract tarot card description (EN)\" }."
          },
          {
            role: "user",
            content: userRequest || "Общий прогноз"
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`Ошибка OpenRouter: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices[0].message.content;

    // 4. Чистим ответ (ищем JSON внутри текста)
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("ИИ вернул не JSON: " + rawContent);
    
    const result = JSON.parse(jsonMatch[0]);

    // 5. Генерируем ссылку на картинку (Pollinations)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt + " mystical tarot style, 8k, dark gold")}`;

    // 6. Отдаем ответ клиенту
    return new Response(JSON.stringify({
      card_name: result.card_name,
      interpretation: result.interpretation,
      imageUrl: imageUrl
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
