import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  analysisId?: string;
}

const AnalysisRating = ({ analysisId }: Props) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<-1 | 1 | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user || !analysisId) return null;

  const rate = async (value: -1 | 1) => {
    if (saving) return;
    setSaving(true);

    if (rating === value) {
      // Remove rating
      await supabase.from("analysis_ratings").delete().eq("analysis_id", analysisId).eq("user_id", user.id);
      setRating(null);
    } else {
      // Upsert rating
      await supabase.from("analysis_ratings").upsert(
        { analysis_id: analysisId, user_id: user.id, rating: value },
        { onConflict: "analysis_id,user_id" }
      );
      setRating(value);
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Was this helpful?</span>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${rating === 1 ? "text-success bg-success/10" : "text-muted-foreground"}`}
        onClick={() => rate(1)}
        disabled={saving}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${rating === -1 ? "text-destructive bg-destructive/10" : "text-muted-foreground"}`}
        onClick={() => rate(-1)}
        disabled={saving}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

export default AnalysisRating;
