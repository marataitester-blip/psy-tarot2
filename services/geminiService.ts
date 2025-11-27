import { TarotAnalysisResult } from "../types";

export const analyzeSituation = async (userInput: string): Promise<TarotAnalysisResult> => {
  // 1. Setup Timeout Logic (9 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput }),
      signal: controller.signal // Link signal to fetch
    });

    clearTimeout(timeoutId); // Clear timer if successful

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server Error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("Связь с эфиром прервана (Тайм-аут). Попробуйте еще раз.");
    }
    throw error;
  }
};
