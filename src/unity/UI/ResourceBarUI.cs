// =============================================================================
// ResourceBarUI.cs — Top resource bar showing Wood, Steel, Runes
// Project Valhalla — AI Game Studio
//
// Setup in Unity:
//   1. Create Canvas → Panel (top, horizontal layout)
//   2. Add 3 child panels with Image (icon) + Text (amount) + Text (rate)
//   3. Attach this script to the parent Panel
//   4. Assign references in Inspector
// =============================================================================

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Valhalla.Data;

namespace Valhalla.UI
{
    public class ResourceBarUI : MonoBehaviour
    {
        [Header("Wood")]
        [SerializeField] private Image woodIcon;
        [SerializeField] private TextMeshProUGUI woodAmount;
        [SerializeField] private TextMeshProUGUI woodRate;

        [Header("Steel")]
        [SerializeField] private Image steelIcon;
        [SerializeField] private TextMeshProUGUI steelAmount;
        [SerializeField] private TextMeshProUGUI steelRate;

        [Header("Runes")]
        [SerializeField] private Image runesIcon;
        [SerializeField] private TextMeshProUGUI runesAmount;

        [Header("Colors")]
        [SerializeField] private Color woodColor = new Color(0.545f, 0.271f, 0.075f);   // #8B4513
        [SerializeField] private Color steelColor = new Color(0.690f, 0.769f, 0.871f);   // #B0C4DE
        [SerializeField] private Color runesColor = new Color(0.576f, 0.439f, 0.859f);   // #9370DB

        /// <summary>
        /// Call every frame or on resource change to update the display.
        /// </summary>
        public void UpdateResources(PlayerResources resources, float woodPerHour, float steelPerHour)
        {
            // Amounts
            woodAmount.text = FormatNumber(resources.wood_yggdrasil);
            steelAmount.text = FormatNumber(resources.steel_dwarf);
            runesAmount.text = resources.runes.ToString();

            // Production rates
            woodRate.text = $"+{woodPerHour:F0}/h";
            steelRate.text = $"+{steelPerHour:F0}/h";
        }

        /// <summary>
        /// Flash a resource when the player can't afford something.
        /// </summary>
        public void FlashInsufficientResource(string resourceId)
        {
            TextMeshProUGUI target = resourceId switch
            {
                "wood_yggdrasil" => woodAmount,
                "steel_dwarf" => steelAmount,
                "runes" => runesAmount,
                _ => null
            };

            if (target != null)
            {
                StartCoroutine(FlashRoutine(target));
            }
        }

        private System.Collections.IEnumerator FlashRoutine(TextMeshProUGUI text)
        {
            Color original = text.color;
            for (int i = 0; i < 3; i++)
            {
                text.color = Color.red;
                yield return new WaitForSeconds(0.15f);
                text.color = original;
                yield return new WaitForSeconds(0.15f);
            }
        }

        private string FormatNumber(float value)
        {
            if (value >= 1_000_000) return $"{value / 1_000_000:F1}M";
            if (value >= 1_000) return $"{value / 1_000:F1}K";
            return Mathf.FloorToInt(value).ToString();
        }
    }
}
