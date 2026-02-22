// =============================================================================
// GameHUD.cs — Main game HUD that ties everything together
// Project Valhalla — AI Game Studio
//
// This is the main UI controller. Attach to the Canvas root.
// It connects ResourceBarUI, BuildingCardUI[], and the game systems.
//
// Setup in Unity:
//   1. Create Canvas (Screen Space - Overlay, scale with screen 1080 ref)
//   2. Add ResourceBarUI panel at top
//   3. Add ScrollView with Horizontal Layout Group for buildings
//   4. Assign BuildingCard prefab
//   5. Attach this script to Canvas and wire references
// =============================================================================

using System.Collections.Generic;
using UnityEngine;
using Valhalla.Core;
using Valhalla.Data;

namespace Valhalla.UI
{
    public class GameHUD : MonoBehaviour
    {
        [Header("UI References")]
        [SerializeField] private ResourceBarUI resourceBar;
        [SerializeField] private Transform buildingsContainer;
        [SerializeField] private BuildingCardUI buildingCardPrefab;

        [Header("Offline Earnings Popup")]
        [SerializeField] private GameObject offlinePopup;
        [SerializeField] private TMPro.TextMeshProUGUI offlineWoodText;
        [SerializeField] private TMPro.TextMeshProUGUI offlineSteelText;
        [SerializeField] private UnityEngine.UI.Button offlineClaimButton;

        // Systems
        private GameState _state;
        private ProductionSystem _production;
        private BuildingSystem _buildings;
        private Dictionary<string, BuildingCardUI> _buildingCards = new();
        private float _tickTimer;
        private float _saveTimer;

        void Start()
        {
            var config = ConfigLoader.Instance;

            // Create systems
            _production = new ProductionSystem(config.Buildings);
            _buildings = new BuildingSystem(config.Buildings, _production);

            // Load or create new game
            if (PlayerPrefs.HasKey("valhalla_save"))
            {
                string json = PlayerPrefs.GetString("valhalla_save");
                _state = JsonUtility.FromJson<GameState>(json);

                // Calculate offline earnings
                float now = GetTimestamp();
                var (wood, steel) = _production.CalculateOfflineEarnings(_state, now);
                _state.lastUpdateTimestamp = now;

                if (wood > 1 || steel > 1)
                {
                    ShowOfflinePopup(wood, steel);
                }
            }
            else
            {
                _state = BuildingSystem.CreateNewGame(config.Resources);
                Debug.Log("[GameHUD] New game started!");
            }

            // Build UI
            CreateBuildingCards();
            RefreshAllUI();
        }

        void Update()
        {
            _tickTimer += Time.deltaTime;
            _saveTimer += Time.deltaTime;

            // Tick production every second
            if (_tickTimer >= 1f)
            {
                _tickTimer = 0f;
                TickProduction();

                // Check completed upgrades
                var completed = _buildings.ProcessCompletedUpgrades(_state);
                if (completed.Count > 0)
                {
                    RefreshAllUI();
                }
            }

            // Auto-save every 30 seconds
            if (_saveTimer >= 30f)
            {
                _saveTimer = 0f;
                SaveGame();
            }

            // Update timers on upgrading buildings
            UpdateUpgradeTimers();

            // Refresh resource display every frame for smooth numbers
            var (woodRate, steelRate) = _production.CalculateTotalProduction(_state.buildings);
            resourceBar.UpdateResources(_state.resources, woodRate, steelRate);
        }

        // --- Production ---

        private void TickProduction()
        {
            var (woodPerHour, steelPerHour) = _production.CalculateTotalProduction(_state.buildings);
            float woodPerSecond = woodPerHour / 3600f;
            float steelPerSecond = steelPerHour / 3600f;

            // Apply with storage cap
            var (maxWood, maxSteel) = _production.CalculateStorageCap(_state.buildings);
            _state.resources.wood_yggdrasil = Mathf.Min(
                _state.resources.wood_yggdrasil + woodPerSecond, maxWood);
            _state.resources.steel_dwarf = Mathf.Min(
                _state.resources.steel_dwarf + steelPerSecond, maxSteel);

            _state.lastUpdateTimestamp = GetTimestamp();
        }

        // --- Building Cards ---

