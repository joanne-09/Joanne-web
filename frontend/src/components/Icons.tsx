import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const strokeIconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
} as const;

export const MailIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeIconProps} {...props}>
    <path d="M4.75 6.75h14.5v10.5H4.75z" />
    <path d="m5.5 7.5 6.5 5 6.5-5" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeIconProps} {...props}>
    <path d="M8.2 5.15 10 8.9l-1.9 1.35c.8 1.68 1.97 2.85 3.65 3.65L13.1 12l3.75 1.8-.45 3.05c-.12.82-.82 1.4-1.65 1.35-5.08-.28-8.67-3.87-8.95-8.95-.05-.83.53-1.53 1.35-1.65z" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeIconProps} {...props}>
    <path d="M18.25 10.2c0 4.55-6.25 9.55-6.25 9.55s-6.25-5-6.25-9.55a6.25 6.25 0 1 1 12.5 0Z" />
    <circle cx="12" cy="10.2" r="2.1" />
  </svg>
);

export const GithubIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M12 2.75a9.25 9.25 0 0 0-2.93 18.03c.46.08.63-.2.63-.45v-1.58c-2.57.56-3.11-1.1-3.11-1.1-.42-1.07-1.03-1.36-1.03-1.36-.84-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.83 1.41 2.17 1 2.7.77.08-.6.32-1 .58-1.23-2.05-.23-4.2-1.03-4.2-4.56 0-1.01.36-1.83.95-2.47-.1-.24-.41-1.18.09-2.44 0 0 .78-.25 2.54.95a8.79 8.79 0 0 1 4.62 0c1.76-1.2 2.53-.95 2.53-.95.51 1.26.19 2.2.1 2.44.6.64.95 1.46.95 2.47 0 3.54-2.16 4.32-4.21 4.55.33.29.62.85.62 1.71v2.38c0 .25.17.54.64.45A9.25 9.25 0 0 0 12 2.75Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeIconProps} {...props}>
    <rect x="5" y="5" width="14" height="14" rx="4" />
    <circle cx="12" cy="12" r="3.25" />
    <path d="M16.35 7.65h.01" />
  </svg>
);

export const LinkedinIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M6.9 8.9H4.4v10.2h2.5zM5.65 4.4a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9ZM19.6 13.25c0-2.75-1.46-4.03-3.42-4.03a2.94 2.94 0 0 0-2.66 1.46h-.04V8.9h-2.4v10.2h2.5v-5.05c0-1.33.25-2.62 1.9-2.62 1.62 0 1.64 1.52 1.64 2.7v4.97h2.48z" />
  </svg>
);
