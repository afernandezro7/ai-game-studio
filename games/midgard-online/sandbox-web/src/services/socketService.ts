import { io, Socket } from "socket.io-client";

/**
 * Socket.io client singleton for real-time events.
 * Events: attack:incoming, attack:resolved, building:complete,
 *         troops:trained, resources:tick, alliance:chat, alliance:member_attacked
 */
class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    if (this.socket?.connected) return;

    const token = localStorage.getItem("midgard_token");
    this.socket = io("/", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("[WS] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[WS] Disconnected:", reason);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinVillage(villageId: string): void {
    this.socket?.emit("join:village", villageId);
  }

  leaveVillage(villageId: string): void {
    this.socket?.emit("leave:village", villageId);
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
