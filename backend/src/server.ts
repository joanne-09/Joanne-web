import express, { Request, Response } from 'express';
import db from './db'; // Imports work the same way

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// --- API ENDPOINTS ---

// Define a type for what a Post should look like
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// GET /api/posts - Fetch all posts
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const sql = "SELECT * FROM posts ORDER BY created_at DESC";
    const [rows] = await db.query(sql);
    res.json(rows as Post[]); // Assert that the rows are of type Post[]
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts - Create a new post
app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const sql = "INSERT INTO posts (title, content) VALUES (?, ?)";
    const [result] = await db.query(sql, [title, content]);
    
    // The result from an INSERT query has a specific shape
    const insertResult = result as any;

    res.status(201).json({
      message: 'Post created successfully',
      postId: insertResult.insertId
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});