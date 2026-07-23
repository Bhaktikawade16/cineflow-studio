export function ParticleField({ count = 24 }: { count?: number }) {
  const particles = Array.from({ length: count });
  return (
    <div className="cf-particles" aria-hidden="true">
      {particles.map((_, i) => {
        const x = (i * 137) % 100;
        const dur = 14 + ((i * 7) % 16);
        const delay = (i * 1.3) % 18;
        const px = ((i % 2 === 0 ? 1 : -1) * ((i * 11) % 60)) + "px";
        const size = 2 + (i % 3);
        return (
          <span
            key={i}
            style={{
              // @ts-expect-error - CSS custom properties
              "--x": `${x}%`,
              "--dur": `${dur}s`,
              "--delay": `${delay}s`,
              "--px": px,
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
}