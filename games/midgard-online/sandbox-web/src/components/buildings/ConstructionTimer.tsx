/**
 * ConstructionTimer — Countdown + progress bar for active building upgrades.
 * Used inside BuildingSlot overlay and BuildingDetailPanel.
 */

import { useEffect, useState } from "react";
import "./ConstructionTimer.css";

interface ConstructionTimerProps {
  upgradeFinishAt: string; // ISO date string
  /** base build time in seconds (for progress bar denominator) */
  effectiveBuildTimeSec: number | null;
  onCancel?: () => void;
  isCancelling?: boolean;
  compact?: boolean; // slot overlay uses compact mode
}

function fmtCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function ConstructionTimer({
  upgradeFinishAt,
  effectiveBuildTimeSec,
  onCancel,
  isCancelling,
  compact = false,
}: ConstructionTimerProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const r = Math.max(
        0,
        Math.ceil((new Date(upgradeFinishAt).getTime() - Date.now()) / 1000),
      );
      setRemaining(r);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [upgradeFinishAt]);

  const totalSec = effectiveBuildTimeSec ?? 1;
  const elapsed = totalSec - remaining;
  const pct = Math.min(100, Math.max(0, (elapsed / totalSec) * 100));

  return (
    <div
      className={`construction-timer ${compact ? "construction-timer--compact" : ""}`}
    >
      <span className="construction-timer__countdown" aria-live="polite">
        🔨 {fmtCountdown(remaining)}
      </span>
      <div
        className="construction-timer__bar"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="construction-timer__fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      {onCancel && !compact && (
        <button
          className="construction-timer__cancel"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelando…" : "Cancelar"}
        </button>
      )}
    </div>
  );
}
