import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_CULTURES, searchCultures, findCultureByCode, SUPPORTED_CULTURES } from "@/lib/cultures";
import type { Culture } from "@shared/schema";

interface CulturesPanelProps {
  cultures: Culture[];
  onCulturesChange: (cultures: Culture[]) => void;
}

// Helper function to get flag emoji from culture code
const getFlagEmoji = (cultureCode: string): string => {
  const flagMap: { [key: string]: string } = {
    'AE': '🇦🇪', 'AM': '🇦🇲', 'AU': '🇦🇺', 'BG': '🇧🇬', 'BR': '🇧🇷', 'CA': '🇨🇦', 'CN': '🇨🇳', 'CZ': '🇨🇿',
    'DE': '🇩🇪', 'DK': '🇩🇰', 'EE': '🇪🇪', 'ES': '🇪🇸', 'FI': '🇫🇮', 'FR': '🇫🇷', 'GB': '🇬🇧', 'GR': '🇬🇷',
    'HR': '🇭🇷', 'HU': '🇭🇺', 'ID': '🇮🇩', 'IL': '🇮🇱', 'IT': '🇮🇹', 'JP': '🇯🇵', 'KR': '🇰🇷', 'LT': '🇱🇹',
    'LV': '🇱🇻', 'MX': '🇲🇽', 'MY': '🇲🇾', 'NL': '🇳🇱', 'NO': '🇳🇴', 'PL': '🇵🇱', 'PT': '🇵🇹', 'RO': '🇷🇴',
    'RS': '🇷🇸', 'RU': '🇷🇺', 'SE': '🇸🇪', 'SI': '🇸🇮', 'SK': '🇸🇰', 'TH': '🇹🇭', 'TR': '🇹🇷', 'TW': '🇹🇼',
    'UA': '🇺🇦', 'VN': '🇻🇳', 'IN': '🇮🇳'
  };
  
  const parts = cultureCode.split('-');
  const countryCode = parts[parts.length - 1]?.toUpperCase() || cultureCode.substring(0, 2).toUpperCase();
  return flagMap[countryCode] || '🌐';
};

// Helper function to get country code for fallback
const getCountryCode = (cultureCode: string): string => {
  const parts = cultureCode.split('-');
  return parts[parts.length - 1]?.toUpperCase() || cultureCode.substring(0, 2).toUpperCase();
};

