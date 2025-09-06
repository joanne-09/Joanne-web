import React, { useEffect } from 'react';
import '../styles/Travel.css';

import { Navbar, Footer } from './Essentials';

const Travel: React.FC = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    // Clean up the attribute when the component unmounts
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className="Travel">
      <Navbar />
      <main>
        <div className="container">
          <h1 className="page-title">Travel</h1>
          <p>This page is under construction. Please check back later!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Travel;