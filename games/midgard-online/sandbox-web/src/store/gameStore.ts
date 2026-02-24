import { create } from "zustand";

interface Resources {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
}

interface Building {
  id: string;
  buildingType: string;
  level: number;
  slotIndex: number;
  upgradeFinishAt: string | null;
}

interface Troop {
  troopType: string;
  count: number;
}

interface GameState {
  // Resources
  resources: Resources;
  setResources: (resources: Resources) => void;

  // Buildings
  buildings: Building[];
  setBuildings: (buildings: Building[]) => void;

  // Troops
  troops: Troop[];
  setTroops: (troops: Troop[]) => void;

  // Active village
  villageId: string | null;
  setVillageId: (id: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: { wood: 0, clay: 0, iron: 0, wheat: 0 },
  setResources: (resources) => set({ resources }),

  buildings: [],
  setBuildings: (buildings) => set({ buildings }),

  troops: [],
  setTroops: (troops) => set({ troops }),

  villageId: null,
  setVillageId: (villageId) => set({ villageId }),
}));
