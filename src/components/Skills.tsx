import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { skillGroups, skillLevels, type SkillLevel } from '@/data/profile';

const levelStyles: Record<SkillLevel, string> = {
  Production: 'bg-accent/15 text-accent border-accent/30',
  Project: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
  Familiar: 'bg-slate-400/10 text-slate-300 border-slate-400/25',
  Learning: 'bg-signal/10 text-signal border-signal/30',
};

const levelDot: Record<SkillLevel, string> = {
  Production: 'bg-accent',
  Project: 'bg-sky-400',
  Familiar: 'bg-slate-400',
  Learning: 'bg-signal',
};

const Skills = () => {
  return (
    <section id="skills" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          label="skills"
          title="What I work with"
          lede="Grouped by where I actually use them — not a wall of logos. Levels are honest: production means it runs in real systems today."
        />

        {/* Legend */}
        <Reveal className="mb-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(Object.keys(skillLevels) as SkillLevel[]).map((level) => (
              <span key={level} className="flex items-center gap-2 text-xs text-mist font-mono">
                <span className={`w-2 h-2 rounded-full ${levelDot[level]}`} aria-hidden />
                {level} — {skillLevels[level].toLowerCase()}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 70}>
              <div className="panel panel-hover p-6 h-full">
                <h3 className="text-base font-bold text-white">{group.title}</h3>
                <p className="mt-1 text-xs text-mist">{group.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill.name}>
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-md border ${levelStyles[skill.level]}`}
                        title={skillLevels[skill.level]}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${levelDot[skill.level]}`}
                          aria-hidden
                        />
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
