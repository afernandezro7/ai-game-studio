// =============================================================================
// BuildingData.cs — C# data model for BuildingsConfig.json
// Project Valhalla — AI Game Studio
//
// Usage in Unity:
//   TextAsset json = Resources.Load<TextAsset>("Config/BuildingsConfig");
//   BuildingsConfig config = JsonUtility.FromJson<BuildingsConfig>(json.text);
// =============================================================================

using System;

namespace Valhalla.Data
{
    [Serializable]
    public class BuildingsConfig
    {
        public BuildingDefinition[] buildings;
    }

    [Serializable]
    public class BuildingDefinition
    {
        public string id;          // "great_hall", "lumber_mill", "steel_mine"
        public string name;        // Display name
        public string description; // Tooltip text
        public BuildingLevel[] levels;
    }

    [Serializable]
    public class BuildingLevel
    {
        public int level;
        public ResourceCost cost;
        public int buildTimeMin;              // Build time in minutes
        public int hp;                        // Hit points

        // --- Great Hall specific ---
        public ResourceStorage storage;       // Max storage capacity (null for non-storage buildings)
        public ResourceProduction passiveProduction; // Passive production/hour (null if none)

        // --- Resource building specific ---
        public int productionRatePerHour;     // Production rate (0 for non-producers)
        public int storageCapacity;           // Internal storage (0 for non-storage)
    }

    [Serializable]
    public class ResourceCost
    {
        public int wood_yggdrasil;
        public int steel_dwarf;
    }

    [Serializable]
    public class ResourceStorage
    {
        public int wood_yggdrasil;
        public int steel_dwarf;
    }

    [Serializable]
    public class ResourceProduction
    {
        public int wood_yggdrasil;
        public int steel_dwarf;
    }
}
