import type { ReactNode } from 'react';

import { Navbar, Footer } from './Essentials';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

interface PageShellProps {
  children: ReactNode;
}

/**
 * Nav + main + footer, with the top padding that clears the fixed header.
 * Every route except Home (which owns a full-height hero) is built on this.
 */
export const PageShell: React.FC<PageShellProps> = ({ children }) => (
  <div className="min-h-screen bg-bg text-ink">
    <Navbar />
    {/* opaque and above the fixed footer, so it covers it until scrolled past */}
    <main className="relative z-10 bg-bg pb-16 pt-[calc(var(--nav-h)+2.25rem)] md:pb-24 md:pt-[calc(var(--nav-h)+5.5rem)]">
      {children}
    </main>
    <Footer />
  </div>
);

interface PageHeaderProps {
  kicker: string;
  title: string;
  /** Exact substring of `title` to set in serif italic. */
  emphasis?: string;
  lead?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ kicker, title, emphasis, lead }) => (
  <Container>
    <Reveal as="p" className="label">
      {kicker}
    </Reveal>

    <SplitText
      as="h1"
      text={title}
      emphasis={emphasis}
      delay={120}
      className="mt-6 block max-w-[18ch] text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-ink"
    />

    {lead ? (
      <Reveal as="p" delay={260} className="mt-6 max-w-[56ch] text-base leading-relaxed text-muted">
        {lead}
      </Reveal>
    ) : null}
  </Container>
);
