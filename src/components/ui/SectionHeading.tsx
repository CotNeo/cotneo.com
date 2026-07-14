import Reveal from './Reveal';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  lede?: string;
}

/** Numbered mono label + title used at the top of every section. */
const SectionHeading = ({ index, label, title, lede }: SectionHeadingProps) => (
  <Reveal className="mb-12 md:mb-16 max-w-3xl">
    <p className="section-label mb-3">
      {index} / {label}
    </p>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
    {lede && <p className="mt-4 text-base md:text-lg text-mist leading-relaxed">{lede}</p>}
  </Reveal>
);

export default SectionHeading;
