/**
 * Production Tick — runs every PRODUCTION_TICK_INTERVAL_MS (default 60 s).
 *
 * For each active village (owner logged in within last 7 days):
 * 1. Calculate deltaT since resources.lastUpdated
 * 2. Apply real production (productionService)
 * 3. Update resources in DB (Prisma transaction per village)
 * 4. Emit `resources:tick` Socket.io event to room `village:<id>`
 */

import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import {
  calculateProduction,
  getStorageCaps,
  applyTick,
} from "../services/productionService.js";
import { getIO } from "../ws/socketServer.js";

export function startProductionTick(): void {
  console.log(
    `[CRON] Production tick scheduler started (every ${env.PRODUCTION_TICK_INTERVAL_MS / 1000}s)`,
  );

  setInterval(() => {
    runProductionTick().catch((err: unknown) => {
      console.error("[CRON] Production tick error:", err);
    });
  }, env.PRODUCTION_TICK_INTERVAL_MS);
}

async function runProductionTick(): Promise<void> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const villages = await prisma.village.findMany({
    where: {
      owner: { lastLogin: { gte: sevenDaysAgo } },
    },
    include: {
      resources: true,
      buildings: { select: { buildingType: true, level: true } },
    },
  });

  if (villages.length === 0) return;

  let processed = 0;

  for (const village of villages) {
    if (!village.resources) continue;

    const deltaSeconds =
      (now.getTime() - village.resources.lastUpdated.getTime()) / 1000;

    // Skip if less than 1 s has passed (prevents no-op writes)
    if (deltaSeconds < 1) continue;

    const rates = calculateProduction(village.buildings, village.population);
    const caps = getStorageCaps(village.buildings);

    const current = {
      wood: Number(village.resources.wood),
      clay: Number(village.resources.clay),
      iron: Number(village.resources.iron),
      wheat: Number(village.resources.wheat),
    };

    const updated = applyTick(current, rates, caps, deltaSeconds);

    await prisma.resource.update({
      where: { villageId: village.id },
      data: { ...updated, lastUpdated: now },
    });

    // Emit to village room — safe if IO not ready yet
    try {
      getIO()
        .to(`village:${village.id}`)
        .emit("resources:tick", {
          wood: updated.wood,
          clay: updated.clay,
          iron: updated.iron,
          wheat: updated.wheat,
          rates: {
            woodPerHour: rates.woodPerHour,
            clayPerHour: rates.clayPerHour,
            ironPerHour: rates.ironPerHour,
            wheatPerHour: rates.wheatPerHour,
            wheatGrossPerHour: rates.wheatGrossPerHour,
            wheatConsumptionPerHour: rates.wheatConsumptionPerHour,
          },
          caps,
        });
    } catch {
      // IO not initialized — safe during early startup
    }

    processed++;
  }

  if (processed > 0) {
    console.log(`[CRON] Production tick processed ${processed} villages`);
  }
}
