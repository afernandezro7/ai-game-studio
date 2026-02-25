import { Router } from 'express';

export const alliancesRouter = Router();

// GET /alliances
alliancesRouter.get('/', (_req, res) => {
  // TODO: list all alliances
  res.status(501).json({ error: 'Not implemented' });
});

// GET /alliances/:id
alliancesRouter.get('/:id', (_req, res) => {
  // TODO: alliance detail
  res.status(501).json({ error: 'Not implemented' });
});

// POST /alliances
alliancesRouter.post('/', (_req, res) => {
  // TODO: create new alliance
  res.status(501).json({ error: 'Not implemented' });
});

// POST /alliances/:id/join
alliancesRouter.post('/:id/join', (_req, res) => {
  // TODO: request to join alliance
  res.status(501).json({ error: 'Not implemented' });
});

// POST /alliances/:id/invite
alliancesRouter.post('/:id/invite', (_req, res) => {
  // TODO: invite player to alliance
  res.status(501).json({ error: 'Not implemented' });
});

// PUT /alliances/:id/diplomacy
alliancesRouter.put('/:id/diplomacy', (_req, res) => {
  // TODO: change diplomatic state
  res.status(501).json({ error: 'Not implemented' });
});

// DELETE /alliances/:id/leave
alliancesRouter.delete('/:id/leave', (_req, res) => {
  // TODO: leave alliance
  res.status(501).json({ error: 'Not implemented' });
});
