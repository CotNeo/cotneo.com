import Image from 'next/image';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

const strengths = [
  {
    title: 'Across the stack, for real',
    text: 'React and Next.js on the web, native Android and React Native on mobile, .NET and Node.js behind them — plus the Oracle procedures they all talk to.',
  },
  {
    title: 'Production first',
    text: 'My daily work runs in live logistics operations. When a barcode fails to print or an invoice flow breaks, I trace it through the app, the API and the database.',
  },
  {
    title: 'Legacy meets modern',
    text: 'Comfortable connecting SOAP services and PL/SQL packages to modern REST APIs and mobile clients — and documenting how it all fits together.',
  },
  {
    title: 'Product mindset',
    text: 'I build and run my own things: an AI-assisted CV builder, a RAG chatbot, automation tools and a live e-commerce store.',
  },
];

const About = () => {
  return (
    <section id="about" className="relative py-20 md:py-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          label="about"
          title="Software that has to work on the warehouse floor"
          lede="Not every bug shows up in a browser console. Some of them show up as a courier holding a label that won't print."
        />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-10 md:gap-14 items-start">
          {/* Photo */}
          <Reveal>
            <div className="panel p-2 max-w-xs mx-auto md:mx-0">
              <div className="relative overflow-hidden rounded-lg bg-ink">
                <Image
                  src="/images/profile-optimized.webp"
                  alt="Furkan Akar"
                  width={800}
                  height={1200}
                  sizes="(max-width: 768px) min(100vw - 2rem, 20rem), 320px"
                  quality={85}
                  className="h-auto w-full object-contain object-top"
                />
              </div>
              <div className="px-3 py-3 font-mono text-xs text-mist flex items-center justify-between">
                <span>Istanbul, TR</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  open to work
                </span>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <div className="space-y-6">
            <Reveal>
              <p className="text-base md:text-lg text-fog leading-relaxed">
                I&apos;m a full-stack and mobile developer based in Istanbul. Right now I build
                operational software for a nationwide logistics company: native Android apps
                running on Zebra handheld terminals, .NET 8 APIs, and Oracle PL/SQL procedures
                that together handle shipments, invoices and barcode operations every day.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-base md:text-lg text-fog leading-relaxed">
                Before that, I operated the security technology of the same logistics network —
                a fleet of around 1,300 CCTV and access devices. That&apos;s where I learned to take
                production systems seriously: monitoring, incident analysis, and clear
                communication when something breaks at 3 a.m.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-base md:text-lg text-fog leading-relaxed">
                On my own time I ship web products — Next.js, TypeScript, Node.js — and
                experiment with practical AI: retrieval-augmented chatbots, embeddings,
                automation. I&apos;m aiming at international, remote-friendly teams where I can keep
                growing toward cloud, DevOps and system design.
              </p>
            </Reveal>

            {/* Strengths grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {strengths.map((s, i) => (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="panel panel-hover p-5 h-full">
                    <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-mist leading-relaxed">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
