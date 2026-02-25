/**
 * useBuildings — Hook for building data and upgrade actions.
 * Will integrate with React Query + backend API.
 */
export function useBuildings() {
  // TODO: implement building queries and mutations
  return {
    buildings: [],
    upgrade: (_buildingType: string) => {
      /* noop */
    },
  };
}
