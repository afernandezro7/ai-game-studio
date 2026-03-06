import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/database.js";
import type { JwtPayload } from "../middleware/auth.js";

// ── Event payload types ───────────────────────────────────────

export interface ResourcesTickPayload {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
}

export interface BuildingCompletePayload {
  buildingType: string;
  newLevel: number;
}

export interface JoinVillagePayload {
  villageId: string;
}

// ── Socket augmented data ─────────────────────────────────────

interface SocketData {
  user: JwtPayload;
}

let io: Server | null = null;

/**
 * Setup Socket.io server attached to the HTTP server.
 *
 * Auth: JWT token in socket.handshake.auth.token — rejected if invalid.
 * Rooms: `village:<id>` — client emits `join_village` to subscribe.
 *
 * Events emitted (server → client):
 *   resources:tick  — every 60 s from productionTick
 *   building:complete — on upgrade finish from buildingChecker
 *   attack:incoming, attack:resolved — v0.2.0 (stub)
 *   troops:trained   — v0.2.0 (stub)
 *   alliance:chat, alliance:member_attacked — v0.3.0 (stub)
 */
export function setupSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.WS_CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  // ── JWT authentication middleware ─────────────────────────
  io.use((socket, next) => {
    const token = (socket.handshake.auth as { token?: string }).token;
    if (!token) {
      next(new Error("Unauthorized: missing token"));
      return;
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      (socket.data as SocketData).user = {
        userId: decoded.userId,
        username: decoded.username,
      };
      next();
    } catch {
      next(new Error("Unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, username } = (socket.data as SocketData).user;
    console.log(`[WS] Client connected: ${socket.id} (user: ${username})`);

    // Client joins its village room to receive events
    socket.on("join_village", async (payload: JoinVillagePayload) => {
      const villageId = payload?.villageId;
      if (!villageId || typeof villageId !== "string") return;

      try {
        const village = await prisma.village.findFirst({
          where: { id: villageId, ownerId: userId },
          select: { id: true },
        });

        if (!village) {
          socket.emit("error", {
            message: "Village not found or unauthorized",
          });
          return;
        }

        await socket.join(`village:${villageId}`);
        console.log(
          `[WS] ${socket.id} (${username}) joined village:${villageId}`,
        );
      } catch (err) {
        console.error("[WS] join_village error:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[WS] Client disconnected: ${socket.id} (${username}) — ${reason}`,
      );
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
