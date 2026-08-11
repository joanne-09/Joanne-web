import type { CSSProperties } from 'react';

import { useScrollProgress } from '../../lib/motion';

/** Hairline reading-progress indicator pinned to the top of the viewport. */
const ScrollRail: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div
      className="scroll-rail"
      aria-hidden="true"
      style={{ '--progress': progress } as CSSProperties}
    />
  );
};

export default ScrollRail;
