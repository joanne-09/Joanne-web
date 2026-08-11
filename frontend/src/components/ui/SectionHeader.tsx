import type { ReactNode } from 'react';

import Reveal from './Reveal';

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ label, title, lead, className = '' }) => (
  <header className={`flex flex-col gap-4 ${className}`}>
    <Reveal as="p" className="label">
      {label}
    </Reveal>
    <Reveal
      as="h2"
      delay={80}
      className="max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-ink"
    >
      {title}
    </Reveal>
    {lead ? (
      <Reveal as="p" delay={140} className="max-w-[52ch] text-base text-muted">
        {lead}
      </Reveal>
    ) : null}
  </header>
);

export default SectionHeader;
