import React, { useState, useEffect } from 'react';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Essentials.css';

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

  return (
      <header>
        <div className="nav-container container">
          <div className="logo" onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>JC</div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-regular fa-sun'}></i>
              </button>
            </li>
            <li><Link onClick={() => handleNavigate('/')} underline='none'>Home</Link></li>
            <li><Link onClick={() => handleNavigate('/projects')} underline='none'>Projects</Link></li>
            <li><Link onClick={() => handleNavigate('/article')} underline='none'>Article</Link></li>
            <li><Link onClick={() => handleNavigate('/travel')} underline='none'>Travel</Link></li>
          </ul>
        </div>
      </header>
    );
};

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="social-links">
          <a href="https://github.com/joanne-09" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          <a href="https://www.instagram.com/joanne09._/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://www.linkedin.com/in/%E9%99%B3-%E8%8A%B7%E5%A6%8D-379085357/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
        </div>
        <p>&copy; {new Date().getFullYear()} Joanne Chen.</p>
      </div>
    </footer>
  );
};