/**
 * BuildingService — Validates upgrade requirements and manages construction queue.
 *
 * Responsibilities:
 * - Check resource availability against BuildingsConfig levels
 * - Verify prerequisites (mainBuilding unlocks table)
 * - Apply construction speed modifiers from mainBuilding (-3%/level, max -30%)
 * - Deduct resources and set upgradeFinishAt
 * - Refund 100% resources on cancel
 * - Increment level and update population on complete
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { gameData } from "../config/gameData.js";

// ── Config types ──────────────────────────────────────────────

interface BuildingLevelConfig {
  level: number;
  costs: { wood: number; clay: number; iron: number; wheat: number };
  timeSec: number;
  productionPerHour?: number;
  capacityPerResource?: number;
  capacityWheat?: number;
  buildTimeReduction?: number;
  population: number;
}

interface BuildingCfg {
  id: string;
  name: string;
  maxLevel: number;
  maxPerVillage: number;
  levels: BuildingLevelConfig[];
}

interface MainBuildingCfg extends BuildingCfg {
  unlocks: Record<string, string[]>;
}

interface BuildingsCfgRoot {
  buildings: Record<string, BuildingCfg>;
}

const buildingsCfg = gameData.buildings as unknown as BuildingsCfgRoot;

// ── Output types ──────────────────────────────────────────────

export interface ResourceValues {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
}

export interface BuildingWithStats {
  id: string;
  buildingType: string;
  slotIndex: number;
  level: number;
  upgradeFinishAt: Date | null;
  name: string;
  maxLevel: number;
  currentStats: BuildingLevelConfig | null;
  nextLevelCost: ResourceValues | null;
  nextLevelTimeSec: number | null;
}

export interface UpgradeResult {
  building: {
    id: string;
    buildingType: string;
    level: number;
    upgradeFinishAt: Date | null;
  };
  resourcesAfter: ResourceValues;
}

// ── Config helpers ────────────────────────────────────────────

export function getBuildingConfig(buildingType: string): BuildingCfg | null {
  return buildingsCfg.buildings[buildingType] ?? null;
}

/**
 * Returns the upgrade cost for a building at the given TARGET level.
 * Levels in config are 1-indexed; targetLevel = currentLevel + 1.
 */
export function getUpgradeCost(
  buildingType: string,
  targetLevel: number,
): ResourceValues | null {
  const cfg = buildingsCfg.buildings[buildingType];
  if (!cfg) return null;
  const levelCfg = cfg.levels[targetLevel - 1];
  if (!levelCfg) return null;
  return {
    wood: levelCfg.costs.wood,
    clay: levelCfg.costs.clay,
    iron: levelCfg.costs.iron,
    wheat: levelCfg.costs.wheat,
  };
}

/**
 * Returns effective build time in seconds, applying mainBuilding time reduction.
 * Formula: baseTime × (1 - mainBuildingLevel × 0.03), min 10s
 */
export function getBuildTime(
  buildingType: string,
  targetLevel: number,
  mainBuildingLevel: number,
): number {
  const cfg = buildingsCfg.buildings[buildingType];
  if (!cfg) return 60;
  const levelCfg = cfg.levels[targetLevel - 1];
  if (!levelCfg) return 60;
  const reduction = Math.min(mainBuildingLevel * 0.03, 0.3); // cap at 30%
  return Math.max(10, Math.round(levelCfg.timeSec * (1 - reduction)));
}

/**
 * Returns the minimum mainBuilding level required to build this buildingType.
 * Reads from mainBuilding.unlocks in BuildingsConfig.
 */
function getRequiredMainBuildingLevel(buildingType: string): number {
  const mainCfg = buildingsCfg.buildings["mainBuilding"] as MainBuildingCfg;
  if (!mainCfg?.unlocks) return 1;
  for (const [lvlStr, types] of Object.entries(mainCfg.unlocks)) {
    if ((types as string[]).includes(buildingType)) {
      return parseInt(lvlStr, 10);
    }
  }
  return 0; // not in unlocks table — always available
}

// ── Core service functions ────────────────────────────────────

/**
 * Returns all buildings for a village, enriched with config stats.
 */
