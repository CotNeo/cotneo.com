import Reveal from './ui/Reveal';
import { site, socials } from '@/data/profile';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <p className="section-label mb-3">07 / contact</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Let&apos;s talk
          </h2>
          <p className="mt-5 text-base md:text-lg text-mist leading-relaxed">
            I&apos;m open to full-stack, backend and mobile roles with international teams —
            remote or relocation-supported. If my mix of modern web and enterprise systems
            experience fits what you&apos;re building, I&apos;d like to hear about it.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-9 flex flex-wrap justify-center items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-accent text-ink font-semibold text-sm hover:bg-accent-deep transition-colors duration-200"
            >
              <FaEnvelope className="w-4 h-4" />
              {site.email}
            </a>
            <a
              href={socials.find((s) => s.id === 'linkedin')?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-edge text-fog font-semibold text-sm hover:border-accent/50 hover:text-white transition-colors duration-200"
            >
              <FaLinkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={socials.find((s) => s.id === 'github')?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-edge text-fog font-semibold text-sm hover:border-accent/50 hover:text-white transition-colors duration-200"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-8 font-mono text-xs text-mist">
            {site.location} · {site.timezone} · usually replies within a day
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
