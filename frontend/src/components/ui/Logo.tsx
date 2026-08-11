interface LogoProps {
  className?: string;
  /** Decorative by default — the button that wraps it carries the label. */
  title?: string;
}

/**
 * The identity mark: a constructed JC monogram.
 *
 * Drawn rather than set. The previous badge was Instrument Serif "JC" typed
 * into a bordered circle, which is the single most common personal-portfolio
 * logo there is — the "template-like" register PRODUCT.md warns against. This
 * is built on a 32-unit grid instead: both letters share one stroke weight and
 * one radius family (the J's hook at 4.6, the C at 7.2), so they read as a
 * single object rather than two glyphs sitting next to each other.
 *
 * The J takes the brand accent and the C inherits currentColor, which keeps the
 * mark to the one chromatic note the palette allows, lets the C follow the
 * surrounding ink, and makes the whole mark resolve to brand on hover.
 *
 * Letter order is load-bearing: J before C. Earlier constructions that nested
 * or interlocked the pair read as "CJ".
 */
const Logo: React.FC<LogoProps> = ({ className = '', title }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role={title ? 'img' : 'presentation'}
    aria-hidden={title ? undefined : true}
  >
    {title ? <title>{title}</title> : null}

    {/* J — stem and hook */}
    <path d="M9.7 7.6V17.2A4.6 4.6 0 0 1 5.1 21.8" stroke="var(--brand)" strokeWidth="2.5" />

    {/* C — open to the right, terminals cut at 45° */}
    <path d="M24.79 21.09A7.2 7.2 0 1 1 24.79 10.91" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export default Logo;
