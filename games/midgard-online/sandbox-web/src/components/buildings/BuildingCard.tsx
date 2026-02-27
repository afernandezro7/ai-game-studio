/**
 * BuildingCard — compact card for a single building.
 *
 * Shows: name, level, production/capacity stats, upgrade cost,
 * build time, upgrade/cancel button, and a countdown when upgrading.
 */

import { useEffect, useState, useCallback } from "react";
import type { BuildingData } from "@/services/buildingService";
import "./BuildingCard.css";

// ── Helper types ──────────────────────────────────────────────

interface BuildingCardProps {
  building: BuildingData;
  resources: { wood: number; clay: number; iron: number; wheat: number };
  hasQueueSlot: boolean; // false if another building is upgrading
  onUpgrade: () => Promise<void>;
  onCancel: () => Promise<void>;
  isUpgrading: boolean;
  isCancelling: boolean;
}

// ── Helpers ───────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function buildingEmoji(buildingType: string): string {
  const map: Record<string, string> = {
    woodcutter: "🪵",
    claypit: "🧱",
    ironMine: "⚙️",
    farm: "🌾",
    mainBuilding: "🏛️",
    warehouse: "📦",
    granary: "🌽",
    barracks: "⚔️",
    stable: "🐴",
    workshop: "🔨",
    marketplace: "🏪",
    embassy: "🤝",
    academy: "📚",
  };
  return map[buildingType] ?? "🏗️";
}

// ── Component ─────────────────────────────────────────────────

export function BuildingCard({
  building,
  resources,
  hasQueueSlot,
  onUpgrade,
  onCancel,
  isUpgrading,
  isCancelling,
}: BuildingCardProps) {
  const [countdown, setCountdown] = useState(0);

  // Countdown ticker
  useEffect(() => {
    if (!building.upgradeFinishAt) {
      setCountdown(0);
      return;
    }
    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(building.upgradeFinishAt!).getTime() - Date.now()) / 1000,
        ),
      );
      setCountdown(remaining);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [building.upgradeFinishAt]);

  const isUnderConstruction = building.upgradeFinishAt !== null;
  const atMaxLevel = building.level >= building.maxLevel;
  const cost = building.nextLevelCost;

  const canAfford =
    cost !== null &&
    resources.wood >= cost.wood &&
    resources.clay >= cost.clay &&
    resources.iron >= cost.iron &&
    resources.wheat >= cost.wheat;

  const upgradeEnabled =
    !atMaxLevel && !isUnderConstruction && hasQueueSlot && canAfford;

  // Current stats label
  const stats = building.currentStats;
  let statsLabel: string | null = null;
  if (stats) {
    if (stats.productionPerHour !== undefined) {
      statsLabel = `+${formatNumber(stats.productionPerHour)}/h`;
    } else if (stats.capacityPerResource !== undefined) {
      statsLabel = `${formatNumber(stats.capacityPerResource)} cap`;
    } else if (stats.capacityWheat !== undefined) {
      statsLabel = `${formatNumber(stats.capacityWheat)} cap`;
    } else if (stats.buildTimeReduction !== undefined) {
      statsLabel = `${stats.buildTimeReduction}% build time`;
    }
  }

  const handleUpgrade = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void onUpgrade();
    },
    [onUpgrade],
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void onCancel();
    },
    [onCancel],
  );

  return (
    <div
      className={`building-card ${isUnderConstruction ? "building-card--upgrading" : ""} ${building.level === 0 ? "building-card--empty" : ""}`}
    >
      {/* Header */}
      <div className="building-card__header">
        <span className="building-card__emoji">
          {buildingEmoji(building.buildingType)}
        </span>
        <div className="building-card__title">
          <span className="building-card__name">{building.name}</span>
          <span className="building-card__level">
            {building.level > 0 ? `Lv.${building.level}` : "Sin construir"}
          </span>
        </div>
        {statsLabel && (
          <span className="building-card__stats">{statsLabel}</span>
        )}
      </div>

      {/* Upgrade progress or cost */}
      {isUnderConstruction ? (
        <div className="building-card__progress-section">
          <div className="building-card__countdown">
            🔨 {formatTime(countdown)} restante
          </div>
          <div className="building-card__progress-bar">
            <div
              className="building-card__progress-fill"
              style={{
                width: building.nextLevelTimeSec
                  ? `${Math.max(0, Math.min(100, 100 - (countdown / building.nextLevelTimeSec) * 100))}%`
                  : "50%",
              }}
            />
          </div>
          <button
            className="building-card__btn building-card__btn--cancel"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelando..." : "✕ Cancelar"}
          </button>
        </div>
      ) : (
        <div className="building-card__upgrade-section">
          {!atMaxLevel && cost && (
            <div className="building-card__costs">
              <CostItem label="🪵" amount={cost.wood} have={resources.wood} />
              <CostItem label="🧱" amount={cost.clay} have={resources.clay} />
              <CostItem label="⚙️" amount={cost.iron} have={resources.iron} />
              <CostItem label="🌾" amount={cost.wheat} have={resources.wheat} />
              {building.nextLevelTimeSec && (
                <span className="building-card__time">
                  ⏱ {formatTime(building.nextLevelTimeSec)}
                </span>
              )}
            </div>
          )}
          {atMaxLevel ? (
            <span className="building-card__max-badge">MAX</span>
          ) : (
            <button
              className={`building-card__btn ${upgradeEnabled ? "building-card__btn--upgrade" : "building-card__btn--disabled"}`}
              onClick={handleUpgrade}
              disabled={!upgradeEnabled || isUpgrading}
              title={
                !hasQueueSlot
                  ? "Otro edificio en construcción"
                  : !canAfford
                    ? "Recursos insuficientes"
                    : ""
              }
            >
              {isUpgrading ? "..." : `▲ Lv.${building.level + 1}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── CostItem sub-component ────────────────────────────────────

function CostItem({
  label,
  amount,
  have,
}: {
  label: string;
  amount: number;
  have: number;
}) {
  return (
    <span
      className={`building-card__cost-item ${have >= amount ? "building-card__cost-item--ok" : "building-card__cost-item--low"}`}
    >
      {label} {formatNumber(amount)}
    </span>
  );
}
