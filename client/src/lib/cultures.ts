import type { Culture } from "@shared/schema";

// Comprehensive list of supported cultures with flags and names
export const SUPPORTED_CULTURES: Culture[] = [
  { code: "ar-AE", name: "Arabic (UAE)", flag: "🇦🇪" },
  { code: "bg-BG", name: "Bulgarian (Bulgaria)", flag: "🇧🇬" },
  { code: "ca-ES", name: "Catalan (Spain)", flag: "🇪🇸" },
  { code: "cs-CZ", name: "Czech (Czech Republic)", flag: "🇨🇿" },
  { code: "da-DK", name: "Danish (Denmark)", flag: "🇩🇰" },
  { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
  { code: "el-GR", name: "Greek (Greece)", flag: "🇬🇷" },
  { code: "en-AU", name: "English (Australia)", flag: "🇦🇺" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
  { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
  { code: "es-MX", name: "Spanish (Mexico)", flag: "🇲🇽" },
  { code: "et-EE", name: "Estonian (Estonia)", flag: "🇪🇪" },
  { code: "eu-ES", name: "Basque (Spain)", flag: "🇪🇸" },
  { code: "fi-FI", name: "Finnish (Finland)", flag: "🇫🇮" },
  { code: "fr-CA", name: "French (Canada)", flag: "🇨🇦" },
  { code: "fr-FR", name: "French (France)", flag: "🇫🇷" },
  { code: "he-IL", name: "Hebrew (Israel)", flag: "🇮🇱" },
  { code: "hr-HR", name: "Croatian (Croatia)", flag: "🇭🇷" },
  { code: "hu-HU", name: "Hungarian (Hungary)", flag: "🇭🇺" },
  { code: "hy-AM", name: "Armenian (Armenia)", flag: "🇦🇲" },
  { code: "id-ID", name: "Indonesian (Indonesia)", flag: "🇮🇩" },
  { code: "it-IT", name: "Italian (Italy)", flag: "🇮🇹" },
  { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean (South Korea)", flag: "🇰🇷" },
  { code: "lt-LT", name: "Lithuanian (Lithuania)", flag: "🇱🇹" },
  { code: "lv-LV", name: "Latvian (Latvia)", flag: "🇱🇻" },
  { code: "ms-MY", name: "Malay (Malaysia)", flag: "🇲🇾" },
  { code: "nb-NO", name: "Norwegian (Norway)", flag: "🇳🇴" },
  { code: "nl-NL", name: "Dutch (Netherlands)", flag: "🇳🇱" },
  { code: "pl-PL", name: "Polish (Poland)", flag: "🇵🇱" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
  { code: "ro-RO", name: "Romanian (Romania)", flag: "🇷🇴" },
  { code: "ru-RU", name: "Russian (Russia)", flag: "🇷🇺" },
  { code: "sk-SK", name: "Slovak (Slovakia)", flag: "🇸🇰" },
  { code: "sl-SI", name: "Slovenian (Slovenia)", flag: "🇸🇮" },
  { code: "sr-Latn-RS", name: "Serbian (Latin, Serbia)", flag: "🇷🇸" },
  { code: "sv-SE", name: "Swedish (Sweden)", flag: "🇸🇪" },
  { code: "th-TH", name: "Thai (Thailand)", flag: "🇹🇭" },
  { code: "tr-TR", name: "Turkish (Turkey)", flag: "🇹🇷" },
  { code: "uk-UA", name: "Ukrainian (Ukraine)", flag: "🇺🇦" },
  { code: "vi-VN", name: "Vietnamese (Vietnam)", flag: "🇻🇳" },
  { code: "zh-CN", name: "Chinese (China)", flag: "🇨🇳" },
  { code: "zh-Hant", name: "Chinese (Traditional)", flag: "🇹🇼" },
];

// Default cultures for initial setup
export const DEFAULT_CULTURES: Culture[] = [
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
  { code: "fr-CA", name: "French (Canada)", flag: "🇨🇦" },
  { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
  { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
  { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean (South Korea)", flag: "🇰🇷" },
  { code: "zh-CN", name: "Chinese (China)", flag: "🇨🇳" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
];

// Helper function to search cultures
export function searchCultures(query: string, excludeCodes: string[] = []): Culture[] {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return SUPPORTED_CULTURES
    .filter(culture => !excludeCodes.includes(culture.code))
    .filter(culture => 
      culture.code.toLowerCase().includes(searchTerm) ||
      culture.name.toLowerCase().includes(searchTerm)
    )
    .slice(0, 8); // Limit to 8 suggestions
}

// Helper function to find culture by code
export function findCultureByCode(code: string): Culture | undefined {
  return SUPPORTED_CULTURES.find(culture => 
    culture.code.toLowerCase() === code.toLowerCase()
  );
}
