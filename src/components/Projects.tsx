import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { projects } from '@/data/profile';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

const Projects = () => {
  return (
    <section id="projects" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          label="projects"
          title="Things I've built"
          lede="Products and case studies — from an AI-assisted CV builder to a live e-commerce store running in production."
        />

        {/* Featured projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {featured.map((project, i) => (
            <Reveal key={project.name} delay={i * 70}>
              <article className="panel panel-hover p-6 md:p-7 h-full flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                      {project.kind}
                    </p>
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={project.repo ?? 'https://github.com/CotNeo?tab=repositories'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} source code`}
                      title="Source code"
                      className="p-2 rounded-md text-mist hover:text-accent hover:bg-panel-2 transition-colors duration-200"
                    >
                      <FaGithub className="w-4.5 h-4.5" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} live demo`}
                        title="Live demo"
                        className="p-2 rounded-md text-mist hover:text-accent hover:bg-panel-2 transition-colors duration-200"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm md:text-base text-mist leading-relaxed">
                  {project.description}
                </p>

                <ul className="mt-4 space-y-1.5 flex-1">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm text-fog">
                      <span className="text-accent shrink-0" aria-hidden>
                        ▸
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-edge flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Other projects */}
        <Reveal className="mt-14">
          <p className="section-label mb-6">more work</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((project, i) => (
            <Reveal key={project.name} delay={i * 60}>
              <article className="panel panel-hover p-5 h-full flex flex-col">
                <h3 className="text-base font-semibold text-white">{project.name}</h3>
                <p className="mt-2 text-sm text-mist leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 3).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <a
            href="https://github.com/CotNeo?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline underline-offset-4"
          >
            <FaGithub className="w-4 h-4" />
            All repositories on GitHub →
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
