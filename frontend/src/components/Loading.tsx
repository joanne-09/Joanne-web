import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]"></div>
    </div>
  );
};

export default Loading;
