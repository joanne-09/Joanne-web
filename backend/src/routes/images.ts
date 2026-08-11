import { Router, Request, Response } from 'express';
import NodeCache from 'node-cache';
import cloudinary from '../cloudinary';

const router = Router();
const galleryCache = new NodeCache({ stdTTL: 3600 }); // Cache gallery data for 1 hour
const API_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const DETAIL_TRANSFORM = 'f_auto,q_auto:eco,c_limit,w_1600,dpr_auto';
const THUMBNAIL_TRANSFORM = 'f_auto,q_auto:eco,c_fill,g_auto,w_720,h_480,dpr_auto';

const setGalleryCacheHeaders = (res: Response) => {
  res.set('Cache-Control', API_CACHE_CONTROL);
};

const withCloudinaryTransform = (url: string, transform: string) => {
  const uploadMarker = '/image/upload/';

  if (!url || !url.includes(uploadMarker)) {
    return url;
  }

  return url.replace(uploadMarker, `${uploadMarker}${transform}/`);
};

const toImageResponse = (img: any, folder?: string) => {
  const originalUrl = img.secure_url;

  return {
    public_id: img.public_id,
    originalUrl,
    url: withCloudinaryTransform(originalUrl, DETAIL_TRANSFORM),
    thumbnailUrl: withCloudinaryTransform(originalUrl, THUMBNAIL_TRANSFORM),
    width: img.width,
    height: img.height,
    ...(folder ? { folder } : {}),
  };
};

// GET /api/images - Fetch images from a specific folder
router.get('/', async (req: Request, res: Response) => {
  // path: /api/images?folder=travel
  const folder = req.query.folder as string;
  
  if (!folder) {
    return res.status(400).json({ error: 'Folder parameter is required' });
  }

  const cacheKey = `gallery_${folder}`;

  const cachedData = galleryCache.get(cacheKey);
  if (cachedData) {
    console.log(`Serving ${folder} from cache`);
    setGalleryCacheHeaders(res);
    return res.json(cachedData);
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:Joanne-web/${folder}/`)
      .max_results(50)
      .execute();

    const responseData = {
      images: result.resources.map((img: any) => toImageResponse(img)),
      next_cursor: result.next_cursor,
    };

    galleryCache.set(cacheKey, responseData, 3600); // cache the response
    setGalleryCacheHeaders(res);
    res.json(responseData);
  } catch (err) {
    console.error(`Error fetching images from folder ${folder}:`, err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// GET /api/images/random - Fetch random images for travel page
router.get('/random', async (req: Request, res: Response) => {
  const cacheKey = 'random_images_cache';
  
  const cachedData = galleryCache.get(cacheKey);
  if (cachedData) {
    console.log("Serving random images from cache");
    setGalleryCacheHeaders(res);
    return res.json(cachedData);
  }

  try {
    const rootFolder = 'Joanne-web';
    
    // Get subfolders within Joanne-web
    let folders: any[] = [];
    try {
      const subFoldersResponse = await cloudinary.api.sub_folders(rootFolder);
      folders = subFoldersResponse.folders;
    } catch (error: any) {
        console.warn(`Could not fetch subfolders for ${rootFolder}:`, error.message);
        
        try {
            const fallbackResult = await cloudinary.api.resources({
                type: 'upload',
                prefix: `${rootFolder}/`, 
                max_results: 15
            });
             const images = fallbackResult.resources.map((img: any) => toImageResponse(img, rootFolder));
            setGalleryCacheHeaders(res);
            return res.json({ images });
        } catch (innerErr: any) {
             console.error("Fallback fetch failed:", innerErr);
             throw innerErr;
        }
    }

    if (!folders || folders.length === 0) {
      console.log('No subfolders found.');
      setGalleryCacheHeaders(res);
      return res.json({ images: [] });
    }

    const travelFolders = folders;
    console.log(`Processing folders: ${travelFolders.map((f: any) => f.name).join(', ')}`);

    const allImages: any[] = [];
    for (const folder of travelFolders) {
      try {
        const folderPath = `${rootFolder}/${folder.name}/`;
        console.log(`Fetching from: ${folderPath}`);
        
        const result = await cloudinary.search
          .expression(`folder:${folderPath}`)
          .max_results(20)
          .execute();

        const folderImages = result.resources.map((img: any) => toImageResponse(img, folder.name));
        
        console.log(`  - Found ${folderImages.length} images`);
        allImages.push(...folderImages);
      } catch (err: any) {
        console.error(`Failed to fetch images for folder ${folder.name}:`, err.message);
      }
    }

    console.log(`Total images returning: ${allImages.length}`);

    galleryCache.set(cacheKey, { images: allImages }, 3600);
    setGalleryCacheHeaders(res);
    res.json({ images: allImages });
  } catch (err: any) {
    console.error("Error fetching random images:", err);
    res.status(500).json({ error: `Failed to fetch random images: ${err.message}` });
  }
});

export default router;
