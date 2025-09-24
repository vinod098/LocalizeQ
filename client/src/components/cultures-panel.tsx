import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Culture } from "@shared/schema";

const DEFAULT_CULTURES: Culture[] = [
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "fr-CA", name: "French (Canada)", flag: "🇨🇦" },
  { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
  { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
  { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean (South Korea)", flag: "🇰🇷" },
  { code: "zh-CN", name: "Chinese (China)", flag: "🇨🇳" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
];

interface CulturesPanelProps {
  cultures: Culture[];
  onCulturesChange: (cultures: Culture[]) => void;
}

export default function CulturesPanel({ cultures, onCulturesChange }: CulturesPanelProps) {
  const [newCultureCode, setNewCultureCode] = useState("");
  const { toast } = useToast();

  const addCulture = () => {
    if (!newCultureCode.trim()) return;
    
    const code = newCultureCode.trim().toLowerCase();
    
    // Check if culture already exists
    if (cultures.some(c => c.code.toLowerCase() === code)) {
      toast({
        title: "Culture already exists",
        description: `${code} is already in your supported cultures list.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Basic validation for culture code format
    if (!/^[a-z]{2}(-[a-z]{2})?$/i.test(code)) {
      toast({
        title: "Invalid culture code",
        description: "Please use format like 'en-US' or 'fr-CA'.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Try to find a nice name for common cultures
    const cultureNames: { [key: string]: string } = {
      'en-us': 'English (US)',
      'en-gb': 'English (UK)',
      'fr-fr': 'French (France)',
      'fr-ca': 'French (Canada)',
      'es-es': 'Spanish (Spain)',
      'es-mx': 'Spanish (Mexico)',
      'de-de': 'German (Germany)',
      'it-it': 'Italian (Italy)',
      'pt-pt': 'Portuguese (Portugal)',
      'pt-br': 'Portuguese (Brazil)',
      'ru-ru': 'Russian (Russia)',
      'zh-cn': 'Chinese (China)',
      'zh-tw': 'Chinese (Taiwan)',
      'ja-jp': 'Japanese (Japan)',
      'ko-kr': 'Korean (South Korea)',
      'ar-sa': 'Arabic (Saudi Arabia)',
      'hi-in': 'Hindi (India)',
      'th-th': 'Thai (Thailand)',
      'vi-vn': 'Vietnamese (Vietnam)',
    };

    const newCulture: Culture = {
      code: code,
      name: cultureNames[code] || code.toUpperCase(),
      flag: "🌐", // Generic flag for unknown cultures
    };

    onCulturesChange([...cultures, newCulture]);
    setNewCultureCode("");
    
    toast({
      title: "Culture added",
      description: `${newCulture.name} has been added to supported cultures.`,
      duration: 3000,
    });
  };

  const removeCulture = (codeToRemove: string) => {
    const updatedCultures = cultures.filter(c => c.code !== codeToRemove);
    onCulturesChange(updatedCultures);
    
    toast({
      title: "Culture removed",
      description: `${codeToRemove} has been removed from supported cultures.`,
      duration: 3000,
    });
  };

  const resetToDefaults = () => {
    onCulturesChange(DEFAULT_CULTURES);
    toast({
      title: "Reset to defaults",
      description: "Cultures list has been reset to default values.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Supported Cultures</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Reset
        </Button>
      </div>
      
      {/* Add New Culture */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Input
            data-testid="input-culture-code"
            type="text" 
            placeholder="e.g., ru-RU"
            className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
            value={newCultureCode}
            onChange={(e) => setNewCultureCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCulture()}
          />
          <Button
            data-testid="button-add-culture"
            size="sm"
            className="px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
            onClick={addCulture}
            disabled={!newCultureCode.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Culture List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {cultures.map((culture) => (
          <div
            key={culture.code}
            className="culture-tag flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:shadow-md cursor-pointer"
            data-testid={`culture-${culture.code}`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-lg">{culture.flag}</div>
              <div>
                <div className="text-sm font-medium text-foreground">{culture.code}</div>
                <div className="text-xs text-muted-foreground">{culture.name}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              data-testid={`button-remove-${culture.code}`}
              className="text-muted-foreground hover:text-destructive transition-colors duration-200 p-1"
              onClick={(e) => {
                e.stopPropagation();
                removeCulture(culture.code);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        {cultures.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No cultures added yet</p>
            <p className="text-sm mt-2">Add your first culture above</p>
          </div>
        )}
      </div>
      
      {/* Culture Count */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Cultures</span>
          <span className="font-semibold text-foreground" data-testid="culture-count">
            {cultures.length}
          </span>
        </div>
      </div>
    </div>
  );
}
