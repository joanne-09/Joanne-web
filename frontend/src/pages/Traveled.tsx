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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#1a252f] font-travel text-[var(--primary)]">
      <div className="fixed top-0 z-[100] w-full">
        <Navbar />
      </div>

      <main className="relative z-[3] bg-[var(--background)]">
        <section className="relative mx-auto w-full max-w-[1400px] px-8 pb-8 pt-24 text-center">
          <button className="mb-4 block bg-transparent text-left font-travel text-base text-[var(--primary)] opacity-70 transition hover:opacity-100 sm:absolute sm:left-8 sm:top-32 sm:mb-0" onClick={() => navigate('/travel')}>
            &larr; Back to Travel
          </button>
          <h1 className="m-0 font-display text-5xl font-light capitalize tracking-[0.05em] text-[var(--primary)] sm:text-6xl">{folder}</h1>
        </section>

        <section className="mx-auto min-h-[50vh] w-full max-w-[1400px] px-8 pb-24 pt-8">
          {images.length === 0 ? (
            <p className="text-center text-xl opacity-70">No images found for this location.</p>
          ) : (
            <div className="grid auto-rows-[250px] grid-flow-dense grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 sm:gap-6">
              {images.map((img, index) => (
                <div key={index} className={`${mosaicClass(index)} group relative overflow-hidden rounded transition duration-300 hover:z-[2] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}>
                  <img className="h-full w-full object-cover brightness-[.85] transition duration-700 group-hover:scale-110 group-hover:brightness-100" src={img.url} alt={`${folder} memory ${index + 1}`} loading="lazy" />
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
