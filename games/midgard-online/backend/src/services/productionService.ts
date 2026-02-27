/**
 * ProductionService — Pure calculation module for resource production.
 *
 * Formula (economy.md + ResourcesConfig.json):
 *   prodPerHour = Σ(building.levels[level-1].productionPerHour)  per resource type
 *   newAmount   = current + (prodPerHour / 3600) × deltaSeconds
 *   capAmount   = min(newAmount, storageCapacity)
 *   wheat       = max(0, wheatAfterProd - population × populationPerHour × deltaH)
 */

import { gameData } from "../config/gameData.js";

// ── Types ────────────────────────────────────────────────────

export interface BuildingInfo {
  buildingType: string;
  level: number;
}

export interface ProductionRates {
  woodPerHour: number;
  clayPerHour: number;
  ironPerHour: number;
  wheatGrossPerHour: number;
  wheatConsumptionPerHour: number;
  /** net wheat = gross - consumption (can be negative) */
  wheatPerHour: number;
}

export interface StorageCaps {
  woodCap: number;
  clayCap: number;
  ironCap: number;
  wheatCap: number;
}

export interface ResourceValues {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
}

// ── Constants ────────────────────────────────────────────────

/** Fallback cap when no warehouse/granary has been built yet */
const DEFAULT_STORAGE_CAP = 800;

/** Map: buildingType → resource produced */
const RESOURCE_BUILDINGS: Partial<Record<string, keyof ResourceValues>> = {
  woodcutter: "wood",
  claypit: "clay",
  ironMine: "iron",
  farm: "wheat",
};

// ── Internal config types (avoid depending on generated JSON types) ──

interface LevelDef {
  level: number;
  productionPerHour?: number;
  capacityPerResource?: number;
  capacityWheat?: number;
}

interface BuildingDef {
  levels: LevelDef[];
}

type BuildingsShape = { buildings: Record<string, BuildingDef> };
type ResourcesShape = {
  wheatConsumption: { populationPerHour: number };
  antiExploit: { productionStopsOnFullStorage: boolean };
};

// ── Public API ───────────────────────────────────────────────

/**
 * Calculates gross and net production rates per hour based on building levels.
 * Wheat consumption = population × ResourcesConfig.wheatConsumption.populationPerHour
 */
export function calculateProduction(
  buildings: BuildingInfo[],
  population: number,
): ProductionRates {
  const buildingsCfg = (gameData.buildings as unknown as BuildingsShape)
    .buildings;
  const resourcesCfg = gameData.resources as unknown as ResourcesShape;

  let woodPerHour = 0;
  let clayPerHour = 0;
  let ironPerHour = 0;
  let wheatGrossPerHour = 0;

  for (const b of buildings) {
    const resource = RESOURCE_BUILDINGS[b.buildingType];
    if (!resource || b.level < 1) continue;

    const def = buildingsCfg[b.buildingType];
    if (!def) continue;

    const levelDef = def.levels[b.level - 1];
    const prod = levelDef?.productionPerHour ?? 0;

    if (resource === "wood") woodPerHour += prod;
    else if (resource === "clay") clayPerHour += prod;
    else if (resource === "iron") ironPerHour += prod;
    else if (resource === "wheat") wheatGrossPerHour += prod;
  }

  const wheatConsumptionPerHour =
    population * resourcesCfg.wheatConsumption.populationPerHour;

  return {
    woodPerHour,
    clayPerHour,
    ironPerHour,
    wheatGrossPerHour,
    wheatConsumptionPerHour,
    wheatPerHour: wheatGrossPerHour - wheatConsumptionPerHour,
  };
}

/**
 * Returns storage caps derived from warehouse (wood/clay/iron) and granary (wheat) levels.
 * Multiple warehouses/granaries are summed.
 */
export function getStorageCaps(buildings: BuildingInfo[]): StorageCaps {
  const buildingsCfg = (gameData.buildings as unknown as BuildingsShape)
    .buildings;

  const warehouses = buildings.filter(
    (b) => b.buildingType === "warehouse" && b.level >= 1,
  );
  const granaries = buildings.filter(
    (b) => b.buildingType === "granary" && b.level >= 1,
  );

  let woodCap = DEFAULT_STORAGE_CAP;
  let clayCap = DEFAULT_STORAGE_CAP;
  let ironCap = DEFAULT_STORAGE_CAP;

  if (warehouses.length > 0) {
    woodCap = 0;
    clayCap = 0;
    ironCap = 0;
    for (const wh of warehouses) {
      const cap =
        buildingsCfg["warehouse"]?.levels[wh.level - 1]?.capacityPerResource ??
        DEFAULT_STORAGE_CAP;
      woodCap += cap;
      clayCap += cap;
      ironCap += cap;
    }
  }

  let wheatCap = DEFAULT_STORAGE_CAP;
  if (granaries.length > 0) {
    wheatCap = 0;
    for (const gr of granaries) {
      const cap =
        buildingsCfg["granary"]?.levels[gr.level - 1]?.capacityWheat ??
        DEFAULT_STORAGE_CAP;
      wheatCap += cap;
    }
  }

  return { woodCap, clayCap, ironCap, wheatCap };
}

/**
 * Applies a production tick to resource values.
 *  - Adds production for deltaSeconds (capped at storage max)
 *  - Deducts wheat consumption; wheat floor is 0
 *  - Logs a starvation warning when wheat reaches 0 (desertion → Phase 2)
 */
export function applyTick(
  current: ResourceValues,
  rates: ProductionRates,
  caps: StorageCaps,
  deltaSeconds: number,
): ResourceValues {
  if (deltaSeconds <= 0) return { ...current };

  const dh = deltaSeconds / 3600;

  const wood = Math.min(current.wood + rates.woodPerHour * dh, caps.woodCap);
  const clay = Math.min(current.clay + rates.clayPerHour * dh, caps.clayCap);
  const iron = Math.min(current.iron + rates.ironPerHour * dh, caps.ironCap);

  // Wheat: production is also capped, then consumption is subtracted
  const wheatAfterProd = Math.min(
    current.wheat + rates.wheatGrossPerHour * dh,
    caps.wheatCap,
  );
  const wheat = Math.max(
    0,
    wheatAfterProd - rates.wheatConsumptionPerHour * dh,
  );

  if (wheat === 0 && current.wheat > 0) {
    console.warn(
      "[production] Starvation detected — desertion logic pending Phase 2",
    );
  }

  // Round to 2 decimal places (stored as Decimal(10,2) in DB)
  return {
    wood: Math.round(wood * 100) / 100,
    clay: Math.round(clay * 100) / 100,
    iron: Math.round(iron * 100) / 100,
    wheat: Math.round(wheat * 100) / 100,
  };
}
