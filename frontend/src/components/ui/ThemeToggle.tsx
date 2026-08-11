import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const readTheme = (): Theme => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Rendered exactly once in the header. The previous navbar inlined this markup
 * twice (mobile and desktop), which meant two independent pieces of state for
 * one setting.
 *
 * The initial value is seeded from the data-theme the inline script in
 * index.html already applied, so there is no flash and no disagreement between
 * the attribute and this component.
 */
const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-line text-ink transition-[border-color,color] duration-[var(--dur)] ease-[var(--ease-out-quint)] hover:border-brand hover:text-brand active:scale-95 md:h-9 md:w-9 ${className}`}
    >
      {/* accent fill blooms out from the centre on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 scale-0 rounded-[var(--radius-full)] bg-[var(--brand-soft)] opacity-0 transition-[transform,opacity] duration-[var(--dur)] ease-[var(--ease-out-quint)] group-hover:scale-100 group-hover:opacity-100"
      />

      <span
        className="relative block h-[18px] w-[18px] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-quint)] group-hover:rotate-[30deg] group-hover:scale-110"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute inset-0 h-[18px] w-[18px] transition-[transform,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out-quint)] ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
          }`}
        >
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2.75v2.4M12 18.85v2.4M4.41 4.41l1.7 1.7M17.89 17.89l1.7 1.7M2.75 12h2.4M18.85 12h2.4M4.41 19.59l1.7-1.7M17.89 6.11l1.7-1.7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute inset-0 h-[18px] w-[18px] transition-[transform,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out-quint)] ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
          }`}
        >
          <path
            d="M20.2 15.1A8.2 8.2 0 0 1 8.9 3.8a8.65 8.65 0 1 0 11.3 11.3Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
