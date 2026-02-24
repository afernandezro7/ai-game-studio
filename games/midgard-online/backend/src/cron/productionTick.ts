/**
 * Production Tick — runs every 60 seconds.
 *
 * For each active village:
 * 1. Calculate deltaT since last_updated
 * 2. Sum production from all resource buildings
 * 3. Apply storage caps (warehouse/granary)
 * 4. Deduct wheat consumption from troops
 * 5. Handle starvation (desertion) if wheat === 0
 */

// import cron from 'node-cron';

export function startProductionTick(): void {
  // TODO: cron.schedule('*/60 * * * * *', async () => { ... });
  console.log('[CRON] Production tick — not yet implemented');
}