export async function getVillageBuildings(
  villageId: string,
): Promise<BuildingWithStats[]> {
  const buildings = await prisma.building.findMany({
    where: { villageId },
    orderBy: [{ slotIndex: "asc" }],
  });

  return buildings.map((b) => {
    const cfg = buildingsCfg.buildings[b.buildingType];
    const currentStats = cfg?.levels[b.level - 1] ?? null;
    const nextLevelCost =
      b.level < (cfg?.maxLevel ?? 10)
        ? getUpgradeCost(b.buildingType, b.level + 1)
        : null;
    const nextLevelTimeSec =
      b.level < (cfg?.maxLevel ?? 10)
        ? (cfg?.levels[b.level]?.timeSec ?? null)
        : null;

    return {
      id: b.id,
      buildingType: b.buildingType,
      slotIndex: b.slotIndex,
      level: b.level,
      upgradeFinishAt: b.upgradeFinishAt,
      name: cfg?.name ?? b.buildingType,
      maxLevel: cfg?.maxLevel ?? 10,
      currentStats,
      nextLevelCost,
      nextLevelTimeSec,
    };
  });
}

/**
 * Validates all preconditions for upgrading a building.
 * Throws with descriptive error message if any check fails.
 * Returns the building row and current resource snapshot on success.
 */
async function validateUpgrade(
  villageId: string,
  buildingType: string,
  userId: string,
) {
  // 1. Verify village ownership
  const village = await prisma.village.findUnique({
    where: { id: villageId },
    include: {
      resources: true,
      buildings: {
        where: { buildingType: "mainBuilding" },
        select: { level: true },
      },
    },
  });

  if (!village) throw new Error("Village not found");
  if (village.ownerId !== userId)
    throw new Error("Forbidden: you do not own this village");
  if (!village.resources) throw new Error("Village has no resource record");

  // 2. Find the building
  const building = await prisma.building.findFirst({
    where: { villageId, buildingType },
  });
  if (!building)
    throw new Error(`Building '${buildingType}' not found in village`);

  // 3. Check max level
  const cfg = buildingsCfg.buildings[buildingType];
  if (!cfg) throw new Error(`Unknown building type: ${buildingType}`);
  const targetLevel = building.level + 1;
  if (targetLevel > cfg.maxLevel)
    throw new Error(
      `Building '${buildingType}' is already at max level ${cfg.maxLevel}`,
    );

  // 4. Check no other building currently upgrading (v0.1.0: 1 concurrent)
  const inProgress = await prisma.building.findFirst({
    where: { villageId, upgradeFinishAt: { not: null } },
  });
  if (inProgress) {
    throw new Error(
      `Another building (${inProgress.buildingType}) is already under construction`,
    );
  }

  // 5. Check mainBuilding prerequisite
  const mainBuildingLevel = village.buildings[0]?.level ?? 0;
  const requiredMainLevel = getRequiredMainBuildingLevel(buildingType);
  if (mainBuildingLevel < requiredMainLevel) {
    throw new Error(
      `Requires Gran Salón level ${requiredMainLevel} (current: ${mainBuildingLevel})`,
    );
  }

  // 6. Check sufficient resources
  const cost = getUpgradeCost(buildingType, targetLevel);
  if (!cost) throw new Error("Could not determine upgrade cost");

  const res = village.resources;
  const wood = Number(res.wood);
  const clay = Number(res.clay);
  const iron = Number(res.iron);
  const wheat = Number(res.wheat);

  if (
    wood < cost.wood ||
    clay < cost.clay ||
    iron < cost.iron ||
    wheat < cost.wheat
  ) {
    throw new Error(
      `Insufficient resources. Need: ${cost.wood}w/${cost.clay}c/${cost.iron}i/${cost.wheat}f`,
    );
  }

  return {
    village,
    building,
    resources: { wood, clay, iron, wheat },
    cost,
    mainBuildingLevel,
  };
}

/**
 * Starts an upgrade: deducts resources and sets upgradeFinishAt.
 * Returns the updated building and resources.
 */
