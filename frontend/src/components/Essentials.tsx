import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './Icons';

const ThemeIcon: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <svg
        className={`${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'} absolute inset-0 h-5 w-5 transition duration-500 ease-out`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2.75v2.4M12 18.85v2.4M4.41 4.41l1.7 1.7M17.89 17.89l1.7 1.7M2.75 12h2.4M18.85 12h2.4M4.41 19.59l1.7-1.7M17.89 6.11l1.7-1.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
      <svg
        className={`${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'} absolute inset-0 h-5 w-5 transition duration-500 ease-out`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M20.2 15.1A8.2 8.2 0 0 1 8.9 3.8a8.65 8.65 0 1 0 11.3 11.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </span>
  );
};

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Article', path: '/article' },
    { label: 'Travel', path: '/travel' },
  ];

  return (
    <header className="fixed left-0 top-0 z-[1000] w-full border-b border-[var(--nav-border)] bg-[var(--nav-background)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-5 md:h-[76px]">
        <button
          className="group flex items-center gap-3 bg-transparent text-left text-[var(--primary)]"
          onClick={() => handleNavigate('/')}
          aria-label="Go to home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] font-serif text-lg font-semibold transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            JC
          </span>
          <span className="hidden text-sm font-semibold uppercase md:inline">Joanne Chen</span>
        </button>

        <button
          className="relative z-[1100] flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full bg-transparent text-xl text-[var(--primary)] transition hover:bg-[var(--button-hover-background)] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`${isMenuOpen ? 'translate-y-[5px] rotate-45' : ''} h-px w-5 bg-current transition`}></span>
          <span className={`${isMenuOpen ? 'opacity-0' : ''} h-px w-5 bg-current transition`}></span>
          <span className={`${isMenuOpen ? '-translate-y-[5px] -rotate-45' : ''} h-px w-5 bg-current transition`}></span>
        </button>

        <nav
          className={`${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} fixed inset-0 z-[1050] flex h-screen w-screen flex-col items-center justify-start gap-5 bg-[var(--background)] pt-28 text-[var(--text)] transition duration-300 md:static md:z-auto md:h-auto md:w-auto md:translate-x-0 md:flex-row md:justify-center md:gap-2 md:bg-transparent md:pt-0`}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`${isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'} rounded-full bg-transparent px-4 py-2 text-2xl font-semibold transition hover:bg-[var(--button-hover-background)] hover:text-[var(--accent)] md:text-sm`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={toggleTheme}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-lg text-[var(--text)] transition duration-300 hover:rotate-12 hover:bg-[var(--button-hover-background)] hover:text-[var(--accent)]"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <ThemeIcon theme={theme} />
          </button>
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 z-0 min-h-[300px] bg-[var(--footer-background)] px-5 py-10 text-[var(--footer-text)]">
      <div className="mx-auto flex min-h-[220px] w-full max-w-[1180px] flex-col justify-end gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-4xl font-semibold leading-tight">Joanne Chen</p>
          <p className="mt-3 max-w-[360px] text-sm leading-7 text-[var(--footer-muted)]">
            Computer science student building small, considered systems across AI, software, and visual storytelling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--footer-link-background)] text-[var(--footer-text)] transition hover:-translate-y-1 hover:bg-[var(--footer-link-hover)]" href="https://github.com/joanne-09" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon className="h-5 w-5" />
          </a>
          <a className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--footer-link-background)] text-[var(--footer-text)] transition hover:-translate-y-1 hover:bg-[var(--footer-link-hover)]" href="https://www.instagram.com/joanne09._/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--footer-link-background)] text-[var(--footer-text)] transition hover:-translate-y-1 hover:bg-[var(--footer-link-hover)]" href="https://www.linkedin.com/in/%E9%99%B3-%E8%8A%B7%E5%A6%8D-379085357/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon className="h-5 w-5" />
          </a>
        </div>

        <p className="text-sm text-[var(--footer-muted)]">&copy; {new Date().getFullYear()} Joanne Chen.</p>
      </div>
    </footer>
  );
};