// Flag component with CSS-based flag representation
const FlagComponent = ({ cultureCode, cultureName }: { cultureCode: string; cultureName: string }) => {
  const countryCode = getCountryCode(cultureCode);
  
  // CSS-based flag colors and patterns
  const getFlagStyle = (countryCode: string) => {
    const flagStyles: { [key: string]: { background: string; color: string } } = {
      'DE': { background: 'linear-gradient(to bottom, #000000 33%, #dd0000 33%, #dd0000 66%, #ffce00 66%)', color: '#000' }, // Germany
      'GB': { background: 'linear-gradient(45deg, #012169 25%, #ffffff 25%, #ffffff 50%, #c8102e 50%, #c8102e 75%, #ffffff 75%)', color: '#012169' }, // UK
      'ES': { background: 'linear-gradient(to bottom, #c60b1e 25%, #ffc400 25%, #ffc400 75%, #c60b1e 75%)', color: '#c60b1e' }, // Spain
      'CA': { background: 'linear-gradient(to right, #ff0000 25%, #ffffff 25%, #ffffff 75%, #ff0000 75%)', color: '#ff0000' }, // Canada
      'JP': { background: 'radial-gradient(circle, #bc002d 30%, #ffffff 30%)', color: '#bc002d' }, // Japan
      'KR': { background: 'linear-gradient(to bottom, #ffffff 33%, #000000 33%, #000000 66%, #cd2e3a 66%)', color: '#000' }, // Korea
      'CN': { background: 'linear-gradient(to bottom, #de2910 50%, #ffde00 50%)', color: '#de2910' }, // China
      'FR': { background: 'linear-gradient(to right, #002395 33%, #ffffff 33%, #ffffff 66%, #ed2939 66%)', color: '#002395' }, // France
      'IN': { background: 'linear-gradient(to bottom, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%)', color: '#ff9933' }, // India
      'US': { background: 'linear-gradient(to bottom, #b22234 50%, #ffffff 50%)', color: '#b22234' }, // USA
      'AU': { background: 'linear-gradient(to bottom, #00008b 50%, #ffffff 50%)', color: '#00008b' }, // Australia
      'BR': { background: 'linear-gradient(to bottom, #009739 50%, #fedf00 50%)', color: '#009739' }, // Brazil
      'RU': { background: 'linear-gradient(to bottom, #ffffff 33%, #0039a6 33%, #0039a6 66%, #d52b1e 66%)', color: '#ffffff' }, // Russia
      'IT': { background: 'linear-gradient(to right, #009246 33%, #ffffff 33%, #ffffff 66%, #ce2b37 66%)', color: '#009246' }, // Italy
      'NL': { background: 'linear-gradient(to bottom, #ae1c28 33%, #ffffff 33%, #ffffff 66%, #21468b 66%)', color: '#ae1c28' }, // Netherlands
      'SE': { background: 'linear-gradient(to right, #006aa7 40%, #fecc00 40%, #fecc00 60%, #006aa7 60%)', color: '#006aa7' }, // Sweden
      'NO': { background: 'linear-gradient(to right, #ef2b2d 40%, #ffffff 40%, #ffffff 60%, #002868 60%)', color: '#ef2b2d' }, // Norway
      'DK': { background: 'linear-gradient(to right, #c60c30 40%, #ffffff 40%, #ffffff 60%, #c60c30 60%)', color: '#c60c30' }, // Denmark
      'FI': { background: 'linear-gradient(to right, #ffffff 40%, #003580 40%, #003580 60%, #ffffff 60%)', color: '#003580' }, // Finland
      'PL': { background: 'linear-gradient(to bottom, #ffffff 50%, #dc143c 50%)', color: '#dc143c' }, // Poland
      'CZ': { background: 'linear-gradient(to bottom, #ffffff 50%, #d7141a 50%)', color: '#d7141a' }, // Czech Republic
      'HU': { background: 'linear-gradient(to bottom, #ce2939 33%, #ffffff 33%, #ffffff 66%, #477050 66%)', color: '#ce2939' }, // Hungary
      'RO': { background: 'linear-gradient(to right, #002b7f 33%, #fcd116 33%, #fcd116 66%, #ce1126 66%)', color: '#002b7f' }, // Romania
      'BG': { background: 'linear-gradient(to bottom, #ffffff 33%, #00966e 33%, #00966e 66%, #d62612 66%)', color: '#ffffff' }, // Bulgaria
      'GR': { background: 'linear-gradient(to bottom, #0d5eaf 50%, #ffffff 50%)', color: '#0d5eaf' }, // Greece
      'TR': { background: 'linear-gradient(to right, #e30a17 50%, #ffffff 50%)', color: '#e30a17' }, // Turkey
      'IL': { background: 'linear-gradient(to bottom, #ffffff 50%, #0038b8 50%)', color: '#0038b8' }, // Israel
      'AE': { background: 'linear-gradient(to bottom, #00732f 33%, #ffffff 33%, #ffffff 66%, #000000 66%)', color: '#00732f' }, // UAE
      'SA': { background: 'linear-gradient(to right, #ffffff 50%, #006c35 50%)', color: '#006c35' }, // Saudi Arabia
      'EG': { background: 'linear-gradient(to bottom, #ce1126 33%, #ffffff 33%, #ffffff 66%, #000000 66%)', color: '#ce1126' }, // Egypt
      'ZA': { background: 'linear-gradient(to bottom, #007a4d 33%, #ffffff 33%, #ffffff 66%, #ffb81c 66%)', color: '#007a4d' }, // South Africa
      'MX': { background: 'linear-gradient(to right, #006847 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%)', color: '#006847' }, // Mexico
      'AR': { background: 'linear-gradient(to bottom, #74acdf 50%, #ffffff 50%)', color: '#74acdf' }, // Argentina
      'CL': { background: 'linear-gradient(to bottom, #0033a0 50%, #ffffff 50%)', color: '#0033a0' }, // Chile
      'PE': { background: 'linear-gradient(to right, #d91023 50%, #ffffff 50%)', color: '#d91023' }, // Peru
      'CO': { background: 'linear-gradient(to bottom, #fcd116 33%, #003893 33%, #003893 66%, #ce1126 66%)', color: '#fcd116' }, // Colombia
      'VE': { background: 'linear-gradient(to bottom, #fcd116 33%, #003893 33%, #003893 66%, #ce1126 66%)', color: '#fcd116' }, // Venezuela
      'TH': { background: 'linear-gradient(to bottom, #ed1c24 33%, #ffffff 33%, #ffffff 66%, #241d4f 66%)', color: '#ed1c24' }, // Thailand
      'VN': { background: 'linear-gradient(to right, #da020e 50%, #ffcd00 50%)', color: '#da020e' }, // Vietnam
      'MY': { background: 'linear-gradient(to bottom, #cc0000 50%, #ffffff 50%)', color: '#cc0000' }, // Malaysia
      'SG': { background: 'linear-gradient(to bottom, #ed2939 50%, #ffffff 50%)', color: '#ed2939' }, // Singapore
      'ID': { background: 'linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)', color: '#ff0000' }, // Indonesia
      'PH': { background: 'linear-gradient(to bottom, #0038a8 50%, #ffffff 50%)', color: '#0038a8' }, // Philippines
      'TW': { background: 'linear-gradient(to bottom, #fe0000 50%, #ffffff 50%)', color: '#fe0000' }, // Taiwan
      'HK': { background: 'linear-gradient(to bottom, #de2910 50%, #ffffff 50%)', color: '#de2910' }, // Hong Kong
      'NZ': { background: 'linear-gradient(to bottom, #000080 50%, #ffffff 50%)', color: '#000080' }, // New Zealand
    };
    
    return flagStyles[countryCode] || { background: 'linear-gradient(45deg, #666666, #999999)', color: '#ffffff' };
  };
  
  const flagStyle = getFlagStyle(countryCode);
  
  return (
    <div className="w-8 h-6 flex items-center justify-center rounded border shadow-sm" title={`${countryCode} - ${cultureName}`}>
      <div 
        className="w-full h-full rounded"
        style={{
          background: flagStyle.background,
          color: flagStyle.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6em',
          fontWeight: 'bold',
          textShadow: '0 0 2px rgba(0,0,0,0.3)'
        }}
      >
        {countryCode}
      </div>
    </div>
  );
};


