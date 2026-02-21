import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle, MinusCircle } from "lucide-react";
import type { AnalysisResult } from "./NewsAnalyzer";

interface ResultCardProps {
  result: AnalysisResult;
  text: string;
}

const ResultCard = ({ result, text }: ResultCardProps) => {
  const isReal = result.verdict === "REAL";
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="space-y-4">
      {/* Verdict Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`rounded-xl p-8 text-center ${isReal ? "bg-gradient-real" : "bg-gradient-fake"}`}
      >
        <div className="flex justify-center mb-4">
          {isReal ? (
            <ShieldCheck className="w-16 h-16 text-success-foreground" />
          ) : (
            <ShieldAlert className="w-16 h-16 text-destructive-foreground" />
          )}
        </div>
        <h2 className="text-3xl font-bold font-heading text-primary-foreground mb-2">
          {isReal ? "Likely Real" : "Likely Fake"}
        </h2>
        <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">{confidencePercent}% Confidence</span>
        </div>
      </motion.div>

      {/* Confidence Bar */}
      <div className="glass-card rounded-xl p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confidence Score</span>
          <span className="font-semibold">{confidencePercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${isReal ? "bg-gradient-real" : "bg-gradient-fake"}`}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-heading font-semibold mb-2">Analysis Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
      </div>

      {/* Indicators */}
      <div className="glass-card rounded-xl p-6 space-y-3">
        <h3 className="font-heading font-semibold mb-1">Key Indicators</h3>
        <div className="space-y-2">
          {result.indicators.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              {ind.type === "positive" ? (
                <CheckCircle className="w-4 h-4 text-success shrink-0" />
              ) : ind.type === "negative" ? (
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              ) : (
                <MinusCircle className="w-4 h-4 text-warning shrink-0" />
              )}
              <span className="text-muted-foreground">{ind.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Original text preview */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-heading font-semibold mb-2 text-sm">Analyzed Text</h3>
        <p className="text-xs text-muted-foreground line-clamp-3">{text}</p>
      </div>
    </div>
  );
};

export default ResultCard;
