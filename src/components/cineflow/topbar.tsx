import { Moon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function TopBar() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary border border-white/10">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}