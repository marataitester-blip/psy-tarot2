export interface TarotAnalysisResult {
  cardName: string;
  cardId: string;
  deckImageUrl: string;
  archetype: string;
  interpretation: string;
  imagePrompt: string;
  advice: string;
}

export interface AppState {
  step: 'input' | 'processing' | 'result';
  userInput: string;
  analysis: TarotAnalysisResult | null;
  generatedImageUrl: string | null;
  error: string | null;
}