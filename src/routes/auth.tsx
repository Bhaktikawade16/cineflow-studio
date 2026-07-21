import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Film, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/cineflow/logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In · CineFlow AI" },
      { name: "description", content: "Sign in to your CineFlow AI studio to plan productions with your team of AI agents." },
      { property: "og:title", content: "Sign In · CineFlow AI" },
      { property: "og:description", content: "Sign in to your CineFlow AI studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to the studio.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="min-h-screen relative grid place-items-center px-4">
      <div className="absolute inset-0 spotlight-bg -z-10" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-brand/15 blur-3xl animate-spotlight" />

      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="animated-border rounded-3xl">
          <div className="glass rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-gold">
                <Film className="h-3 w-3" /> Studio Access
              </div>
              <h1 className="mt-4 cinema-heading text-3xl sm:text-4xl">
                {mode === "signin" ? "Enter the Studio" : "Join the Crew"}
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {mode === "signin" ? "Sign in to your production suite." : "Create your CineFlow account."}
              </p>
            </div>

            <Button
              onClick={handleGoogle}
              variant="outline"
              className="w-full bg-white text-black hover:bg-white/90 border-white rounded-xl"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/40">
              <div className="h-px flex-1 bg-white/10" /> or email <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleEmail} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[11px] tracking-[0.2em] uppercase text-white/60">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-black/40 border-white/10" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/60"><Mail className="h-3 w-3 text-gold" /> Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" className="bg-black/40 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/60"><Lock className="h-3 w-3 text-gold" /> Password</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-black/40 border-white/10" />
              </div>
              <Button type="submit" disabled={loading} className="w-full btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground rounded-full cinema-heading tracking-widest">
                {loading ? "..." : mode === "signin" ? "Roll Camera" : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-white/50">
              {mode === "signin" ? "New to the studio?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-gold hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
            <p className="text-center">
              <Link to="/" className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70">← Back to lobby</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}