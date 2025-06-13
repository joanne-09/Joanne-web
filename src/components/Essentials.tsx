import React, { useState } from 'react';
import { Link, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Essentials.css';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <Link
        id="nav-button"
        aria-controls={open ? 'nav-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Pages
      </Link>
      <Menu
        id="nav-menu"
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'nav-button',
        }}
      >
        <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
        <MenuItem onClick={() => navigate('/article')}>Article</MenuItem>
        <MenuItem onClick={() => navigate('/projects')}>Projects</MenuItem>
        <MenuItem onClick={() => navigate('/travel')}>Travel</MenuItem>
      </Menu>
    </>
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