/**
 * BuildingPanel — Detailed side panel for a selected building.
 *
 * Shows: name, current level stats vs next level stats (side by side),
 * full cost table, build time with Gran Salón reduction, all levels table.
 */

import { useState } from "react";
import type { BuildingData, BuildingLevelStats } from "@/services/buildingService";
import "./BuildingPanel.css";

// ── Props ─────────────────────────────────────────────────────

interface BuildingPanelProps {
  building: BuildingData | null;
  mainBuildingLevel: number;
  resources: { wood: number; clay: number; iron: number; wheat: number };
  hasQueueSlot: boolean;
  onUpgrade: (buildingType: string) => Promise<void>;
  onCancel: (buildingId: string) => Promise<void>;
  onClose?: () => void;
  isUpgrading: boolean;
}

// ── Helpers ───────────────────────────────────────────────────

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function effectiveTime(baseTimeSec: number, mainBuildingLevel: number): number {
  const reduction = Math.min(mainBuildingLevel * 0.03, 0.3);
  return Math.max(10, Math.round(baseTimeSec * (1 - reduction)));
}

function getStatLabel(stats: BuildingLevelStats): { label: string; value: string } {
  if (stats.productionPerHour !== undefined) {
    return { label: "Producción", value: `${fmt(stats.productionPerHour)}/h` };
  }
  if (stats.capacityPerResource !== undefined) {
    return { label: "Capacidad", value: `${fmt(stats.capacityPerResource)} por recurso` };
  }
  if (stats.capacityWheat !== undefined) {
    return { label: "Cap. trigo", value: fmt(stats.capacityWheat) };
  }
  if (stats.buildTimeReduction !== undefined) {
    return { label: "Reducción", value: `${Math.abs(stats.buildTimeReduction)}%` };
  }
  return { label: "—", value: "—" };
}

// ── Component ─────────────────────────────────────────────────

