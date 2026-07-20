import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clapperboard } from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Movie — CineFlow AI" },
      { name: "description", content: "Describe your movie idea and let the CineFlow AI agents plan the production." },
    ],
  }),
  component: CreatePage,
});

const genres = ["Action", "Drama", "Sci-Fi", "Comedy", "Thriller", "Romance", "Horror", "Documentary", "Fantasy"];

function CreatePage() {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/processing" });
  };
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground">
            <Clapperboard className="h-3.5 w-3.5 text-brand-glow" /> New production
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold">Create your <span className="gradient-text">movie</span></h1>
          <p className="mt-3 text-muted-foreground">Give the crew a brief. They'll take it from here.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <Field label="Movie idea" htmlFor="idea">
            <Textarea id="idea" required placeholder="A rogue AI archaeologist discovers a lost cinema on Mars..." rows={4} className="bg-background/40 border-white/10" />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Genre" htmlFor="genre">
              <Select>
                <SelectTrigger id="genre" className="bg-background/40 border-white/10"><SelectValue placeholder="Select genre" /></SelectTrigger>
                <SelectContent>{genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Target audience" htmlFor="audience">
              <Input id="audience" placeholder="e.g. Adults 18-45" className="bg-background/40 border-white/10" />
            </Field>
            <Field label="Language" htmlFor="language">
              <Input id="language" placeholder="English" className="bg-background/40 border-white/10" />
            </Field>
            <Field label="Estimated budget" htmlFor="budget">
              <Input id="budget" placeholder="$5,000,000" className="bg-background/40 border-white/10" />
            </Field>
            <Field label="Movie duration" htmlFor="duration">
              <Input id="duration" placeholder="120 minutes" className="bg-background/40 border-white/10" />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" placeholder="United States" className="bg-background/40 border-white/10" />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button asChild variant="ghost"><Link to="/">Back</Link></Button>
            <Button type="submit" size="lg" className="btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground hover:opacity-90">
              Generate movie <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}