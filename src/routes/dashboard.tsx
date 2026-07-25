import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Plus, Sparkles, Film, Clapperboard, ArrowRight, Clock,
} from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { listProjects } from "@/lib/ai.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Studio Control · CineFlow AI" },
      { name: "description", content: "Every AI-generated production in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <div className="animated-border rounded-2xl">
          <div className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80">Studio Control</p>
              <h1 className="truncate cinema-heading text-2xl sm:text-3xl">
                Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
              </h1>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow rounded-full cinema-heading tracking-widest"
            >
              <Link to="/create"><Plus className="h-4 w-4 mr-1" /> New Production</Link>
            </Button>
          </div>
        </div>

        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-3 flex items-center gap-2">
            <LayoutDashboard className="h-3.5 w-3.5" /> Your Productions
          </p>

          {projects.isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-shimmer h-40 rounded-2xl" />
              ))}
            </div>
          )}

          {projects.isError && (
            <p className="text-sm text-cinema-red">Failed to load projects.</p>
          )}

          {projects.data && projects.data.length === 0 && (
            <div className="glass rounded-2xl border border-white/10 p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/40 to-brand/5 border border-white/10">
                <Clapperboard className="h-6 w-6 text-brand-glow" />
              </div>
              <p className="cinema-heading text-xl mt-4">Your first film awaits</p>
              <p className="text-sm text-white/60 mt-1">Brief the crew and Gemini will develop the full production.</p>
              <Button
                asChild
                className="mt-5 bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow rounded-full cinema-heading tracking-widest"
              >
                <Link to="/create">Start now</Link>
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {(projects.data ?? []).map((p: any) => {
              const meta = (p.metadata ?? {}) as any;
              return (
                <Link
                  key={p.id}
                  to="/project/$projectId"
                  params={{ projectId: p.id }}
                  className="group glass glow-hover rounded-2xl border border-white/10 p-5"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-brand/15 text-brand-glow border border-brand/25 tracking-widest uppercase text-[10px]">
                      {p.status}
                    </Badge>
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="cinema-heading text-xl mt-3 truncate">{p.title ?? "Untitled"}</p>
                  {p.genre && (
                    <p className="text-[11px] uppercase tracking-widest text-gold mt-0.5">{p.genre}</p>
                  )}
                  <p className="text-xs text-white/60 mt-2 line-clamp-3">
                    {meta.logline ?? p.idea}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-gold" /> Gemini 2.5</span>
                    <span className="flex items-center gap-1 group-hover:text-brand-glow transition-colors">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="glass rounded-2xl border border-white/10 p-5 animate-fade-up">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-3 flex items-center gap-2">
            <Film className="h-3.5 w-3.5" /> Meet Your Departments
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 stagger">
            {[
              { n: "Director", d: "Vision, tone, performance" },
              { n: "Script Writer", d: "Dialogue, structure" },
              { n: "Producer", d: "Scope & logistics" },
              { n: "Budget Planner", d: "Line items & tradeoffs" },
              { n: "Storyboard", d: "Shot lists & framing" },
            ].map((a) => (
              <div key={a.n} className="rounded-xl border border-white/10 bg-black/40 p-3 glow-hover">
                <p className="text-sm font-semibold text-white">{a.n}</p>
                <p className="text-xs text-white/60 mt-1">{a.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