export function BuildingPanel({
  building,
  mainBuildingLevel,
  resources,
  hasQueueSlot,
  onUpgrade,
  onCancel,
  onClose,
  isUpgrading,
}: BuildingPanelProps) {
  const [levelsOpen, setLevelsOpen] = useState(false);

  if (!building) {
    return (
      <div className="building-panel building-panel--empty">
        <p className="building-panel__hint">
          Selecciona un edificio para ver sus detalles
        </p>
      </div>
    );
  }

  const { currentStats, nextLevelCost, nextLevelTimeSec } = building;
  const isUpgradingThis = building.upgradeFinishAt !== null;
  const atMaxLevel = building.level >= building.maxLevel;
  const targetLevel = building.level + 1;

  const canAfford =
    nextLevelCost !== null &&
    resources.wood >= nextLevelCost.wood &&
    resources.clay >= nextLevelCost.clay &&
    resources.iron >= nextLevelCost.iron &&
    resources.wheat >= nextLevelCost.wheat;

  const upgradeEnabled =
    !atMaxLevel && !isUpgradingThis && hasQueueSlot && canAfford;

  // Stats for next level (from building.currentStats shifted one level up — approximated)
  const currentStat = currentStats ? getStatLabel(currentStats) : null;

  const effectiveBuildTime = nextLevelTimeSec
    ? effectiveTime(nextLevelTimeSec, mainBuildingLevel)
    : null;

  const ghReduction = Math.round(Math.min(mainBuildingLevel * 3, 30));

  return (
    <div className="building-panel">
      {onClose && (
        <button className="building-panel__close" onClick={onClose}>
          ✕
        </button>
      )}

      {/* Title */}
      <h2 className="building-panel__title">
        {building.name}
        <span className="building-panel__level-badge">
          {building.level > 0 ? `Lv.${building.level}` : "Sin construir"}
        </span>
      </h2>

      {/* Stats comparison (current vs next) */}
      {!atMaxLevel && currentStat && (
        <div className="building-panel__stats-compare">
          <div className="building-panel__stat-col building-panel__stat-col--current">
            <span className="building-panel__stat-label">Nivel actual</span>
            <span className="building-panel__stat-value">
              {building.level > 0 ? currentStat.value : "—"}
            </span>
          </div>
          <div className="building-panel__stat-arrow">→</div>
          <div className="building-panel__stat-col building-panel__stat-col--next">
            <span className="building-panel__stat-label">Nivel {targetLevel}</span>
            <span className="building-panel__stat-value building-panel__stat-value--next">
              {currentStat.label}
            </span>
          </div>
        </div>
      )}

      {/* Upgrade cost */}
      {!atMaxLevel && !isUpgradingThis && nextLevelCost && (
        <div className="building-panel__cost-section">
          <h3 className="building-panel__section-title">
            Coste Lv.{targetLevel}
          </h3>
          <div className="building-panel__cost-grid">
            <CostRow label="🪵 Madera" need={nextLevelCost.wood} have={resources.wood} />
            <CostRow label="🧱 Arcilla" need={nextLevelCost.clay} have={resources.clay} />
            <CostRow label="⚙️ Hierro" need={nextLevelCost.iron} have={resources.iron} />
            <CostRow label="🌾 Trigo" need={nextLevelCost.wheat} have={resources.wheat} />
          </div>
        </div>
      )}

      {/* Build time */}
      {!atMaxLevel && !isUpgradingThis && effectiveBuildTime !== null && (
        <div className="building-panel__time-section">
          <span className="building-panel__time-label">⏱ Tiempo de construcción:</span>
          <span className="building-panel__time-value">
            {fmtTime(effectiveBuildTime)}
          </span>
          {ghReduction > 0 && (
            <span className="building-panel__time-reduction">
              (−{ghReduction}% Gran Salón Lv.{mainBuildingLevel})
            </span>
          )}
        </div>
      )}

      {/* Upgrade / Cancel button */}
      <div className="building-panel__actions">
        {isUpgradingThis ? (
          <button
            className="building-panel__btn building-panel__btn--cancel"
            onClick={() => void onCancel(building.id)}
            disabled={isUpgrading}
          >
            ✕ Cancelar construcción (reembolso 100%)
          </button>
        ) : atMaxLevel ? (
          <span className="building-panel__max">✅ Nivel máximo alcanzado</span>
        ) : (
          <button
            className={`building-panel__btn ${upgradeEnabled ? "building-panel__btn--upgrade" : "building-panel__btn--disabled"}`}
            onClick={() => void onUpgrade(building.buildingType)}
            disabled={!upgradeEnabled || isUpgrading}
          >
            {isUpgrading ? "Iniciando..." : `▲ Subir a Lv.${targetLevel}`}
          </button>
        )}
      </div>

      {/* All levels table */}
      <div className="building-panel__levels-accordion">
        <button
          className="building-panel__accordion-toggle"
          onClick={() => setLevelsOpen((o) => !o)}
        >
          {levelsOpen ? "▼" : "▶"} Todos los niveles
        </button>
        {levelsOpen && (
          <table className="building-panel__levels-table">
            <thead>
              <tr>
                <th>Nv</th>
                <th>🪵</th>
                <th>🧱</th>
                <th>⚙️</th>
                <th>🌾</th>
                <th>⏱</th>
                <th>Efecto</th>
              </tr>
            </thead>
            <tbody>
              {(building as unknown as { allLevelStats?: BuildingLevelStats[] }).allLevelStats?.map(
                (lvl) => {
                  const stat = getStatLabel(lvl);
                  return (
                    <tr
                      key={lvl.level}
                      className={lvl.level === building.level ? "building-panel__levels-table__current" : ""}
                    >
                      <td>{lvl.level}</td>
                      <td>{fmt(lvl.costs.wood)}</td>
                      <td>{fmt(lvl.costs.clay)}</td>
                      <td>{fmt(lvl.costs.iron)}</td>
                      <td>{fmt(lvl.costs.wheat)}</td>
                      <td>{fmtTime(effectiveTime(lvl.timeSec, mainBuildingLevel))}</td>
                      <td>{stat.value}</td>
                    </tr>
                  );
                },
              ) ?? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                    Datos completos no disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── CostRow sub-component ─────────────────────────────────────

function CostRow({
  label,
  need,
  have,
}: {
  label: string;
  need: number;
  have: number;
}) {
  const ok = have >= need;
  return (
    <div className="building-panel__cost-row">
      <span className="building-panel__cost-row__label">{label}</span>
      <span
        className={`building-panel__cost-row__amount ${ok ? "building-panel__cost-row__amount--ok" : "building-panel__cost-row__amount--low"}`}
      >
        {fmt(need)}
      </span>
      <span className="building-panel__cost-row__have">/ {fmt(have)}</span>
    </div>
  );
}
