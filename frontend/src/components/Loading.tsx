import React from 'react';

/** Inline loading state, used inside a page that has already rendered. */
const Loading: React.FC = () => (
  <div className="flex items-center gap-3 py-16" role="status" aria-label="Loading">
    <span className="relative block h-px w-24 overflow-hidden bg-line">
      <span className="rail-sweep absolute inset-y-0 left-0 w-1/3 bg-ink" />
    </span>
    <span className="label">Loading</span>
  </div>
);

export default Loading;
