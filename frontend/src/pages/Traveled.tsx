import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/Essentials';
import LoadingPage from './LoadingPage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

interface TravelImage {
  url: string;
  width: number;
  height: number;
}

const mosaicClass = (index: number) => {
  if (index % 11 === 0) return 'sm:col-span-2 sm:row-span-2';
  if (index % 7 === 1) return 'sm:col-span-2';
  if (index % 5 === 3) return 'sm:row-span-2';
  return '';
};

const Traveled: React.FC = () => {
  const { folder } = useParams<{ folder: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<TravelImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!folder) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/images?folder=${encodeURIComponent(folder)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.images) {
            setImages(data.images);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch images for folder ${folder}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folder]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-[var(--footer-background)] font-travel text-[var(--text)]">
      <div className="fixed top-0 z-[100] w-full">
        <Navbar />
      </div>

      <main className="relative z-[2] bg-[var(--background)] shadow-[var(--page-shadow)]">
        <section className="relative mx-auto w-full max-w-[1400px] px-5 pb-8 pt-28 md:px-8 md:pt-36">
          <button className="mb-8 flex items-center gap-2 bg-transparent text-left text-sm font-semibold uppercase text-[var(--text-muted)] transition hover:text-[var(--accent)]" onClick={() => navigate('/travel')}>
            <span aria-hidden="true">←</span>
            Back to Travel
          </button>
          <div className="border-y border-[var(--border-strong)] py-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase text-[var(--accent)]">Location</p>
            <h1 className="m-0 font-display text-5xl font-semibold capitalize leading-tight text-[var(--primary)] sm:text-7xl">{folder}</h1>
          </div>
        </section>

        <section className="mx-auto min-h-[50vh] w-full max-w-[1400px] px-5 pb-24 pt-8 md:px-8">
          {images.length === 0 ? (
            <p className="text-center text-xl text-[var(--text-muted)]">No images found for this location.</p>
          ) : (
            <div className="grid auto-rows-[250px] grid-flow-dense grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 sm:gap-5">
              {images.map((img, index) => (
                <div key={index} className={`${mosaicClass(index)} group relative overflow-hidden bg-[var(--surface-soft)] transition duration-300 hover:z-[2] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}>
                  <img className="h-full w-full object-cover brightness-[.9] saturate-[0.9] transition duration-700 group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100" src={img.url} alt={`${folder} memory ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Traveled;
