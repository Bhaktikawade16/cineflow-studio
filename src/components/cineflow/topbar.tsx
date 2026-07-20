import { Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function TopBar() {
  const [dark, setDark] = useState(true);
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
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-gold/20 border border-white/10">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}