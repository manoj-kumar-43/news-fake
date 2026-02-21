import { motion } from "framer-motion";
import { Shield, Zap, Brain } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
      
      <div className="container relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">AI-Powered Verification</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6">
            Detect{" "}
            <span className="text-gradient-primary">Fake News</span>
            <br />
            In Seconds
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Paste any news article and our AI will analyze it for credibility, 
            giving you a confidence score and detailed breakdown of key indicators.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Source Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>AI-Powered</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
