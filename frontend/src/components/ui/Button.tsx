import { useRef } from 'react';
import type { ReactNode } from 'react';

import { useMagnetic } from '../../lib/motion';

type Variant = 'primary' | 'ghost';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/*
 * transform is deliberately NOT transitioned here. useMagnetic rewrites it
 * every animation frame, and transitioning it made each frame ease over
 * --dur, so the button visibly lagged and rubber-banded behind the cursor.
 * Untransitioned it tracks exactly; the spring-back on exit is handled by
 * .magnetic-release instead.
 */
const base =
  'group inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] px-5 py-2.5 text-sm font-medium ' +
  'transition-[background-color,border-color,color] duration-[var(--dur)] ease-[var(--ease-out-quint)] ' +
  'disabled:cursor-not-allowed disabled:opacity-55';

/**
 * Two weights only. Without an accent colour, "primary" is carried by an
 * inverted fill rather than a hue.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-ink text-invert hover:bg-ink/85',
  ghost: 'border border-line text-ink hover:border-line-strong hover:bg-[var(--hover-wash)]',
};

const Button: React.FC<ButtonProps> = (props) => {
  const { children, variant = 'primary', className = '' } = props;
  const ref = useRef<HTMLElement>(null);
  useMagnetic(ref, 6);

  const classes = `${base} ${variants[variant]} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const external = props.external ?? /^https?:/.test(props.href);

    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={props.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  const { onClick, type = 'button', disabled } = props as ButtonAsButton;

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
