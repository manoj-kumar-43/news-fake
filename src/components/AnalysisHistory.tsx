import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ShieldCheck, ShieldAlert, Clock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  input_text: string;
  verdict: "REAL" | "FAKE";
  confidence: number;
  summary: string;
  created_at: string;
}

const SESSION_KEY = "verifyai_session_id";

const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export { getSessionId };

const AnalysisHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("analysis_history")
      .select("id, input_text, verdict, confidence, summary, created_at")
      .eq("session_id", getSessionId())
      .order("created_at", { ascending: false })
      .limit(10);

    setHistory((data as HistoryItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    await supabase
      .from("analysis_history")
      .delete()
      .eq("session_id", getSessionId());
    setHistory([]);
  };

  if (loading) return null;
  if (history.length === 0) return null;

  return (
    <section className="container max-w-3xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Recent Analyses</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={clearHistory} className="gap-1.5 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {history.map((item, i) => {
            const isReal = item.verdict === "REAL";
            const pct = Math.round(item.confidence * 100);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-4 flex items-start gap-4"
              >
                <div className={`mt-0.5 p-2 rounded-lg ${isReal ? "bg-success/10" : "bg-destructive/10"}`}>
                  {isReal ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isReal ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                      {item.verdict}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{pct}%</span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-1 mb-1">{item.input_text}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AnalysisHistory;
