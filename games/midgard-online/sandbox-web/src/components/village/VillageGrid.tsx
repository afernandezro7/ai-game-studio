/**
 * VillageGrid — Two-zone grid: resource fields (outer) + inner buildings.
 * Zone 1 (slotIndex 0-17):  4×woodcutter  4×claypit  4×ironMine  6×farm
 * Zone 2 (slotIndex 18-20): mainBuilding  warehouse  granary
 */

import type { BuildingData } from "@/services/buildingService";
import BuildingSlot, { SLOT_DEFINITIONS } from "./BuildingSlot";
import "./VillageGrid.css";
import "./BuildingSlot.css";

interface VillageGridProps {
  buildings: BuildingData[];
  selectedBuildingType: string | null;
  onSelectSlot: (buildingType: string) => void;
  isCancelling: boolean;
  onCancel: (buildingId: string) => void;
}

export default function VillageGrid({
  buildings,
  selectedBuildingType,
  onSelectSlot,
  isCancelling,
  onCancel,
}: VillageGridProps) {
  const buildingByType = new Map(buildings.map((b) => [b.buildingType, b]));

  const resourceSlots = SLOT_DEFINITIONS.filter((s) => s.slotIndex < 18);
  const innerSlots = SLOT_DEFINITIONS.filter((s) => s.slotIndex >= 18);

  return (
    <div className="village-grid">
      {/* Zone 1 — Resource fields */}
      <section className="village-grid__zone village-grid__zone--resources">
        <h3 className="village-grid__zone-title">Campos de Recursos</h3>
        <div className="village-grid__resource-cells">
          {resourceSlots.map((slot) => {
            const building = buildingByType.get(slot.buildingType);
            const upgradingBuilding = buildings.find(
              (b) => b.buildingType === slot.buildingType && b.upgradeFinishAt,
            );
            return (
              <div
                key={slot.slotIndex}
                className={`village-grid__cell ${selectedBuildingType === slot.buildingType ? "village-grid__cell--selected" : ""}`}
              >
                <BuildingSlot
                  slot={slot}
                  building={building}
                  onClick={() => onSelectSlot(slot.buildingType)}
                  isCancelling={isCancelling}
                  onCancel={
                    upgradingBuilding
                      ? () => onCancel(upgradingBuilding.id)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Zone 2 — Inner buildings */}
      <section className="village-grid__zone village-grid__zone--inner">
        <h3 className="village-grid__zone-title">Centro de la Aldea</h3>
        <div className="village-grid__inner-cells">
          {innerSlots.map((slot) => {
            const building = buildingByType.get(slot.buildingType);
            return (
              <div
                key={slot.slotIndex}
                className={`village-grid__cell ${selectedBuildingType === slot.buildingType ? "village-grid__cell--selected" : ""}`}
              >
                <BuildingSlot
                  slot={slot}
                  building={building}
                  onClick={() => onSelectSlot(slot.buildingType)}
                  isCancelling={isCancelling}
                  onCancel={
                    building?.upgradeFinishAt
                      ? () => onCancel(building.id)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
