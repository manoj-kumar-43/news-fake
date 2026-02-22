import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import NewsAnalyzer from "@/components/NewsAnalyzer";
import AnalysisHistory from "@/components/AnalysisHistory";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Newspaper, Github, Shield, Users, BookOpen, BarChart3, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [historyKey, setHistoryKey] = useState(0);
  const refreshHistory = useCallback(() => setHistoryKey((k) => k + 1), []);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 font-heading font-bold text-lg">
            <Newspaper className="w-5 h-5 text-primary" />
            <span>VerifyAI</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-xs">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link to="/auth">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <HeroSection />
      <NewsAnalyzer onAnalysisComplete={refreshHistory} />
      <AnalysisHistory key={historyKey} />

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-3">
                <Newspaper className="w-5 h-5 text-primary" />
                <span>VerifyAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An AI-powered platform that helps students, journalists, researchers, and the general public detect misinformation and verify news credibility in seconds.
              </p>
            </div>

            {/* For */}
            <div>
              <h4 className="font-heading font-semibold mb-3">Built For</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-primary" /> Students & Educators</li>
                <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary" /> Journalists & Fact-Checkers</li>
                <li className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-primary" /> General Public</li>
                <li className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-primary" /> Researchers</li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} VerifyAI. Results are indicative and should not replace professional fact-checking.</p>
            <a href="#" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Github className="w-3.5 h-3.5" /> Open Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
