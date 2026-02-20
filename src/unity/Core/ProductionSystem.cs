// =============================================================================
// ProductionSystem.cs — Handles offline + real-time resource production
// Project Valhalla — AI Game Studio
//
// Core game loop logic: calculates resource production from all buildings,
// handles offline earnings, and manages resource caps.
//
// This is engine logic — NO UI dependencies. Can be unit tested independently.
// =============================================================================

using System;
using UnityEngine;

namespace Valhalla.Core
{
    public class ProductionSystem
    {
        private readonly Data.BuildingsConfig _buildingsConfig;

        public ProductionSystem(Data.BuildingsConfig buildingsConfig)
        {
            _buildingsConfig = buildingsConfig;
        }

        /// <summary>
        /// Calculate total production rates across all player buildings.
        /// Returns (woodPerHour, steelPerHour).
        /// </summary>
        public (float woodPerHour, float steelPerHour) CalculateTotalProduction(Data.PlayerBuilding[] playerBuildings)
        {
            float totalWood = 0f;
            float totalSteel = 0f;

            foreach (var playerBuilding in playerBuildings)
            {
                if (playerBuilding.isUpgrading) continue; // Buildings under construction don't produce

                var definition = FindBuildingDefinition(playerBuilding.buildingId);
                if (definition == null) continue;

                var level = FindLevel(definition, playerBuilding.level);
                if (level == null) continue;

                // Resource producers (lumber_mill, steel_mine)
                if (level.productionRatePerHour > 0)
                {
                    if (playerBuilding.buildingId == "lumber_mill")
                        totalWood += level.productionRatePerHour;
                    else if (playerBuilding.buildingId == "steel_mine")
                        totalSteel += level.productionRatePerHour;
                }

                // Great Hall passive production
                if (level.passiveProduction != null)
                {
                    totalWood += level.passiveProduction.wood_yggdrasil;
                    totalSteel += level.passiveProduction.steel_dwarf;
                }
            }

            return (totalWood, totalSteel);
        }

        /// <summary>
        /// Calculate resources earned while the player was offline.
        /// Call this when the game starts with the saved GameState.
        /// </summary>
        public (float woodEarned, float steelEarned) CalculateOfflineEarnings(
            Data.GameState state, float currentTimestamp)
        {
            float hoursElapsed = (currentTimestamp - state.lastUpdateTimestamp) / 3600f;

            // Cap offline earnings to 8 hours (prevent exploit)
            hoursElapsed = Mathf.Min(hoursElapsed, 8f);

            if (hoursElapsed <= 0) return (0f, 0f);

            var (woodPerHour, steelPerHour) = CalculateTotalProduction(state.buildings);

            return (woodPerHour * hoursElapsed, steelPerHour * hoursElapsed);
        }

        /// <summary>
        /// Get the maximum storage capacity for a resource across all buildings.
        /// </summary>
        public (int maxWood, int maxSteel) CalculateStorageCap(Data.PlayerBuilding[] playerBuildings)
        {
            int maxWood = 0;
            int maxSteel = 0;

            foreach (var playerBuilding in playerBuildings)
            {
                var definition = FindBuildingDefinition(playerBuilding.buildingId);
                if (definition == null) continue;

                var level = FindLevel(definition, playerBuilding.level);
                if (level == null) continue;

                // Great Hall storage
                if (level.storage != null)
                {
                    maxWood += level.storage.wood_yggdrasil;
                    maxSteel += level.storage.steel_dwarf;
                }

                // Resource building internal storage
                if (level.storageCapacity > 0)
                {
                    if (playerBuilding.buildingId == "lumber_mill")
                        maxWood += level.storageCapacity;
                    else if (playerBuilding.buildingId == "steel_mine")
                        maxSteel += level.storageCapacity;
                }
            }

            return (maxWood, maxSteel);
        }

        /// <summary>
        /// Check if player can afford to build/upgrade a building.
        /// </summary>
        public bool CanAfford(Data.PlayerResources resources, Data.ResourceCost cost)
        {
            return resources.wood_yggdrasil >= cost.wood_yggdrasil
                && resources.steel_dwarf >= cost.steel_dwarf;
        }

        /// <summary>
        /// Check if a building upgrade is complete based on elapsed time.
        /// </summary>
        public bool IsUpgradeComplete(Data.PlayerBuilding playerBuilding, float currentTimestamp)
        {
            if (!playerBuilding.isUpgrading) return false;

            var definition = FindBuildingDefinition(playerBuilding.buildingId);
            if (definition == null) return false;

            // Next level config has the build time
            var nextLevel = FindLevel(definition, playerBuilding.level + 1);
            if (nextLevel == null) return false;

            float buildTimeSeconds = nextLevel.buildTimeMin * 60f;
            float elapsed = currentTimestamp - playerBuilding.upgradeStartTimestamp;

            return elapsed >= buildTimeSeconds;
        }

        // --- Private helpers ---

        private Data.BuildingDefinition FindBuildingDefinition(string buildingId)
        {
            foreach (var b in _buildingsConfig.buildings)
            {
                if (b.id == buildingId) return b;
            }
            return null;
        }

        private Data.BuildingLevel FindLevel(Data.BuildingDefinition def, int level)
        {
            foreach (var l in def.levels)
            {
                if (l.level == level) return l;
            }
            return null;
        }
    }
}
