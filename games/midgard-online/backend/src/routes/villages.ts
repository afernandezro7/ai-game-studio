import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import {
  getVillageState,
  getVillageResources,
} from "../services/villageService.js";

export const villagesRouter = Router();

// ── GET /villages/:id ────────────────────────────────────────
// Returns full village state (resources + buildings).
// Resources: public basic info, detailed resources only to owner.

villagesRouter.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as AuthRequest).user;
      const id = req.params["id"] as string;

      const state = await getVillageState(id);

      if (!state) {
        res.status(404).json({ error: "Village not found" });
        return;
      }

      // Travian pattern: public basic info, private resources (owner only)
      if (state.ownerId !== userId) {
        res.json({
          village: {
            id: state.id,
            name: state.name,
            mapX: state.mapX,
            mapY: state.mapY,
            population: state.population,
            createdAt: state.createdAt,
          },
        });
        return;
      }

      res.json({ village: state });
    } catch (err) {
      next(err);
    }
  },
);

// ── GET /villages/:id/resources ──────────────────────────────
// Returns current resources with lazy tick applied (owner only).

villagesRouter.get(
  "/:id/resources",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as AuthRequest).user;
      const id = req.params["id"] as string;

      // Verify ownership
      const village = await prisma.village.findUnique({
        where: { id },
        select: { ownerId: true },
      });

      if (!village) {
        res.status(404).json({ error: "Village not found" });
        return;
      }

      if (village.ownerId !== userId) {
        res.status(403).json({ error: "Forbidden — not your village" });
        return;
      }

      const resources = await getVillageResources(id);

      if (!resources) {
        res.status(404).json({ error: "Resources not found" });
        return;
      }

      res.json({ resources });
    } catch (err) {
      next(err);
    }
  },
);

// ── PATCH /villages/:id/name ─────────────────────────────────
// Rename village (owner only).

const renameSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(50, "Name too long (max 50 chars)")
    .trim(),
});

villagesRouter.patch(
  "/:id/name",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as AuthRequest).user;
      const id = req.params["id"] as string;

      const parsed = renameSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: parsed.error.errors[0]?.message ?? "Validation error",
        });
        return;
      }

      const village = await prisma.village.findUnique({
        where: { id },
        select: { ownerId: true },
      });

      if (!village) {
        res.status(404).json({ error: "Village not found" });
        return;
      }

      if (village.ownerId !== userId) {
        res.status(403).json({ error: "Forbidden — not your village" });
        return;
      }

      const updated = await prisma.village.update({
        where: { id },
        data: { name: parsed.data.name },
        select: { id: true, name: true },
      });

      res.json({ village: updated });
    } catch (err) {
      next(err);
    }
  },
);
