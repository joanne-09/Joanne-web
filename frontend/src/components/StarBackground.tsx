import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  direction: 1 | -1;
}

const getShouldShowStars = () => {
  const explicitTheme = document.documentElement.getAttribute('data-theme');
  if (explicitTheme) return explicitTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const updateTheme = () => setShowStars(getShouldShowStars());
    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showStars) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const createStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.25,
      alpha: Math.random() * 0.75 + 0.12,
      twinkleSpeed: 0.002 + Math.random() * 0.006,
      direction: Math.random() > 0.5 ? 1 : -1,
    });

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.floor((width * height) / 6800);
      stars = Array.from({ length: count }, createStar);
    };

    const draw = () => {
      const styles = getComputedStyle(document.documentElement);
      const starRgb = styles.getPropertyValue('--star-rgb').trim() || '247, 243, 234';
      const starOpacity = Number.parseFloat(styles.getPropertyValue('--star-opacity')) || 0.46;

      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        if (!reducedMotion) {
          star.alpha += star.twinkleSpeed * star.direction;
          if (star.alpha >= 0.95 || star.alpha <= 0.08) star.direction *= -1;
        }

        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${starRgb}, ${star.alpha * starOpacity})`;
        context.fill();
      });

      if (!reducedMotion) animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showStars]);

  if (!showStars) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[4] h-screen w-screen"
      aria-hidden="true"
    />
  );
};

export default StarBackground;
