import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Single source of truth for whether motion is allowed. Every animated
 * component gates on this, so the user's OS setting is honoured in JS as well
 * as in the CSS kill switch in motion.css.
 */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

/**
 * Tracks the pointer inside an element and writes its position to --px / --py,
 * which the .spot class reads to position its radial highlight.
 *
 * Writes are batched into a single animation frame so a fast pointer cannot
 * queue up more style recalcs than the browser paints.
 */
export const useSpotlight = <T extends HTMLElement>(ref: RefObject<T | null>): void => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--px', `${event.clientX - rect.left}px`);
        element.style.setProperty('--py', `${event.clientY - rect.top}px`);
      });
    };

    element.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', onPointerMove);
    };
  }, [ref, reduced]);
};

/**
 * Pulls an element toward the pointer while it is nearby, and releases it on
 * exit. The displacement is capped at `strength` px so it reads as weight
 * rather than as the control running away from the cursor.
 */
export const useMagnetic = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 8,
): void => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    // Coarse pointers have no hover, so this would only ever fire mid-tap.
    if (!window.matchMedia('(hover: hover)').matches) return;

    let frame = 0;
    let releaseTimer = 0;

    const onPointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        // Tracking must be untransitioned or the element lags the cursor.
        window.clearTimeout(releaseTimer);
        element.classList.remove('magnetic-release');

        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);

        element.style.transform = `translate3d(${(dx / rect.width) * strength * 2}px, ${
          (dy / rect.height) * strength * 2
        }px, 0)`;
      });
    };

    const onLeave = () => {
      window.cancelAnimationFrame(frame);

      // Ease back to rest, then drop the class so tracking stays instant.
      element.classList.add('magnetic-release');
      element.style.transform = '';

      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        element.classList.remove('magnetic-release');
      }, 440);
    };

    element.addEventListener('pointermove', onPointerMove, { passive: true });
    element.addEventListener('pointerleave', onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', onLeave);
      element.classList.remove('magnetic-release');
      element.style.transform = '';
    };
  }, [ref, reduced, strength]);
};

/**
 * Drives --scroll-y (px scrolled past the element's top) and --scroll-p (0..1
 * across one viewport) on an element, for scroll-linked parallax and fade.
 */
export const useScrollParallax = <T extends HTMLElement>(ref: RefObject<T | null>): void => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    let frame = 0;

    const update = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      element.style.setProperty('--scroll-p', `${progress}`);
      element.style.setProperty('--scroll-y', `${window.scrollY}`);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ref, reduced]);
};

/**
 * Fraction of the document scrolled, 0..1, for the progress rail.
 */
export const useScrollProgress = (): number => {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame.current);
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
};
