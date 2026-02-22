// =============================================================================
// BuildingCardUI.cs — Individual building card with upgrade button
// Project Valhalla — AI Game Studio
//
// Setup in Unity:
//   1. Create a Prefab with: Image (building sprite), Text (name), Text (level),
//      Text (production), Button (upgrade), Text (cost on button)
//   2. Attach this script to the prefab root
//   3. Assign all references in Inspector
//   4. BuildingGridUI will instantiate this prefab for each building
// =============================================================================

using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Valhalla.Data;

namespace Valhalla.UI
{
    public class BuildingCardUI : MonoBehaviour
    {
        [Header("Display")]
        [SerializeField] private Image buildingImage;
        [SerializeField] private TextMeshProUGUI buildingName;
        [SerializeField] private TextMeshProUGUI levelText;
        [SerializeField] private TextMeshProUGUI productionText;
        [SerializeField] private TextMeshProUGUI descriptionText;

        [Header("Upgrade Button")]
        [SerializeField] private Button upgradeButton;
        [SerializeField] private TextMeshProUGUI upgradeCostText;
        [SerializeField] private Image upgradeButtonImage;

        [Header("Upgrade Timer")]
        [SerializeField] private GameObject timerPanel;
        [SerializeField] private TextMeshProUGUI timerText;
        [SerializeField] private Slider timerSlider;

        [Header("Speed Up")]
        [SerializeField] private Button speedUpButton;
        [SerializeField] private TextMeshProUGUI speedUpCostText;

        [Header("Colors")]
        [SerializeField] private Color affordableColor = new Color(0.298f, 0.686f, 0.314f);  // #4CAF50
        [SerializeField] private Color unaffordableColor = new Color(0.620f, 0.620f, 0.620f); // gray
        [SerializeField] private Color maxLevelColor = new Color(0.855f, 0.647f, 0.125f);     // #DAA520 gold

        // Events
        public event Action<string> OnUpgradeClicked;
        public event Action<string> OnSpeedUpClicked;

        private string _buildingId;
        private bool _isMaxLevel;

        /// <summary>
        /// Initialize the card with building data. Call once when creating the card.
        /// </summary>
        public void Setup(string buildingId, BuildingDefinition definition, int currentLevel, 
                          bool canAfford, bool isUpgrading, float remainingSeconds, int speedUpRuneCost)
        {
            _buildingId = buildingId;

            buildingName.text = definition.name;
            descriptionText.text = definition.description;
            levelText.text = $"Nivel {currentLevel}";

            // Find current level stats for production display
            BuildingLevel currentLevelData = null;
            BuildingLevel nextLevelData = null;
            foreach (var lvl in definition.levels)
            {
                if (lvl.level == currentLevel) currentLevelData = lvl;
                if (lvl.level == currentLevel + 1) nextLevelData = lvl;
            }

            // Show production rate
            if (currentLevelData != null)
            {
                if (currentLevelData.productionRatePerHour > 0)
                {
                    productionText.text = $"+{currentLevelData.productionRatePerHour}/h";
                }
                else if (currentLevelData.passiveProduction != null)
                {
                    productionText.text = $"+{currentLevelData.passiveProduction.wood_yggdrasil}🪵 +{currentLevelData.passiveProduction.steel_dwarf}⛏️/h";
                }
                else
                {
                    productionText.text = "";
                }
            }

            // Upgrade state
            _isMaxLevel = nextLevelData == null;

            if (isUpgrading)
            {
                // Show timer
                upgradeButton.gameObject.SetActive(false);
                timerPanel.SetActive(true);
                speedUpButton.gameObject.SetActive(true);
                speedUpCostText.text = $"⚡ {speedUpRuneCost} 💎";
            }
            else if (_isMaxLevel)
            {
                // Max level
                upgradeButton.gameObject.SetActive(true);
                upgradeButton.interactable = false;
                upgradeCostText.text = "MAX";
                upgradeButtonImage.color = maxLevelColor;
                timerPanel.SetActive(false);
                speedUpButton.gameObject.SetActive(false);
            }
            else
            {
                // Show upgrade button
                upgradeButton.gameObject.SetActive(true);
                upgradeButton.interactable = canAfford;
                upgradeCostText.text = $"🪵 {nextLevelData.cost.wood_yggdrasil}  ⛏️ {nextLevelData.cost.steel_dwarf}";
                upgradeButtonImage.color = canAfford ? affordableColor : unaffordableColor;
                timerPanel.SetActive(false);
                speedUpButton.gameObject.SetActive(false);
            }

            // Wire up buttons
            upgradeButton.onClick.RemoveAllListeners();
            upgradeButton.onClick.AddListener(() => OnUpgradeClicked?.Invoke(_buildingId));

            speedUpButton.onClick.RemoveAllListeners();
            speedUpButton.onClick.AddListener(() => OnSpeedUpClicked?.Invoke(_buildingId));
        }

        /// <summary>
        /// Update the upgrade timer display. Call every frame while upgrading.
        /// </summary>
        public void UpdateTimer(float remainingSeconds, float totalSeconds)
        {
            if (!timerPanel.activeSelf) return;

            int minutes = Mathf.FloorToInt(remainingSeconds / 60f);
            int seconds = Mathf.FloorToInt(remainingSeconds % 60f);
            timerText.text = $"{minutes:D2}:{seconds:D2}";

            if (totalSeconds > 0)
            {
                timerSlider.value = 1f - (remainingSeconds / totalSeconds);
            }

            // Auto-complete when timer reaches 0
            if (remainingSeconds <= 0)
            {
                timerPanel.SetActive(false);
                upgradeButton.gameObject.SetActive(true);
            }
        }

        /// <summary>
        /// Set the building sprite image.
        /// </summary>
        public void SetBuildingSprite(Sprite sprite)
        {
            if (sprite != null)
            {
                buildingImage.sprite = sprite;
            }
        }
    }
}
