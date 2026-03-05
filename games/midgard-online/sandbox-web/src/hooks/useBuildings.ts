/**
 * useBuildings — React Query hook for building data and upgrade actions.
 *
 * - Fetches all buildings from GET /villages/:id/buildings
 * - Exposes upgradeBuilding + cancelUpgrade mutations
 * - Listens to `building:complete` WebSocket event to sync state
 * - Derives currentUpgrade and canUpgrade helper
 */

import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBuildings,
  upgradeBuilding,
  cancelBuildingUpgrade,
  type BuildingData,
} from "@/services/buildingService";
import { socketService } from "@/services/socketService";

// ── Types ────────────────────────────────────────────────────────

export interface UseBuildings {
  buildings: BuildingData[];
  currentUpgrade: BuildingData | null;
  canUpgrade: (buildingType: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  upgrade: (buildingType: string) => Promise<void>;
  cancel: (buildingId: string) => Promise<void>;
  isUpgrading: boolean;
  isCancelling: boolean;
}

// ── Hook ─────────────────────────────────────────────────────────

export function useBuildings(villageId: string | null): UseBuildings {
  const queryClient = useQueryClient();

  // ── Fetch buildings ──
  const { data, isLoading, error } = useQuery({
    queryKey: ["buildings", villageId],
    queryFn: () => getBuildings(villageId!),
    enabled: !!villageId,
    staleTime: 10_000,
  });

  const buildings: BuildingData[] = data ?? [];

  // ── Derived state ──
  const currentUpgrade =
    buildings.find((b) => b.upgradeFinishAt !== null) ?? null;

  const canUpgrade = useCallback(
    (buildingType: string): boolean => {
      // Cannot upgrade if another building is already in progress
      if (currentUpgrade) return false;
      const building = buildings.find((b) => b.buildingType === buildingType);
      if (!building) return false;
      return building.level < building.maxLevel;
    },
    [buildings, currentUpgrade],
  );

  // ── Mutations ──
  const upgradeMutation = useMutation({
    mutationFn: ({ type }: { type: string }) =>
      upgradeBuilding(villageId!, type),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["buildings", villageId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["resources", villageId],
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => cancelBuildingUpgrade(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["buildings", villageId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["resources", villageId],
      });
    },
  });

  // ── WebSocket: building:complete ──
  const handleComplete = useCallback(
    (payload: { buildingType: string; newLevel: number }) => {
      console.log(
        `[WS] building:complete — ${payload.buildingType} → Lv${payload.newLevel}`,
      );
      void queryClient.invalidateQueries({
        queryKey: ["buildings", villageId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["resources", villageId],
      });
    },
    [queryClient, villageId],
  );

  useEffect(() => {
    if (!villageId) return;
    const socket = socketService.getSocket();
    socket?.on("building:complete", handleComplete);
    return () => {
      socket?.off("building:complete", handleComplete);
    };
  }, [villageId, handleComplete]);

  return {
    buildings,
    currentUpgrade,
    canUpgrade,
    isLoading,
    error: error as Error | null,
    upgrade: async (buildingType: string) => {
      await upgradeMutation.mutateAsync({ type: buildingType });
    },
    cancel: async (buildingId: string) => {
      await cancelMutation.mutateAsync({ id: buildingId });
    },
    isUpgrading: upgradeMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
