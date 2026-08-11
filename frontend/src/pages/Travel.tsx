import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Navbar, Footer } from '../components/Essentials';
import { Container, Img, Marquee, Reveal, SectionHeader } from '../components/ui';
import { useViewNavigate } from '../lib/navigation';
import LoadingPage from './LoadingPage';
import {
  buildTravelRows,
  fallbackTravelImages,
  previewUrl,
  travelFolderImagesQueryOptions,
  travelGalleryImagesQueryOptions,
} from '../data/travelQueries';
import type { TravelImage } from '../data/travelQueries';

const revealStyle = (delay: number): CSSProperties => ({ '--reveal-delay': `${delay}ms` } as CSSProperties);

/**
 * Breaks the uniform grid so the mosaic reads as an archive, not a table.
 *
 * Unprefixed on purpose. These were `sm:`-only, which left the phone with a
 * flat two-column run of identical 162x150 tiles — the "identical card grid"
 * PRODUCT.md lists as an anti-reference. The spans work just as well against
 * the two-column phone grid as against the wider auto-fit one.
 */
const mosaicClass = (index: number) => {
  if (index % 11 === 0) return 'col-span-2 row-span-2';
  if (index % 7 === 1) return 'col-span-2';
  if (index % 5 === 3) return 'row-span-2';
  return '';
};

const Travel: React.FC = () => {
  const navigate = useViewNavigate();
  const queryClient = useQueryClient();

  // The hero is meant to be seen whole, so the bar stays out of it and slides
  // in once the hero is mostly scrolled past.
  const [navHidden, setNavHidden] = useState(true);

  useEffect(() => {
    const onScroll = () => setNavHidden(window.scrollY < window.innerHeight * 0.45);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { data: galleryImages = fallbackTravelImages, isLoading } = useQuery(travelGalleryImagesQueryOptions());
  const { row1Images, row2Images, row3Images } = useMemo(() => buildTravelRows(galleryImages), [galleryImages]);

  const prefetchFolder = (folder?: string) => {
    if (!folder) return;
    void queryClient.prefetchQuery(travelFolderImagesQueryOptions(folder));
  };

  /*
   * Each row renders its images twice (inside Marquee), not four times as
   * before. Two copies is all a -50% translate needs to loop seamlessly, and it
   * halves the number of <img> nodes the hero has to decode.
   */
  const marqueeItems = (images: string[], priority: boolean) =>
    images.map((src, index) => (
      /*
       * One sizing mode at every width: height comes from the viewport, so the
       * three rows plus their two 1.5rem gaps always add up to exactly the
       * screen height, and width follows from the aspect ratio.
       *
       * Only the crop changes. The phone was previously sized off its WIDTH
       * (w-[72vw]) because the 16:10 frame, once driven off height, came out
       * ~425px wide on a 390px screen. But that left the three rows totalling
       * ~555px in a 667px viewport — a band of empty background under the
       * carousel. Squaring the crop to 4:3 on phones solves both: a 390x844
       * screen gets a 265px-tall row at 353px wide, so it fills the height and
       * still sits inside the screen.
       */
      <div
        key={index}
        className="aspect-[4/3] h-[calc((100svh-3rem)/3)] w-auto shrink-0 overflow-hidden rounded-[var(--radius-xl)] bg-surface-soft sm:aspect-[16/10]"
      >
        <Img
          src={src}
          alt=""
          priority={priority && index < 3}
          className="block h-full w-full object-cover"
        />
      </div>
    ));

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <Navbar hidden={navHidden} />

      {/* opaque and above the fixed footer, so it covers it until scrolled past */}
      <main className="relative z-10 bg-bg pb-16">
        {/*
          The marquees are the one looping animation on the site. They are
          content rather than decoration — real photographs, moving slowly —
          and they stop entirely under prefers-reduced-motion.
        */}
        {/*
          No top padding: the navbar is hidden over this hero, so the band is
          free to centre on the window itself. Padding here pushed the whole
          band down instead of centring it.
        */}
        <section className="relative h-svh w-full overflow-hidden">
          {/*
            One shared box for every layer.
            The photo band, the wash and the title all centre on this box, so
            they sit on a single axis. Previously the absolute layers used the
            section's own inset-0 while the title was centred inside the
            padding, which put the word off-centre against the photographs.
          */}
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 flex flex-col justify-center gap-6">
              <Marquee items={marqueeItems(row1Images, true)} duration={64} gapClass="gap-6" />
              <Marquee items={marqueeItems(row2Images, false)} duration={56} reverse gapClass="gap-6" />
              <Marquee items={marqueeItems(row3Images, false)} duration={48} gapClass="gap-6" />
            </div>

            <div className="travel-wash pointer-events-none absolute inset-0" />

            {/*
              Only the word is in flow, so the centring lands on the word
              itself. With the eyebrow in flow above it the block centred but
              the title rode ~13px low against the photo band.
            */}
            <div className="pointer-events-none relative px-5 text-center">
              <Reveal as="p" className="label absolute inset-x-0 bottom-full mb-3">
                Visual archive
              </Reveal>

              <Reveal
                as="h1"
                delay={120}
                className="display-serif block text-[clamp(4.5rem,19vw,12rem)] leading-[0.92] tracking-[-0.02em]"
              >
                Travel
              </Reveal>
            </div>
          </div>
        </section>

        <Container className="py-14 md:py-28">
          <SectionHeader
            label="Gallery"
            title={
              <>
                Places, textures, food, and <span className="serif-accent">memories</span>.
              </>
            }
            lead="Open a set to see everything from that trip."
          />

          {/*
            Two shorter columns on a phone. minmax(280px,1fr) collapsed to a
            single 250px-tall column there, which turned the gallery into a
            very long single-file scroll.
          */}
          <div className="mt-10 grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:mt-12 sm:auto-rows-[250px] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:gap-5">
            {galleryImages.map((img: TravelImage, index) => {
              const folder = img.folder || 'Unknown';

              return (
                <button
                  key={`${folder}-${index}`}
                  className={`${mosaicClass(index)} group relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface-soft text-left transition-[transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out-quint)] hover:z-[2] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}
                  data-reveal=""
                  style={revealStyle((index % 8) * 70)}
                  onFocus={() => prefetchFolder(folder)}
                  onMouseEnter={() => prefetchFolder(folder)}
                  onClick={() => navigate(`/travel/${encodeURIComponent(folder)}`)}
                >
                  <Img
                    className="h-full w-full scale-100 object-cover group-hover:scale-[1.05]"
                    src={previewUrl(img)}
                    srcSet={img.thumbnailUrl && img.url ? `${img.thumbnailUrl} 720w, ${img.url} 1600w` : undefined}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                    alt={`${folder} travel set`}
                  />

                  {/*
                    The folder name is the only thing identifying a tile, and
                    it used to be revealed by hover alone — which a touch
                    device can never do, leaving the phone gallery as a wall of
                    unlabelled thumbnails. It is always on below `sm`, and
                    still reveals on hover from `sm` up.
                  */}
                  <span
                    className="absolute inset-0 flex items-end p-3 opacity-100 transition-opacity duration-[var(--dur)] sm:p-5 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
                    style={{ background: 'var(--scrim)' }}
                  >
                    <span className="translate-y-0 text-base font-semibold capitalize leading-tight text-white transition-transform duration-[var(--dur)] ease-[var(--ease-out-quint)] sm:translate-y-2 sm:text-2xl sm:group-hover:translate-y-0">
                      {folder}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Travel;
