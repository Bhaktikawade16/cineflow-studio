import { Film } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-glow btn-glow">
        <Film className="h-5 w-5 text-brand-foreground" />
      </div>
      <span className="text-lg font-bold gradient-text">CineFlow AI</span>
    </Link>
  );
}