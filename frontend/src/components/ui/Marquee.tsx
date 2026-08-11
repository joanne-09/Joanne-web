import type { CSSProperties, ReactNode } from 'react';

interface MarqueeProps {
  items: ReactNode[];
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  gapClass?: string;
}

/**
 * Continuous horizontal strip. Renders the item list exactly twice — the track
 * translates by -50%, so copy two lands where copy one started and the seam is
 * invisible. Pauses on hover; frozen entirely under reduced motion.
 */
const Marquee: React.FC<MarqueeProps> = ({
  items,
  duration = 40,
  reverse = false,
  className = '',
  gapClass = 'gap-3',
}) => (
  <div className={`marquee relative overflow-hidden ${className}`}>
    <div
      className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''} ${gapClass}`}
      style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
    >
      {[0, 1].map((copy) => (
        <div key={copy} className={`flex shrink-0 ${gapClass}`} aria-hidden={copy === 1}>
          {items.map((item, index) => (
            <div key={index} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Marquee;
