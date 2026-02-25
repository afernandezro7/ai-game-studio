// import { getIO } from './socketServer.js';

/**
 * AttackNotifier — Emits attack-related events to affected players.
 *
 * Events:
 *   - `attack:incoming` → notifies defender when troops are en route
 *   - `attack:resolved` → notifies both parties with battle report
 */

export function notifyIncomingAttack(
  _targetVillageId: string,
  _payload: { attacker: string; troops: number; arriveAt: string },
): void {
  // TODO: getIO().to(`village:${targetVillageId}`).emit('attack:incoming', payload);
}

export function notifyAttackResolved(
  _originVillageId: string,
  _targetVillageId: string,
  _payload: { reportId: string; winner: string; loot: Record<string, number> },
): void {
  // TODO: emit 'attack:resolved' to both origin and target rooms
}
