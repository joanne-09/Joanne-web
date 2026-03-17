import { Router, Request, Response } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === adminPassword) {
    // In a real production app, return a JWT token or set a session cookie here.
    // For simplicity, we just return a success boolean.
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: 'Incorrect password' });
  }
});

export default router;