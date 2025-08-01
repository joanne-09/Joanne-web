import React from 'react';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Essentials.css';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
      <header>
        <div className="nav-container container">
          <div className="logo">JC</div>
          <ul className="nav-links">
            <Link onClick={() => navigate('/')}>Home</Link>
            <Link onClick={() => navigate('/article')}>Article</Link>
            <Link onClick={() => navigate('/projects')}>Projects</Link>
            <Link onClick={() => navigate('/travel')}>Travel</Link>
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