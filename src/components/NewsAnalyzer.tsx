import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, RotateCcw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResultCard from "./ResultCard";

export interface AnalysisResult {
  verdict: "REAL" | "FAKE";
  confidence: number;
  summary: string;
  indicators: { label: string; type: "positive" | "negative" | "neutral" }[];
}

const SAMPLE_TEXTS = [
  "Breaking: Scientists at MIT have developed a new solar panel technology that converts sunlight to energy with 47% efficiency, nearly doubling current commercial panels. The peer-reviewed study was published in Nature Energy.",
  "SHOCKING!! Government SECRETLY implants microchips in ALL vaccines!! Exposed by whistleblower!! Share before they DELETE this!! 100% PROOF inside!!!",
];

const NewsAnalyzer = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyze = async () => {
    if (text.trim().length < 20) {
      toast({ title: "Too short", description: "Please enter at least 20 characters.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
    } catch (e: any) {
      toast({ title: "Analysis failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setText("");
    setResult(null);
  };

  return (
    <section className="container max-w-3xl mx-auto px-4 pb-24">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6 space-y-4">
              <Textarea
                placeholder="Paste a news article or headline here to analyze..."
                className="min-h-[180px] bg-transparent border-none resize-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isAnalyzing}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {text.length} characters
                </span>
                <Button
                  onClick={analyze}
                  disabled={isAnalyzing || text.trim().length < 20}
                  className="bg-gradient-primary text-primary-foreground font-semibold px-6 gap-2 hover:opacity-90 transition-opacity"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Scanning animation */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-8 flex flex-col items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-full border-2 border-primary/30">
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <Brain className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Analyzing text for credibility indicators...</p>
              </motion.div>
            )}

            {/* Sample texts */}
            {!isAnalyzing && text.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Try a sample</p>
                {SAMPLE_TEXTS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => setText(sample)}
                    className="w-full text-left p-4 rounded-lg border border-border/50 bg-card/40 hover:bg-card/80 transition-colors text-sm text-muted-foreground line-clamp-2"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <ResultCard result={result} text={text} />
            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Analyze Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NewsAnalyzer;
