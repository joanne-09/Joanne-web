import React from 'react';
import type { CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { PageShell } from '../components/PageShell';
import { Container, EmptyState, Img, Reveal } from '../components/ui';
import { useViewNavigate } from '../lib/navigation';
import LoadingPage from './LoadingPage';
import { previewUrl, travelFolderImagesQueryOptions } from '../data/travelQueries';

const revealStyle = (delay: number): CSSProperties => ({ '--reveal-delay': `${delay}ms` } as CSSProperties);

/** Unprefixed so the phone's two-column grid gets the same mosaic variation. */
const mosaicClass = (index: number) => {
  if (index % 11 === 0) return 'col-span-2 row-span-2';
  if (index % 7 === 1) return 'col-span-2';
  if (index % 5 === 3) return 'row-span-2';
  return '';
};

const Traveled: React.FC = () => {
  const { folder } = useParams<{ folder: string }>();
  const navigate = useViewNavigate();
  const query = useQuery({
    ...travelFolderImagesQueryOptions(folder || ''),
    enabled: Boolean(folder),
  });
  const images = query.data || [];

  if (query.isLoading) {
    return <LoadingPage />;
  }

  return (
    <PageShell>
      <Container className="pb-8">
        <Reveal>
          <button
            onClick={() => navigate('/travel')}
            className="group flex items-center gap-2 text-sm text-muted transition-colors duration-[var(--dur)] hover:text-brand"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-[var(--dur)] ease-[var(--ease-out-quint)] group-hover:-translate-x-0.5"
            >
              ←
            </span>
            Back to Travel
          </button>
        </Reveal>

        <div className="mt-10 border-b border-line pb-9">
          <Reveal as="p" className="label">
            Location
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold capitalize leading-[1.04] tracking-[-0.04em] text-ink"
          >
            {folder}
          </Reveal>
          <Reveal as="p" delay={160} className="mt-4 text-sm text-muted">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </Reveal>
        </div>

        <div className="mt-12 pb-8">
          {images.length === 0 ? (
            <EmptyState
              title="Nothing here"
              body="No images were found for this location."
            />
          ) : (
            <div className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[250px] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:gap-5">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`${mosaicClass(index)} clip-reveal group relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface-soft transition-[transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out-quint)] hover:z-[2] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}
                  data-reveal=""
                  style={revealStyle((index % 8) * 70)}
                >
                  <Img
                    className="h-full w-full scale-100 object-cover group-hover:scale-[1.05]"
                    src={previewUrl(img)}
                    srcSet={img.thumbnailUrl && img.url ? `${img.thumbnailUrl} 720w, ${img.url} 1600w` : undefined}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                    alt={`${folder} memory ${index + 1}`}
                    priority={index < 4}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </PageShell>
  );
};

export default Traveled;
