import React from 'react';
import '../styles/Travel.css';

import { Navbar, Footer } from './Essentials';

const Travel: React.FC = () => {
    return (
      <div className="Travel">
        <Navbar theme='dark' />
          <main>
            Nothing here yet!
          </main>
        <Footer />
      </div>
    );
};

export default Travel;