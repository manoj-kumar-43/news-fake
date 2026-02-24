import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Shield, Users, BarChart3, MessageSquare, Trash2, ArrowLeft,
  ShieldCheck, ShieldAlert, Clock, Loader2, Newspaper
} from "lucide-react";
import { Link } from "react-router-dom";

interface AnalysisRow {
  id: string;
  input_text: string;
  verdict: string;
  confidence: number;
  created_at: string;
  user_id: string | null;
}

interface ProfileRow {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

interface FeedbackRow {
  id: string;
  user_id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { isAdmin, loading: roleLoading } = useRole();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!roleLoading && !isAdmin) return;
  }, [authLoading, roleLoading, user, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [a, p, f] = await Promise.all([
        supabase.from("analysis_history").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
      ]);
      setAnalyses((a.data as AnalysisRow[]) || []);
      setProfiles((p.data as ProfileRow[]) || []);
      setFeedback((f.data as FeedbackRow[]) || []);
      setLoadingData(false);
    };
    load();
  }, [isAdmin]);

  const deleteAnalysis = async (id: string) => {
    await supabase.from("analysis_history").delete().eq("id", id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    await supabase.from("feedback").update({ status }).eq("id", id);
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  };

  const deleteFeedback = async (id: string) => {
    await supabase.from("feedback").delete().eq("id", id);
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-heading font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm">You don't have admin privileges.</p>
        <Button asChild variant="outline"><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  const statusColor = (s: string) => {
    switch (s) {
      case "open": return "bg-warning/15 text-warning";
      case "in_progress": return "bg-primary/15 text-primary";
      case "resolved": return "bg-success/15 text-success";
      case "closed": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div className="flex items-center gap-2 font-heading font-bold text-lg">
              <Shield className="w-5 h-5 text-primary" />
              <span>Admin Panel</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Analyses", value: analyses.length, icon: BarChart3 },
            { label: "Users", value: profiles.length, icon: Users },
            { label: "Feedback", value: feedback.length, icon: MessageSquare },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{loadingData ? "…" : s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="analyses" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="analyses" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Analyses</TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5"><Users className="w-3.5 h-3.5" />Users</TabsTrigger>
            <TabsTrigger value="feedback" className="gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Feedback</TabsTrigger>
          </TabsList>

          {/* Analyses Tab */}
          <TabsContent value="analyses">
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Text</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyses.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="max-w-xs truncate text-sm">{a.input_text}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={a.verdict === "REAL" ? "border-success text-success" : "border-destructive text-destructive"}>
                          {a.verdict === "REAL" ? <ShieldCheck className="w-3 h-3 mr-1" /> : <ShieldAlert className="w-3 h-3 mr-1" />}
                          {a.verdict}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{Math.round(a.confidence * 100)}%</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.created_at).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteAnalysis(a.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {analyses.length === 0 && !loadingData && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No analyses yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display Name</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.display_name || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{p.user_id.slice(0, 8)}…</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {profiles.length === 0 && !loadingData && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No users yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs capitalize">{f.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium max-w-[150px] truncate">{f.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{f.message}</TableCell>
                      <TableCell>
                        <Select value={f.status} onValueChange={(v) => updateFeedbackStatus(f.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["open", "in_progress", "resolved", "closed"].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("_", " ")}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteFeedback(f.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {feedback.length === 0 && !loadingData && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No feedback yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
