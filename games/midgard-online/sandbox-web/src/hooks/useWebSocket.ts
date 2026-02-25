import { useEffect, useRef } from "react";
import { socketService } from "@/services/socketService";

/**
 * useWebSocket — Hook that manages the Socket.io connection lifecycle.
 * Connects on mount, disconnects on unmount.
 */
export function useWebSocket() {
  const connected = useRef(false);

  useEffect(() => {
    if (!connected.current) {
      socketService.connect();
      connected.current = true;
    }

    return () => {
      socketService.disconnect();
      connected.current = false;
    };
  }, []);

  return {
    socket: socketService.getSocket(),
  };
}