export async function startUpgrade(
  villageId: string,
  buildingType: string,
  userId: string,
): Promise<UpgradeResult> {
  const { village, building, resources, cost, mainBuildingLevel } =
    await validateUpgrade(villageId, buildingType, userId);

  const targetLevel = building.level + 1;
  const buildTimeSec = getBuildTime(
    buildingType,
    targetLevel,
    mainBuildingLevel,
  );
  const upgradeFinishAt = new Date(Date.now() + buildTimeSec * 1000);

  const updatedResource: Prisma.ResourceUpdateInput = {
    wood: resources.wood - cost.wood,
    clay: resources.clay - cost.clay,
    iron: resources.iron - cost.iron,
    wheat: resources.wheat - cost.wheat,
    lastUpdated: new Date(),
  };

  const [updatedBuilding, updatedRes] = await prisma.$transaction([
    prisma.building.update({
      where: { id: building.id },
      data: { upgradeFinishAt },
    }),
    prisma.resource.update({
      where: { villageId: village.id },
      data: updatedResource,
    }),
  ]);

  return {
    building: {
      id: updatedBuilding.id,
      buildingType: updatedBuilding.buildingType,
      level: updatedBuilding.level,
      upgradeFinishAt: updatedBuilding.upgradeFinishAt,
    },
    resourcesAfter: {
      wood: Number(updatedRes.wood),
      clay: Number(updatedRes.clay),
      iron: Number(updatedRes.iron),
      wheat: Number(updatedRes.wheat),
    },
  };
}

/**
 * Cancels an active upgrade, refunding 100% of resources.
 */
export async function cancelUpgrade(
  buildingId: string,
  userId: string,
): Promise<UpgradeResult> {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
    include: {
      village: { include: { resources: true } },
    },
  });

  if (!building) throw new Error("Building not found");
  if (!building.upgradeFinishAt)
    throw new Error("Building is not currently upgrading");
  if (building.village.ownerId !== userId) throw new Error("Forbidden");
  if (!building.village.resources)
    throw new Error("Village has no resource record");

  // 100% refund of target level cost
  const targetLevel = building.level + 1;
  const refund = getUpgradeCost(building.buildingType, targetLevel);
  if (!refund) throw new Error("Could not determine refund cost");

  const res = building.village.resources;
  const [updatedBuilding, updatedRes] = await prisma.$transaction([
    prisma.building.update({
      where: { id: building.id },
      data: { upgradeFinishAt: null },
    }),
    prisma.resource.update({
      where: { villageId: building.villageId },
      data: {
        wood: Number(res.wood) + refund.wood,
        clay: Number(res.clay) + refund.clay,
        iron: Number(res.iron) + refund.iron,
        wheat: Number(res.wheat) + refund.wheat,
        lastUpdated: new Date(),
      },
    }),
  ]);

  return {
    building: {
      id: updatedBuilding.id,
      buildingType: updatedBuilding.buildingType,
      level: updatedBuilding.level,
      upgradeFinishAt: updatedBuilding.upgradeFinishAt,
    },
    resourcesAfter: {
      wood: Number(updatedRes.wood),
      clay: Number(updatedRes.clay),
      iron: Number(updatedRes.iron),
      wheat: Number(updatedRes.wheat),
    },
  };
}

/**
 * Completes a build: increments level, clears timer, updates village population.
 * Returns the updated building and the villageId for WS emit.
 */
export async function completeUpgrade(
  buildingId: string,
): Promise<{
  building: { id: string; buildingType: string; newLevel: number };
  villageId: string;
}> {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) throw new Error("Building not found");
  if (!building.upgradeFinishAt) throw new Error("Building is not upgrading");

  const oldLevel = building.level;
  const newLevel = oldLevel + 1;
  const cfg = buildingsCfg.buildings[building.buildingType];

  // Population delta: newLevelConfig.population - prevLevelConfig.population
  const newLevelPop = cfg?.levels[newLevel - 1]?.population ?? 0;
  const oldLevelPop =
    oldLevel > 0 ? (cfg?.levels[oldLevel - 1]?.population ?? 0) : 0;
  const populationDelta = newLevelPop - oldLevelPop;

  const [updatedBuilding] = await prisma.$transaction([
    prisma.building.update({
      where: { id: building.id },
      data: { level: newLevel, upgradeFinishAt: null },
    }),
    prisma.village.update({
      where: { id: building.villageId },
      data: { population: { increment: populationDelta } },
    }),
  ]);

  return {
    building: {
      id: updatedBuilding.id,
      buildingType: updatedBuilding.buildingType,
      newLevel,
    },
    villageId: building.villageId,
  };
}
