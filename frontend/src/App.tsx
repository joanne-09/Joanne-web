import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Article from './pages/Article';
import ArticleDetail from './components/Post';
import Projects from './pages/Projects';
import Travel from './pages/Travel';
import Traveled from './pages/Traveled';
import Admin from './pages/Admin';
import { DataProvider } from './contexts/DataProvider';
import ScrollRail from './components/ui/ScrollRail';
import { queryClient } from './lib/queryClient';

// Declare EmailJS at the window level
declare global {
  interface Window {
    emailjs?: {
      init: (publicKey: string) => void;
      send: (serviceId: string, templateId: string, params: Record<string, string>) => Promise<unknown>;
    };
  }
}

/**
 * Adds .is-revealed to [data-reveal] elements as they enter the viewport.
 *
 * The MutationObserver is what makes this work with data that arrives after
 * first paint — project and travel lists render in later, and their reveal
 * targets have to be picked up without a full rescan on every mutation.
 */
const useScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealElements = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        element.classList.add('is-revealed');
      });
    };

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealElements();
      return;
    }

    const observed = new WeakSet<Element>();
    let scanFrame = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.14,
    });

    const observeRevealElement = (element: Element) => {
      if (!(element instanceof HTMLElement)) return;
      if (observed.has(element) || element.classList.contains('is-revealed')) return;

      observed.add(element);
      observer.observe(element);
    };

    const scan = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeRevealElement);
    };

    const mutationObserver = new MutationObserver((mutations) => {
      window.cancelAnimationFrame(scanFrame);
      scanFrame = window.requestAnimationFrame(() => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;

            if (node.matches('[data-reveal]')) {
              observeRevealElement(node);
            }

            scan(node);
          });
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      window.cancelAnimationFrame(scanFrame);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname, location.search]);
};

const useRouteScrollReset = () => {
  const location = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [location.pathname]);
};

const RouteEffects = () => {
  useRouteScrollReset();
  useScrollReveal();
  return null;
};

const AppContent = () => (
  <Router>
    <RouteEffects />
    <ScrollRail />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article" element={<Article />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/travel" element={<Travel />} />
      <Route path="/travel/:folder" element={<Traveled />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </Router>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
