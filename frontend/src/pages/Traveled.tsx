import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Traveled.css';
import { Navbar, Footer } from '../components/Essentials';
import LoadingPage from './LoadingPage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

interface TravelImage {
  url: string;
  width: number;
  height: number;
}

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
    <div className="TravelFolder">
      <div className="navbar-container">
        <Navbar />
      </div>

      <section className="folder-header">
        <button className="back-button" onClick={() => navigate('/travel')}>
          &larr; Back to Travel
        </button>
        <h1 className="folder-title">{folder}</h1>
      </section>

      <section className="folder-gallery">
        {images.length === 0 ? (
          <p className="no-images">No images found for this location.</p>
        ) : (
          <div className="folder-grid">
            {images.map((img, index) => (
              <div key={index} className="folder-item">
                <img src={img.url} alt={`${folder} memory ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Traveled;
