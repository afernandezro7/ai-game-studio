import { create } from "zustand";
import { getVillage, getVillageResources } from "../services/villageService";

interface Resources {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
  lastUpdated?: string;
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

interface Village {
  id: string;
  name: string;
  mapX: number;
  mapY: number;
  population: number;
  createdAt: string;
  ownerId: string;
  resources: Resources;
  buildings: Building[];
}

interface GameState {
  // Village
  currentVillage: Village | null;
  setCurrentVillage: (village: Village) => void;

  // Resources
  resources: Resources;
  setResources: (resources: Resources) => void;

  // Buildings
  buildings: Building[];
  setBuildings: (buildings: Building[]) => void;

  // Troops
  troops: Troop[];
  setTroops: (troops: Troop[]) => void;

  // Active village id
  villageId: string | null;
  setVillageId: (id: string) => void;

  // Actions
  fetchVillage: (id: string) => Promise<void>;
  refreshResources: (id: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  currentVillage: null,
  setCurrentVillage: (currentVillage) => set({ currentVillage }),

  resources: { wood: 0, clay: 0, iron: 0, wheat: 0 },
  setResources: (resources) => set({ resources }),

  buildings: [],
  setBuildings: (buildings) => set({ buildings }),

  troops: [],
  setTroops: (troops) => set({ troops }),

  villageId: null,
  setVillageId: (villageId) => set({ villageId }),

  fetchVillage: async (id: string) => {
    const data = await getVillage(id);
    const village = data.village as Village;
    set({
      currentVillage: village,
      villageId: village.id,
      resources: village.resources,
      buildings: village.buildings,
    });
  },

  refreshResources: async (id: string) => {
    const data = await getVillageResources(id);
    set({ resources: data.resources as Resources });
  },
}));
