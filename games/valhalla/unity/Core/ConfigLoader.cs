// =============================================================================
// ConfigLoader.cs — Loads JSON configs from Resources folder
// Project Valhalla — AI Game Studio
//
// Attach to a GameObject in your first scene, or call from GameManager.
//
// Unity setup:
//   1. Copy src/config/*.json → Assets/Resources/Config/
//   2. Rename: BuildingsConfig.json → BuildingsConfig.json (keep as-is)
//   3. This script loads them at runtime via Resources.Load<TextAsset>
// =============================================================================

using UnityEngine;

namespace Valhalla.Core
{
    public class ConfigLoader : MonoBehaviour
    {
        public static ConfigLoader Instance { get; private set; }

        public Data.BuildingsConfig Buildings { get; private set; }
        public Data.ResourcesConfig Resources { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            LoadAllConfigs();
        }

        private void LoadAllConfigs()
        {
            // Load Buildings
            TextAsset buildingsJson = UnityEngine.Resources.Load<TextAsset>("Config/BuildingsConfig");
            if (buildingsJson != null)
            {
                Buildings = JsonUtility.FromJson<Data.BuildingsConfig>(buildingsJson.text);
                Debug.Log($"[ConfigLoader] Loaded {Buildings.buildings.Length} buildings");
            }
            else
            {
                Debug.LogError("[ConfigLoader] BuildingsConfig.json not found in Resources/Config/");
            }

            // Load Resources
            TextAsset resourcesJson = UnityEngine.Resources.Load<TextAsset>("Config/ResourcesConfig");
            if (resourcesJson != null)
            {
                Resources = JsonUtility.FromJson<Data.ResourcesConfig>(resourcesJson.text);
                Debug.Log($"[ConfigLoader] Loaded {Resources.resources.Length} resource types");
            }
            else
            {
                Debug.LogError("[ConfigLoader] ResourcesConfig.json not found in Resources/Config/");
            }
        }

        /// <summary>
        /// Get a building definition by ID (e.g., "great_hall")
        /// </summary>
        public Data.BuildingDefinition GetBuilding(string buildingId)
        {
            foreach (var building in Buildings.buildings)
            {
                if (building.id == buildingId) return building;
            }
            Debug.LogWarning($"[ConfigLoader] Building '{buildingId}' not found");
            return null;
        }

        /// <summary>
        /// Get a specific level config for a building
        /// </summary>
        public Data.BuildingLevel GetBuildingLevel(string buildingId, int level)
        {
            var building = GetBuilding(buildingId);
            if (building == null) return null;

            foreach (var lvl in building.levels)
            {
                if (lvl.level == level) return lvl;
            }
            Debug.LogWarning($"[ConfigLoader] Building '{buildingId}' level {level} not found");
            return null;
        }

        /// <summary>
        /// Get initial resources for a new player
        /// </summary>
        public Data.InitialResources GetInitialResources()
        {
            return Resources.initialResources;
        }
    }
}
