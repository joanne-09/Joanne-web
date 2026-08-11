import Reveal from './Reveal';

interface EmptyStateProps {
  title: string;
  body: string;
}

/** Shared treatment for "nothing here" and "could not load" states. */
const EmptyState: React.FC<EmptyStateProps> = ({ title, body }) => (
  <Reveal className="rounded-[var(--radius-card)] border border-line bg-surface-soft px-6 py-10">
    <p className="label">{title}</p>
    <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-muted">{body}</p>
  </Reveal>
);

export default EmptyState;
