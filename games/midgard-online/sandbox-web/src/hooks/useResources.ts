/**
 * useResources — Real-time resource hook.
 *
 * - Fetches resources from GET /villages/:id/resources (includes rates + caps)
 * - Client-side interpolation: updates displayed values every second via rates
 * - Resets base state on `resources:tick` socket event
 * - Joins village WS room on mount; leaves on unmount
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVillageResources } from "@/services/villageService";
import { socketService } from "@/services/socketService";

// ── Types ────────────────────────────────────────────────────

export interface ProductionRates {
  woodPerHour: number;
  clayPerHour: number;
  ironPerHour: number;
  wheatPerHour: number;
  wheatGrossPerHour: number;
  wheatConsumptionPerHour: number;
}

export interface StorageCaps {
  woodCap: number;
  clayCap: number;
  ironCap: number;
  wheatCap: number;
}

export interface ResourceDisplay {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
  rates: ProductionRates;
  caps: StorageCaps;
  isFull: { wood: boolean; clay: boolean; iron: boolean; wheat: boolean };
  isLoading: boolean;
  error: Error | null;
}

const DEFAULT_RATES: ProductionRates = {
  woodPerHour: 0,
  clayPerHour: 0,
  ironPerHour: 0,
  wheatPerHour: 0,
  wheatGrossPerHour: 0,
  wheatConsumptionPerHour: 0,
};

const DEFAULT_CAPS: StorageCaps = {
  woodCap: 800,
  clayCap: 800,
  ironCap: 800,
  wheatCap: 800,
};

// ── Hook ─────────────────────────────────────────────────────

export function useResources(villageId: string | null): ResourceDisplay {
  const queryClient = useQueryClient();

  // Interpolation state: base values + timestamp from last server sync
  const baseRef = useRef<{
    wood: number;
    clay: number;
    iron: number;
    wheat: number;
    syncedAt: number; // ms
  } | null>(null);

  const [interpolated, setInterpolated] = useState({
    wood: 0,
    clay: 0,
    iron: 0,
    wheat: 0,
  });

  const ratesRef = useRef<ProductionRates>(DEFAULT_RATES);
  const capsRef = useRef<StorageCaps>(DEFAULT_CAPS);

  // ── Server fetch ──
  const { data, isLoading, error } = useQuery({
    queryKey: ["resources", villageId],
    queryFn: () => getVillageResources(villageId!),
    enabled: !!villageId,
    refetchInterval: 60_000, // fallback if WS is down
    staleTime: 5_000,
  });

  // Sync base when server data arrives
  useEffect(() => {
    if (!data) return;
    const { resources, rates, caps } = data as {
      resources: {
        wood: number;
        clay: number;
        iron: number;
        wheat: number;
        lastUpdated: string;
      };
      rates: ProductionRates;
      caps: StorageCaps;
    };

    baseRef.current = {
      wood: resources.wood,
      clay: resources.clay,
      iron: resources.iron,
      wheat: resources.wheat,
      syncedAt: Date.now(),
    };
    ratesRef.current = rates ?? DEFAULT_RATES;
    capsRef.current = caps ?? DEFAULT_CAPS;
    setInterpolated({
      wood: resources.wood,
      clay: resources.clay,
      iron: resources.iron,
      wheat: resources.wheat,
    });
  }, [data]);

  // ── Client-side interpolation (every 1 s) ──
  useEffect(() => {
    const tick = setInterval(() => {
      const base = baseRef.current;
      if (!base) return;

      const rates = ratesRef.current;
      const caps = capsRef.current;
      const deltaH = (Date.now() - base.syncedAt) / 3_600_000;

      setInterpolated({
        wood: Math.min(
          Math.max(0, base.wood + rates.woodPerHour * deltaH),
          caps.woodCap,
        ),
        clay: Math.min(
          Math.max(0, base.clay + rates.clayPerHour * deltaH),
          caps.clayCap,
        ),
        iron: Math.min(
          Math.max(0, base.iron + rates.ironPerHour * deltaH),
          caps.ironCap,
        ),
        wheat: Math.min(
          Math.max(
            0,
            base.wheat +
              (rates.wheatGrossPerHour - rates.wheatConsumptionPerHour) *
                deltaH,
          ),
          caps.wheatCap,
        ),
      });
    }, 1_000);

    return () => clearInterval(tick);
  }, []);

  // ── WebSocket: join room + listen to resources:tick ──
  const handleTick = useCallback(
    (payload: {
      wood: number;
      clay: number;
      iron: number;
      wheat: number;
      rates: ProductionRates;
      caps: StorageCaps;
    }) => {
      baseRef.current = {
        wood: payload.wood,
        clay: payload.clay,
        iron: payload.iron,
        wheat: payload.wheat,
        syncedAt: Date.now(),
      };
      if (payload.rates) ratesRef.current = payload.rates;
      if (payload.caps) capsRef.current = payload.caps;

      setInterpolated({
        wood: payload.wood,
        clay: payload.clay,
        iron: payload.iron,
        wheat: payload.wheat,
      });

      // Keep React Query cache in sync
      queryClient.invalidateQueries({ queryKey: ["resources", villageId] });
    },
    [queryClient, villageId],
  );

  useEffect(() => {
    if (!villageId) return;

    const socket = socketService.getSocket();
    socketService.joinVillage(villageId);
    socket?.on("resources:tick", handleTick);

    return () => {
      socket?.off("resources:tick", handleTick);
      socketService.leaveVillage(villageId);
    };
  }, [villageId, handleTick]);

  // ── Derived state ──
  const caps = capsRef.current;
  const isFull = {
    wood: interpolated.wood >= caps.woodCap,
    clay: interpolated.clay >= caps.clayCap,
    iron: interpolated.iron >= caps.ironCap,
    wheat: interpolated.wheat >= caps.wheatCap,
  };

  return {
    ...interpolated,
    rates: ratesRef.current,
    caps,
    isFull,
    isLoading,
    error: error as Error | null,
  };
}
