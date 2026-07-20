import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-gold/20 border border-white/10 shadow-[0_0_20px_-6px_var(--brand)]">
        <svg viewBox="0 0 40 40" className="h-6 w-6 animate-reel-spin text-brand-glow" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="20" cy="20" r="14" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" />
          <circle cx="20" cy="8"  r="2.2" />
          <circle cx="20" cy="32" r="2.2" />
          <circle cx="8"  cy="20" r="2.2" />
          <circle cx="32" cy="20" r="2.2" />
          <path d="M20 12 L20 6 M20 34 L20 28 M12 20 L6 20 M34 20 L28 20" stroke="var(--gold)" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="cinema-heading text-lg font-normal tracking-[0.18em] gradient-text">CineFlow</span>
        <span className="text-[10px] tracking-[0.35em] text-gold/80 -mt-0.5">A · I &nbsp; S T U D I O</span>
      </div>
    </Link>
  );
}