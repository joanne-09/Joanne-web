import { useState } from 'react';
import type { CSSProperties } from 'react';

interface ImgProps {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** First-screen images should pass true so they are not deprioritised. */
  priority?: boolean;
}

/**
 * Image that fades itself in once decoded.
 *
 * Nothing on the site blocks rendering on image downloads any more, so images
 * arrive while the layout is already on screen. Without this they would pop in
 * hard; with it they resolve softly into a placeholder of the right size.
 */
const Img: React.FC<ImgProps> = ({
  src,
  alt,
  srcSet,
  sizes,
  className = '',
  style,
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-[opacity,filter,transform] duration-[var(--dur-slower)] ease-[var(--ease-out-quint)] ${
        loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
      }`}
      style={style}
    />
  );
};

export default Img;