        private void CreateBuildingCards()
        {
            var config = ConfigLoader.Instance;

            foreach (var building in config.Buildings.buildings)
            {
                var card = Instantiate(buildingCardPrefab, buildingsContainer);
                card.OnUpgradeClicked += HandleUpgrade;
                card.OnSpeedUpClicked += HandleSpeedUp;
                _buildingCards[building.id] = card;
            }
        }

        private void RefreshAllUI()
        {
            var config = ConfigLoader.Instance;

            foreach (var building in config.Buildings.buildings)
            {
                if (!_buildingCards.ContainsKey(building.id)) continue;

                var playerBuilding = FindPlayerBuilding(building.id);
                int level = playerBuilding?.level ?? 0;
                bool isUpgrading = playerBuilding?.isUpgrading ?? false;

                // Check next level cost affordability
                bool canAfford = false;
                foreach (var lvl in building.levels)
                {
                    if (lvl.level == level + 1)
                    {
                        canAfford = _production.CanAfford(_state.resources, lvl.cost);
                        break;
                    }
                }

                float remaining = _buildings.GetRemainingUpgradeTime(_state, building.id);
                int runeCost = Mathf.CeilToInt(remaining / 60f);

                _buildingCards[building.id].Setup(
                    building.id, building, level, canAfford, isUpgrading, remaining, runeCost);
            }
        }

        private void UpdateUpgradeTimers()
        {
            var config = ConfigLoader.Instance;

            foreach (var building in config.Buildings.buildings)
            {
                var playerBuilding = FindPlayerBuilding(building.id);
                if (playerBuilding == null || !playerBuilding.isUpgrading) continue;

                float remaining = _buildings.GetRemainingUpgradeTime(_state, building.id);

                // Find total build time for the progress bar
                float totalSeconds = 0;
                foreach (var lvl in building.levels)
                {
                    if (lvl.level == playerBuilding.level + 1)
                    {
                        totalSeconds = lvl.buildTimeMin * 60f;
                        break;
                    }
                }

                _buildingCards[building.id].UpdateTimer(remaining, totalSeconds);
            }
        }

        // --- Actions ---

        private void HandleUpgrade(string buildingId)
        {
            if (_buildings.TryUpgrade(_state, buildingId))
            {
                RefreshAllUI();
                SaveGame();
                Debug.Log($"[GameHUD] Upgrade started: {buildingId}");
            }
            else
            {
                // Flash insufficient resource
                resourceBar.FlashInsufficientResource("wood_yggdrasil");
                Debug.Log($"[GameHUD] Can't afford upgrade: {buildingId}");
            }
        }

        private void HandleSpeedUp(string buildingId)
        {
            if (_buildings.TrySpeedUpWithRunes(_state, buildingId))
            {
                RefreshAllUI();
                SaveGame();
                Debug.Log($"[GameHUD] Speed up completed: {buildingId}");
            }
        }

        // --- Offline Popup ---

        private void ShowOfflinePopup(float wood, float steel)
        {
            if (offlinePopup == null) return;

            offlinePopup.SetActive(true);
            offlineWoodText.text = $"+{Mathf.FloorToInt(wood)} 🪵";
            offlineSteelText.text = $"+{Mathf.FloorToInt(steel)} ⛏️";

            offlineClaimButton.onClick.RemoveAllListeners();
            offlineClaimButton.onClick.AddListener(() =>
            {
                _state.resources.wood_yggdrasil += wood;
                _state.resources.steel_dwarf += steel;
                offlinePopup.SetActive(false);
                RefreshAllUI();
                SaveGame();
            });
        }

        // --- Save/Load ---

        private void SaveGame()
        {
            _state.lastUpdateTimestamp = GetTimestamp();
            string json = JsonUtility.ToJson(_state);
            PlayerPrefs.SetString("valhalla_save", json);
            PlayerPrefs.Save();
        }

        void OnApplicationPause(bool paused)
        {
            if (paused) SaveGame();
        }

        void OnApplicationQuit()
        {
            SaveGame();
        }

        // --- Helpers ---

        private PlayerBuilding FindPlayerBuilding(string buildingId)
        {
            if (_state.buildings == null) return null;
            foreach (var b in _state.buildings)
            {
                if (b.buildingId == buildingId) return b;
            }
            return null;
        }

        private static float GetTimestamp()
        {
            return (float)(System.DateTime.UtcNow - new System.DateTime(1970, 1, 1)).TotalSeconds;
        }
    }
}
