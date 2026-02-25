import api from "./api";

/**
 * VillageService — API client for village endpoints.
 *
 * Endpoints:
 *   GET  /villages/:id           → full village state
 *   GET  /villages/:id/resources → current resources (with tick applied)
 *   PATCH /villages/:id/name     → rename village
 */

export async function getVillage(villageId: string) {
  const { data } = await api.get(`/villages/${villageId}`);
  return data;
}

export async function getVillageResources(villageId: string) {
  const { data } = await api.get(`/villages/${villageId}/resources`);
  return data;
}

export async function renameVillage(villageId: string, name: string) {
  const { data } = await api.patch(`/villages/${villageId}/name`, { name });
  return data;
}
