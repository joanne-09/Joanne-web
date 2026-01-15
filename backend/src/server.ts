import express, { Request, Response } from 'express';
import NodeCache from 'node-cache';
import path from 'path';
import db from './db';
import cloudinary from './cloudinary';
import cors from 'cors';

import type { Post, Project } from '@joanne-web/shared';

const app = express();
const PORT = process.env.PORT || 3001;

const galleryCache = new NodeCache({ stdTTL: 3600 }); // Cache gallery data for 1 hour

app.use(cors());
app.use(express.json());

// ====== POSTS API ======
// GET /api/posts - Fetch all posts
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id - Fetch a single post by ID
app.get('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching post ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// ====== TRAVEL IMAGES API ======
// GET /api/images/:folder - Fetch images from a specific folder
app.get('/api/images', async (req: Request, res: Response) => {
  // path: /api/images?folder=travel
  const folder = req.query.folder as string;
  const cacheKey = `gallery_${folder}`;

  const cachedData = galleryCache.get(cacheKey);
  if (cachedData) {
    console.log(`Serving ${folder} from cache`);
    return res.json(cachedData);
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder ? `Joanne-web/${folder}/` : 'Joanne-web/',
      max_results: 100,
      next_cursor: req.query.cursor as string | undefined,
    });

    const responseData = {
      images: result.resources.map((img: any) => ({
        public_id: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
      })),
      next_cursor: result.next_cursor,
    };

    galleryCache.set(cacheKey, responseData); // cache the response
    res.json(responseData);
  } catch (err) {
    console.error(`Error fetching images from folder ${folder}:`, err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// GET /api/images/random - Fetch random images for travel page
app.get('/api/images/random', async (req: Request, res: Response) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
      console.error("Cloudinary credentials missing");
      return res.status(500).json({ error: 'Server configuration error: Cloudinary credentials missing' });
    }

    const rootFolder = 'Joanne-web';
    
    // Get subfolders within Joanne-web
    let folders: any[] = [];
    try {
      const subFoldersResponse = await cloudinary.api.sub_folders(rootFolder);
      folders = subFoldersResponse.folders;
    } catch (error: any) {
        // If folder not found or other API error, log it.
        // It might be that 'Joanne-web' doesn't exist as a folder entity.
        console.warn(`Could not fetch subfolders for ${rootFolder}:`, error.message);
        
        // Fallback: try to fetch resources from rootFolder directly
        try {
            const fallbackResult = await cloudinary.api.resources({
                type: 'upload',
                prefix: `${rootFolder}/`, 
                max_results: 30 
            });
             const images = fallbackResult.resources.map((img: any) => ({
                public_id: img.public_id,
                url: img.secure_url,
                width: img.width,
                height: img.height,
                folder: rootFolder
            }));
            return res.json({ images });
        } catch (innerErr: any) {
             console.error("Fallback fetch failed:", innerErr);
             throw innerErr;
        }
    }

    if (!folders || folders.length === 0) {
      return res.json({ images: [] });
    }

    // Limit folders to avoid timeout/rate limits (e.g., take first 10 or random 5)
    // We'll take up to 6 folders to ensure we have enough variety without overloading
    const selectedFolders = folders.slice(0, 6);

    // Fetch images from selected folders sequentially to avoid concurrency limits
    const allImages = [];
    for (const folder of selectedFolders) {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: `${rootFolder}/${folder.name}/`, 
                max_results: 6
            });
            
            const folderImages = result.resources.map((img: any) => ({
                public_id: img.public_id,
                url: img.secure_url,
                width: img.width,
                height: img.height,
                folder: folder.name
            }));
            allImages.push(...folderImages);
        } catch (err) {
            console.error(`Failed to fetch images for folder ${folder.name}`, err);
            // Continue to next folder
        }
    }

    res.json({ images: allImages });
  } catch (err: any) {
    console.error("Error fetching random images:", err);
    res.status(500).json({ error: `Failed to fetch random images: ${err.message}` });
  }
});

// ====== PROJECTS API =====
// GET /api/projects - Sample endpoint to fetch projects (static data for now)
app.get('/api/projects', async (req: Request, res: Response) => {
  try{
    const { rows } = await db.query('SELECT * FROM projects');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Fetch a single project by ID
app.get('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching project ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/posts - Create a new post
app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // The Neon driver uses template literals for parameterized queries
    const result = await db.query(
      `INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id`,
      [title, content]
    );

    res.status(201).json({
      message: 'Post created successfully',
      postId: result.rows[0].id
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});