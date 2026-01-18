import React, { useEffect, useRef, useState } from 'react';
import '../styles/StarBackground.css';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
       const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       const isDataDark = document.documentElement.getAttribute('data-theme') === 'dark';
       setIsDark(isSystemDark || isDataDark);
    };
  
    checkTheme();
  
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
        checkTheme();
    };
    mediaQuery.addEventListener('change', handleSystemChange);
  
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let animationFrameId: number;

    class Star {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      alpha: number = 0;
      twinkleSpeed: number = 0;
      direction: number = 0;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.twinkleSpeed = 0.003 + Math.random() * 0.008;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.alpha += this.twinkleSpeed * this.direction;
        if (this.alpha >= 1 || this.alpha <= 0.1) this.direction *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        context.fill();
      }
    }

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight; // Use viewport height for fixed background
      stars = [];
      const count = Math.floor((width * height) / 5000);
      for (let i = 0; i < count; i++) stars.push(new Star());
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener('resize', resize);

    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  if (!isDark) return null;

  return <canvas ref={canvasRef} id="starCanvas"></canvas>;
};

export default StarBackground;

