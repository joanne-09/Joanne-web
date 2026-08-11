import { queryOptions } from '@tanstack/react-query';
import { shouldUseLocalPreview } from './localPreview';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const MINUTE = 60 * 1000;

export interface TravelImage {
  url: string;
  folder?: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  width?: number;
  height?: number;
}

interface TravelImageResponse {
  url: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  folder?: string;
  width?: number;
  height?: number;
}

interface TravelImagesResponse {
  images?: TravelImageResponse[];
}

const localImage = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

export const fallbackTravelImages: TravelImage[] = [
  { url: localImage('profile.jpg'), folder: 'Archive' },
  { url: localImage('bird_sound.jpg'), folder: 'Sound' },
  { url: localImage('FPGA_implementation.jpg'), folder: 'Lab' },
  { url: localImage('chatroom_project.png'), folder: 'Chatroom' },
  { url: localImage('beat_game.png'), folder: 'Beat' },
  { url: localImage('mahjong_project.jpg'), folder: 'Mahjong' },
  { url: localImage('monopoly_project.png'), folder: 'Monopoly' },
  { url: localImage('greenfoot-project.png'), folder: 'Greenfoot' },
  { url: localImage('lexiaid.png'), folder: 'LexiAid' },
  { url: localImage('web_mario.png'), folder: 'Mario' },
  { url: localImage('profile.jpg'), folder: 'Memory' },
  { url: localImage('bird_sound.jpg'), folder: 'Field' },
];

export const localTravelDetailImages: TravelImage[] = fallbackTravelImages.slice(0, 6).map((image) => ({
  ...image,
  height: 900,
  width: 1200,
}));

export const previewUrl = (image: TravelImage) => image.thumbnailUrl || image.url;

export const preloadTravelImages = (urls: string[]) => {
  return Promise.all(urls.map((src) => (
    new Promise<void>((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve();
      image.onerror = () => resolve();
    })
  )));
};

export const buildTravelRows = (images: TravelImage[]) => {
  const heroImages = images.slice(0, 18);
  const urls = heroImages.map(previewUrl);
  const chunkSize = Math.max(1, Math.ceil(urls.length / 3));

  return {
    row1Images: urls.slice(0, chunkSize),
    row2Images: urls.slice(chunkSize, chunkSize * 2),
    row3Images: urls.slice(chunkSize * 2),
  };
};

const toTravelImage = (img: TravelImageResponse): TravelImage => ({
  url: img.url,
  thumbnailUrl: img.thumbnailUrl,
  originalUrl: img.originalUrl,
  width: img.width,
  height: img.height,
  folder: img.folder || 'Unknown',
});

const shuffleImages = (images: TravelImage[]) => {
  const shuffled = [...images];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const fetchJson = async <T>(url: string, signal?: AbortSignal) => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const travelGalleryImagesQueryOptions = () => queryOptions({
  queryKey: ['travel', 'random-images'],
  queryFn: async ({ signal }) => {
    /*
     * Preloading is fired but deliberately NOT awaited.
     *
     * Awaiting it held the query in isLoading until six full images had
     * downloaded, so the whole Travel route sat on the loading screen waiting
     * on the network. The URLs are returned immediately and each <img> fades
     * itself in as it arrives; the warm cache is a bonus, not a gate.
     */
    if (shouldUseLocalPreview(BACKEND_URL)) {
      void preloadTravelImages(fallbackTravelImages.slice(0, 6).map(previewUrl));
      return fallbackTravelImages;
    }

    try {
      const data = await fetchJson<TravelImagesResponse>(`${BACKEND_URL}/api/images/random`, signal);
      const images = data.images?.length
        ? shuffleImages(data.images.map(toTravelImage))
        : fallbackTravelImages;

      void preloadTravelImages(images.slice(0, 6).map(previewUrl));
      return images;
    } catch (error) {
      console.error('Failed to fetch travel images', error);
      void preloadTravelImages(fallbackTravelImages.slice(0, 6).map(previewUrl));
      return fallbackTravelImages;
    }
  },
  staleTime: 5 * MINUTE,
});

export const travelFolderImagesQueryOptions = (folder: string) => queryOptions({
  queryKey: ['travel', 'folder-images', folder],
  queryFn: async ({ signal }) => {
    if (shouldUseLocalPreview(BACKEND_URL)) {
      return localTravelDetailImages;
    }

    try {
      const data = await fetchJson<TravelImagesResponse>(
        `${BACKEND_URL}/api/images?folder=${encodeURIComponent(folder)}`,
        signal,
      );

      return data.images?.map(toTravelImage) || [];
    } catch (error) {
      console.error(`Failed to fetch images for folder ${folder}`, error);
      return [];
    }
  },
  staleTime: 5 * MINUTE,
});
