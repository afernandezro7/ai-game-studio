/**
 * ResourceBar — Persistent top bar showing all 4 resources.
 *
 * Displays: 🪵 Wood: 750/1200 (+45/h) with progress bar and FULL badge.
 * Updates every second via client-side interpolation (useResources hook).
 */

import type { StorageCaps, ProductionRates } from "@/hooks/useResources";
import "./ResourceBar.css";

// ── Types ────────────────────────────────────────────────────

interface ResourceBarProps {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
  rates: ProductionRates;
  caps: StorageCaps;
  isFull: { wood: boolean; clay: boolean; iron: boolean; wheat: boolean };
  runes?: number; // from authStore.user.runes (premium currency)
}

// ── Resource config ──────────────────────────────────────────

const RESOURCES = [
  {
    key: "wood" as const,
    emoji: "🪵",
    label: "Madera",
    colorVar: "--res-wood",
    rateKey: "woodPerHour" as const,
    capKey: "woodCap" as const,
  },
  {
    key: "clay" as const,
    emoji: "🧱",
    label: "Arcilla",
    colorVar: "--res-clay",
    rateKey: "clayPerHour" as const,
    capKey: "clayCap" as const,
  },
  {
    key: "iron" as const,
    emoji: "⚙️",
    label: "Hierro",
    colorVar: "--res-iron",
    rateKey: "ironPerHour" as const,
    capKey: "ironCap" as const,
  },
  {
    key: "wheat" as const,
    emoji: "🌾",
    label: "Trigo",
    colorVar: "--res-wheat",
    rateKey: "wheatPerHour" as const,
    capKey: "wheatCap" as const,
  },
] as const;

// ── Helpers ──────────────────────────────────────────────────

function fmt(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return Math.floor(value).toString();
}

function fmtRate(rate: number): string {
  const abs = Math.abs(Math.round(rate));
  return rate >= 0 ? `+${abs}/h` : `-${abs}/h`;
}

// ── Component ────────────────────────────────────────────────

export default function ResourceBar({
  wood,
  clay,
  iron,
  wheat,
  rates,
  caps,
  isFull,
  runes,
}: ResourceBarProps) {
  const values = { wood, clay, iron, wheat };

  return (
    <div
      className="resource-bar"
      role="status"
      aria-label="Recursos de la aldea"
    >
      {RESOURCES.map((res) => {
        const value = values[res.key];
        const cap = caps[res.capKey];
        const rate = rates[res.rateKey];
        const full = isFull[res.key];
        const pct = Math.min(100, (value / cap) * 100);
        const isNegative = rate < 0;

        return (
          <div
            key={res.key}
            className={`resource-bar__item ${full ? "resource-bar__item--full" : ""}`}
            title={`${res.label}: ${Math.floor(value)} / ${fmt(cap)} (${fmtRate(rate)})`}
          >
            <span className="resource-bar__emoji" aria-hidden="true">
              {res.emoji}
            </span>

            <div className="resource-bar__info">
              <div className="resource-bar__numbers">
                <span className="resource-bar__value">{fmt(value)}</span>
                <span className="resource-bar__sep">/</span>
                <span className="resource-bar__cap">{fmt(cap)}</span>
                <span
                  className={`resource-bar__rate ${isNegative ? "resource-bar__rate--negative" : ""}`}
                >
                  {fmtRate(rate)}
                </span>
              </div>

              <div className="resource-bar__track" aria-hidden="true">
                <div
                  className="resource-bar__fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: `var(${res.colorVar})`,
                  }}
                />
              </div>
            </div>

            {full && (
              <span
                className="resource-bar__full-badge"
                aria-label="Almacenamiento lleno"
              >
                FULL
              </span>
            )}
          </div>
        );
      })}

      {/* ── Runas (premium, separate) ── */}
      {runes !== undefined && (
        <div
          className="resource-bar__item resource-bar__item--premium"
          title={`Runas de Odín: ${runes}`}
        >
          <span className="resource-bar__emoji" aria-hidden="true">
            ᚱ
          </span>
          <div className="resource-bar__info">
            <div className="resource-bar__numbers">
              <span className="resource-bar__value resource-bar__value--premium">
                {fmt(runes)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
