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

const fallbackImages: TravelImage[] = [
    { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600", folder: "Unknown" },
    { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", folder: "Unknown" }
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
          <div className="flex gap-6"> 
            {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                    {images.map((src, index) => (
                        <div key={`${i}-${index}`} className="w-80 shrink-0 overflow-hidden rounded-xl">
                            <img src={src} className="block h-[180px] w-full object-cover brightness-50" alt="travel location" />
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#1a252f] font-travel text-[var(--primary)]">
      <div className={`${showNavbar ? 'visible opacity-100' : 'invisible opacity-0'} fixed top-0 z-[100] w-full transition duration-300`}>
        <Navbar />
      </div>

      <main className="relative z-[3] bg-[var(--background)]">
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-transparent">
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center opacity-100">
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-6 animate-[marquee-left_100s_linear_infinite]">
                       {renderMarqueeRow(row1Images)}
                  </div>
              </div>
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-6 animate-[marquee-right_90s_linear_infinite]">
                       {renderMarqueeRow(row2Images)}
                  </div>
              </div>
              <div className="relative w-full overflow-hidden py-2.5">
                  <div className="flex w-max gap-6 animate-[marquee-left_80s_linear_infinite]">
                       {renderMarqueeRow(row3Images)}
                  </div>
              </div>
          </div>

          <div className="pointer-events-none relative z-50 text-center">
              <p className="font-display text-8xl font-semibold italic leading-none tracking-normal text-[var(--primary)] drop-shadow-[0_0_50px_rgba(0,0,0,0.9)] md:text-[12rem]">
                  Travel
              </p>
          </div>
        </section>

        <section className="relative z-20 mx-auto w-full max-w-[1400px] px-8 py-24">
          <h2 className="mb-16 text-center font-display text-5xl font-light tracking-[0.05em] text-[var(--primary)]">Visual Layout</h2>
          <div className="grid auto-rows-[250px] grid-flow-dense grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 sm:gap-6">
            {galleryImages.map((img, index) => (
                <button 
                    key={`${img.folder}-${index}`} 
                    className={`${mosaicClass(index)} group relative overflow-hidden rounded text-left transition duration-300 hover:z-[2] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                    onClick={() => navigate(`/travel/${img.folder}`)}
                >
                    <img 
                        className="h-full w-full object-cover brightness-[.85] transition duration-700 group-hover:scale-110 group-hover:brightness-100"
                        src={img.url} 
                        alt={`Memories ${index + 1}`} 
                        loading="lazy"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.6)_100%)] opacity-0 transition group-hover:opacity-100">
                      <span className="translate-y-5 font-display text-3xl font-semibold capitalize tracking-[0.05em] text-[var(--thirdary)] drop-shadow transition group-hover:translate-y-0">{img.folder}</span>
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
