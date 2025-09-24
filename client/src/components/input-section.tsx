import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface InputSectionProps {
  onGenerateTranslations: (value: string, comment: string) => void;
  isLoading: boolean;
}

export default function InputSection({ onGenerateTranslations, isLoading }: InputSectionProps) {
  const [value, setValue] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onGenerateTranslations(value.trim(), comment.trim());
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Input Text & Context</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">YAML Format</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="value" className="block text-sm font-medium text-foreground mb-2">
            Value
          </Label>
          <Textarea
            id="value"
            data-testid="input-value"
            className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-200"
            placeholder="Enter the text you want to translate..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
            Comment (Context)
          </Label>
          <Textarea
            id="comment"
            data-testid="input-comment"
            className="w-full h-16 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-200"
            placeholder="Provide context to help AI generate better translations..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <Button 
          data-testid="button-generate"
          className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
        >
          <Zap className="w-5 h-5" />
          <span>{isLoading ? "Generating..." : "Generate Translations"}</span>
        </Button>
      </div>
    </div>
  );
}
