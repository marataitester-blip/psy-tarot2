const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    keys: {},
    connectivity: {}
  };

  // 1. ПРОВЕРКА НАЛИЧИЯ КЛЮЧЕЙ
  // Проверяем OPENROUTER_API_KEY (основной) и API_KEY (резервный)
  const keysToCheck = ["OPENROUTER_API_KEY", "API_KEY"];

  keysToCheck.forEach(keyName => {
    const value = process.env[keyName];
    if (!value) {
      results.keys[keyName] = { status: "MISSING", preview: "N/A" };
    } else if (value.trim() === "") {
      results.keys[keyName] = { status: "EMPTY", preview: "Empty String" };
    } else {
      // Безопасная маска
      const preview = value.substring(0, 4) + "*".repeat(Math.max(0, value.length - 4));
      results.keys[keyName] = { status: "PRESENT", preview: preview };
    }
  });

  // 2. ТЕСТОВОЕ ПОДКЛЮЧЕНИЕ (PING) К OPENROUTER
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY;

  if (apiKey) {
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
      });

      // Тестовый запрос к бесплатной быстрой модели
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
            { role: "user", content: "Say OK" }
        ],
        max_tokens: 5
      });
      
      const text = completion.choices[0]?.message?.content;
      
      results.connectivity.openrouter = {
        status: "OK",
        message: "Connection successful",
        modelResponse: text ? text.trim() : "No text returned"
      };
    } catch (error) {
      results.connectivity.openrouter = {
        status: "ERROR",
        message: error.message,
        details: error.toString()
      };
    }
  } else {
    results.connectivity.openrouter = {
      status: "SKIPPED",
      message: "No API Key found to test connection"
    };
  }

  // Возвращаем результат
  res.status(200).json(results);
};