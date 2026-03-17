import { Router, Request, Response } from 'express';
import db from '../db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../frontend/public/images');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const title = req.body.title || 'project';
    const firstWord = title.trim().split(/\s+/)[0] || 'project';
    const ext = path.extname(file.originalname);
    cb(null, `${firstWord}${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/projects/upload-image - Upload an image for a project
router.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  // The client expects the URL/path to the image
  // Since it is saved in frontend/public/images/, the URL from frontend's perspective is /images/filename
  res.json({ imageUrl: `/images/${req.file.filename}` });
});

// GET /api/projects - Sample endpoint to fetch projects (static data for now)
router.get('/', async (req: Request, res: Response) => {
  try{
    const { rows } = await db.query('SELECT * FROM projects');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Fetch a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
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

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ghLink, imgsrc, imgalt, imgstyle, title, type, description, role, tech } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    await db.query(
      `UPDATE projects 
       SET "ghLink" = $1, imgsrc = $2, imgalt = $3, imgstyle = $4, title = $5, type = $6, description = $7, role = $8, tech = $9
       WHERE id = $10`,
      [ghLink, imgsrc, imgalt, imgstyle ? JSON.stringify(imgstyle) : null, title, type, description, role, tech ? JSON.stringify(tech) : null, id]
    );

    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// POST /api/projects/ - Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, ghLink, imgsrc, imgalt, imgstyle, title, type, description, role, tech } = req.body;

    if (!id || !title) {
      return res.status(400).json({ error: 'ID and title are required' });
    }
    
    const result = await db.query(
      `INSERT INTO projects (id, "ghLink", imgsrc, imgalt, imgstyle, title, type, description, role, tech) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [id, ghLink, imgsrc, imgalt, imgstyle ? JSON.stringify(imgstyle) : null, title, type, description, role, tech ? JSON.stringify(tech) : null]
    );

    res.status(201).json({
      message: 'Project created successfully',
      projectId: result.rows[0].id
    });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;