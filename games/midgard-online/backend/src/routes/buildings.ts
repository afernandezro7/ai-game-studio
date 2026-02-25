import { Router } from 'express';

export const buildingsRouter = Router();

// POST /buildings/upgrade
buildingsRouter.post('/upgrade', (_req, res) => {
  // TODO: validate resources, start upgrade timer
  res.status(501).json({ error: 'Not implemented' });
});

// DELETE /buildings/upgrade/:id
buildingsRouter.delete('/upgrade/:id', (_req, res) => {
  // TODO: cancel active construction
  res.status(501).json({ error: 'Not implemented' });
});
