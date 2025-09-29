import { useState, useEffect } from "react";
import InputSection from "@/components/input-section";
import OutputSection from "@/components/output-section";
import CulturesPanel from "@/components/cultures-panel";
import { generateTranslations } from "@/lib/gemini";
import { DEFAULT_CULTURES } from "@/lib/cultures";
import type { Translation, Culture } from "@shared/schema";

export default function Home() {
  const [cultures, setCultures] = useState<Culture[]>(DEFAULT_CULTURES);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTranslations = async (value: string, comment: string) => {
    if (cultures.length === 0) {
      setError("Please add at least one culture to translate to.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslation(null);

    try {
      const targetCultures = cultures.map(c => c.code);
      const translationResult = await generateTranslations({
        value,
        comment,
        targetCultures,
      });

      const newTranslation: Translation = {
        value,
        comment,
        cultures: translationResult,
      };

      setTranslation(newTranslation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">LocalizeQ</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Celebrate global reach with LocalizeQ 🌍🎉</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input and Output Section */}
          <div className="lg:col-span-3 space-y-6">
            <InputSection 
              onGenerateTranslations={handleGenerateTranslations}
              isLoading={isLoading}
            />
            <OutputSection 
              translation={translation}
              isLoading={isLoading}
              error={error}
            />
          </div>
          
          {/* Cultures Panel */}
          <div className="lg:col-span-1">
            <CulturesPanel 
              cultures={cultures}
              onCulturesChange={setCultures}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side - Powered by */}
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
            </div>
            
            {/* Right side - Made with love */}
            <div className="text-sm text-muted-foreground">
              Made with <span className="text-red-500">❤️</span> for developers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
