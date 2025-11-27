
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    keys: {},
    connectivity: {}
  };

  // 1. ПРОВЕРКА НАЛИЧИЯ КЛЮЧЕЙ
  // Мы проверяем и API_KEY (который используется в приложении) и специфичные ключи
  const keysToCheck = ["API_KEY", "GEMINI_API_KEY", "DEEPSEEK_API_KEY"];

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
  // Пытаемся использовать API_KEY или GEMINI_API_KEY
  const geminiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      // Используем самую легкую модель для теста
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = "Reply with only the word 'OK'.";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      results.connectivity.gemini = {
        status: "OK",
        message: "Connection successful",
        modelResponse: text.trim()
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
      message: "No valid Gemini key found to test connection"
    };
  }

  // Возвращаем результат
  res.status(200).json(results);
}
