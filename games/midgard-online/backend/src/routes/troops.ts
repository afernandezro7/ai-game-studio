import { Router } from 'express';

export const troopsRouter = Router();

// POST /troops/train
troopsRouter.post('/train', (_req, res) => {
  // TODO: validate resources + barracks level, enqueue training
  res.status(501).json({ error: 'Not implemented' });
});

// GET /troops/:villageId
troopsRouter.get('/:villageId', (_req, res) => {
  // TODO: return troops stationed in village
  res.status(501).json({ error: 'Not implemented' });
});
