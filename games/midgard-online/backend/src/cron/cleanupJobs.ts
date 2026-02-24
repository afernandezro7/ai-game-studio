/**
 * Cleanup Jobs — runs daily.
 *
 * Tasks:
 * - Delete battle reports older than 30 days
 * - Archive inactive villages (no login > 60 days)
 * - Clean up expired sessions
 */

// import cron from 'node-cron';

export function startCleanupJobs(): void {
  // TODO: cron.schedule('0 3 * * *', async () => { ... });
  console.log('[CRON] Cleanup jobs — not yet implemented');
}
