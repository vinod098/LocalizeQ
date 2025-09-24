import type { GeminiTranslationRequest } from "@shared/schema";

export interface TranslationResult {
  [cultureCode: string]: string;
}

export async function generateTranslations(request: GeminiTranslationRequest): Promise<TranslationResult> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const translations: TranslationResult = await response.json();
    return translations;
  } catch (error) {
    console.error("Translation API Error:", error);
    throw new Error(`Failed to generate translations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
