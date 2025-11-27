// Этот эндпоинт устарел. 
// Генерация изображений теперь происходит автоматически внутри api/analyze.js через Pollinations AI.
// Мы оставляем этот файл пустым (заглушкой), чтобы избежать ошибок импорта старых библиотек.

module.exports = async (req, res) => {
  res.status(410).json({ 
    error: "This endpoint is deprecated. Image generation is now handled within /api/analyze." 
  });
};