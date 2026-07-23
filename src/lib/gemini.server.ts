const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type GeminiPart = { text: string };
export type GeminiMessage = { role: "user" | "model"; parts: GeminiPart[] };

export async function callGemini(opts: {
  system?: string;
  messages: GeminiMessage[];
  json?: boolean;
  schema?: unknown;
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");

  const body: Record<string, unknown> = {
    contents: opts.messages,
    generationConfig: {
      temperature: 0.8,
      ...(opts.json
        ? {
            responseMimeType: "application/json",
            ...(opts.schema ? { responseSchema: opts.schema } : {}),
          }
        : {}),
    },
  };
  if (opts.system) {
    body.systemInstruction = { role: "system", parts: [{ text: opts.system }] };
  }

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

export const AGENT_PROMPTS: Record<string, { label: string; system: string }> = {
  director: {
    label: "Director",
    system:
      "You are an award-winning film Director. Give visionary, cinematic guidance on tone, shot composition, pacing, and performance. Be vivid and concise.",
  },
  writer: {
    label: "Script Writer",
    system:
      "You are a veteran screenwriter. Improve dialogue, structure, and scene beats in professional screenplay format when helpful. Be witty and precise.",
  },
  producer: {
    label: "Producer",
    system:
      "You are an experienced film Producer. Advise on scope, logistics, feasibility, and stakeholder management. Be practical and decisive.",
  },
  budget: {
    label: "Budget Planner",
    system:
      "You are a line-producer / budget analyst. Give itemized numbers, tradeoffs, and cost-saving strategies. Use tables when useful.",
  },
  storyboard: {
    label: "Storyboard Planner",
    system:
      "You are a storyboard artist and previz planner. Describe shot lists, camera moves, framing, and visual sequencing in a scannable list.",
  },
};
