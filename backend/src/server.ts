import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3001; // Backend runs on a different port

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

let articles = [
  { id: '1', slug: 'my-first-article', title: 'My First Backend Article', content: 'This content comes from the backend!', author: 'Joanne', publicationDate: new Date(), summary: 'A quick summary.' },
  { id: '2', slug: 'another-backend-post', title: 'Exploring Backend Development', content: 'Learning how to set up a simple API.', author: 'Joanne', publicationDate: new Date(), summary: 'Another brief look.' },
];

// API Endpoints
app.get('/api/articles', (req: Request, res: Response) => {
  res.send(articles);
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});