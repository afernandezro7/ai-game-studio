import type { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { gameData } from "../config/gameData.js";
import {
  calculateProduction,
  getStorageCaps,
  applyTick,
} from "./productionService.js";

// ── Types ────────────────────────────────────────────────────

interface Coords {
  x: number;
  y: number;
}

interface ResourceSnapshot {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
  lastUpdated: Date;
}

export interface ResourcesWithProduction extends ResourceSnapshot {
  rates: import("./productionService.js").ProductionRates;
  caps: import("./productionService.js").StorageCaps;
}

// ── Coordinate generation ────────────────────────────────────

/**
 * Generates a random coordinate in the Media zone (distance 80-160 from center).
 * Based on MapConfig.json zones.mid.distanceFromCenter = [80, 160].
 */
function randomMediaCoords(): Coords {
  const mapConfig = gameData.map as {
    zones: { mid: { distanceFromCenter: [number, number] } };
    grid: { rangeX: [number, number]; rangeY: [number, number] };
  };

  const [minDist, maxDist] = mapConfig.zones.mid.distanceFromCenter;
  const [[minX, maxX], [minY, maxY]] = [
    mapConfig.grid.rangeX,
    mapConfig.grid.rangeY,
  ];

  const angle = Math.random() * 2 * Math.PI;
  const dist = minDist + Math.random() * (maxDist - minDist);
  const x = Math.round(Math.cos(angle) * dist);
  const y = Math.round(Math.sin(angle) * dist);

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

/**
 * Finds a free coordinate in the Media zone.
 * Retries up to `maxRetries` times if the cell is already occupied.
 */
export async function generateStartingCoordinates(
  maxRetries = 10,
): Promise<Coords> {
  for (let i = 0; i < maxRetries; i++) {
    const coords = randomMediaCoords();
    const existing = await prisma.mapCell.findUnique({
      where: { x_y: { x: coords.x, y: coords.y } },
      select: { x: true },
    });
    if (!existing) return coords;
  }
  // Fallback: generate without uniqueness check (DB constraint will be the final guard)
  return randomMediaCoords();
}

// ── Village creation transaction ─────────────────────────────

/**
 * Creates village + resources + map_cell in a single Prisma transaction.
 * Called from auth.ts POST /register with the tx client.
 */
export async function createVillageInTx(
  tx: Prisma.TransactionClient,
  userId: string,
  username: string,
  coords: Coords,
): Promise<string> {
  const resourcesConfig = gameData.resources as {
    startingResources: {
      wood: number;
      clay: number;
      iron: number;
      wheat: number;
    };
  };
  const { wood, clay, iron, wheat } = resourcesConfig.startingResources;

  const village = await tx.village.create({
    data: {
      ownerId: userId,
      name: `Aldea de ${username}`,
      mapX: coords.x,
      mapY: coords.y,
      population: 0,
    },
  });

  await tx.resource.create({
    data: {
      villageId: village.id,
      wood,
      clay,
      iron,
      wheat,
      lastUpdated: new Date(),
    },
  });

  await tx.mapCell.create({
    data: {
      x: coords.x,
      y: coords.y,
      cellType: "player_village",
      villageId: village.id,
    },
  });

  return village.id;
}

// ── Lazy resource tick ───────────────────────────────────────

/**
 * Re-exported for backward compatibility — delegates to productionService.applyTick.
 * @deprecated Use applyTick from productionService directly.
 */
export function applyLazyTick(resources: ResourceSnapshot): ResourceSnapshot {
  // MO-04: real production logic is now in productionService.
  // This stub is preserved so any external callers don't break.
  return { ...resources, lastUpdated: new Date() };
}

// ── Village state query ──────────────────────────────────────

/**
 * Fetches the full village state including resources (with lazy tick) and buildings.
 * Returns null if not found.
 */
export async function getVillageState(villageId: string) {
  const village = await prisma.village.findUnique({
    where: { id: villageId },
    include: {
      resources: true,
      buildings: {
        orderBy: { slotIndex: "asc" },
      },
    },
  });

  if (!village || !village.resources) return null;

  const now = new Date();
  const deltaSeconds =
    (now.getTime() - village.resources.lastUpdated.getTime()) / 1000;

  const buildings = village.buildings.map((b) => ({
    buildingType: b.buildingType,
    level: b.level,
  }));

  const rates = calculateProduction(buildings, village.population);
  const caps = getStorageCaps(buildings);
  const current = {
    wood: Number(village.resources.wood),
    clay: Number(village.resources.clay),
    iron: Number(village.resources.iron),
    wheat: Number(village.resources.wheat),
  };

  const updated = applyTick(current, rates, caps, Math.max(0, deltaSeconds));

  // Persist tick result (W-003 fix: now awaited)
  await prisma.resource.update({
    where: { villageId },
    data: { ...updated, lastUpdated: now },
  });

  return {
    id: village.id,
    name: village.name,
    mapX: village.mapX,
    mapY: village.mapY,
    population: village.population,
    createdAt: village.createdAt,
    ownerId: village.ownerId,
    resources: {
      ...updated,
      lastUpdated: now,
    },
    buildings: village.buildings.map((b) => ({
      id: b.id,
      buildingType: b.buildingType,
      slotIndex: b.slotIndex,
      level: b.level,
      upgradeFinishAt: b.upgradeFinishAt,
    })),
    rates,
    caps,
  };
}

/**
 * Returns resources with real production tick applied, plus rates and caps.
 * Used by GET /villages/:id/resources for frontend interpolation.
 */
export async function getVillageResources(
  villageId: string,
): Promise<ResourcesWithProduction | null> {
  // Fetch resource + buildings in one query so we can apply real production
  const village = await prisma.village.findUnique({
    where: { id: villageId },
    select: {
      population: true,
      resources: true,
      buildings: { select: { buildingType: true, level: true } },
    },
  });

  if (!village?.resources) return null;

  const now = new Date();
  const deltaSeconds =
    (now.getTime() - village.resources.lastUpdated.getTime()) / 1000;

  const rates = calculateProduction(village.buildings, village.population);
  const caps = getStorageCaps(village.buildings);
  const current = {
    wood: Number(village.resources.wood),
    clay: Number(village.resources.clay),
    iron: Number(village.resources.iron),
    wheat: Number(village.resources.wheat),
  };

  const updated = applyTick(current, rates, caps, Math.max(0, deltaSeconds));

  // Persist tick (await — W-003 resolved)
  await prisma.resource.update({
    where: { villageId },
    data: { ...updated, lastUpdated: now },
  });

  return { ...updated, lastUpdated: now, rates, caps };
}
