import type { Request, Response, NextFunction } from 'express';

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
export function authMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  // TODO: implement JWT verification
  // 1. Extract token from Authorization: Bearer <token>
  // 2. Verify with jwt.verify(token, env.JWT_SECRET)
  // 3. Attach decoded payload to req.user
  // 4. Call next() or respond 401
  next();
}
