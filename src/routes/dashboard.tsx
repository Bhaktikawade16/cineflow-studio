import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Plus, PenLine, Wallet, Users, CalendarClock, Megaphone,
  Menu, X, MapPin, Hash, Instagram, Film, Clapperboard, DollarSign, Clock, Sparkles, Users2,
} from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Studio Control · CineFlow AI" }] }),
  component: Dashboard,
});

const NAV = [
  { id: "overview", label: "Studio", icon: LayoutDashboard, to: "/dashboard" as const },
  { id: "create", label: "New Production", icon: Plus, to: "/create" as const },
];
const AGENT_NAV = [
  { id: "writer", label: "Director's Room", icon: PenLine, accent: "brand" },
  { id: "budget", label: "Producer's Office", icon: Wallet, accent: "gold" },
  { id: "casting", label: "Casting Studio", icon: Users, accent: "red" },
  { id: "scheduler", label: "Production Control", icon: CalendarClock, accent: "brand" },
  { id: "marketing", label: "Marketing Studio", icon: Megaphone, accent: "gold" },
];

const budgetData = [
  { name: "Cast", value: 1_800_000 },
  { name: "Crew", value: 900_000 },
  { name: "VFX", value: 1_200_000 },
  { name: "Locations", value: 500_000 },
  { name: "Post", value: 400_000 },
  { name: "Marketing", value: 200_000 },
];

