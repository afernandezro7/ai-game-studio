/**
 * Mission Resolver — runs every 5 seconds.
 *
 * Checks all missions with status='traveling' whose arrive_at <= now.
 * Resolves combat, applies loot, updates troop counts, creates battle reports.
 */

// import cron from 'node-cron';

export function startMissionResolver(): void {
  // TODO: cron.schedule('*/5 * * * * *', async () => { ... });
  console.log('[CRON] Mission resolver — not yet implemented');
}
