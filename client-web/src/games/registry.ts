/**
 * Game Registry — central catalog of all games available in the sandbox.
 *
 * To add a new game:
 * 1. Create a folder under games/<id>/ with game.json and configs
 * 2. Create a lazy-loaded page in client-web/src/games/<id>/
 * 3. Add an entry here
 */

export interface GameEntry {
  id: string;
  name: string;
  description: string;
  theme: string;
  status: "pre-production" | "prototype" | "alpha" | "beta" | "live";
  icon: string; // Emoji for quick visual ID
  path: string; // React Router path segment
  color: string; // Brand color hex
}

export const GAME_REGISTRY: GameEntry[] = [
  {
    id: "valhalla",
    name: "Project Valhalla",
    description:
      "Norse mythology city builder — strategy & resource management",
    theme: "Norse Mythology / Vikings",
    status: "pre-production",
    icon: "⚔️",
    path: "valhalla",
    color: "#DAA520",
  },
  // Add more games here:
  // {
  //   id: "samurai",
  //   name: "Project Samurai",
  //   description: "Feudal Japan tower defense",
  //   theme: "Japanese Mythology",
  //   status: "pre-production",
  //   icon: "⛩️",
  //   path: "samurai",
  //   color: "#DC143C",
  // },
];
