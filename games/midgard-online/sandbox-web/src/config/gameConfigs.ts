/**
 * Re-export of all 6 game JSON configs.
 * Configs live at games/midgard-online/config/ (source of truth).
 *
 * NOTE: Vite resolves JSON imports at build time.
 * The configs are NOT modified by the frontend — read-only reference data.
 */

import BuildingsConfig from "../../../config/BuildingsConfig.json";
import ResourcesConfig from "../../../config/ResourcesConfig.json";
import TroopsConfig from "../../../config/TroopsConfig.json";
import CombatConfig from "../../../config/CombatConfig.json";
import MapConfig from "../../../config/MapConfig.json";
import AlliancesConfig from "../../../config/AlliancesConfig.json";

export {
  BuildingsConfig,
  ResourcesConfig,
  TroopsConfig,
  CombatConfig,
  MapConfig,
  AlliancesConfig,
};
