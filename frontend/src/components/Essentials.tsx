import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
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
    <header className="fixed left-0 top-0 z-[1000] w-full bg-[var(--background)] shadow-[0_2px_10px_var(--shadow-color)]">
      <div className="mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between px-5 md:h-20">
        <button
          className="font-serif text-2xl font-medium text-[var(--primary)]"
          onClick={() => handleNavigate('/')}
          aria-label="Go to home"
        >
          JC
        </button>

        <button
          className="relative z-[1100] bg-transparent text-2xl text-[var(--primary)] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>

        <nav
          className={`${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} fixed inset-0 flex flex-col items-center justify-center gap-8 bg-[var(--background)]/95 backdrop-blur-sm transition duration-300 md:static md:h-auto md:translate-x-0 md:flex-row md:gap-6 md:bg-transparent md:backdrop-blur-none`}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center bg-transparent p-1 text-xl text-[var(--text)] transition hover:rotate-12 hover:text-[var(--accent)]"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-regular fa-sun'}></i>
          </button>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="bg-transparent text-2xl font-medium text-[var(--text)] transition hover:text-[var(--accent)] md:text-base"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 z-[1] bg-[#1a252f] py-8 text-center text-white">
      <div className="mx-auto w-full max-w-[1200px] px-5">
        <div className="mb-5 flex justify-center gap-5">
          <a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-[var(--accent)]" href="https://github.com/joanne-09" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-[var(--accent)]" href="https://www.instagram.com/joanne09._/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-1 hover:bg-[var(--accent)]" href="https://www.linkedin.com/in/%E9%99%B3-%E8%8A%B7%E5%A6%8D-379085357/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Joanne Chen.</p>
      </div>
    </footer>
  );
};
