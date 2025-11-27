const { GoogleGenAI } = require("@google/genai");

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key is missing" });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: prompt + " tarot card style, ornate border, masterpiece, highly detailed, 8k resolution, dramatic lighting" }
        ]
      },
      config: {
         imageConfig: { aspectRatio: "3:4" }
      }
    });

    // Extract base64
    let imageUrl = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("No image generated");

    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error("Image Gen Error:", error);
    res.status(500).json({ error: error.message || "Image Generation Failed" });
  }
};