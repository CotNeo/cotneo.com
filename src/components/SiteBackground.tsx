/**
 * Lightweight static background: blueprint grid + two soft accent glows.
 * Replaces the previous WebGL galaxy (three.js) — zero runtime cost,
 * no per-frame work, and it respects reduced-motion by default.
 */
const SiteBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
    {/* Blueprint grid */}
    <div
      className="absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
      }}
    />
    {/* Accent glows */}
    <div
      className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
      style={{ background: 'radial-gradient(closest-side, rgba(45,212,191,0.09), transparent)' }}
    />
    <div
      className="absolute bottom-[-200px] right-[-120px] h-[420px] w-[560px] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(closest-side, rgba(56,124,255,0.06), transparent)' }}
    />
  </div>
);

export default SiteBackground;
