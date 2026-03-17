import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/posts/tags - Fetch all unique tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT name FROM tags ORDER BY name ASC');
    res.json(rows.map(row => row.name));
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// GET /api/posts - Fetch all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, tag } = req.query;
    
    let query = `
      SELECT 
        p.*,
        COALESCE(
          array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), 
          '{}'
        ) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`p.title ILIKE $${params.length}`);
    }

    if (tag) {
      params.push(tag);
      conditions.push(`
        EXISTS (
          SELECT 1 FROM post_tags pt2 
          JOIN tags t2 ON pt2.tag_id = t2.id 
          WHERE pt2.post_id = p.id AND t2.name = $${params.length}
        )
      `);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id - Fetch a single post by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT 
        p.*,
        COALESCE(
          array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), 
          '{}'
        ) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching post ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('BEGIN');
    await db.query('DELETE FROM post_tags WHERE post_id = $1', [id]);
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    await db.query('COMMIT');
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error("Error deleting post:", err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// PUT /api/posts/:id - Update a post
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    await db.query('BEGIN');

    await db.query(
      `UPDATE posts SET title = $1, content = $2 WHERE id = $3`,
      [title, content, id]
    );

    // Update tags
    await db.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        const tagName = tag.trim();
        if (!tagName) continue;
        
        let tagRes = await db.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        let tagId;
        
        if (tagRes.rows.length === 0) {
          const newTagRes = await db.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tagName]);
          tagId = newTagRes.rows[0].id;
        } else {
          tagId = tagRes.rows[0].id;
        }
        
        await db.query('INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)', [id, tagId]);
      }
    }

    await db.query('COMMIT');
    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error("Error updating post:", err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// POST /api/posts/create - Create a new post
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    await db.query('BEGIN');

    const result = await db.query(
      `INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id`,
      [title, content]
    );
    const postId = result.rows[0].id;

    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        const tagName = tag.trim();
        if (!tagName) continue;
        
        let tagRes = await db.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        let tagId;
        
        if (tagRes.rows.length === 0) {
          const newTagRes = await db.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tagName]);
          tagId = newTagRes.rows[0].id;
        } else {
          tagId = tagRes.rows[0].id;
        }
        
        await db.query('INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)', [postId, tagId]);
      }
    }

    await db.query('COMMIT');

    res.status(201).json({
      message: 'Post created successfully',
      postId,
      tags
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error("Error creating post:", err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE /api/posts/tags/:name - Delete a tag
router.delete('/tags/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tagRes = await db.query('SELECT id FROM tags WHERE name = $1', [name]);
    if (tagRes.rows.length === 0) {
      return res.status(404).json({error: 'Tag not found'});
    }
    const tagId = tagRes.rows[0].id;
    await db.query('DELETE FROM post_tags WHERE tag_id = $1', [tagId]);
    await db.query('DELETE FROM tags WHERE id = $1', [tagId]);
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

export default router;