/**
 * BuildingSlot — A single cell in the village grid.
 * States: empty (Lv.0), built (Lv>0), upgrading (upgradeFinishAt set).
 */

import type { BuildingData } from "@/services/buildingService";
import ConstructionTimer from "@/components/buildings/ConstructionTimer";
import "./BuildingSlot.css";

// ── Types ─────────────────────────────────────────────────────

interface SlotDef {
  slotIndex: number;
  buildingType: string;
  label: string;
  emoji: string;
}

interface BuildingSlotProps {
  slot: SlotDef;
  building?: BuildingData;
  onClick: () => void;
  isCancelling?: boolean;
  onCancel?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────

export const SLOT_DEFINITIONS: SlotDef[] = [
  ...Array.from(
    { length: 4 },
    (_, i): SlotDef => ({
      slotIndex: i,
      buildingType: "woodcutter",
      label: "Leñador",
      emoji: "🪵",
    }),
  ),
  ...Array.from(
    { length: 4 },
    (_, i): SlotDef => ({
      slotIndex: 4 + i,
      buildingType: "claypit",
      label: "Cantera",
      emoji: "🧱",
    }),
  ),
  ...Array.from(
    { length: 4 },
    (_, i): SlotDef => ({
      slotIndex: 8 + i,
      buildingType: "ironMine",
      label: "Mina",
      emoji: "⚙️",
    }),
  ),
  ...Array.from(
    { length: 6 },
    (_, i): SlotDef => ({
      slotIndex: 12 + i,
      buildingType: "farm",
      label: "Granja",
      emoji: "🌾",
    }),
  ),
  {
    slotIndex: 18,
    buildingType: "mainBuilding",
    label: "Gran Salón",
    emoji: "🏛️",
  },
  { slotIndex: 19, buildingType: "warehouse", label: "Almacén", emoji: "📦" },
  { slotIndex: 20, buildingType: "granary", label: "Granero", emoji: "🌽" },
];

// ── Component ─────────────────────────────────────────────────

export default function BuildingSlot({
  slot,
  building,
  onClick,
  isCancelling,
  onCancel,
}: BuildingSlotProps) {
  const isUpgrading = !!building?.upgradeFinishAt;
  const level = building?.level ?? 0;
  const isBuilt = level > 0;

  let stateClass = "building-slot--empty";
  if (isUpgrading) stateClass = "building-slot--upgrading";
  else if (isBuilt) stateClass = "building-slot--built";

  return (
    <button
      className={`building-slot ${stateClass}`}
      onClick={onClick}
      aria-label={`${slot.label} Lv.${level}`}
    >
      <span className="building-slot__emoji">{slot.emoji}</span>
      <span className="building-slot__label">{slot.label}</span>
      {isBuilt && !isUpgrading && (
        <span className="building-slot__level">Lv.{level}</span>
      )}
      {isUpgrading && building && (
        <div className="building-slot__timer-overlay">
          <ConstructionTimer
            upgradeFinishAt={building.upgradeFinishAt!}
            effectiveBuildTimeSec={building.effectiveBuildTimeSec}
            onCancel={onCancel}
            isCancelling={isCancelling}
            compact
          />
        </div>
      )}
    </button>
  );
}

export type { SlotDef };
