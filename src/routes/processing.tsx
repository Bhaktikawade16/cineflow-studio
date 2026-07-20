import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, PenLine, Wallet, Users, CalendarClock, Megaphone } from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/processing")({
  head: () => ({ meta: [{ title: "Generating — CineFlow AI" }] }),
  component: Processing,
});

const AGENTS = [
  { icon: PenLine, name: "Writer Agent", task: "Generating screenplay" },
  { icon: Wallet, name: "Budget Agent", task: "Estimating production budget" },
  { icon: Users, name: "Casting Agent", task: "Recommending actors" },
  { icon: CalendarClock, name: "Scheduler Agent", task: "Planning shooting schedule" },
  { icon: Megaphone, name: "Marketing Agent", task: "Creating promotional content" },
];

function Processing() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (current >= AGENTS.length) {
      const t = setTimeout(() => navigate({ to: "/dashboard" }), 800);
      return () => clearTimeout(t);
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrent((c) => c + 1), 250);
          return 100;
        }
        return p + 4;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [current, navigate]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold">Your <span className="gradient-text">AI crew</span> is on it</h1>
          <p className="mt-3 text-muted-foreground">Agents run sequentially. Please stay on this screen.</p>
        </div>
        <div className="glass rounded-3xl p-4 sm:p-6 space-y-3">
          {AGENTS.map((a, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div
                key={a.name}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                  active ? "border-brand/40 bg-brand/5" : done ? "border-white/10 bg-white/5" : "border-white/5 opacity-60"
                }`}
              >
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${
                    done ? "bg-brand text-brand-foreground border-transparent" : active ? "bg-brand/20 border-brand/30" : "bg-secondary border-white/10"
                  }`}
                  style={active ? { animation: "pulse-ring 1.4s ease-out infinite" } : undefined}
                >
                  {done ? <Check className="h-5 w-5" /> : active ? <Loader2 className="h-5 w-5 animate-spin" /> : <a.icon className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold truncate">{a.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {done ? "Complete" : active ? `${progress}%` : "Queued"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.task}</p>
                  {active && <Progress value={progress} className="mt-2 h-1.5" />}
                </div>
              </div>
            );
          })}
        </div>
        {current >= AGENTS.length && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-brand-glow font-medium">All agents complete. Opening your dashboard…</p>
            <Button asChild className="mt-4 bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow">
              <a href="/dashboard">Go to dashboard</a>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}