import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

import { useViewNavigate } from '../lib/navigation';
import { GithubIcon, InstagramIcon, LinkedinIcon } from './Icons';
import ThemeToggle from './ui/ThemeToggle';
import Container from './ui/Container';
import Logo from './ui/Logo';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Article', path: '/article' },
  { label: 'Travel', path: '/travel' },
];

const isActivePath = (current: string, path: string) =>
  path === '/' ? current === '/' : current.startsWith(path);

interface NavbarProps {
  /**
   * Slides the bar out of view — used over the travel hero. It still reveals
   * itself on focus-within, so keyboard users are never left tabbing through
   * an invisible header.
   */
  hidden?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hidden = false }) => {
  const navigate = useViewNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const activePath = navItems.find((item) => isActivePath(location.pathname, item.path))?.path ?? null;
  const targetPath = hovered ?? activePath;

  const [underline, setUnderline] = useState({ x: 0, w: 0, o: 0 });

  const measure = useCallback(() => {
    const element = targetPath ? itemRefs.current[targetPath] : null;

    if (!element) {
      setUnderline((prev) => ({ ...prev, o: 0 }));
      return;
    }

    setUnderline({ x: element.offsetLeft, w: element.offsetWidth, o: 1 });
  }, [targetPath]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);

    // Webfonts land after first paint and change the text metrics, so the
    // underline has to be re-measured once they are ready.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // A route change from anywhere (including the mobile sheet) closes the sheet.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // The sheet covers the page, so the page behind it should not scroll.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      /*
       * Solid on phones. The translucent + blurred treatment let page content
       * read straight through the bar at small sizes, and backdrop-filter is
       * unreliable on mobile browsers anyway. Blur is kept from md up.
       */
      className={`fixed inset-x-0 top-0 z-[1000] border-b border-line bg-[var(--nav-overlay)] transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out-quint)] focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 md:bg-[var(--nav-background)] md:backdrop-blur-xl ${
        hidden && !isMenuOpen ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <Container className="flex h-[var(--nav-h)] items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          aria-label="Go to home"
          /*
           * -m-1 p-1 grows the hit area to 44px without moving the mark or
           * changing the bar's optical alignment: the padding is transparent
           * and the negative margin cancels it out in the flex row.
           */
          className="group -m-1 flex shrink-0 items-center gap-2.5 p-1 text-ink"
        >
          {/*
            The mark carries its own enclosing form, so it needs no badge ring
            around it. 36px on touch, 32px once there is a pointer — the header
            controls were all under the comfortable tap minimum on a phone.
          */}
          <Logo className="h-9 w-9 shrink-0 transition-colors duration-[var(--dur)] ease-[var(--ease-out-quint)] group-hover:text-brand md:h-8 md:w-8" />
          <span className="hidden text-sm font-medium tracking-tight sm:inline">Joanne Chen</span>
        </button>

        <div
          onMouseLeave={() => setHovered(null)}
          className="relative hidden h-full items-center md:flex"
        >
          {navItems.map((item) => {
            const active = activePath === item.path;

            return (
              <button
                key={item.path}
                ref={(node) => {
                  itemRefs.current[item.path] = node;
                }}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHovered(item.path)}
                onFocus={() => setHovered(item.path)}
                onBlur={() => setHovered(null)}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-2 text-sm transition-colors duration-[var(--dur)] ${
                  active ? 'font-medium text-brand' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <span
            className="nav-underline"
            aria-hidden="true"
            style={
              {
                '--underline-x': `${underline.x}px`,
                '--underline-w': `${underline.w}px`,
                '--underline-o': underline.o,
              } as CSSProperties
            }
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[var(--radius-full)] border border-line text-ink transition-colors duration-[var(--dur)] hover:border-line-strong md:hidden"
          >
            <span
              className={`h-px w-4 bg-current transition-transform duration-[var(--dur)] ease-[var(--ease-out-quint)] ${
                isMenuOpen ? 'translate-y-[3px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-4 bg-current transition-transform duration-[var(--dur)] ease-[var(--ease-out-quint)] ${
                isMenuOpen ? '-translate-y-[3px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </Container>

      {/*
        Mobile sheet.

        The height is set explicitly rather than by stretching top-to-bottom.
        The header carries a translate utility, and a `translate` other than
        `none` makes an element the containing block for its position: fixed
        descendants — so `top: var(--nav-h); bottom: 0` resolved inside the
        64px-tall header and computed to a height of ZERO. The background
        painted nothing while the links overflowed, which is why the menu
        rendered as transparent text sitting on top of the page.

        Sizing from 100svh keeps it correct whichever element ends up being the
        containing block, and svh (not vh) means the mobile browser chrome
        cannot push the last link off-screen.
      */}
      <div
        className={`fixed inset-x-0 top-[var(--nav-h)] z-[1050] h-[calc(100svh-var(--nav-h))] overflow-y-auto overscroll-contain bg-[var(--nav-overlay)] transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out-quint)] md:hidden ${
          isMenuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/*
          The links tighten when the viewport is short. At the display size
          below, four items at py-5/text-3xl need 332px but a landscape phone
          leaves only 311px under the header — "Travel" sat below the fold with
          nothing to indicate it was there.
        */}
        <Container className="flex flex-col pt-6 [@media(max-height:520px)]:pt-3">
          {navItems.map((item) => {
            const active = activePath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                tabIndex={isMenuOpen ? 0 : -1}
                className={`flex items-baseline justify-between border-b border-line py-5 text-left text-3xl font-medium tracking-tight transition-colors [@media(max-height:520px)]:py-3 [@media(max-height:520px)]:text-2xl ${
                  active ? 'text-brand' : 'text-muted'
                }`}
              >
                {item.label}
                {active ? <span className="label">current</span> : null}
              </button>
            );
          })}
        </Container>
      </div>
    </header>
  );
};

const socials = [
  { href: 'https://github.com/joanne-09', label: 'GitHub', Icon: GithubIcon },
  { href: 'https://www.instagram.com/joanne09._/', label: 'Instagram', Icon: InstagramIcon },
  {
    href: 'https://www.linkedin.com/in/%E9%99%B3-%E8%8A%B7%E5%A6%8D-379085357/',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
];

/**
 * Footer that lies behind the page and is uncovered by scrolling.
 *
 * The footer itself is fixed to the bottom of the viewport at a lower stacking
 * level than <main>, which is opaque and sits above it. The spacer rendered
 * ahead of it adds exactly the footer's own height to the document, so there is
 * something to scroll through while main slides up and off it.
 *
 * The spacer is measured rather than hardcoded because the footer reflows
 * between the mobile and desktop layouts.
 */
export const Footer: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => setHeight(element.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div aria-hidden="true" style={{ height }} />

      <footer
        ref={ref}
        className="fixed inset-x-0 bottom-0 z-0 border-t border-line bg-surface-soft py-14"
      >
        <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[38ch]">
            <p className="text-2xl font-semibold tracking-tight text-ink">
              Joanne <span className="serif-accent">Chen</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Computer science student building small, considered systems across AI, software, and
              visual storytelling.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-line text-ink transition-[transform,border-color,background-color,color] duration-[var(--dur)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-brand hover:bg-[var(--brand-soft)] hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <p className="text-xs text-subtle">&copy; {new Date().getFullYear()} Joanne Chen</p>
          </div>
        </Container>
      </footer>
    </>
  );
};