export default function CulturesPanel({ cultures, onCulturesChange }: CulturesPanelProps) {
  const [newCultureCode, setNewCultureCode] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Culture[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setNewCultureCode(value);
    
    if (value.trim().length > 0) {
      const searchResults = searchCultures(value, cultures.map(c => c.code));
      setSuggestions(searchResults);
      setShowSuggestions(searchResults.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add culture from suggestion or manual input
  const addCulture = (culture?: Culture) => {
    const cultureToAdd = culture || findCultureByCode(newCultureCode.trim());
    
    if (!cultureToAdd) {
      // Manual input validation
      const code = newCultureCode.trim();
      
      if (!code) return;
      
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

      // Create a basic culture for unknown codes
      const newCulture: Culture = {
        code: code, // Preserve original case
        name: code.toUpperCase(),
        flag: "🌐",
      };
      
      addCultureToList(newCulture);
    } else {
      addCultureToList(cultureToAdd);
    }
  };

  const addCultureToList = (culture: Culture) => {
    // Check if culture already exists
    if (cultures.some(c => c.code.toLowerCase() === culture.code.toLowerCase())) {
      toast({
        title: "Culture already exists",
        description: `${culture.code} is already in your supported cultures list.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    onCulturesChange([...cultures, culture]);
    setNewCultureCode("");
    setShowSuggestions(false);
    setSuggestions([]);
    
    toast({
      title: "Culture added",
      description: `${culture.name} has been added to supported cultures.`,
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


  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="mb-6 relative">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              data-testid="input-culture-code"
              type="text" 
              placeholder="Search cultures (e.g., ru-RU, Spanish, German)"
              className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              value={newCultureCode}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCulture()}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {suggestions.map((culture) => (
                  <div
                    key={culture.code}
                    className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => addCulture(culture)}
                  >
                    <FlagComponent cultureCode={culture.code} cultureName={culture.name} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{culture.code}</div>
                      <div className="text-xs text-muted-foreground">{culture.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            data-testid="button-add-culture"
            size="sm"
            className="px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
            onClick={() => addCulture()}
            disabled={!newCultureCode.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Culture List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {cultures.sort((a, b) => a.code.localeCompare(b.code)).map((culture) => (
          <div
            key={culture.code}
            className="culture-tag flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:shadow-md cursor-pointer"
            data-testid={`culture-${culture.code}`}
          >
            <div className="flex items-center space-x-3">
              <FlagComponent cultureCode={culture.code} cultureName={culture.name} />
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
