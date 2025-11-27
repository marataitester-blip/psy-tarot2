import { TarotAnalysisResult } from "../types";

export const analyzeSituation = async (userInput: string): Promise<TarotAnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInput })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server Error: ${response.status}`);
  }

  return response.json();
};

export const generateTarotImage = async (imagePrompt: string): Promise<string> => {
  const response = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: imagePrompt })
  });

  if (!response.ok) {
     const errData = await response.json().catch(() => ({}));
     throw new Error(errData.error || `Image Server Error: ${response.status}`);
  }

  const data = await response.json();
  return data.imageUrl;
};