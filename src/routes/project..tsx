import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, Send, Upload, FileText, Wallet, CalendarClock, Users, Sparkles,
  MessageSquare, Loader2, Film, PenLine, Clapperboard, Image as ImageIcon,
} from "lucide-react";
import { TopBar } from "@/components/cineflow/topbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { chatWithAgent, getProjectBundle } from "@/lib/ai.functions";

export const Route = createFileRoute("/project/")({
  head: () => ({ meta: [{ title: "Production · CineFlow AI" }] }),
  component: ProjectPage,
});

const AGENTS = [
  { id: "director" as const, label: "Director", icon: Clapperboard, accent: "brand" },
  { id: "writer" as const, label: "Script Writer", icon: PenLine, accent: "gold" },
  { id: "producer" as const, label: "Producer", icon: Sparkles, accent: "brand" },
  { id: "budget" as const, label: "Budget Planner", icon: Wallet, accent: "gold" },
  { id: "storyboard" as const, label: "Storyboard", icon: ImageIcon, accent: "red" },
];

type AgentId = (typeof AGENTS)[number]["id"];

const QUICK_PROMPTS = [
  "Improve dialogue in the opening scene",
  "Rewrite the ending with a twist",
  "Reduce budget by 20%",
  "Add more comedy to Act 2",
  "Translate the screenplay to Spanish",
  "Generate the next scene",
];

