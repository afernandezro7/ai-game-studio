import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/services/socketService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/Toast";

/**
 * useWebSocket — Manages Socket.io connection lifecycle for a village.
 *
 * - Connects with JWT token (auto-connect handles page refresh)
 * - Joins village room so server can push events to this client
 * - `resources:tick`  → handled by useResources (not duplicated here)
 * - `building:complete` → invalidate queries + show toast
 * - Cleans up listeners on unmount; disconnect is driven by authStore.logout
 */

// ── Building display names ──────────────────────────────────

const BUILDING_NAMES: Record<string, string> = {
  woodcutter: "Leñador de Yggdrasil",
  claypit: "Cantera de Midgard",
  ironMine: "Mina de Hierro Enano",
  farm: "Granja de Freya",
  mainBuilding: "Gran Salón",
  warehouse: "Almacén",
  granary: "Granero",
  barracks: "Cuartel",
  stable: "Cuadra",
  workshop: "Taller",
  marketplace: "Mercado",
  embassy: "Embajada",
  academy: "Academia",
};

// ── Types ───────────────────────────────────────────────

export interface UseWebSocketResult {
  isConnected: boolean;
  lastTick: Date | null;
}

// ── Hook ───────────────────────────────────────────────

export function useWebSocket(
  villageId: string | null,
): UseWebSocketResult {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(socketService.isConnected);
  const [lastTick, setLastTick] = useState<Date | null>(null);
  const joinedVillageRef = useRef<string | null>(null);

  // ── Ensure connection is active ─────────────────────────────
  useEffect(() => {
    if (!token) return;

    // connect() is idempotent: no-op if already connected
    socketService.connect(token);

    const socket = socketService.getSocket();
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onError = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    // Sync immediately in case socket is already connected
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, [token]);

  // ── Join village room ───────────────────────────────────
  useEffect(() => {
    if (!villageId) return;
    if (joinedVillageRef.current === villageId) return;

    // Socket.io buffers emits until connected — no need to wait for isConnected
    socketService.joinVillage(villageId);
    joinedVillageRef.current = villageId;
  }, [villageId]);

  // ── building:complete → toast + query invalidation ───────────────
  useEffect(() => {
    if (!villageId) return;

    const handleComplete = (payload: {
      buildingType: string;
      newLevel: number;
    }) => {
      const name =
        BUILDING_NAMES[payload.buildingType] ?? payload.buildingType;
      toast(`¡${name} mejorado a Nivel ${payload.newLevel}!`);
      setLastTick(new Date());
      void queryClient.invalidateQueries({
        queryKey: ["buildings", villageId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["resources", villageId],
      });
    };

    socketService.onEvent("building:complete", handleComplete);
    return () => {
      socketService.offEvent("building:complete", handleComplete);
    };
  }, [villageId, queryClient]);

  // ── resources:tick → update lastTick timestamp ────────────────
  useEffect(() => {
    if (!villageId) return;

    const handleTick = () => setLastTick(new Date());
    socketService.onEvent("resources:tick", handleTick);
    return () => {
      socketService.offEvent("resources:tick", handleTick);
    };
  }, [villageId]);

  return { isConnected, lastTick };
}
