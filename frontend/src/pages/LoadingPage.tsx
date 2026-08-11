import React from 'react';

/** Full-page loading state, used before a route has any content to show. */
const LoadingPage: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex min-h-screen w-full items-center justify-center bg-bg px-5 text-ink">
    <div className="flex flex-col items-center gap-6" role="status" aria-live="polite" aria-label="Loading portfolio">
      <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] border border-line-strong font-serif text-lg">
        JC
      </span>

      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-medium tracking-[-0.02em]">
          Loading <span className="serif-accent">portfolio</span>
        </p>

        <span className="relative block h-px w-40 overflow-hidden bg-line">
          <span className="rail-sweep absolute inset-y-0 left-0 w-1/3 bg-ink" />
        </span>
      </div>
    </div>
  </div>
);

export default LoadingPage;
