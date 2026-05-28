import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Essentials';
import LoadingPage from './LoadingPage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

interface TravelImage {
  url: string;
  folder: string;
}

interface TravelImageResponse {
  url: string;
  folder?: string;
}

const localImage = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const fallbackImages: TravelImage[] = [
    { url: localImage("profile.jpg"), folder: "Archive" },
    { url: localImage("bird_sound.jpg"), folder: "Sound" },
    { url: localImage("FPGA_implementation.jpg"), folder: "Lab" },
    { url: localImage("chatroom_project.png"), folder: "Chatroom" },
    { url: localImage("beat_game.png"), folder: "Beat" },
    { url: localImage("mahjong_project.jpg"), folder: "Mahjong" },
    { url: localImage("monopoly_project.png"), folder: "Monopoly" },
    { url: localImage("greenfoot-project.png"), folder: "Greenfoot" },
    { url: localImage("lexiaid.png"), folder: "LexiAid" },
    { url: localImage("web_mario.png"), folder: "Mario" },
    { url: localImage("profile.jpg"), folder: "Memory" },
    { url: localImage("bird_sound.jpg"), folder: "Field" }
];

const mosaicClass = (index: number) => {
  if (index % 11 === 0) return 'sm:col-span-2 sm:row-span-2';
  if (index % 7 === 1) return 'sm:col-span-2';
  if (index % 5 === 3) return 'sm:row-span-2';
  return '';
};

const Travel: React.FC = () => {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const [row1Images, setRow1Images] = useState<string[]>(fallbackImages.slice(0, 4).map(img => img.url));
  const [row2Images, setRow2Images] = useState<string[]>(fallbackImages.slice(4, 8).map(img => img.url));
  const [row3Images, setRow3Images] = useState<string[]>(fallbackImages.slice(8, 12).map(img => img.url));
  const [galleryImages, setGalleryImages] = useState<TravelImage[]>(fallbackImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
        let imagesToPreload = fallbackImages;
        try {
            const res = await fetch(`${BACKEND_URL}/api/images/random`);
            if (res.ok) {
                const data = await res.json();
                if (data.images && data.images.length > 0) {
                    const images: TravelImage[] = data.images.map((img: TravelImageResponse) => ({
                        url: img.url,
                        folder: img.folder || 'Unknown'
                    }));

                    for (let i = images.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [images[i], images[j]] = [images[j], images[i]];
                    }

                    setGalleryImages(images);

                    if (images.length > 0) {
                        const urls = images.map(img => img.url);
                        const chunkSize = Math.ceil(urls.length / 3);
                        setRow1Images(urls.slice(0, chunkSize));
                        setRow2Images(urls.slice(chunkSize, chunkSize * 2));
                        setRow3Images(urls.slice(chunkSize * 2));
                    }
                    imagesToPreload = images;
                }
            }
        } catch (error) {
            console.error("Failed to fetch travel images", error);
        } finally {
            const imagePromises = imagesToPreload.map(img => {
                return new Promise((resolve) => {
                    const image = new Image();
                    image.src = img.url;
                    image.onload = resolve;
                    image.onerror = resolve;
                });
            });
            await Promise.all(imagePromises);
            setLoading(false);
        }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        setShowNavbar(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const renderMarqueeRow = (images: string[]) => {
      return (
          <div className="flex gap-5">
            {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                    {images.map((src, index) => (
                        <div key={`${i}-${index}`} className="w-80 shrink-0 overflow-hidden">
                            <img src={src} className="block h-[180px] w-full object-cover opacity-60 saturate-[0.75]" alt="travel location" />
                        </div>
                    ))}
                </React.Fragment>
            ))}
          </div>
      );
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-[var(--footer-background)] font-travel text-[var(--text)]">
      <div className={`${showNavbar ? 'visible opacity-100' : 'invisible opacity-0'} fixed top-0 z-[100] w-full transition duration-300`}>
        <Navbar />
      </div>

      <main className="relative z-[2] bg-[var(--background)] shadow-[var(--page-shadow)]">
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-transparent">
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center opacity-100">
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-5 animate-[marquee-left_100s_linear_infinite]">
                       {renderMarqueeRow(row1Images)}
                  </div>
              </div>
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-5 animate-[marquee-right_90s_linear_infinite]">
                       {renderMarqueeRow(row2Images)}
                  </div>
              </div>
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-5 animate-[marquee-left_80s_linear_infinite]">
                       {renderMarqueeRow(row3Images)}
                  </div>
              </div>
          </div>

          <div className="absolute inset-0 z-20 bg-[var(--image-scrim)]"></div>

          <div className="pointer-events-none relative z-50 px-5 text-center">
              <p className="font-display text-7xl font-semibold italic leading-none text-[var(--primary)] md:text-[12rem]">
                  Travel
              </p>
          </div>
        </section>

        <section className="relative z-20 mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 grid gap-5 md:grid-cols-[0.7fr_1fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[var(--accent)]">Gallery</p>
              <h2 className="font-serif text-4xl font-semibold text-[var(--primary)] md:text-5xl">Gallery</h2>
            </div>
          </div>

          <div className="grid auto-rows-[250px] grid-flow-dense grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 sm:gap-5">
            {galleryImages.map((img, index) => (
                <button
                    key={`${img.folder}-${index}`}
                    className={`${mosaicClass(index)} group relative overflow-hidden bg-[var(--surface-soft)] text-left transition duration-300 hover:z-[2] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}
                    onClick={() => navigate(`/travel/${img.folder}`)}
                >
                    <img
                        className="h-full w-full object-cover brightness-[.86] saturate-[0.86] transition duration-700 group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100"
                        src={img.url}
                        alt={`Memories ${index + 1}`}
                        loading="lazy"
                    />
                    <span className="absolute inset-0 flex items-end bg-[var(--image-scrim)] p-5 opacity-0 transition group-hover:opacity-100">
                      <span className="translate-y-3 font-serif text-3xl font-semibold capitalize text-[var(--primary)] transition group-hover:translate-y-0">{img.folder}</span>
                    </span>
                </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Travel;
