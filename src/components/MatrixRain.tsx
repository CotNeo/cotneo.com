'use client';

import { useEffect, useRef } from 'react';

/**
 * Classic "digital rain" effect on a single 2D canvas — no libraries,
 * no per-frame allocations beyond the drop array. Colored with the
 * site's teal accent to stay on-brand rather than stock green.
 *
 * Skips entirely under prefers-reduced-motion, throttles to ~24fps,
 * and pauses via the Page Visibility API when the tab isn't active.
 */
const FONT_SIZE = 16;
const FPS = 24;
const CHARS =
  'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
      ctx.fillStyle = '#0a0e14';
      ctx.fillRect(0, 0, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId = 0;
    let lastTime = 0;
    const interval = 1000 / FPS;

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);
      if (time - lastTime < interval) return;
      lastTime = time;

      // Translucent fill over the previous frame — this is what
      // produces the fading trail instead of a hard-cleared canvas.
      ctx.fillStyle = 'rgba(10, 14, 20, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, "JetBrains Mono", monospace`;
      ctx.fillStyle = 'rgba(45, 212, 191, 0.85)';

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        if (y >= 0) {
          ctx.fillText(char, x, y);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        lastTime = 0;
        animationId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden />;
};

export default MatrixRain;
