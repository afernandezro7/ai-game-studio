import { Router } from 'express';

export const authRouter = Router();

// POST /auth/register
authRouter.post('/register', (_req, res) => {
  // TODO: implement registration with bcrypt + JWT
  res.status(501).json({ error: 'Not implemented' });
});

// POST /auth/login
authRouter.post('/login', (_req, res) => {
  // TODO: implement login with bcrypt + JWT
  res.status(501).json({ error: 'Not implemented' });
});

// GET /auth/me
authRouter.get('/me', (_req, res) => {
  // TODO: implement JWT-protected user info
  res.status(501).json({ error: 'Not implemented' });
});
