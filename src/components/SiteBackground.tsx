import MatrixRain from './MatrixRain';

/**
 * Background: dark ink base + a Matrix-style digital rain layer on a
 * plain 2D canvas (no three.js — see MatrixRain) + two soft accent
 * glows. The rain skips itself under prefers-reduced-motion, so that
 * case falls back to the flat ink + glows, same as before.
 */
const SiteBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
    {/* Digital rain, vignetted so it stays subtle behind content */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 100%)',
      }}
    >
      <MatrixRain />
    </div>
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
