import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, PenLine, Wallet, Users, CalendarClock, Megaphone, Film } from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { generateProject } from "@/lib/ai.functions";

export const Route = createFileRoute("/processing")({
  head: () => ({ meta: [{ title: "Rolling — CineFlow AI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    projectId: typeof s.projectId === "string" ? s.projectId : "",
  }),
  component: Processing,
});

const AGENTS = [
  { icon: PenLine, emoji: "🎬", name: "Writing Screenplay", dept: "Director's Room", accent: "brand" as const },
  { icon: Users, emoji: "🎭", name: "Casting Actors", dept: "Casting Studio", accent: "red" as const },
  { icon: Wallet, emoji: "💰", name: "Calculating Budget", dept: "Producer's Office", accent: "gold" as const },
  { icon: CalendarClock, emoji: "📅", name: "Planning Shoot", dept: "Production Control", accent: "brand" as const },
  { icon: Megaphone, emoji: "📢", name: "Creating Marketing Campaign", dept: "Marketing Studio", accent: "gold" as const },
];

const accentBg: Record<string, string> = {
  brand: "from-brand/40 to-brand/5",
  gold: "from-gold/40 to-gold/5",
  red: "from-cinema-red/40 to-cinema-red/5",
};
const accentText: Record<string, string> = {
  brand: "text-brand-glow",
  gold: "text-gold",
  red: "text-cinema-red",
};
const accentDot: Record<string, string> = {
  brand: "bg-brand",
  gold: "bg-gold",
  red: "bg-cinema-red",
};

function Processing() {
  const navigate = useNavigate();
  const { projectId } = useSearch({ from: "/processing" });
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!projectId) {
      toast.error("Missing project id.");
      navigate({ to: "/dashboard" });
      return;
    }
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        await generateProject({ data: { projectId } });
        setCurrent(AGENTS.length);
        setDone(true);
        setTimeout(() => navigate({ to: "/project/$projectId", params: { projectId } }), 900);
      } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "AI generation failed.");
      }
    })();
  }, [projectId, navigate]);

  // Animated staging (visual only, capped until real completion)
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return 92;
        return p + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [done]);

  useEffect(() => {
    if (done) return;
    if (progress >= 90 && current < AGENTS.length - 1) {
      setCurrent((c) => Math.min(c + 1, AGENTS.length - 1));
      setProgress(0);
    }
  }, [progress, current, done]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-brand/15 blur-3xl animate-spotlight" />
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cinema-red/40 bg-black/40 px-4 py-1.5 text-[11px] tracking-[0.3em] uppercase text-cinema-red">
            <span className="h-1.5 w-1.5 rounded-full bg-cinema-red animate-pulse" /> On Air · Live Production
          </div>
          <h1 className="mt-5 cinema-heading text-4xl sm:text-6xl">
            Rolling on <span className="gradient-text">Set</span>
          </h1>
          <p className="mt-3 text-white/60">
            Gemini 2.5 Flash is developing your screenplay, plan and budget. Hold tight.
          </p>
          <div className="mt-6 flex items-end justify-center gap-1 h-8">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-brand to-gold origin-bottom animate-soundwave"
                style={{ height: "100%", animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-brand via-gold to-cinema-red opacity-60" />

          <div className="space-y-4">
            {AGENTS.map((a, i) => {
              const isDone = done || i < current;
              const active = !done && i === current;
              return (
                <div
                  key={a.name}
                  className={`relative transition-all duration-500 ${!isDone && !active ? "opacity-45" : "opacity-100"}`}
                >
                  <div
                    className={`absolute -left-10 top-4 grid h-7 w-7 place-items-center rounded-full border-2 ${
                      isDone
                        ? `${accentDot[a.accent]} border-transparent text-black`
                        : active
                          ? `bg-black border-brand-glow ${accentText[a.accent]}`
                          : "bg-black border-white/20 text-white/40"
                    }`}
                    style={active ? { animation: "pulse-ring 1.4s ease-out infinite" } : undefined}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Film className={active ? "h-3.5 w-3.5 animate-reel-spin" : "h-3.5 w-3.5"} />
                    )}
                  </div>

                  <div
                    className={`glass rounded-2xl p-4 sm:p-5 border ${
                      active ? "border-brand/40" : isDone ? "border-white/10" : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-3">
                        <div
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${accentBg[a.accent]} border border-white/10 text-lg`}
                        >
                          {a.emoji}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-white/50">{a.dept}</p>
                          <p className="cinema-heading text-lg text-white truncate">
                            {a.name}
                            {active && <span className="animate-caret ml-1 text-brand-glow">|</span>}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] tracking-[0.25em] uppercase ${
                          isDone ? "text-gold" : active ? accentText[a.accent] : "text-white/40"
                        }`}
                      >
                        {isDone ? "✓ Complete" : active ? `${progress}%` : "Queued"}
                      </span>
                    </div>

                    {active && (
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand via-brand-glow to-gold transition-all"
                          style={{ width: `${progress}%`, boxShadow: "0 0 20px var(--brand-glow)" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {done && (
          <div className="mt-10 text-center animate-fade-in">
            <p className="cinema-heading text-xl gold-text">That's a wrap.</p>
            <p className="mt-1 text-white/60 text-sm">Opening your production…</p>
            <Button
              onClick={() => navigate({ to: "/project/$projectId", params: { projectId } })}
              className="mt-5 bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow rounded-full cinema-heading tracking-widest"
            >
              Enter Studio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
