import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full flex-col items-center justify-center bg-[var(--background)]">
      <div className="mb-5 h-14 w-14 animate-spin rounded-full border-[6px] border-[var(--border)] border-t-[var(--accent)]"></div>
      <div className="animate-pulse font-serif text-xl tracking-[0.2em] text-[var(--text)]">Loading...</div>
    </div>
  );
};

export default LoadingPage;
