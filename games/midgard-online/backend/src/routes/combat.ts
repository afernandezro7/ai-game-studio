import { Router } from 'express';

export const combatRouter = Router();

// POST /combat/send
combatRouter.post('/send', (_req, res) => {
  // TODO: validate troops, calculate travel time, create mission
  res.status(501).json({ error: 'Not implemented' });
});

// GET /combat/missions
combatRouter.get('/missions', (_req, res) => {
  // TODO: return active missions for authenticated user
  res.status(501).json({ error: 'Not implemented' });
});

// GET /combat/reports
combatRouter.get('/reports', (_req, res) => {
  // TODO: return battle report history
  res.status(501).json({ error: 'Not implemented' });
});

// GET /combat/reports/:id
combatRouter.get('/reports/:id', (_req, res) => {
  // TODO: return single battle report detail
  res.status(501).json({ error: 'Not implemented' });
});
