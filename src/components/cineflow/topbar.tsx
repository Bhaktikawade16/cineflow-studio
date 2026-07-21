import { LogIn, LogOut, Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";

export function TopBar() {
  const [dark, setDark] = useState(true);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.remove("light");
    else root.classList.add("light");
  }, [dark]);
  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl glass px-4 sm:px-5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]">
        <Logo />
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label="Toggle theme" className="hover:bg-white/5 hover:text-gold transition-colors">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {loading ? null : user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-1 leading-tight">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">Producer</span>
                <span className="text-xs text-white/80 truncate max-w-[140px]">{user.email}</span>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-gold/20 border border-white/10">
                <User className="h-4 w-4" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => { await signOut(); navigate({ to: "/", replace: true }); }}
                aria-label="Sign out"
                className="hover:bg-white/5 hover:text-gold"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="btn-glow bg-gradient-to-r from-brand to-brand-glow text-brand-foreground rounded-full cinema-heading tracking-widest px-4">
              <Link to="/auth"><LogIn className="mr-1.5 h-3.5 w-3.5" /> Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}