import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
import { geminiTranslationRequestSchema } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation API endpoint
  app.post('/api/translate', async (req, res) => {
    try {
      // Validate request body
      const validation = geminiTranslationRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.errors
        });
      }

      const { value, comment, targetCultures } = validation.data;
      
      const userPrompt = `Translate the text "${value}" ${comment ? `(Context: ${comment})` : ''} into these languages: ${targetCultures.join(', ')}.

Return ONLY a JSON object with culture codes as keys and translations as values. No explanation, no markdown, just the JSON:

{
  "en-GB": "translation",
  "fr-CA": "translation",
  ...
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: userPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawJson = response.text;
      
      if (!rawJson) {
        return res.status(500).json({
          message: "Empty response from Gemini API"
        });
      }

      // Clean up the response to extract valid JSON
      let cleanJson = rawJson.trim();
      
      // Remove any markdown code blocks if present
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to find JSON object if response has extra text
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }

      let translations;
      try {
        translations = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", rawJson);
        return res.status(500).json({
          message: "Invalid JSON response from AI service"
        });
      }
      
      // Validate that we got translations for all requested cultures
      const missingCultures = targetCultures.filter(culture => !translations[culture]);
      if (missingCultures.length > 0) {
        console.warn(`Missing translations for cultures: ${missingCultures.join(', ')}`);
      }

      res.json(translations);
    } catch (error) {
      console.error("Translation API Error:", error);
      res.status(500).json({
        message: `Failed to generate translations: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
