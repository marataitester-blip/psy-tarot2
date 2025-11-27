const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    keys: {},
    connectivity: {}
  };

  // 1. ПРОВЕРКА НАЛИЧИЯ КЛЮЧЕЙ
  // Мы проверяем только API_KEY, так как это единственный правильный источник ключа.
  const keysToCheck = ["API_KEY"];

  keysToCheck.forEach(keyName => {
    const value = process.env[keyName];
    if (!value) {
      results.keys[keyName] = { status: "MISSING", preview: "N/A" };
    } else if (value.trim() === "") {
      results.keys[keyName] = { status: "EMPTY", preview: "Empty String" };
    } else {
      // Безопасная маска: показываем первые 4 символа, остальное скрываем
      const preview = value.substring(0, 4) + "*".repeat(value.length - 4);
      results.keys[keyName] = { status: "PRESENT", preview: preview };
    }
  });

  // 2. ТЕСТОВОЕ ПОДКЛЮЧЕНИЕ (PING) К GEMINI
  const apiKey = process.env.API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      // Используем корректную модель для простых текстовых задач согласно гайдлайнам
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Reply with only the word 'OK'.",
      });
      
      const text = response.text;
      
      results.connectivity.gemini = {
        status: "OK",
        message: "Connection successful",
        modelResponse: text ? text.trim() : "No text returned"
      };
    } catch (error) {
      results.connectivity.gemini = {
        status: "ERROR",
        message: error.message,
        details: error.toString()
      };
    }
  } else {
    results.connectivity.gemini = {
      status: "SKIPPED",
      message: "No API_KEY found to test connection"
    };
  }

  // Возвращаем результат
  res.status(200).json(results);
};