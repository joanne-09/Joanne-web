import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-[var(--radius-full)] border border-line bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted ${className}`}
  >
    {children}
  </span>
);

export default Tag;
