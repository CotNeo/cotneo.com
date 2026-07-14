import { site, socials } from '@/data/profile';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-edge py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-mono text-sm text-fog">
              <span className="text-accent">~/</span>furkan-akar
            </p>
            <p className="mt-1 text-xs text-mist">
              {site.title} · {site.location}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Footer">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target={s.id === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-xs text-mist hover:text-accent transition-colors duration-200"
              >
                {s.name}
              </a>
            ))}
          </nav>

          <p className="text-xs text-mist text-center md:text-right">
            © {currentYear} Furkan Akar
            <span className="block mt-1">
              Built with <span className="text-fog">Next.js</span> +{' '}
              <span className="text-fog">Tailwind CSS</span> ·{' '}
              <a
                href="https://github.com/CotNeo/cotneo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                source
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
