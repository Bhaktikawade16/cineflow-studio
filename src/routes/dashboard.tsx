import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Plus, PenLine, Wallet, Users, CalendarClock, Megaphone,
  Menu, X, MapPin, Hash, Instagram, Film, Clapperboard,
} from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CineFlow AI" }] }),
  component: Dashboard,
});

const NAV = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" as const },
  { id: "create", label: "Create Movie", icon: Plus, to: "/create" as const },
];
const AGENT_NAV = [
  { id: "writer", label: "Writer Agent", icon: PenLine },
  { id: "budget", label: "Budget Agent", icon: Wallet },
  { id: "casting", label: "Casting Agent", icon: Users },
  { id: "scheduler", label: "Scheduler Agent", icon: CalendarClock },
  { id: "marketing", label: "Marketing Agent", icon: Megaphone },
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

function Dashboard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 py-6">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 shrink-0 border-r border-white/10 bg-sidebar/95 backdrop-blur-xl p-4 pt-20 transition-transform lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:translate-x-0 lg:rounded-2xl lg:border lg:pt-4 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-muted-foreground">Menu</span>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <Link key={n.id} to={n.to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                activeProps={{ className: "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold bg-gradient-to-r from-brand/20 to-transparent text-foreground border border-brand/20" }}
                activeOptions={{ exact: true }}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            <div className="my-3 h-px bg-white/5" />
            <p className="px-3 pb-1 text-xs uppercase tracking-wider text-muted-foreground">Agents</p>
            {AGENT_NAV.map((a) => (
              <a key={a.id} href={`#${a.id}`} onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <a.icon className="h-4 w-4 text-brand-glow" /> {a.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Production overview</p>
              <h1 className="truncate text-2xl sm:text-3xl font-bold">Martian Memory <span className="gradient-text">/ Draft 01</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="lg:hidden border-white/10" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></Button>
              <Badge variant="secondary" className="bg-brand/15 text-brand-glow border-brand/20">All agents ready</Badge>
            </div>
          </div>

          {/* Writer */}
          <Section id="writer" icon={PenLine} title="Writer Agent" subtitle="Screenplay & story">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Title</p>
                  <p className="text-xl font-semibold">Martian Memory</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Synopsis</p>
                  <p className="mt-1 text-sm text-foreground/85 leading-relaxed">
                    When archaeologist Dr. Aria Vance unearths a buried theater on Mars, she discovers a
                    reel that predicts her own death — and the identity of the killer. Racing across two
                    planets, she must rewrite the ending before it's projected.
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Screenplay preview</p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-background/60 border border-white/10 p-4 text-xs font-mono text-foreground/85">{`INT. LOST CINEMA — MARS — NIGHT

A single beam of red dust cuts the dark. ARIA (30s), helmet
off, watches the projector flicker to life.

  ARIA
That's… my face.

On screen, ARIA on Earth — tomorrow's date.`}</pre>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Characters</p>
                <ul className="space-y-2">
                  {[
                    { n: "Dr. Aria Vance", d: "Archaeologist. Lead." },
                    { n: "Cmdr. Ryo Marin", d: "Colony commander. Antagonist." },
                    { n: "Engineer Kade", d: "Ally, mechanic, moral compass." },
                    { n: "The Projectionist", d: "Unseen force pulling the strings." },
                  ].map((c) => (
                    <li key={c.n} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold">{c.n}</p>
                      <p className="text-xs text-muted-foreground">{c.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Budget */}
          <Section id="budget" icon={Wallet} title="Budget Agent" subtitle="Estimated $5.0M total">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">% of budget</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetData.map((b) => {
                      const total = budgetData.reduce((s, x) => s + x.value, 0);
                      return (
                        <TableRow key={b.name} className="border-white/5">
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell className="text-right">${(b.value / 1000).toLocaleString()}K</TableCell>
                          <TableCell className="text-right text-muted-foreground">{Math.round((b.value / total) * 100)}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Distribution</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData}>
                      <XAxis dataKey="name" stroke="oklch(0.68 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="oklch(0.68 0.03 255)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                      <Tooltip contentStyle={{ background: "oklch(0.19 0.025 265)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {budgetData.map((_, i) => <Cell key={i} fill={`oklch(${0.55 + i * 0.04} 0.19 ${240 + i * 6})`} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Section>

          {/* Casting */}
          <Section id="casting" icon={Users} title="Casting Agent" subtitle="Top recommendations">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cast.map((c) => (
                <div key={c.name} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover-scale transition">
                  <div className="aspect-[4/5] bg-gradient-to-br from-brand/30 to-brand-glow/10 relative overflow-hidden">
                    <img src={c.img} alt={c.name} className="h-full w-full object-cover opacity-90" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-brand-glow">{c.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Scheduler */}
          <Section id="scheduler" icon={CalendarClock} title="Scheduler Agent" subtitle="22-day principal photography">
            <ol className="relative border-l border-white/10 space-y-4 pl-6">
              {schedule.map((s, i) => (
                <li key={s.day} className="relative">
                  <span className="absolute -left-[30px] top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-[10px] font-bold text-brand-foreground">{i + 1}</span>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{s.day}</p>
                      <Badge variant="outline" className="border-white/15 text-xs"><MapPin className="mr-1 h-3 w-3" />{s.location}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.scenes}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* Marketing */}
          <Section id="marketing" icon={Megaphone} title="Marketing Agent" subtitle="Launch campaign kit">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Film className="h-3.5 w-3.5" /> Poster prompt</p>
                <p className="mt-2 text-sm text-foreground/85">
                  A lone astronaut silhouetted against a crimson Martian sunset, faint film-reel constellations
                  overhead, cinematic teal-and-orange grading, minimalist typography, IMAX ratio.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Clapperboard className="h-3.5 w-3.5" /> Trailer script</p>
                <p className="mt-2 text-sm text-foreground/85 italic">
                  "They said Mars was empty… (beat) …until it started playing back." Cut to reels, glass shattering,
                  Aria's whisper: "Rewrite it." Title slam. Release date.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Instagram className="h-3.5 w-3.5" /> Instagram caption</p>
                <p className="mt-2 text-sm text-foreground/85">
                  Some films predict the future. This one remembers it. 🎬🔴 Martian Memory — in theaters everywhere.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> Hashtags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hashtags.map((h) => (
                    <span key={h} className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs text-brand-glow">{h}</span>
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

function Section({
  id, icon: Icon, title, subtitle, children,
}: { id: string; icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="glass rounded-3xl p-5 sm:p-6 scroll-mt-24 animate-fade-in">
      <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-glow/20 border border-white/10">
          <Icon className="h-5 w-5 text-brand-glow" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}