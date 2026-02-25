import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';

let io: Server | null = null;

/**
 * Setup Socket.io server attached to the HTTP server.
 * Events emitted:
 *   attack:incoming, attack:resolved, building:complete,
 *   troops:trained, resources:tick, alliance:chat, alliance:member_attacked
 */
export function setupSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.WS_CORS_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  // Auth middleware placeholder
  io.use((_socket, next) => {
    // TODO: verify JWT from socket.handshake.auth.token
    next();
  });

  io.on('connection', (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`[WS] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
