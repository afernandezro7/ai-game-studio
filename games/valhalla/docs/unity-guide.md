# 🎮 Unity Integration Guide — Project Valhalla

## Overview

This guide explains how to set up a Unity project that consumes the JSON configs from `src/config/` and uses the C# game systems from `src/unity/`.

## Prerequisites

- **Unity 6 LTS** (or Unity 2022 LTS) with modules:
  - Android Build Support
  - iOS Build Support
- **Unity Hub** installed
- **Google Play Console** account ($25 one-time) for Android
- **Apple Developer Program** ($99/year) + Mac for iOS

---

## Step 1: Create Unity Project

1. Open Unity Hub → **New Project**
2. Select template: **2D (URP)** — Universal Render Pipeline for best mobile performance
3. Name: `valhalla-unity` (or your preference)
4. Create project

## Step 2: Import Configs

Copy the JSON config files into Unity's Resources folder:

```bash
# From the ai-game-studio root:
mkdir -p valhalla-unity/Assets/Resources/Config
cp src/config/BuildingsConfig.json valhalla-unity/Assets/Resources/Config/
cp src/config/ResourcesConfig.json valhalla-unity/Assets/Resources/Config/
```

> **Important**: Files in `Assets/Resources/` can be loaded at runtime with `Resources.Load<TextAsset>()`.

## Step 3: Import C# Scripts

Copy the pre-built game systems:

```bash
# Data models
mkdir -p valhalla-unity/Assets/Scripts/Valhalla/Data
cp src/unity/Models/*.cs valhalla-unity/Assets/Scripts/Valhalla/Data/

# Core systems
mkdir -p valhalla-unity/Assets/Scripts/Valhalla/Core
cp src/unity/Core/*.cs valhalla-unity/Assets/Scripts/Valhalla/Core/
```

## Step 4: Set Up Scene

1. Create a new scene or use the default `SampleScene`
2. Create an empty GameObject → name it `GameManager`
3. Attach `ConfigLoader.cs` to GameManager
4. The ConfigLoader will auto-load all configs on `Awake()`

### Verify configs are loaded:

```csharp
void Start()
{
    var config = ConfigLoader.Instance;
    Debug.Log($"Buildings: {config.Buildings.buildings.Length}");
    Debug.Log($"Resources: {config.Resources.resources.Length}");

    // Access a specific building
    var greatHall = config.GetBuilding("great_hall");
    Debug.Log($"Great Hall: {greatHall.name}, {greatHall.levels.Length} levels");
}
```

## Step 5: Implement Game Manager

Here's a minimal GameManager example that ties everything together:

