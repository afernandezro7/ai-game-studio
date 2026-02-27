/**
 * BuildingService (frontend) — API client for building endpoints.
 *
 * Endpoints:
 *   GET    /villages/:id/buildings  → list buildings with stats
 *   POST   /buildings/upgrade       → start upgrade
 *   DELETE /buildings/upgrade/:id   → cancel upgrade
 */

import api from "./api";

// ── Types ───────────────────────────────────────────────────

export interface BuildingLevelStats {
  level: number;
  productionPerHour?: number;
  capacityPerResource?: number;
  capacityWheat?: number;
  buildTimeReduction?: number;
  population: number;
  timeSec: number;
  costs: { wood: number; clay: number; iron: number; wheat: number };
}

export interface BuildingData {
  id: string;
  buildingType: string;
  slotIndex: number;
  level: number;
  upgradeFinishAt: string | null;
  name: string;
  maxLevel: number;
  currentStats: BuildingLevelStats | null;
  nextLevelCost: {
    wood: number;
    clay: number;
    iron: number;
    wheat: number;
  } | null;
  nextLevelTimeSec: number | null;
}

export interface UpgradeResult {
  building: {
    id: string;
    buildingType: string;
    level: number;
    upgradeFinishAt: string | null;
  };
  resourcesAfter: {
    wood: number;
    clay: number;
    iron: number;
    wheat: number;
  };
}

// ── API calls ────────────────────────────────────────────────

export async function getBuildings(villageId: string): Promise<BuildingData[]> {
  const { data } = await api.get<{ buildings: BuildingData[] }>(
    `/villages/${villageId}/buildings`,
  );
  return data.buildings;
}

export async function upgradeBuilding(
  villageId: string,
  buildingType: string,
): Promise<UpgradeResult> {
  const { data } = await api.post<UpgradeResult>("/buildings/upgrade", {
    villageId,
    buildingType,
  });
  return data;
}

export async function cancelBuildingUpgrade(
  buildingId: string,
): Promise<UpgradeResult> {
  const { data } = await api.delete<UpgradeResult>(
    `/buildings/upgrade/${buildingId}`,
  );
  return data;
}
