import type { Socket } from 'socket.io';

/**
 * ChatHandler — Handles alliance chat messages via WebSocket.
 *
 * Events:
 *   - `alliance:chat` (client→server) → broadcast to alliance room
 *   - `alliance:chat` (server→client) → { playerId, message, timestamp }
 */

export function registerChatHandlers(_socket: Socket): void {
  // TODO: listen for 'alliance:chat' and broadcast to alliance room
  // socket.on('alliance:chat', (data) => { ... });
}