```csharp
using UnityEngine;
using Valhalla.Core;
using Valhalla.Data;

public class GameManager : MonoBehaviour
{
    private GameState _state;
    private ProductionSystem _production;
    private BuildingSystem _buildings;
    private float _tickTimer;

    void Start()
    {
        var config = ConfigLoader.Instance;

        // Create systems
        _production = new ProductionSystem(config.Buildings);
        _buildings = new BuildingSystem(config.Buildings, _production);

        // Load or create new game
        if (PlayerPrefs.HasKey("save"))
        {
            string json = PlayerPrefs.GetString("save");
            _state = JsonUtility.FromJson<GameState>(json);

            // Calculate offline earnings
            float now = (float)(System.DateTime.UtcNow - new System.DateTime(1970, 1, 1)).TotalSeconds;
            var (wood, steel) = _production.CalculateOfflineEarnings(_state, now);
            _state.resources.wood_yggdrasil += wood;
            _state.resources.steel_dwarf += steel;
            _state.lastUpdateTimestamp = now;

            Debug.Log($"Welcome back! Earned {wood:F0} wood and {steel:F0} steel while away.");
        }
        else
        {
            _state = BuildingSystem.CreateNewGame(config.Resources);
            Debug.Log("New game started!");
        }
    }

    void Update()
    {
        // Tick production every second
        _tickTimer += Time.deltaTime;
        if (_tickTimer >= 1f)
        {
            _tickTimer = 0f;
            TickProduction();
            _buildings.ProcessCompletedUpgrades(_state);
        }
    }

    void TickProduction()
    {
        var (woodPerHour, steelPerHour) = _production.CalculateTotalProduction(_state.buildings);
        float woodPerSecond = woodPerHour / 3600f;
        float steelPerSecond = steelPerHour / 3600f;

        // Apply production (capped by storage)
        var (maxWood, maxSteel) = _production.CalculateStorageCap(_state.buildings);
        _state.resources.wood_yggdrasil = Mathf.Min(_state.resources.wood_yggdrasil + woodPerSecond, maxWood);
        _state.resources.steel_dwarf = Mathf.Min(_state.resources.steel_dwarf + steelPerSecond, maxSteel);
    }

    // Call this from UI button
    public void UpgradeBuilding(string buildingId)
    {
        if (_buildings.TryUpgrade(_state, buildingId))
        {
            SaveGame();
        }
    }

    void SaveGame()
    {
        _state.lastUpdateTimestamp = (float)(System.DateTime.UtcNow - new System.DateTime(1970, 1, 1)).TotalSeconds;
        string json = JsonUtility.ToJson(_state);
        PlayerPrefs.SetString("save", json);
        PlayerPrefs.Save();
    }

    void OnApplicationPause(bool paused)
    {
        if (paused) SaveGame();
    }
}
```

---

## Project Structure in Unity

```
valhalla-unity/
├── Assets/
│   ├── Resources/
│   │   └── Config/
│   │       ├── BuildingsConfig.json    ← From src/config/
│   │       └── ResourcesConfig.json    ← From src/config/
│   ├── Scripts/
│   │   └── Valhalla/
│   │       ├── Data/                   ← From src/unity/Models/
│   │       │   ├── BuildingData.cs
│   │       │   ├── ResourceData.cs
│   │       │   └── GameState.cs
│   │       └── Core/                   ← From src/unity/Core/
│   │           ├── ConfigLoader.cs
│   │           ├── ProductionSystem.cs
│   │           └── BuildingSystem.cs
│   ├── Scenes/
│   ├── Sprites/                        ← Art assets (AI-generated)
│   └── Prefabs/                        ← Building prefabs
├── Packages/
└── ProjectSettings/
```

---

## Publishing to Stores

### Android (Google Play)

1. **File → Build Settings → Android** → Switch Platform
2. **Player Settings**:
   - Company Name: `AI Game Studio`
   - Product Name: `Project Valhalla`
   - Package Name: `com.aigamestudio.valhalla`
   - Minimum API: 24 (Android 7.0)
   - Target API: 34
3. **Build** → Generates `.aab` (Android App Bundle)
4. Upload to **Google Play Console** → Internal Testing → Review → Production

### iOS (App Store)

1. **File → Build Settings → iOS** → Switch Platform
2. **Player Settings**:
   - Bundle Identifier: `com.aigamestudio.valhalla`
   - Target minimum iOS: 15.0
   - Signing Team ID: Your Apple Developer Team
3. **Build** → Generates Xcode project
4. Open in Xcode → Archive → Upload to **App Store Connect**

---

## Keeping Configs in Sync

When the AI agents update `src/config/*.json`, sync to Unity:

```bash
# Simple copy script (add to package.json scripts if desired)
cp src/config/*.json valhalla-unity/Assets/Resources/Config/
```

Or automate with a GitHub Action that copies configs on merge.

---

## Next Steps

1. **Create basic UI**: Resource bar (top), building grid (center), upgrade panel (bottom)
2. **Add sprites**: Use `@artdirector` AI prompts to generate isometric building art
3. **Implement tutorials**: FTUE (First-Time User Experience) flow
4. **Add sounds**: Nordic ambient + building/upgrade SFX
5. **Monetization**: Unity IAP plugin for Rune purchases
