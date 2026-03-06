import { io, Socket } from "socket.io-client";

/**
 * Socket.io client singleton for real-time events.
 *
 * Auto-connects on module load if a JWT token is in localStorage
 * (handles page refresh without re-login).
 *
 * Events server→client: resources:tick, building:complete,
 *   attack:incoming, attack:resolved, troops:trained,
 *   alliance:chat, alliance:member_attacked
 *
 * Events client→server: join_village
 */

type ConnectionState = "connected" | "disconnected" | "reconnecting";

class SocketService {
  private socket: Socket | null = null;
  private _state: ConnectionState = "disconnected";

  constructor() {
    // Auto-reconnect after page refresh if already authenticated
    const token = localStorage.getItem("midgard_token");
    if (token) this._initSocket(token);
  }

  /** Connect (or reconnect) with a fresh JWT token. */
  connect(token: string): void {
    if (this.socket?.connected) return;
    if (this.socket && !this.socket.connected) {
      // Update token on existing socket and reconnect
      (this.socket.auth as Record<string, string>).token = token;
      this.socket.connect();
      return;
    }
    this._initSocket(token);
  }

  private _initSocket(token: string): void {
    this.socket = io("/", {
      auth: { token },
      transports: ["websocket"],
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
    });

    this.socket.on("connect", () => {
      this._state = "connected";
      console.log("[WS] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      this._state = "disconnected";
      console.log("[WS] Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      this._state = "reconnecting";
      console.warn("[WS] Connection error:", err.message);
    });

    this.socket.io.on("reconnect_attempt", () => {
      this._state = "reconnecting";
    });

    this.socket.io.on("reconnect", () => {
      this._state = "connected";
    });
  }

  /** Disconnect and destroy the socket. Call on logout. */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this._state = "disconnected";
  }

  /** Emit join_village to subscribe to a village’s event room. */
  joinVillage(villageId: string): void {
    this.socket?.emit("join_village", { villageId });
  }

  /** Stub kept for backwards compat — rooms are cleaned on disconnect. */
  leaveVillage(_villageId: string): void {
    // Socket.io cleans rooms automatically on disconnect.
    // Kept as no-op so existing call-sites in useResources don’t break.
  }

  /** Subscribe to a server event. */
  onEvent<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback as (data: unknown) => void);
  }

  /** Unsubscribe from a server event. */
  offEvent<T>(event: string, callback?: (data: T) => void): void {
    this.socket?.off(event, callback as ((data: unknown) => void) | undefined);
  }

  get isConnected(): boolean {
    return this._state === "connected";
  }

  get connectionState(): ConnectionState {
    return this._state;
  }

  /** Raw socket — use onEvent/offEvent when possible. */
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
