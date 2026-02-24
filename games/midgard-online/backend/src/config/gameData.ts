import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configDir = join(__dirname, '..', '..', '..', 'config');

function loadJson<T>(filename: string): T {
  const filePath = join(configDir, filename);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * All 6 game JSON configs loaded at startup.
 * Source of truth: games/midgard-online/config/
 */
export const gameData = {
  buildings: loadJson('BuildingsConfig.json'),
  resources: loadJson('ResourcesConfig.json'),
  troops: loadJson('TroopsConfig.json'),
  combat: loadJson('CombatConfig.json'),
  map: loadJson('MapConfig.json'),
  alliances: loadJson('AlliancesConfig.json'),
} as const;
