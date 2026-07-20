import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Clapperboard, DollarSign, Users, CalendarClock, Megaphone,
  Sparkles, Film, Camera, Armchair, PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/cineflow/topbar";

export const Route = createFileRoute("/")({
  component: Index,
});

const departments = [
  {
    icon: Clapperboard, emoji: "🎬", name: "Director's Room", agent: "Writer Agent",
    tint: "from-brand/40 to-brand/5", ring: "shadow-[0_0_40px_-10px_var(--brand)]",
    points: ["Crafts the screenplay", "Builds characters & arcs", "Generates dialogue"],
  },
  {
    icon: DollarSign, emoji: "💰", name: "Producer's Office", agent: "Budget Agent",
    tint: "from-gold/40 to-gold/5", ring: "shadow-[0_0_40px_-10px_var(--gold)]",
    points: ["Estimates production costs", "Crew, equipment, marketing", "Line-item breakdowns"],
  },
  {
    icon: Users, emoji: "🎭", name: "Casting Studio", agent: "Casting Agent",
    tint: "from-cinema-red/40 to-cinema-red/5", ring: "shadow-[0_0_40px_-10px_var(--cinema-red)]",
    points: ["Suggests actors per role", "Explains each pick", "Chemistry & availability"],
  },
  {
    icon: CalendarClock, emoji: "📅", name: "Production Control", agent: "Scheduler Agent",
    tint: "from-brand/40 to-brand/5", ring: "shadow-[0_0_40px_-10px_var(--brand)]",
    points: ["Builds shooting schedule", "Plans locations", "Sequencing & call sheets"],
  },
  {
    icon: Megaphone, emoji: "📢", name: "Marketing Studio", agent: "Marketing Agent",
    tint: "from-gold/40 to-cinema-red/10", ring: "shadow-[0_0_40px_-10px_var(--gold)]",
    points: ["Posters & trailer scripts", "Social captions", "Launch campaign"],
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <TopBar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* backdrop */}
        <div className="absolute inset-0 spotlight-bg" />
        {/* animated spotlights */}
        <div className="pointer-events-none absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl animate-spotlight" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-gold/20 blur-3xl animate-spotlight" style={{ animationDelay: "-3s" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-cinema-red/20 blur-3xl animate-spotlight" style={{ animationDelay: "-5s" }} />
        {/* projector beams */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[140%] w-[280px] -rotate-12 bg-gradient-to-b from-brand/20 via-transparent to-transparent blur-2xl" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-[140%] w-[220px] rotate-12 bg-gradient-to-b from-gold/15 via-transparent to-transparent blur-2xl" />

        {/* floating cinema icons */}
        <Floating className="left-6 top-24" delay="0s"><Film className="h-8 w-8 text-brand/60" /></Floating>
        <Floating className="right-10 top-32" delay="-2s"><Clapperboard className="h-9 w-9 text-gold/60" /></Floating>
        <Floating className="left-16 bottom-24" delay="-4s"><Camera className="h-7 w-7 text-cinema-red/60" /></Floating>
        <Floating className="right-20 bottom-20" delay="-1s"><Armchair className="h-8 w-8 text-brand-glow/60" /></Floating>
        <Floating className="left-1/2 top-14" delay="-3s"><PlayCircle className="h-6 w-6 text-gold/50" /></Floating>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-1.5 text-[11px] tracking-[0.25em] uppercase text-gold/90 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" /> Now Showing · Powered by AI
          </div>

          <h1 className="mt-8 cinema-heading text-6xl sm:text-8xl md:text-9xl font-normal leading-[0.9] animate-fade-in">
            <span className="gradient-text">CineFlow</span>{" "}
            <span className="text-white">AI</span>
          </h1>

          <p className="mt-6 text-2xl sm:text-4xl font-serif italic text-white/95 animate-fade-in">
            Lights. Camera. <span className="gold-text not-italic font-semibold">Intelligence.</span>
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed animate-fade-in">
            Your AI-powered movie production studio where multiple intelligent agents collaborate to
            transform an idea into a complete film production plan.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in">
            <Button asChild size="lg" className="btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground hover:opacity-90 rounded-full px-7 h-12 cinema-heading tracking-widest">
              <Link to="/create">Start Production <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 bg-black/40 text-gold hover:bg-gold/10 hover:text-gold rounded-full px-7 h-12 cinema-heading tracking-widest">
              <Link to="/dashboard">View Studio</Link>
            </Button>
          </div>

          {/* film strip */}
          <div className="mt-16 flex items-center justify-center gap-1.5 opacity-70">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="h-4 w-6 rounded-sm bg-white/10 border border-white/20" />
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="mb-14 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold/80">The Crew</p>
          <h2 className="mt-3 cinema-heading text-4xl sm:text-6xl">
            Meet your <span className="gradient-text">AI film crew</span>
          </h2>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">
            Five specialized departments. One seamless production pipeline.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d, i) => (
            <div
              key={d.name}
              className={`group relative rounded-3xl p-[1px] overflow-hidden transition-transform hover:-translate-y-1 ${d.ring}`}
              style={{ animation: `fade-in 0.5s ease-out ${i * 80}ms both` }}
            >
              <div className="animated-border rounded-3xl h-full">
                <div className="relative rounded-3xl glass p-6 h-full flex flex-col">
                  {/* glow */}
                  <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${d.tint} blur-3xl opacity-70 transition-opacity group-hover:opacity-100`} />
                  <div className="relative flex items-start justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${d.tint} border border-white/10`}>
                      <d.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gold/80">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                      </span>
                      AI Online
                    </div>
                  </div>
                  <div className="relative mt-5">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-white/50">{d.agent}</p>
                    <h3 className="mt-1 cinema-heading text-2xl text-white">
                      <span className="mr-2">{d.emoji}</span>{d.name}
                    </h3>
                  </div>
                  <ul className="relative mt-5 space-y-2">
                    {d.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-white/75">
                        <span className="h-1 w-1 rounded-full bg-brand-glow" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs tracking-widest uppercase text-white/40">
        A CineFlow AI Production · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Floating({ children, className = "", delay = "0s" }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <div
      className={`pointer-events-none absolute hidden md:block animate-float-slow ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}