// =============================================================================
// GameState.cs — Runtime game state (save/load with JsonUtility)
// Project Valhalla — AI Game Studio
//
// This represents the PLAYER's current state, not the config data.
// Save:  string json = JsonUtility.ToJson(state); PlayerPrefs.SetString("save", json);
// Load:  GameState state = JsonUtility.FromJson<GameState>(PlayerPrefs.GetString("save"));
// =============================================================================

using System;

namespace Valhalla.Data
{
    [Serializable]
    public class GameState
    {
        public PlayerResources resources;
        public PlayerBuilding[] buildings;
        public float lastUpdateTimestamp; // Unix timestamp for offline production calc
    }

    [Serializable]
    public class PlayerResources
    {
        public float wood_yggdrasil;
        public float steel_dwarf;
        public int runes;
    }

    [Serializable]
    public class PlayerBuilding
    {
        public string buildingId;    // References BuildingDefinition.id
        public int level;
        public bool isUpgrading;
        public float upgradeStartTimestamp; // Unix timestamp when upgrade started
    }
}
