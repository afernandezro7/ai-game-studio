/**
 * BuildingChecker — runs every MISSION_CHECK_INTERVAL_MS (default 5 s).
 *
 * Checks all buildings with upgradeFinishAt ≤ now.
 * For each:
 *   1. Increment level
 *   2. Clear upgradeFinishAt
 *   3. Update village population
 *   4. Emit Socket.io event `building:complete` to room `village:<villageId>`
 */

import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { completeUpgrade } from "../services/buildingService.js";
import { getIO } from "../ws/socketServer.js";

export function startBuildingChecker(): void {
  console.log(
    `[CRON] Building checker started (every ${env.MISSION_CHECK_INTERVAL_MS / 1000}s)`,
  );

  setInterval(() => {
    runBuildingChecker().catch((err: unknown) => {
      console.error("[CRON] Building checker error:", err);
    });
  }, env.MISSION_CHECK_INTERVAL_MS);
}

async function runBuildingChecker(): Promise<void> {
  const now = new Date();

  // Find all buildings whose upgrade timer has elapsed
  const due = await prisma.building.findMany({
    where: {
      upgradeFinishAt: { lte: now },
    },
    select: { id: true },
  });

  if (due.length === 0) return;

  for (const { id } of due) {
    try {
      const result = await completeUpgrade(id);

      // Emit to village room
      try {
        getIO().to(`village:${result.villageId}`).emit("building:complete", {
          buildingType: result.building.buildingType,
          newLevel: result.building.newLevel,
        });
      } catch {
        // IO not ready — safe
      }

      console.log(
        `[CRON] Building complete: ${result.building.buildingType} → Lv${result.building.newLevel} (village ${result.villageId})`,
      );
    } catch (err) {
      console.error(`[CRON] Failed to complete building ${id}:`, err);
    }
  }
}
