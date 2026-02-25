/**
 * ProductionService — Calculates resource production per village.
 *
 * Algorithm (from tech-stack.md):
 *   For each resource: prodPerHour = Σ(building productionPerHour[level])
 *   newAmount = current + (prodPerHour / 3600) × deltaT
 *   capAmount = min(newAmount, storageCapacity)
 *   wheatConsumed = totalTroops × consumption/h × deltaT/3600
 */

export class ProductionService {
  // TODO: implement tick calculation using gameData + prisma
}
