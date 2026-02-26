import { create } from "zustand";
import api from "@/services/api";

interface User {
  id: string;
  username: string;
  email: string;
  runes: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  villageId: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  setAuth: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("midgard_token"),
  user: null,
  villageId: localStorage.getItem("midgard_village_id"),
  isAuthenticated: !!localStorage.getItem("midgard_token"),

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("midgard_token", data.token);
    if (data.villageId) {
      localStorage.setItem("midgard_village_id", data.villageId);
    }
    set({
      token: data.token,
      user: data.user,
      villageId: data.villageId ?? null,
      isAuthenticated: true,
    });
  },

  register: async (username, email, password) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    localStorage.setItem("midgard_token", data.token);
    if (data.villageId) {
      localStorage.setItem("midgard_village_id", data.villageId);
    }
    set({
      token: data.token,
      user: data.user,
      villageId: data.villageId ?? null,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("midgard_token");
    localStorage.removeItem("midgard_village_id");
    set({ token: null, user: null, villageId: null, isAuthenticated: false });
  },

  setAuth: (token, user) => {
    localStorage.setItem("midgard_token", token);
    set({ token, user, isAuthenticated: true });
  },
}));
