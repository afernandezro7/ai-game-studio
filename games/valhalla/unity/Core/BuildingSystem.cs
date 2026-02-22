// =============================================================================
// BuildingSystem.cs — Handles building placement and upgrades
// Project Valhalla — AI Game Studio
//
// Manages the building/upgrade lifecycle: validation, cost deduction,
// timer tracking, and completion.
// =============================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace Valhalla.Core
{
    public class BuildingSystem
    {
        private readonly Data.BuildingsConfig _config;
        private readonly ProductionSystem _production;

        public BuildingSystem(Data.BuildingsConfig config, ProductionSystem production)
        {
            _config = config;
            _production = production;
        }

        /// <summary>
        /// Attempt to start upgrading a building. Returns true if successful.
        /// Deducts resources from player if affordable.
        /// </summary>
        public bool TryUpgrade(Data.GameState state, string buildingId)
        {
            var playerBuilding = FindPlayerBuilding(state, buildingId);
            if (playerBuilding == null)
            {
                Debug.LogWarning($"[BuildingSystem] Player doesn't own building '{buildingId}'");
                return false;
            }

            if (playerBuilding.isUpgrading)
            {
                Debug.LogWarning($"[BuildingSystem] Building '{buildingId}' is already upgrading");
                return false;
            }

            // Find next level config
            var definition = FindDefinition(buildingId);
            if (definition == null) return false;

            int nextLevel = playerBuilding.level + 1;
            var nextLevelConfig = FindLevel(definition, nextLevel);
            if (nextLevelConfig == null)
            {
                Debug.LogWarning($"[BuildingSystem] Building '{buildingId}' is already max level ({playerBuilding.level})");
                return false;
            }

            // Check affordability
            if (!_production.CanAfford(state.resources, nextLevelConfig.cost))
            {
                Debug.Log($"[BuildingSystem] Can't afford upgrade for '{buildingId}' to level {nextLevel}");
                return false;
            }

            // Deduct resources
            state.resources.wood_yggdrasil -= nextLevelConfig.cost.wood_yggdrasil;
            state.resources.steel_dwarf -= nextLevelConfig.cost.steel_dwarf;

            // Start upgrade timer
            playerBuilding.isUpgrading = true;
            playerBuilding.upgradeStartTimestamp = GetCurrentTimestamp();

            Debug.Log($"[BuildingSystem] Started upgrading '{buildingId}' to level {nextLevel} " +
                      $"(will take {nextLevelConfig.buildTimeMin} min)");
            return true;
        }

        /// <summary>
        /// Check all buildings for completed upgrades and apply them.
        /// Call this every frame or on a timer.
        /// </summary>
        public List<string> ProcessCompletedUpgrades(Data.GameState state)
        {
            var completed = new List<string>();
            float now = GetCurrentTimestamp();

            foreach (var building in state.buildings)
            {
                if (!building.isUpgrading) continue;

                if (_production.IsUpgradeComplete(building, now))
                {
                    building.level += 1;
                    building.isUpgrading = false;
                    building.upgradeStartTimestamp = 0f;
                    completed.Add(building.buildingId);

                    Debug.Log($"[BuildingSystem] '{building.buildingId}' upgraded to level {building.level}!");
                }
            }

            return completed;
        }

        /// <summary>
        /// Get remaining upgrade time in seconds for a building.
        /// Returns 0 if not upgrading.
        /// </summary>
        public float GetRemainingUpgradeTime(Data.GameState state, string buildingId)
        {
            var playerBuilding = FindPlayerBuilding(state, buildingId);
            if (playerBuilding == null || !playerBuilding.isUpgrading) return 0f;

            var definition = FindDefinition(buildingId);
            if (definition == null) return 0f;

            var nextLevel = FindLevel(definition, playerBuilding.level + 1);
            if (nextLevel == null) return 0f;

            float buildTimeSeconds = nextLevel.buildTimeMin * 60f;
            float elapsed = GetCurrentTimestamp() - playerBuilding.upgradeStartTimestamp;
            float remaining = buildTimeSeconds - elapsed;

            return Mathf.Max(0f, remaining);
        }

        /// <summary>
        /// Instant-finish an upgrade using Runes (hard currency).
        /// Cost: 1 Rune per remaining minute.
        /// </summary>
        public bool TrySpeedUpWithRunes(Data.GameState state, string buildingId)
        {
            float remainingSeconds = GetRemainingUpgradeTime(state, buildingId);
            if (remainingSeconds <= 0) return false;

            int runesCost = Mathf.CeilToInt(remainingSeconds / 60f); // 1 Rune = 1 min
            if (state.resources.runes < runesCost)
            {
                Debug.Log($"[BuildingSystem] Not enough runes ({state.resources.runes}/{runesCost})");
                return false;
            }

            state.resources.runes -= runesCost;

            var playerBuilding = FindPlayerBuilding(state, buildingId);
            playerBuilding.level += 1;
            playerBuilding.isUpgrading = false;
            playerBuilding.upgradeStartTimestamp = 0f;

            Debug.Log($"[BuildingSystem] Speed-up '{buildingId}' to level {playerBuilding.level} for {runesCost} runes");
            return true;
        }

        /// <summary>
        /// Create a new player GameState with initial buildings and resources.
        /// </summary>
        public static Data.GameState CreateNewGame(Data.ResourcesConfig resourcesConfig)
        {
            var initial = resourcesConfig.initialResources;
            return new Data.GameState
            {
                resources = new Data.PlayerResources
                {
                    wood_yggdrasil = initial.wood_yggdrasil,
                    steel_dwarf = initial.steel_dwarf,
                    runes = initial.runes
                },
                buildings = new[]
                {
                    new Data.PlayerBuilding { buildingId = "great_hall", level = 1, isUpgrading = false },
                    new Data.PlayerBuilding { buildingId = "lumber_mill", level = 1, isUpgrading = false },
                    new Data.PlayerBuilding { buildingId = "steel_mine", level = 1, isUpgrading = false }
                },
                lastUpdateTimestamp = GetCurrentTimestamp()
            };
        }

        // --- Private helpers ---

        private Data.PlayerBuilding FindPlayerBuilding(Data.GameState state, string buildingId)
        {
            foreach (var b in state.buildings)
            {
                if (b.buildingId == buildingId) return b;
            }
            return null;
        }

        private Data.BuildingDefinition FindDefinition(string buildingId)
        {
            foreach (var b in _config.buildings)
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

        private static float GetCurrentTimestamp()
        {
            return (float)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;
        }
    }
}
