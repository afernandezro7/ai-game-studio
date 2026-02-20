import { test, expect } from "@playwright/test";
import resources from "../../src/config/ResourcesConfig.json" with { type: "json" };
import buildings from "../../src/config/BuildingsConfig.json" with { type: "json" };

test.describe("Valhalla Economy", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load initial resources from JSON", async ({ page }) => {
    // Check Wood
    await expect(
      page.getByRole("heading", { name: "🌲 Madera" }),
    ).toBeVisible();
    await expect(page.locator(".resource-card.wooden p")).toHaveText(
      String(resources.initialResources.wood_yggdrasil),
    );

    // Check Steel
    await expect(page.getByRole("heading", { name: "⛏️ Acero" })).toBeVisible();
    await expect(page.locator(".resource-card.steel p")).toHaveText(
      String(resources.initialResources.steel_dwarf),
    );
  });

  test("should allow upgrading a building if resources are sufficient", async ({
    page,
  }) => {
    // Find Lumber Mill upgrade button
    const lumberMill = buildings.buildings.find((b) => b.id === "lumber_mill");
    const level1Cost = lumberMill?.levels.find((l) => l.level === 1)?.cost;

    // Wait, the button text is dynamic: "Mejorar/Construir (Coste: 🌲 100 | ⛏️ 0)"
    // Let's target by text content partial match or structure

    // Target the specific button for Lumber Mill based on the card structure
    const lumberCard = page
      .locator(".building-card")
      .filter({ hasText: "Aserradero de Yggdrasil" });
    const upgradeBtn = lumberCard.getByRole("button", {
      name: "Mejorar/Construir",
    });

    await expect(upgradeBtn).toBeEnabled();

    // Click Upgrade
    await upgradeBtn.click();

    // Verify Resources Decreased
    const expectedWood =
      resources.initialResources.wood_yggdrasil -
      (level1Cost?.wood_yggdrasil || 0);
    await expect(page.locator(".resource-card.wooden p")).toHaveText(
      String(expectedWood),
    );

    // Verify Level Increased
    await expect(lumberCard.getByRole("heading")).toHaveText(
      "Aserradero de Yggdrasil (Lvl 1)",
    );
  });
});
