/**
 * useTroops — Hook for troop data and training actions.
 * Will integrate with React Query + backend API.
 */
export function useTroops() {
  // TODO: implement troop queries and mutations
  return {
    troops: [],
    train: (_troopType: string, _count: number) => {
      /* noop */
    },
  };
}
