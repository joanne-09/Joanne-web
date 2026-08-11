import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** The one horizontal measure every page is built on. */
const Container: React.FC<ContainerProps> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[var(--container)] px-5 md:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
