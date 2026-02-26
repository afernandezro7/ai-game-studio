import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

export const authRouter = Router();

// ── Zod schemas ──────────────────────────────────────────────

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Helpers ──────────────────────────────────────────────────

function signToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function sanitizeUser(user: {
  id: string;
  username: string;
  email: string;
  runes: number;
  createdAt: Date;
}) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    runes: user.runes,
    createdAt: user.createdAt,
  };
}

// ── POST /auth/register ──────────────────────────────────────

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Validation error" });
    return;
  }

  const { username, email, password } = parsed.data;

  // Check uniqueness
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { username: true, email: true },
  });

  if (existing) {
    const field = existing.username === username ? "Username" : "Email";
    res.status(409).json({ error: `${field} is already taken` });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, email, passwordHash, runes: 50 },
    select: {
      id: true,
      username: true,
      email: true,
      runes: true,
      createdAt: true,
    },
  });

  const token = signToken(user.id, user.username);

  res.status(201).json({ token, user: sanitizeUser(user) });
});

// ── POST /auth/login ─────────────────────────────────────────

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Validation error" });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      runes: true,
      createdAt: true,
      passwordHash: true,
    },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const token = signToken(user.id, user.username);

  const { passwordHash: _ph, ...safeUser } = user;
  res.json({ token, user: sanitizeUser(safeUser) });
});

// ── GET /auth/me ─────────────────────────────────────────────

authRouter.get("/me", authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;

  const user = await prisma.user.findUnique({
    where: { id: authReq.user.userId },
    select: {
      id: true,
      username: true,
      email: true,
      runes: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
});
