import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

import postsRouter from './routes/posts';
import projectsRouter from './routes/projects';
import imagesRouter from './routes/images';
import authRouter from './routes/auth';

app.use(cors({
  origin: ['https://joanne-09.github.io', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main App API Routes
app.use('/api/posts', postsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/images', imagesRouter);
app.use('/api/auth', authRouter);

// Static fallback for images
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;