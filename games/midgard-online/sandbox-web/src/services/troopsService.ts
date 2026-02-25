import api from "./api";

/**
 * TroopsService — API client for troop endpoints.
 *
 * Endpoints:
 *   GET  /troops/:villageId              → troops stationed in village
 *   POST /troops/train                   → enqueue training
 */

export async function getTroops(villageId: string) {
  const { data } = await api.get(`/troops/${villageId}`);
  return data;
}

export async function trainTroops(
  villageId: string,
  troopType: string,
  count: number,
) {
  const { data } = await api.post("/troops/train", {
    villageId,
    troopType,
    count,
  });
  return data;
}
