import { z } from "zod";

export const translationSchema = z.object({
  value: z.string().min(1, "Value is required"),
  comment: z.string().optional(),
  cultures: z.record(z.string(), z.string()),
});

export const cultureSchema = z.object({
  code: z.string().min(2, "Culture code must be at least 2 characters"),
  name: z.string().min(1, "Culture name is required"),
  flag: z.string().optional(),
});

export const geminiTranslationRequestSchema = z.object({
  value: z.string().min(1, "Value is required"),
  comment: z.string().optional(),
  targetCultures: z.array(z.string()).min(1, "At least one target culture is required"),
});

export type Translation = z.infer<typeof translationSchema>;
export type Culture = z.infer<typeof cultureSchema>;
export type GeminiTranslationRequest = z.infer<typeof geminiTranslationRequestSchema>;
