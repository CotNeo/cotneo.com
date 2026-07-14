'use client';

import Reveal from './ui/Reveal';
import DownloadCV from './DownloadCV';
import { site, socials } from '@/data/profile';
import {
  FaGithub,
  FaLinkedin,
  FaStackOverflow,
  FaMediumM,
  FaFreeCodeCamp,
  FaEnvelope,
} from 'react-icons/fa';

const socialIcons: Record<string, React.ReactNode> = {
  github: <FaGithub className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />,
  stackoverflow: <FaStackOverflow className="w-5 h-5" />,
  medium: <FaMediumM className="w-5 h-5" />,
  freecodecamp: <FaFreeCodeCamp className="w-5 h-5" />,
  email: <FaEnvelope className="w-5 h-5" />,
};

const topStack = ['TypeScript', 'React', 'Next.js', 'Node.js', 'C# / .NET 8', 'Java / Android', 'React Native', 'Oracle PL/SQL'];

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left — positioning */}
        <div>
          <Reveal>
            <p className="section-label mb-4">
              {site.location} · {site.availability.toLowerCase()}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Furkan Akar
            </h1>
            <p className="mt-3 text-2xl sm:text-3xl font-semibold text-accent tracking-tight">
              {site.title}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-base sm:text-lg text-mist leading-relaxed max-w-xl">
              {site.tagline} From React and Next.js frontends to .NET APIs, native
              Android apps on handheld terminals, and the Oracle procedures underneath —
              I work where modern web meets enterprise operations.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-5 py-3 rounded-md bg-accent text-ink font-semibold text-sm hover:bg-accent-deep transition-colors duration-200"
              >
                View projects
              </a>
              <DownloadCV />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target={s.id === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="p-2.5 rounded-md text-mist hover:text-accent hover:bg-panel border border-transparent hover:border-edge transition-all duration-200"
                >
                  {socialIcons[s.id]}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — terminal card */}
        <Reveal delay={200} className="hidden sm:block">
          <div className="panel overflow-hidden shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-edge bg-panel-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-mist">furkan@cotneo — zsh</span>
            </div>
            {/* Body */}
            <div className="p-5 font-mono text-[13px] leading-relaxed space-y-4">
              <div>
                <p className="text-mist">
                  <span className="text-accent">$</span> whoami
                </p>
                <p className="text-fog">full-stack &amp; mobile software developer</p>
              </div>
              <div>
                <p className="text-mist">
                  <span className="text-accent">$</span> current --role
                </p>
                <p className="text-fog">
                  operational software — logistics
                  <br />
                  <span className="text-mist">android · .net 8 · oracle · zebra printers</span>
                </p>
              </div>
              <div>
                <p className="text-mist">
                  <span className="text-accent">$</span> stack --top
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {topStack.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-mist">
                  <span className="text-accent">$</span> status
                </p>
                <p className="text-fog flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                  shipping to production · learning aws
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
