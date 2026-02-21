import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please provide at least 20 characters of news text to analyze." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a fake news detection AI classifier. Analyze the given news text and determine if it is REAL or FAKE news.

Consider these factors:
- Sensationalist or emotionally manipulative language
- Lack of credible sources or attribution
- Logical inconsistencies or factual errors
- Clickbait-style headlines or exaggerated claims
- Use of absolute statements without evidence
- Grammar and writing quality
- Whether claims can be verified

You MUST respond using the classify_news tool.`,
          },
          { role: "user", content: `Analyze this news text:\n\n${text.trim().substring(0, 3000)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_news",
              description: "Classify news text as real or fake with confidence and reasoning",
              parameters: {
                type: "object",
                properties: {
                  verdict: { type: "string", enum: ["REAL", "FAKE"] },
                  confidence: { type: "number", description: "Confidence score from 0.0 to 1.0" },
                  summary: { type: "string", description: "Brief 1-2 sentence summary of the analysis" },
                  indicators: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        type: { type: "string", enum: ["positive", "negative", "neutral"] },
                      },
                      required: ["label", "type"],
                    },
                    description: "3-5 key indicators found in the text",
                  },
                },
                required: ["verdict", "confidence", "summary", "indicators"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_news" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured output");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
