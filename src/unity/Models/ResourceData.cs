// =============================================================================
// ResourceData.cs — C# data model for ResourcesConfig.json
// Project Valhalla — AI Game Studio
// 
// Usage in Unity:
//   TextAsset json = Resources.Load<TextAsset>("Config/ResourcesConfig");
//   ResourcesConfig config = JsonUtility.FromJson<ResourcesConfig>(json.text);
// =============================================================================

using System;

namespace Valhalla.Data
{
    [Serializable]
    public class ResourcesConfig
    {
        public ResourceDefinition[] resources;
        public InitialResources initialResources;
    }

    [Serializable]
    public class ResourceDefinition
    {
        public string id;          // "wood_yggdrasil", "steel_dwarf", "runes"
        public string name;        // Display name: "Madera de Yggdrasil"
        public string type;        // "SoftCurrency" or "HardCurrency"
        public string description; // Tooltip text
    }

    [Serializable]
    public class InitialResources
    {
        public int wood_yggdrasil; // 500
        public int steel_dwarf;    // 500
        public int runes;          // 100
    }
}
