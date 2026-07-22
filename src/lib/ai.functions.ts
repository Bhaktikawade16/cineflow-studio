import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ProjectIdInput = z.object({ projectId: z.string().uuid() });

export const generateProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ProjectIdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { callGemini } = await import("./gemini.server");
    const { supabase, userId } = context;

    const { data: project, error: pErr } = await supabase
      .from("movie_projects")
      .select("*")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .single();
    if (pErr || !project) throw new Error(pErr?.message ?? "Project not found");

    const prompt = `Develop a full film pre-production package for this concept.

IDEA: ${project.idea}
GENRE: ${project.genre ?? "unspecified"}
AUDIENCE: ${project.audience ?? "general"}
LANGUAGE: ${project.language ?? "English"}
DURATION: ${project.duration ?? "feature length"}
BUDGET TARGET: ${project.budget ?? "flexible"}
COUNTRY: ${project.country ?? "unspecified"}

Return STRICT JSON matching this schema:
{
  "title": string,
  "genre": string,
  "logline": string (one sentence),
  "synopsis": string (2-3 paragraphs),
  "characters": [{ "name": string, "role": string, "description": string }],
  "outline": [{ "act": string, "scenes": [{ "heading": string, "summary": string }] }],
  "screenplay": string (professional screenplay format, 3-5 scenes),
  "productionPlan": { "phases": [{ "name": string, "duration": string, "tasks": [string] }] },
  "budget": { "total": string, "items": [{ "category": string, "amount": string, "notes": string }] },
  "schedule": [{ "day": string, "location": string, "scenes": string }]
}
No prose outside JSON.`;

    const raw = await callGemini({
      system:
        "You are an elite film development studio. Produce complete, coherent, production-ready material as pure JSON.",
      messages: [{ role: "user", parts: [{ text: prompt }] }],
      json: true,
    });

    let plan: any;
    try {
      plan = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      plan = m ? JSON.parse(m[0]) : null;
    }
    if (!plan) throw new Error("Failed to parse AI response");

    await supabase
      .from("movie_projects")
      .update({
        title: plan.title ?? project.title,
        genre: plan.genre ?? project.genre,
        status: "ready",
        metadata: {
          logline: plan.logline,
          synopsis: plan.synopsis,
          characters: plan.characters ?? [],
          outline: plan.outline ?? [],
          schedule: plan.schedule ?? [],
          budgetBreakdown: plan.budget ?? null,
        },
      })
      .eq("id", project.id);

    if (plan.screenplay) {
      await supabase.from("scripts").insert({
        user_id: userId,
        project_id: project.id,
        title: plan.title ?? project.title ?? "Draft 01",
        content: plan.screenplay,
        version: 1,
      });
    }
    if (plan.productionPlan) {
      await supabase.from("production_plans").insert({
        user_id: userId,
        project_id: project.id,
        department: "master",
        plan: plan.productionPlan,
      });
    }
    if (plan.budget) {
      await supabase.from("production_plans").insert({
        user_id: userId,
        project_id: project.id,
        department: "budget",
        plan: plan.budget,
      });
    }
    await supabase.from("ai_conversations").insert({
      user_id: userId,
      project_id: project.id,
      agent: "system",
      role: "assistant",
      content: `Generated full pre-production package for "${plan.title ?? project.title}".`,
      metadata: { logline: plan.logline },
    });

    return { ok: true };
  });

const ChatInput = z.object({
  projectId: z.string().uuid(),
  agent: z.enum(["director", "writer", "producer", "budget", "storyboard"]),
  message: z.string().min(1).max(4000),
});

export const chatWithAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ChatInput.parse(i))
  .handler(async ({ data, context }) => {
    const { callGemini, AGENT_PROMPTS } = await import("./gemini.server");
    const { supabase, userId } = context;

    const { data: project } = await supabase
      .from("movie_projects")
      .select("id,title,idea,genre,metadata")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .single();
    if (!project) throw new Error("Project not found");

    const { data: history } = await supabase
      .from("ai_conversations")
      .select("role,content")
      .eq("project_id", data.projectId)
      .eq("user_id", userId)
      .eq("agent", data.agent)
      .order("created_at", { ascending: true })
      .limit(30);

    const agent = AGENT_PROMPTS[data.agent];
    const contextSummary = `Project: ${project.title ?? "Untitled"} | Idea: ${project.idea} | Genre: ${project.genre ?? "n/a"}`;

    const messages = [
      ...((history ?? []).map((h) => ({
        role: h.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: h.content }],
      }))),
      { role: "user" as const, parts: [{ text: data.message }] },
    ];

    const reply = await callGemini({
      system: `${agent.system}\n\nContext — ${contextSummary}`,
      messages,
    });

    await supabase.from("ai_conversations").insert([
      {
        user_id: userId,
        project_id: data.projectId,
        agent: data.agent,
        role: "user",
        content: data.message,
      },
      {
        user_id: userId,
        project_id: data.projectId,
        agent: data.agent,
        role: "assistant",
        content: reply,
      },
    ]);

    return { reply };
  });

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("movie_projects")
      .select("id,title,idea,genre,status,updated_at,created_at,metadata")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getProjectBundle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ProjectIdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: project }, { data: scripts }, { data: plans }, { data: files }, { data: convos }] =
      await Promise.all([
        supabase.from("movie_projects").select("*").eq("id", data.projectId).eq("user_id", userId).single(),
        supabase.from("scripts").select("*").eq("project_id", data.projectId).order("version", { ascending: false }),
        supabase.from("production_plans").select("*").eq("project_id", data.projectId),
        supabase.from("uploaded_files").select("*").eq("project_id", data.projectId).order("created_at", { ascending: false }),
        supabase.from("ai_conversations").select("*").eq("project_id", data.projectId).order("created_at", { ascending: true }),
      ]);
    return { project, scripts: scripts ?? [], plans: plans ?? [], files: files ?? [], conversations: convos ?? [] };
  });
