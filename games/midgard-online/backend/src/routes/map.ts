import { Router } from 'express';

export const mapRouter = Router();

// GET /map/cells?x=0&y=0&radius=7
mapRouter.get('/cells', (_req, res) => {
  // TODO: return map cells within radius
  res.status(501).json({ error: 'Not implemented' });
});

// GET /map/cell/:x/:y
mapRouter.get('/cell/:x/:y', (_req, res) => {
  // TODO: return single cell detail
  res.status(501).json({ error: 'Not implemented' });
});
