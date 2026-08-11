import { useRef } from 'react';
import type { ReactNode } from 'react';

import { useSpotlight } from '../../lib/motion';

interface CardProps {
  children: ReactNode;
  /** Renders as an anchor when set. */
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Disable the pointer-tracked highlight for static surfaces. */
  spotlight?: boolean;
}

const base =
  'spot group relative block overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface ' +
  'transition-[border-color,transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out-quint)]';

const interactive =
  'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-soft)] ' +
  'focus-visible:-translate-y-0.5 focus-visible:border-line-strong';

/**
 * The workhorse surface: hairline border, no fill contrast, and all of its
 * presence coming from the hover response rather than shadow at rest.
 */
const Card: React.FC<CardProps> = ({
  children,
  href,
  onClick,
  className = '',
  spotlight = true,
}) => {
  const ref = useRef<HTMLElement>(null);
  useSpotlight(ref);

  const isInteractive = Boolean(href || onClick);
  const classes = `${base} ${isInteractive ? interactive : ''} ${className}`;

  if (href) {
    const external = /^https?:/.test(href);

    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={`${classes} w-full text-left`}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={spotlight ? classes : classes.replace('spot ', '')}
    >
      {children}
    </div>
  );
};

export default Card;
