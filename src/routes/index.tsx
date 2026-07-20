import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, PenLine, Wallet, Users, CalendarClock, Megaphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/cineflow/topbar";

export const Route = createFileRoute("/")({
  component: Index,
});

const agents = [
  { icon: PenLine, name: "Writer", desc: "Crafts screenplay, characters, and story arcs." },
  { icon: Wallet, name: "Budget", desc: "Estimates production spend across departments." },
  { icon: Users, name: "Casting", desc: "Suggests actors tailored to your roles." },
  { icon: CalendarClock, name: "Scheduler", desc: "Plans shooting days and locations." },
  { icon: Megaphone, name: "Marketing", desc: "Generates trailers, posters, and campaigns." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-brand-glow" />
            Powered by a team of specialized AI agents
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight animate-fade-in">
            <span className="gradient-text">CineFlow AI</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-medium text-foreground/90 animate-fade-in">
            Lights. Camera. <span className="gradient-text">Intelligence.</span>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground animate-fade-in">
            Five specialized AI agents collaborate to plan your entire movie production — from
            screenplay to schedule to marketing — in minutes, not months.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in">
            <Button asChild size="lg" className="btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground hover:opacity-90">
              <Link to="/create">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5">
              <Link to="/dashboard">View demo dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Meet your AI film crew</h2>
            <p className="mt-2 text-muted-foreground">Each agent owns a discipline. Together, they run the studio.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {agents.map((a, i) => (
              <div
                key={a.name}
                className="glass rounded-2xl p-6 hover-scale transition-all"
                style={{ animation: `fade-in 0.5s ease-out ${i * 80}ms both` }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-glow/20 border border-white/10">
                  <a.icon className="h-5 w-5 text-brand-glow" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{a.name} Agent</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
