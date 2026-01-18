import React, { useEffect, useState } from 'react';
import '../styles/Travel.css';
import { Navbar, Footer } from '../components/Essentials';
import LoadingPage from './LoadingPage';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// fallback temp images
const fallbackImages = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
    "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=600",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600"
];

const Travel: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [row1Images, setRow1Images] = useState<string[]>([]);
  const [row2Images, setRow2Images] = useState<string[]>(fallbackImages.slice(4, 8));
  const [row3Images, setRow3Images] = useState<string[]>(fallbackImages.slice(8, 12));
  const [galleryImages, setGalleryImages] = useState<string[]>(fallbackImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch images from server
    const fetchImages = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/images/random`);
            if (res.ok) {
                const data = await res.json();
                if (data.images && data.images.length > 0) {
                    const urls: string[] = data.images.map((img: any) => img.url);
                    
                    // Shuffle array
                    for (let i = urls.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [urls[i], urls[j]] = [urls[j], urls[i]];
                    }

                    setGalleryImages(urls);

                    // Distribute to rows
                    if (urls.length > 0) {
                        const chunkSize = Math.ceil(urls.length / 3);
                        setRow1Images(urls.slice(0, chunkSize));
                        setRow2Images(urls.slice(chunkSize, chunkSize * 2));
                        setRow3Images(urls.slice(chunkSize * 2));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch travel images", error);
        } finally {
            setLoading(false);
        }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        // Show navbar after scrolling down slightly (e.g., 100px)
        if (window.scrollY > 100) {
            setShowNavbar(true);
        } else {
            setShowNavbar(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Basic theme setup
    document.documentElement.setAttribute('data-theme', 'dark');

    // Clean up
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  // Helper to duplicate images for marquee effect
  const renderMarqueeRow = (images: string[]) => {
      return (
          <div className="marquee-inner"> 
            {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                    {images.map((src, index) => (
                        <div key={`${i}-${index}`} className="marquee-card">
                            <img src={src} className="marquee-image" alt="travel location" />
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
    <div className="Travel">
      {/* Navbar */}
      <div style={{
          position: 'fixed', 
          top: 0, 
          width: '100vw', 
          zIndex: 100,
          opacity: showNavbar ? 1 : 0,
          visibility: showNavbar ? 'visible' : 'hidden',
          transition: 'all 0.3s ease-in-out'
      }}>
           <Navbar />
      </div>

      {/* Hero Section */}
      <section className="hero">
          <div className="hero-title-container">
              <p className="hero-title">
                  Travel
              </p>
          </div>

          <div className="background-gallery">
              {/* Row 1 */}
              <div className="marquee-wrapper">
                  <div className="marquee-content row-slow">
                       {renderMarqueeRow(row1Images)}
                  </div>
              </div>
              {/* Row 2 */}
              <div className="marquee-wrapper">
                  <div className="marquee-content row-reverse">
                       {renderMarqueeRow(row2Images)}
                  </div>
              </div>
              {/* Row 3 */}
              <div className="marquee-wrapper">
                  <div className="marquee-content row-fast">
                       {renderMarqueeRow(row3Images)}
                  </div>
              </div>
          </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          <h2 className="section-title">Visual Layout</h2>
          <div className="gallery-grid">
            {galleryImages.map((src, index) => (
                <div key={index} className="gallery-item">
                    <img 
                        src={src} 
                        alt={`Memories ${index + 1}`} 
                        loading="lazy"
                    />
                      <div className="overlay"></div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Travel;