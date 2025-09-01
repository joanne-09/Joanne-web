// filepath: c:\Users\User\Documents\school\CV\react-portfolio\src\App.tsx
import { useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'; // Import your stylesheet

import Home from './components/Home';
import Article from './components/Article';
import ArticleDetail from './components/Post';
import Projects from './components/Projects';
import Travel from './components/Travel';

// Declare EmailJS at the window level
declare global {
  interface Window {
    emailjs: any;
  }
}

// Smooth Scroll Hook
const useSmoothScroll = () => {
  useEffect(() => {
    const handleScroll = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          event.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            const headerOffset = 80; // Adjust as per your fixed header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleScroll);
    return () => document.removeEventListener('click', handleScroll);
  }, []);
};


// --- Main App Component ---
function App() {
  useSmoothScroll(); // Initialize smooth scrolling

  return (
    <div className="App">
      <Router basename='/Joanne-web'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/travel" element={<Travel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;