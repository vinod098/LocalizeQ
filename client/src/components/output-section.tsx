import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle, XCircle } from "lucide-react";
import { downloadYaml, copyToClipboard } from "@/lib/download";
import { useToast } from "@/hooks/use-toast";
import * as yaml from "js-yaml";
import type { Translation } from "@shared/schema";

interface OutputSectionProps {
  translation: Translation | null;
  isLoading: boolean;
  error: string | null;
}

export default function OutputSection({ translation, isLoading, error }: OutputSectionProps) {
  const [yamlContent, setYamlContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (translation) {
      try {
        const yamlString = yaml.dump(translation, { 
          indent: 2,
          lineWidth: -1,
          quotingType: '"'
        });
        setYamlContent(yamlString);
      } catch (err) {
        console.error("Failed to convert to YAML:", err);
        setYamlContent("# Error converting to YAML");
      }
    }
  }, [translation]);

  const handleCopy = async () => {
    if (!yamlContent) return;
    
    try {
      await copyToClipboard(yamlContent);
      toast({
        title: "Copied to clipboard!",
        description: "YAML content has been copied to your clipboard.",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDownload = () => {
    if (!yamlContent) return;
    
    try {
      downloadYaml(yamlContent, 'translations.yaml');
      toast({
        title: "Download started",
        description: "YAML file download has been initiated.",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Failed to download YAML file.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="loading-spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="text-muted-foreground">Generating translations with AI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg shadow-sm p-4">
        <div className="flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-destructive">Translation Failed</h3>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Generated YAML Output</h2>
        <div className="flex items-center space-x-2">
          <Button
            data-testid="button-copy"
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:border-primary/50 transition-all duration-200"
            onClick={handleCopy}
            disabled={!yamlContent}
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </Button>
          <Button
            data-testid="button-download"
            size="sm"
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-all duration-200"
            onClick={handleDownload}
            disabled={!yamlContent}
          >
            <Download className="w-4 h-4" />
            <span>Download YAML</span>
          </Button>
        </div>
      </div>
      
      <div className="code-editor border border-border rounded-md overflow-hidden">
        <div className="bg-secondary/10 border-b border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-accent"></div>
          </div>
          <span className="text-xs text-muted-foreground">translations.yaml</span>
        </div>
        <div className="p-4 min-h-[300px] text-sm leading-relaxed">
          {yamlContent ? (
            <pre className="text-slate-100 whitespace-pre-wrap font-mono" data-testid="yaml-content">
              {yamlContent}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your translations will appear here</p>
                <p className="text-sm mt-2">Enter text above and click "Generate Translations" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
