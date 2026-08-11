import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * navigate() with the View Transitions API opted in.
 *
 * React Router falls back to a plain navigation where the browser lacks
 * support, so callers never have to feature-detect.
 */
export const useViewNavigate = () => {
  const navigate = useNavigate();

  return useCallback(
    (to: string) => navigate(to, { viewTransition: true }),
    [navigate],
  );
};

/**
 * Scrolls to an in-page section by id.
 *
 * The app uses HashRouter, so a plain href="#contact" would be parsed as a
 * route rather than an anchor. Sections are reached through this instead.
 * scroll-padding-top in base.css keeps the target clear of the fixed header.
 */
export const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
};
