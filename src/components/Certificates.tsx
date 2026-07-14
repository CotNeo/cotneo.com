import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { certificates, education, languages, currentFocus } from '@/data/profile';
import { FaExternalLinkAlt, FaGraduationCap, FaCertificate } from 'react-icons/fa';

const Certificates = () => {
  return (
    <section id="certificates" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="06"
          label="education"
          title="Education & certification"
          lede="Formal study, University of Helsinki certifications, and what I'm learning right now."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Certificates */}
          <Reveal>
            <div className="panel panel-hover p-6 h-full">
              <div className="flex items-center gap-2.5 mb-5">
                <FaCertificate className="w-4 h-4 text-accent" aria-hidden />
                <h3 className="text-base font-bold text-white">Certificates</h3>
              </div>
              <ul className="space-y-4">
                {certificates.map((cert) => (
                  <li key={cert.name}>
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-fog group-hover:text-accent transition-colors duration-200">
                          {cert.name}
                        </p>
                        <p className="text-xs text-mist mt-0.5">{cert.issuer}</p>
                      </div>
                      <FaExternalLinkAlt className="w-3 h-3 text-mist group-hover:text-accent mt-1 shrink-0 transition-colors duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Education */}
          <Reveal delay={70}>
            <div className="panel panel-hover p-6 h-full">
              <div className="flex items-center gap-2.5 mb-5">
                <FaGraduationCap className="w-4 h-4 text-accent" aria-hidden />
                <h3 className="text-base font-bold text-white">Education</h3>
              </div>
              <ul className="space-y-4">
                {education.map((edu) => (
                  <li key={edu.program}>
                    <p className="text-sm font-semibold text-fog">{edu.program}</p>
                    <p className="text-xs text-mist mt-0.5">
                      {edu.school} · {edu.status}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-edge">
                <p className="font-mono text-xs uppercase tracking-widest text-mist mb-3">
                  Languages
                </p>
                <ul className="space-y-2">
                  {languages.map((lang) => (
                    <li key={lang.name} className="text-xs text-mist">
                      <span className="text-fog font-medium">{lang.name}</span> — {lang.level}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Currently learning */}
          <Reveal delay={140}>
            <div className="panel panel-hover p-6 h-full">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" aria-hidden />
                <h3 className="text-base font-bold text-white">Currently learning</h3>
              </div>
              <ul className="space-y-3">
                {currentFocus.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-mist leading-relaxed">
                    <span className="text-signal shrink-0" aria-hidden>
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 pt-4 border-t border-edge text-xs text-mist leading-relaxed">
                Working toward AWS certification and deeper system-design practice for
                distributed, cloud-native services.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
