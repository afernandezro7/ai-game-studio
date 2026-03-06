import type { Server, Socket } from "socket.io";

/**
 * ChatHandler — Handles alliance chat messages via WebSocket.
 * TODO v0.3.0: implement when alliance system is available.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleAllianceChat(_socket: Socket, _io: Server): void {
  // TODO v0.3.0:
  // socket.on('alliance:chat', (data) => {
  //   io.to(`alliance:${data.allianceId}`).emit('alliance:chat', data);
  // });
}