const cast = [
  { name: "Zendaya", role: "Dr. Aria Vance", reason: "Range fits the emotional arc; strong genre draw.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { name: "Oscar Isaac", role: "Cmdr. Ryo Marin", reason: "Grounded intensity matches the antagonist beats.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { name: "Florence Pugh", role: "Engineer Kade", reason: "Chemistry with lead; delivers technical dialogue naturally.", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" },
];

const schedule = [
  { day: "Day 1-4", location: "Sound Stage A, LA", scenes: "Cold open, lab interior" },
  { day: "Day 5-9", location: "Mojave Desert", scenes: "Crash landing, exterior chase" },
  { day: "Day 10-14", location: "Iceland — Vík", scenes: "Ice cavern sequence" },
  { day: "Day 15-18", location: "Sound Stage B, LA", scenes: "Bridge & command center" },
  { day: "Day 19-22", location: "Downtown LA rooftops", scenes: "Third-act confrontation" },
];

const hashtags = ["#CineFlow", "#MartianMemory", "#SciFi2026", "#AIFilm", "#Zendaya", "#OscarIsaac"];

const stats = [
  { label: "Est. Budget", value: "$5.0M", icon: DollarSign, accent: "gold" as const },
  { label: "Production Days", value: "22", icon: CalendarClock, accent: "brand" as const },
  { label: "Characters", value: "12", icon: Users2, accent: "red" as const },
  { label: "AI Agents", value: "5", icon: Sparkles, accent: "brand" as const },
  { label: "Completion ETA", value: "9 mo", icon: Clock, accent: "gold" as const },
];

const accentRing: Record<string, string> = {
  brand: "shadow-[0_0_30px_-10px_var(--brand)] border-brand/30",
  gold:  "shadow-[0_0_30px_-10px_var(--gold)] border-gold/30",
  red:   "shadow-[0_0_30px_-10px_var(--cinema-red)] border-cinema-red/30",
};
const accentTint: Record<string, string> = {
  brand: "from-brand/30 to-brand/5",
  gold:  "from-gold/30 to-gold/5",
  red:   "from-cinema-red/30 to-cinema-red/5",
};
const accentText: Record<string, string> = {
  brand: "text-brand-glow",
  gold:  "text-gold",
  red:   "text-cinema-red",
};

function Dashboard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 py-6">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 shrink-0 border-r border-white/10 bg-black/90 backdrop-blur-xl p-4 pt-20 transition-transform lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:translate-x-0 lg:rounded-2xl lg:border lg:pt-4 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-xs tracking-[0.3em] uppercase text-white/50">Menu</span>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <Link key={n.id} to={n.to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/5 hover:text-white transition-colors"
                activeProps={{ className: "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold bg-gradient-to-r from-brand/25 to-transparent text-white border border-brand/25" }}
                activeOptions={{ exact: true }}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            <div className="my-4 h-px bg-white/5" />
            <p className="px-3 pb-2 text-[10px] tracking-[0.3em] uppercase text-gold/70">Departments</p>
            {AGENT_NAV.map((a) => (
              <a key={a.id} href={`#${a.id}`} onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/5 hover:text-white transition-colors">
                <a.icon className={`h-4 w-4 ${accentText[a.accent]}`} /> {a.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-6">
          {/* Marquee title */}
          <div className="animated-border rounded-2xl">
            <div className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80">Now In Production</p>
                <h1 className="truncate cinema-heading text-2xl sm:text-3xl">
                  Martian Memory <span className="gold-text">/ Draft 01</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="lg:hidden border-white/10" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="bg-brand/15 text-brand-glow border border-brand/20 tracking-widest uppercase text-[10px]">All Departments Online</Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stats.map((s) => (
              <div key={s.label} className={`glass rounded-2xl p-4 border ${accentRing[s.accent]}`}>
                <div className="flex items-center gap-2">
                  <div className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${accentTint[s.accent]} border border-white/10`}>
                    <s.icon className={`h-4 w-4 ${accentText[s.accent]}`} />
                  </div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">{s.label}</p>
                </div>
                <p className="mt-3 cinema-heading text-2xl text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Director's Room */}
          <Section id="writer" emoji="🎬" icon={PenLine} title="Director's Room" subtitle="Writer Agent · Screenplay & story" accent="brand">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Title</p>
                  <p className="cinema-heading text-2xl">Martian Memory</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Synopsis</p>
                  <p className="mt-1 text-sm text-white/80 leading-relaxed">
                    When archaeologist Dr. Aria Vance unearths a buried theater on Mars, she discovers a
                    reel that predicts her own death — and the identity of the killer. Racing across two
                    planets, she must rewrite the ending before it's projected.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Screenplay preview</p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-black/60 border border-white/10 p-4 text-xs font-mono text-white/85">{`INT. LOST CINEMA — MARS — NIGHT

A single beam of red dust cuts the dark. ARIA (30s), helmet
off, watches the projector flicker to life.

  ARIA
That's… my face.

On screen, ARIA on Earth — tomorrow's date.`}</pre>
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Characters</p>
                <ul className="space-y-2">
                  {[
                    { n: "Dr. Aria Vance", d: "Archaeologist. Lead." },
                    { n: "Cmdr. Ryo Marin", d: "Colony commander. Antagonist." },
                    { n: "Engineer Kade", d: "Ally, mechanic, moral compass." },
                    { n: "The Projectionist", d: "Unseen force pulling the strings." },
                  ].map((c) => (
                    <li key={c.n} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">{c.n}</p>
                      <p className="text-xs text-white/60">{c.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Producer's Office */}
          <Section id="budget" emoji="💰" icon={Wallet} title="Producer's Office" subtitle="Budget Agent · Estimated $5.0M total" accent="gold">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetData.map((b) => {
                      const total = budgetData.reduce((s, x) => s + x.value, 0);
                      return (
                        <TableRow key={b.name} className="border-white/5">
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell className="text-right">${(b.value / 1000).toLocaleString()}K</TableCell>
                          <TableCell className="text-right text-white/60">{Math.round((b.value / total) * 100)}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold/80 mb-3">Distribution</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData}>
                      <XAxis dataKey="name" stroke="oklch(0.72 0.015 240)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="oklch(0.72 0.015 240)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                      <Tooltip contentStyle={{ background: "#151515", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {budgetData.map((_, i) => {
                          const colors = ["var(--brand)", "var(--brand-glow)", "var(--gold)", "var(--cinema-red)", "var(--brand)", "var(--gold)"];
                          return <Cell key={i} fill={colors[i % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Section>

          {/* Casting Studio */}
          <Section id="casting" emoji="🎭" icon={Users} title="Casting Studio" subtitle="Casting Agent · Top recommendations" accent="red">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cast.map((c) => (
                <div key={c.name} className="group rounded-2xl border border-white/10 bg-black/40 overflow-hidden hover:-translate-y-1 hover:border-cinema-red/40 hover:shadow-[0_20px_40px_-20px_var(--cinema-red)] transition-all">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={c.img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="cinema-heading text-lg text-white">{c.name}</p>
                      <p className="text-xs text-gold tracking-wider uppercase">{c.role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-white/70">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Production Control */}
          <Section id="scheduler" emoji="📅" icon={CalendarClock} title="Production Control" subtitle="Scheduler Agent · 22-day principal photography" accent="brand">
            <ol className="relative border-l border-brand/30 space-y-4 pl-6">
              {schedule.map((s, i) => (
                <li key={s.day} className="relative">
                  <span className="absolute -left-[30px] top-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-[10px] font-bold text-brand-foreground shadow-[0_0_15px_-2px_var(--brand)]">{i + 1}</span>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="cinema-heading text-white">{s.day}</p>
                      <Badge variant="outline" className="border-gold/30 bg-gold/5 text-gold text-xs"><MapPin className="mr-1 h-3 w-3" />{s.location}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-white/70">{s.scenes}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* Marketing Studio */}
          <Section id="marketing" emoji="📢" icon={Megaphone} title="Marketing Studio" subtitle="Marketing Agent · Launch campaign kit" accent="gold">
            <div className="grid gap-4 lg:grid-cols-2">
              <MarketingCard icon={Film} title="Poster prompt">
                A lone astronaut silhouetted against a crimson Martian sunset, faint film-reel constellations
                overhead, cinematic teal-and-orange grading, minimalist typography, IMAX ratio.
              </MarketingCard>
              <MarketingCard icon={Clapperboard} title="Trailer script" italic>
                "They said Mars was empty… (beat) …until it started playing back." Cut to reels, glass shattering,
                Aria's whisper: "Rewrite it." Title slam. Release date.
              </MarketingCard>
              <MarketingCard icon={Instagram} title="Instagram caption">
                Some films predict the future. This one remembers it. 🎬🔴 Martian Memory — in theaters everywhere.
              </MarketingCard>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold/80 flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> Hashtags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hashtags.map((h) => (
                    <span key={h} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}

function MarketingCard({ icon: Icon, title, italic, children }: { icon: React.ComponentType<{ className?: string }>; title: string; italic?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-gold/30 transition-colors">
      <p className="text-[10px] tracking-[0.25em] uppercase text-gold/80 flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {title}</p>
      <p className={`mt-2 text-sm text-white/80 ${italic ? "italic" : ""}`}>{children}</p>
    </div>
  );
}

function Section({
  id, icon: Icon, emoji, title, subtitle, accent, children,
}: { id: string; icon: React.ComponentType<{ className?: string }>; emoji: string; title: string; subtitle: string; accent: "brand" | "gold" | "red"; children: React.ReactNode }) {
  return (
    <section id={id} className={`glass rounded-3xl p-5 sm:p-6 scroll-mt-24 animate-fade-in border ${accentRing[accent]}`}>
      <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accentTint[accent]} border border-white/10 text-lg`}>
          <span>{emoji}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${accentText[accent]}`} />
            <h2 className="truncate cinema-heading text-xl text-white">{title}</h2>
          </div>
          <p className="truncate text-xs text-white/55">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}