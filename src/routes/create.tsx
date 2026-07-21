import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight, Clapperboard, Film, Globe, Users, DollarSign, Clock, MapPin, Languages,
} from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "New Production — CineFlow AI" },
      { name: "description", content: "Brief your AI film crew and let the departments build your production plan." },
    ],
  }),
  component: CreatePage,
});

const genres = ["Action", "Drama", "Sci-Fi", "Comedy", "Thriller", "Romance", "Horror", "Documentary", "Fantasy"];

function CreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [genre, setGenre] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to start a production.");
      navigate({ to: "/auth" });
      return;
    }
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const idea = String(fd.get("idea") ?? "").trim();
    if (!idea) return;
    setSaving(true);
    const { data, error } = await supabase.from("movie_projects").insert({
      user_id: user.id,
      idea,
      title: idea.slice(0, 80),
      genre: genre || null,
      audience: String(fd.get("audience") ?? "") || null,
      language: String(fd.get("language") ?? "") || null,
      budget: String(fd.get("budget") ?? "") || null,
      duration: String(fd.get("duration") ?? "") || null,
      country: String(fd.get("country") ?? "") || null,
      status: "processing",
    }).select("id").single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Production briefed. Rolling cameras…");
    navigate({ to: "/processing", search: { projectId: data.id } as any });
  };
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-1.5 text-[11px] tracking-[0.25em] uppercase text-gold/90">
            <Clapperboard className="h-3.5 w-3.5" /> New Production
          </div>
          <h1 className="mt-5 cinema-heading text-4xl sm:text-6xl">
            Brief the <span className="gradient-text">Crew</span>
          </h1>
          <p className="mt-3 text-white/60">The departments will handle the rest.</p>
        </div>

        <form onSubmit={handleSubmit} className="animated-border rounded-3xl">
          <div className="glass rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
            {/* Clapperboard header strip */}
            <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-[10px] tracking-[0.3em] uppercase text-white/60">
              <span className="rounded bg-cinema-red px-1.5 py-0.5 text-white font-bold">REC</span>
              <span>Scene 01 · Take 1</span>
              <span className="ml-auto text-gold">CineFlow Studio</span>
            </div>

            <Field label="Movie idea" icon={Film} htmlFor="idea">
              <Textarea id="idea" name="idea" required placeholder="A rogue AI archaeologist discovers a lost cinema on Mars..." rows={4} className="bg-black/40 border-white/10 focus-visible:ring-brand" />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Genre" icon={Clapperboard} htmlFor="genre">
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre" className="bg-black/40 border-white/10"><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>{genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Target audience" icon={Users} htmlFor="audience">
                <Input id="audience" name="audience" placeholder="e.g. Adults 18-45" className="bg-black/40 border-white/10" />
              </Field>
              <Field label="Language" icon={Languages} htmlFor="language">
                <Input id="language" name="language" placeholder="English" className="bg-black/40 border-white/10" />
              </Field>
              <Field label="Estimated budget" icon={DollarSign} htmlFor="budget">
                <Input id="budget" name="budget" placeholder="$5,000,000" className="bg-black/40 border-white/10" />
              </Field>
              <Field label="Movie duration" icon={Clock} htmlFor="duration">
                <Input id="duration" name="duration" placeholder="120 minutes" className="bg-black/40 border-white/10" />
              </Field>
              <Field label="Country" icon={Globe} htmlFor="country">
                <Input id="country" name="country" placeholder="United States" className="bg-black/40 border-white/10" />
              </Field>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/5 px-3 py-2 text-xs text-white/50">
              <MapPin className="h-3.5 w-3.5 text-gold" /> Your brief is routed to five specialist agents simultaneously.
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button asChild variant="ghost" className="text-white/70 hover:text-white"><Link to="/">Back to lobby</Link></Button>
              <Button type="submit" size="lg" disabled={saving} className="btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground hover:opacity-90 rounded-full px-7 cinema-heading tracking-widest">
                {saving ? "Saving…" : "Roll Camera"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label, icon: Icon, htmlFor, children,
}: { label: string; icon: React.ComponentType<{ className?: string }>; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/60">
        <Icon className="h-3.5 w-3.5 text-gold" />
        {label}
      </Label>
      {children}
    </div>
  );
}