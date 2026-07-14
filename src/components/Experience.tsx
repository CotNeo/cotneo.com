import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { experience } from '@/data/profile';

const Experience = () => {
  return (
    <section id="experience" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02"
          label="experience"
          title="Where I've shipped"
          lede="Enterprise mobile and backend work in logistics, systems operations before that, and my own products throughout."
        />

        <ol className="relative border-l border-edge ml-2 md:ml-4 space-y-12">
          {experience.map((job, i) => (
            <Reveal key={job.role} as="li" delay={i * 80} className="relative pl-8 md:pl-12">
              {/* Timeline node */}
              <span
                className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  i === 0 ? 'bg-accent border-accent' : 'bg-ink border-edge'
                }`}
                aria-hidden
              />

              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                {job.period}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-white">{job.role}</h3>
              <p className="text-sm text-mist mt-1">{job.org}</p>

              <p className="mt-4 text-base text-fog leading-relaxed max-w-3xl">{job.summary}</p>

              <ul className="mt-4 space-y-2.5 max-w-3xl">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-mist leading-relaxed">
                    <span className="text-accent mt-0.5 shrink-0" aria-hidden>
                      ▸
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.stack.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
