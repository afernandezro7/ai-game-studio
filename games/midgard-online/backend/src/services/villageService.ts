import type { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { gameData } from "../config/gameData.js";

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
 * Applies a lazy production tick to a resource snapshot.
 * MO-03: No buildings exist yet → production rate is 0.
 * MO-04 will replace this with real production calculation.
 *
 * Returns updated ResourceSnapshot (does NOT persist to DB — caller decides).
 */
export function applyLazyTick(resources: ResourceSnapshot): ResourceSnapshot {
  // Production is 0 until MO-04 implements building-based rates.
  // We still update lastUpdated so future ticks have a correct baseline.
  return {
    ...resources,
    lastUpdated: new Date(),
  };
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

  const ticked = applyLazyTick({
    wood: Number(village.resources.wood),
    clay: Number(village.resources.clay),
    iron: Number(village.resources.iron),
    wheat: Number(village.resources.wheat),
    lastUpdated: village.resources.lastUpdated,
  });

  // Persist updated lastUpdated (fire-and-forget, don't await)
  prisma.resource
    .update({
      where: { villageId },
      data: { lastUpdated: ticked.lastUpdated },
    })
    .catch(() => {
      /* ignore — non-critical */
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
      wood: ticked.wood,
      clay: ticked.clay,
      iron: ticked.iron,
      wheat: ticked.wheat,
      lastUpdated: ticked.lastUpdated,
    },
    buildings: village.buildings.map((b) => ({
      id: b.id,
      buildingType: b.buildingType,
      slotIndex: b.slotIndex,
      level: b.level,
      upgradeFinishAt: b.upgradeFinishAt,
    })),
  };
}

/**
 * Returns only the resources with a lazy tick applied.
 */
export async function getVillageResources(
  villageId: string,
): Promise<ResourceSnapshot | null> {
  const r = await prisma.resource.findUnique({ where: { villageId } });
  if (!r) return null;

  const snapshot: ResourceSnapshot = {
    wood: Number(r.wood),
    clay: Number(r.clay),
    iron: Number(r.iron),
    wheat: Number(r.wheat),
    lastUpdated: r.lastUpdated,
  };

  return applyLazyTick(snapshot);
}