function ProjectPage() {
  const { projectId } = useParams({ from: "/project/$projectId" });
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const qc = useQueryClient();
  const bundle = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectBundle({ data: { projectId } }),
    enabled: !!user,
  });

  const project = bundle.data?.project;
  const meta = (project?.metadata ?? {}) as any;
  const script = bundle.data?.scripts?.[0];
  const plans = bundle.data?.plans ?? [];
  const files = bundle.data?.files ?? [];
  const budgetPlan = plans.find((p: any) => p.department === "budget")?.plan as any;
  const masterPlan = plans.find((p: any) => p.department === "master")?.plan as any;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Studio
            </Link>
            {bundle.isLoading ? (
              <Skeleton className="mt-2 h-9 w-72" />
            ) : (
              <h1 className="cinema-heading text-3xl sm:text-4xl truncate">
                {project?.title ?? "Untitled Production"}
                {project?.genre && (
                  <span className="ml-3 text-sm gold-text tracking-widest uppercase">{project.genre}</span>
                )}
              </h1>
            )}
            {meta?.logline && <p className="mt-1 text-white/70 max-w-2xl">{meta.logline}</p>}
          </div>
          <Badge className="bg-brand/15 text-brand-glow border border-brand/25 tracking-widest uppercase text-[10px]">
            {project?.status ?? "loading"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-black/60 border border-white/10">
            <TabsTrigger value="overview"><FileText className="h-3.5 w-3.5 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="script"><PenLine className="h-3.5 w-3.5 mr-1" />Script</TabsTrigger>
            <TabsTrigger value="plan"><CalendarClock className="h-3.5 w-3.5 mr-1" />Plan</TabsTrigger>
            <TabsTrigger value="budget"><Wallet className="h-3.5 w-3.5 mr-1" />Budget</TabsTrigger>
            <TabsTrigger value="chat"><MessageSquare className="h-3.5 w-3.5 mr-1" />AI Agents</TabsTrigger>
            <TabsTrigger value="files"><Upload className="h-3.5 w-3.5 mr-1" />Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {bundle.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Panel title="Synopsis">
                  <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                    {meta?.synopsis ?? "No synopsis yet."}
                  </p>
                </Panel>
                <Panel title="Characters">
                  <ul className="space-y-2">
                    {(meta?.characters ?? []).map((c: any, i: number) => (
                      <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        {c.role && <p className="text-[11px] uppercase tracking-widest text-gold">{c.role}</p>}
                        <p className="text-xs text-white/60 mt-1">{c.description}</p>
                      </li>
                    ))}
                    {(!meta?.characters || meta.characters.length === 0) && (
                      <p className="text-sm text-white/50">No characters yet.</p>
                    )}
                  </ul>
                </Panel>
                <Panel title="Scene Outline" className="md:col-span-2">
                  {(meta?.outline ?? []).map((act: any, i: number) => (
                    <div key={i} className="mb-4">
                      <p className="cinema-heading text-brand-glow">{act.act}</p>
                      <ul className="mt-2 space-y-1">
                        {(act.scenes ?? []).map((s: any, j: number) => (
                          <li key={j} className="rounded-lg bg-black/40 border border-white/5 p-2">
                            <p className="text-sm font-semibold text-white">{s.heading}</p>
                            <p className="text-xs text-white/60">{s.summary}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {(!meta?.outline || meta.outline.length === 0) && (
                    <p className="text-sm text-white/50">No outline yet.</p>
                  )}
                </Panel>
              </div>
            )}
          </TabsContent>

          <TabsContent value="script">
            <Panel title={script?.title ?? "Screenplay"}>
              {bundle.isLoading ? <Skeleton className="h-96" /> : (
                <pre className="whitespace-pre-wrap rounded-2xl bg-black/60 border border-white/10 p-4 text-xs font-mono text-white/85 max-h-[70vh] overflow-auto">
                  {script?.content ?? "Draft not yet available."}
                </pre>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="plan">
            <Panel title="Production Plan">
              {(masterPlan?.phases ?? []).map((p: any, i: number) => (
                <div key={i} className="mb-4 rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex justify-between">
                    <p className="cinema-heading text-white">{p.name}</p>
                    <span className="text-xs text-gold">{p.duration}</span>
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-white/70 space-y-1">
                    {(p.tasks ?? []).map((t: string, j: number) => <li key={j}>{t}</li>)}
                  </ul>
                </div>
              ))}
              {!masterPlan && <p className="text-sm text-white/50">No plan yet.</p>}
            </Panel>
            <Panel title="Shooting Schedule" className="mt-4">
              <ol className="relative border-l border-brand/30 space-y-3 pl-5">
                {(meta?.schedule ?? []).map((s: any, i: number) => (
                  <li key={i} className="relative rounded-xl border border-white/10 bg-black/40 p-3">
                    <span className="absolute -left-[22px] top-3 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-[9px] font-bold text-brand-foreground">{i + 1}</span>
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="cinema-heading text-white text-sm">{s.day}</p>
                      <span className="text-xs text-gold">{s.location}</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">{s.scenes}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </TabsContent>

          <TabsContent value="budget">
            <Panel title={`Budget${budgetPlan?.total ? ` · ${budgetPlan.total}` : ""}`}>
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-black/60">
                    <tr className="text-white/60 text-[11px] uppercase tracking-widest">
                      <th className="text-left p-3">Category</th>
                      <th className="text-right p-3">Amount</th>
                      <th className="text-left p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(budgetPlan?.items ?? []).map((it: any, i: number) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="p-3 font-medium">{it.category}</td>
                        <td className="p-3 text-right text-gold">{it.amount}</td>
                        <td className="p-3 text-white/60">{it.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!budgetPlan && <p className="text-sm text-white/50 mt-2">No budget yet.</p>}
            </Panel>
          </TabsContent>

          <TabsContent value="chat">
            <AgentChat projectId={projectId} onSaved={() => qc.invalidateQueries({ queryKey: ["project", projectId] })} />
          </TabsContent>

          <TabsContent value="files">
            <FilesPanel projectId={projectId} files={files} onChange={() => qc.invalidateQueries({ queryKey: ["project", projectId] })} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`glass rounded-2xl p-5 border border-white/10 ${className}`}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-3">{title}</p>
      {children}
    </section>
  );
}

function AgentChat({ projectId, onSaved }: { projectId: string; onSaved: () => void }) {
  const [agent, setAgent] = useState<AgentId>("director");
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const messagesQuery = useQuery({
    queryKey: ["chat", projectId, agent],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_conversations")
        .select("id,role,content,created_at")
        .eq("project_id", projectId)
        .eq("agent", agent)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messagesQuery.data]);

  const qc = useQueryClient();
  const send = useMutation({
    mutationFn: (message: string) => chatWithAgent({ data: { projectId, agent, message } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat", projectId, agent] });
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submit = () => {
    const msg = input.trim();
    if (!msg || send.isPending) return;
    setInput("");
    send.mutate(msg);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <div className="glass rounded-2xl p-3 border border-white/10 space-y-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80 p-2">Agents</p>
        {AGENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAgent(a.id)}
            className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
              agent === a.id
                ? "bg-gradient-to-r from-brand/25 to-transparent text-white border border-brand/25"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            <a.icon className="h-4 w-4" /> {a.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/10 flex flex-col min-h-[60vh]">
        <div ref={scroller} className="flex-1 overflow-auto p-4 space-y-3">
          {messagesQuery.isLoading && <Skeleton className="h-8" />}
          {(messagesQuery.data ?? []).length === 0 && !messagesQuery.isLoading && (
            <div className="text-center text-white/50 text-sm py-10">
              Start a conversation with your {AGENTS.find((a) => a.id === agent)?.label}.
            </div>
          )}
          {(messagesQuery.data ?? []).map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-auto bg-brand/20 border border-brand/30 text-white"
                  : "bg-black/40 border border-white/10 text-white/85"
              }`}
            >
              {m.content}
            </div>
          ))}
          {send.isPending && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
            </div>
          )}
        </div>
        <div className="border-t border-white/10 p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="text-[11px] rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-white/70 hover:border-gold/30 hover:text-gold"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={`Message the ${AGENTS.find((a) => a.id === agent)?.label}…`}
              rows={2}
              className="bg-black/40 border-white/10 resize-none"
            />
            <Button
              onClick={submit}
              disabled={send.isPending || !input.trim()}
              className="bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow"
            >
              {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilesPanel({
  projectId,
  files,
  onChange,
}: {
  projectId: string;
  files: any[];
  onChange: () => void;
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large (20MB max).");
      return;
    }
    setUploading(true);
    try {
      const path = `${user.id}/${projectId}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("project-files").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) throw up.error;
      const { error } = await supabase.from("uploaded_files").insert({
        user_id: user.id,
        project_id: projectId,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (error) throw error;
      toast.success("File uploaded.");
      onChange();
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const openFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("project-files").createSignedUrl(path, 3600);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold/80">Attached Files</p>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-brand to-brand-glow text-brand-foreground btn-glow"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload
          </Button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {files.map((f) => (
          <button
            key={f.id}
            onClick={() => openFile(f.storage_path)}
            className="text-left rounded-xl border border-white/10 bg-black/40 p-3 hover:border-gold/30 transition-colors"
          >
            <p className="text-sm font-medium text-white truncate">{f.file_name}</p>
            <p className="text-xs text-white/50 mt-1">{f.mime_type} · {Math.round((f.size_bytes ?? 0) / 1024)} KB</p>
          </button>
        ))}
        {files.length === 0 && (
          <p className="text-sm text-white/50">No files yet. Upload PDFs, DOCX, or images.</p>
        )}
      </div>
    </div>
  );
}
