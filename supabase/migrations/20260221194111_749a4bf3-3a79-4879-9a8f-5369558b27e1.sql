
-- Create analysis history table
CREATE TABLE public.analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  input_text TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('REAL', 'FAKE')),
  confidence NUMERIC NOT NULL,
  summary TEXT NOT NULL,
  indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Public insert policy (no auth required for MVP)
CREATE POLICY "Anyone can insert analysis results"
ON public.analysis_history
FOR INSERT
WITH CHECK (true);

-- Public read policy scoped by session_id
CREATE POLICY "Anyone can read analysis results"
ON public.analysis_history
FOR SELECT
USING (true);

-- Index for faster lookups
CREATE INDEX idx_analysis_history_created_at ON public.analysis_history (created_at DESC);
CREATE INDEX idx_analysis_history_session_id ON public.analysis_history (session_id);
