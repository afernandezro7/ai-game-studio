/**
 * useResources — Hook for fetching and managing resource state.
 * Will integrate with React Query + Zustand gameStore.
 */
export function useResources() {
  // TODO: implement resource polling / websocket sync
  return {
    wood: 0,
    clay: 0,
    iron: 0,
    wheat: 0,
  };
}
