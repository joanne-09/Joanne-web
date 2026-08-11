import type { CSSProperties, ElementType, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger in ms, applied as a transition-delay. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Marks a subtree for scroll reveal. App.tsx's IntersectionObserver adds
 * .is-revealed when it enters the viewport; motion.css does the rest.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
}) => (
  <Tag
    data-reveal=""
    className={className}
    style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
  >
    {children}
  </Tag>
);

export default Reveal;
