import HeroSection from "@/components/HeroSection";
import NewsAnalyzer from "@/components/NewsAnalyzer";
import { Newspaper } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 font-heading font-bold text-lg">
            <Newspaper className="w-5 h-5 text-primary" />
            <span>VerifyAI</span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            AI-Powered News Verification
          </span>
        </div>
      </nav>

      <HeroSection />
      <NewsAnalyzer />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-xs text-muted-foreground px-4">
          <p>VerifyAI uses artificial intelligence for analysis. Results are indicative and should not replace professional fact-checking.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
