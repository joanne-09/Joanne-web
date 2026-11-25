import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Drives `active` from hover/focus, or from visibility when there is no hover. */
const useHoverOrInView = <T extends HTMLElement>(ref: RefObject<T | null>): boolean => {
  const [hovered, setHovered] = useState(false);
  const [seen, setSeen] = useState(false);
  const [canHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches,
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (canHover) {
      const on = () => setHovered(true);
      const off = () => setHovered(false);
      const onFocusOut = (event: FocusEvent) => {
        if (!element.contains(event.relatedTarget as Node | null)) setHovered(false);
      };
      element.addEventListener('mouseenter', on);
      element.addEventListener('mouseleave', off);
      element.addEventListener('focusin', on);
      element.addEventListener('focusout', onFocusOut);
      return () => {
        element.removeEventListener('mouseenter', on);
        element.removeEventListener('mouseleave', off);
        element.removeEventListener('focusin', on);
        element.removeEventListener('focusout', onFocusOut);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, canHover]);

  return canHover ? hovered : seen;
};

export default useHoverOrInView;
