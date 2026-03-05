import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { startUpgrade, cancelUpgrade } from "../services/buildingService.js";

export const buildingsRouter = Router();

// ── POST /buildings/upgrade ───────────────────────────────────
// Start a building upgrade. Deducts resources and sets timer.

const upgradeBodySchema = z.object({
  villageId: z.string().uuid(),
  buildingType: z.string().min(1).max(30),
});

buildingsRouter.post(
  "/upgrade",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = upgradeBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res
          .status(400)
          .json({ error: "Invalid request", details: parsed.error.errors });
        return;
      }

      const { userId } = (req as AuthRequest).user;
      const { villageId, buildingType } = parsed.data;

      const result = await startUpgrade(villageId, buildingType, userId);
      res.status(201).json(result);
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.startsWith("Insufficient") ||
          err.message.startsWith("Requires") ||
          err.message.startsWith("Another building") ||
          err.message.startsWith("Building '") ||
          err.message.startsWith("Unknown building"))
      ) {
        res.status(422).json({ error: err.message });
        return;
      }
      if (err instanceof Error && err.message === "Forbidden") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (err instanceof Error && err.message === "Village not found") {
        res.status(404).json({ error: "Village not found" });
        return;
      }
      next(err);
    }
  },
);

// ── DELETE /buildings/upgrade/:id ────────────────────────────
// Cancel an active construction. Refunds 100% of resources.

buildingsRouter.delete(
  "/upgrade/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildingId = req.params["id"] as string;
      const { userId } = (req as AuthRequest).user;

      const result = await cancelUpgrade(buildingId, userId);
      res.json(result);
    } catch (err) {
      if (err instanceof Error && err.message === "Building not found") {
        res.status(404).json({ error: "Building not found" });
        return;
      }
      if (
        err instanceof Error &&
        err.message === "Building is not currently upgrading"
      ) {
        res.status(422).json({ error: err.message });
        return;
      }
      if (err instanceof Error && err.message === "Forbidden") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      next(err);
    }
  },
);
