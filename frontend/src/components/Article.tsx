import React from 'react';
import '../styles/Article.css';

import { Navigation, Footer } from './Essentials';

const Header: React.FC = () => {
  return (
    <header>
      <div className="nav-container container">
        <div className="logo">JC</div>
        <ul className="nav-links">
          <li><Navigation /></li>
        </ul>
      </div>
    </header>
  );
};

const Article: React.FC = () => {
  return (
    <div className="Article">
      <Header />
      <main></main>
      <Footer />
    </div>
  );
};

export default Article;