import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// ── AuthRequest — extends Request with decoded JWT payload ────

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from Authorization header.
 * Attaches decoded user payload to req as AuthRequest.
 * Returns 401 JSON { error: "Unauthorized" } if missing/invalid.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    (req as AuthRequest).user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
