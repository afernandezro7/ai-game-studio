import { Router } from 'express';

export const villagesRouter = Router();

// GET /villages/:id
villagesRouter.get('/:id', (_req, res) => {
  // TODO: return full village state
  res.status(501).json({ error: 'Not implemented' });
});

// GET /villages/:id/resources
villagesRouter.get('/:id/resources', (_req, res) => {
  // TODO: return resources with production tick applied
  res.status(501).json({ error: 'Not implemented' });
});
