/**
 * CombatService — Resolves combat encounters.
 *
 * Uses CombatConfig formulas:
 * - ATK = Σ(troopCount × troopATK) × moralMultiplier
 * - DEF = Σ(troopCount × troopDEF) × (1 + wallLevel × 0.08)
 * - Losses proportional to ATK/DEF ratio
 * - Loot capped at maxRaidPercent (50%)
 */

export class CombatService {
  // TODO: implement combat resolution
}
