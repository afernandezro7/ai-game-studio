/**
 * Village — Main game page with 3-column layout.
 * Desktop: [Resource Fields] [Inner Buildings] [Detail Panel]
 * Mobile: stacked with BuildingDetailPanel as bottom sheet.
 */

import { useState } from "react";
import AppLayout from "@/components/ui/AppLayout";
import BuildingSlot, {
  SLOT_DEFINITIONS,
} from "@/components/village/BuildingSlot";
import BuildingDetailPanel from "@/components/buildings/BuildingDetailPanel";
import { useBuildings } from "@/hooks/useBuildings";
import type { BuildingData } from "@/services/buildingService";
import { useResources } from "@/hooks/useResources";
import { useAuthStore } from "@/store/authStore";
import "./Village.css";

/**
 * Picks the representative BuildingData for a given buildingType.
 * Priority: upgrading row first (so the timer is visible), then highest level.
 * Handles multi-slot types (woodcutter×4, claypit×4, ironMine×4, farm×6).
 */
function pickForType(
  type: string,
  buildings: BuildingData[]
): BuildingData | undefined {
  const ofType = buildings.filter((b) => b.buildingType === type);
  const upgrading = ofType.find((b) => b.upgradeFinishAt);
  if (upgrading) return upgrading;
  return ofType.sort((a, b) => b.level - a.level)[0];
}

export default function Village() {
  const villageId = useAuthStore((s) => s.villageId);

  const {
    buildings,
    currentUpgrade,
    upgrade,
    cancel,
    isUpgrading,
    isCancelling,
    isLoading,
    error,
  } = useBuildings(villageId);

  const { wood, clay, iron, wheat } = useResources(villageId);

  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (!villageId) {
    return (
      <AppLayout>
        <div className="village-page__empty">
          <h1>Sin aldea</h1>
          <p>No se encontró una aldea en tu cuenta.</p>
        </div>
      </AppLayout>
    );
  }

  // B-003 fix: use pickForType to handle multi-slot building types correctly.
  const selectedBuilding = selectedType
    ? (pickForType(selectedType, buildings) ?? null)
    : null;
  const mainBuildingLevel = pickForType("mainBuilding", buildings)?.level ?? 0;

  const resources = { wood, clay, iron, wheat };
  const hasQueueSlot = !currentUpgrade;

  const resourceSlots = SLOT_DEFINITIONS.filter((s) => s.slotIndex < 18);
  const innerSlots = SLOT_DEFINITIONS.filter((s) => s.slotIndex >= 18);

  function handleSelectSlot(buildingType: string) {
    setSelectedType((prev) => (prev === buildingType ? null : buildingType));
  }

  async function handleUpgrade(buildingType: string) {
    await upgrade(buildingType);
  }

  async function handleCancel(buildingId: string) {
    await cancel(buildingId);
  }

  return (
    <AppLayout>
      {isLoading && (
        <div className="village-page__loading">Cargando aldea…</div>
      )}
      {error && (
        <div className="village-page__error">
          Error: {(error as Error).message}
        </div>
      )}
      {!isLoading && !error && (
        <div
          className={`village-layout ${selectedBuilding ? "village-layout--panel-open" : ""}`}
        >
          {/* ── Column 1: Resource fields ── */}
          <section className="village-layout__col village-layout__col--resources">
            <h2 className="village-layout__zone-title">Campos de Recursos</h2>
            <div className="village-layout__slot-grid village-layout__slot-grid--4col">
              {resourceSlots.map((slot) => {
                const b = pickForType(slot.buildingType, buildings);
                return (
                  <BuildingSlot
                    key={slot.slotIndex}
                    slot={slot}
                    building={b}
                    onClick={() => handleSelectSlot(slot.buildingType)}
                    isCancelling={isCancelling}
                    onCancel={
                      b?.upgradeFinishAt
                        ? () => void handleCancel(b.id)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </section>

          {/* ── Column 2: Inner buildings ── */}
          <section className="village-layout__col village-layout__col--inner">
            <h2 className="village-layout__zone-title">Centro de la Aldea</h2>
            <div className="village-layout__slot-grid village-layout__slot-grid--3col">
              {innerSlots.map((slot) => {
                const b = pickForType(slot.buildingType, buildings);
                return (
                  <BuildingSlot
                    key={slot.slotIndex}
                    slot={slot}
                    building={b}
                    onClick={() => handleSelectSlot(slot.buildingType)}
                    isCancelling={isCancelling}
                    onCancel={
                      b?.upgradeFinishAt
                        ? () => void handleCancel(b.id)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </section>

          {/* ── Column 3: Detail panel ── */}
          {selectedBuilding && (
            <BuildingDetailPanel
              building={selectedBuilding}
              mainBuildingLevel={mainBuildingLevel}
              resources={resources}
              hasQueueSlot={hasQueueSlot}
              onUpgrade={handleUpgrade}
              onCancel={handleCancel}
              onClose={() => setSelectedType(null)}
              isUpgrading={isUpgrading}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
}
