/**
 * AttackNotifier — Emits attack-related events to affected players.
 * TODO v0.2.0: implement when combat system is available.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function notifyIncomingAttack(
  _villageId: string,
  _attackData: { attacker: string; troops: number; arriveAt: string },
): void {
  // TODO v0.2.0:
  // getIO().to(`village:${villageId}`).emit('attack:incoming', attackData);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function notifyAttackResolved(
  _originVillageId: string,
  _targetVillageId: string,
  _payload: { reportId: string; winner: string; loot: Record<string, number> },
): void {
  // TODO v0.2.0:
  // getIO().to(`village:${originVillageId}`).emit('attack:resolved', payload);
  // getIO().to(`village:${targetVillageId}`).emit('attack:resolved', payload);
}
