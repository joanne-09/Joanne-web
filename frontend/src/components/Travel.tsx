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
        Nothing here yet!
      </main>
      <Footer />
    </div>
  );
};

export default Travel;