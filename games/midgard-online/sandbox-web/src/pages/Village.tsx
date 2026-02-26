import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getVillage, renameVillage } from "../services/villageService";
import "./Village.css";

// ── Types ─────────────────────────────────────────────────────

interface Resources {
  wood: number;
  clay: number;
  iron: number;
  wheat: number;
  lastUpdated?: string;
}

interface Building {
  id: string;
  buildingType: string;
  level: number;
  slotIndex: number;
  upgradeFinishAt: string | null;
}

interface VillageData {
  id: string;
  name: string;
  mapX: number;
  mapY: number;
  population: number;
  createdAt: string;
  resources: Resources;
  buildings: Building[];
}

// ── Resource icons ────────────────────────────────────────────

const RESOURCE_META: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  wood: { emoji: "🪵", label: "Madera", color: "var(--color-wood, #8B4513)" },
  clay: { emoji: "🧱", label: "Arcilla", color: "var(--color-clay, #CD853F)" },
  iron: { emoji: "⛏️", label: "Hierro", color: "var(--color-iron, #708090)" },
  wheat: { emoji: "🌾", label: "Trigo", color: "var(--color-wheat, #DAA520)" },
};

// ── ResourceBar ───────────────────────────────────────────────

function ResourceBar({ resources }: { resources: Resources }) {
  return (
    <div className="village-resource-bar">
      {(["wood", "clay", "iron", "wheat"] as const).map((key) => {
        const meta = RESOURCE_META[key];
        const val = Math.floor(resources[key] ?? 0);
        return (
          <div key={key} className="village-resource-item">
            <span className="resource-emoji">{meta.emoji}</span>
            <span className="resource-label">{meta.label}</span>
            <span className="resource-value" style={{ color: meta.color }}>
              {val.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── RenameModal ───────────────────────────────────────────────

interface RenameModalProps {
  currentName: string;
  villageId: string;
  onClose: () => void;
  onRenamed: (newName: string) => void;
}

function RenameModal({
  currentName,
  villageId,
  onClose,
  onRenamed,
}: RenameModalProps) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newName: string) => renameVillage(villageId, newName),
    onSuccess: (data: { village: { id: string; name: string } }) => {
      onRenamed(data.village.name);
      void queryClient.invalidateQueries({ queryKey: ["village", villageId] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message ?? "Error al renombrar");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("El nombre no puede estar vacío");
      return;
    }
    if (trimmed.length > 50) {
      setError("Máximo 50 caracteres");
      return;
    }
    mutation.mutate(trimmed);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Renombrar aldea</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            className="modal-input"
            type="text"
            value={name}
            maxLength={50}
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Village page ──────────────────────────────────────────────

export default function Village() {
  const villageId = useAuthStore((s) => s.villageId);
  const username = useAuthStore((s) => s.user?.username ?? "");
  const [showRename, setShowRename] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["village", villageId],
    queryFn: async () => {
      if (!villageId) throw new Error("Sin aldea asociada");
      const res = await getVillage(villageId);
      return res.village as VillageData;
    },
    enabled: !!villageId,
  });

  if (!villageId) {
    return (
      <main className="village-page">
        <div className="village-empty">
          <h1>Sin aldea</h1>
          <p>No se encontró una aldea asociada a tu cuenta.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="village-page">
        <div className="village-loading">Cargando aldea…</div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="village-page">
        <div className="village-error">
          Error: {(error as Error)?.message ?? "No se pudo cargar la aldea"}
        </div>
      </main>
    );
  }

  const village = data;
  const displayName = localName ?? village.name;
  const isDefaultName = displayName === `Aldea de ${username}`;

  return (
    <main className="village-page">
      {/* Header */}
      <header className="village-header">
        <div className="village-title-row">
          <h1 className="village-name">{displayName}</h1>
          <button
            className="btn-rename"
            onClick={() => setShowRename(true)}
            title="Renombrar aldea"
          >
            ✏️
          </button>
        </div>
        <p className="village-coords">
          📍 ({village.mapX}, {village.mapY}) · Población: {village.population}
        </p>
        {isDefaultName && (
          <div className="village-rename-banner">
            <span>¿Quieres ponerle nombre a tu aldea?</span>
            <button className="btn-link" onClick={() => setShowRename(true)}>
              Renombrar
            </button>
          </div>
        )}
      </header>

      {/* Resources */}
      <section className="village-section">
        <h2 className="section-title">Recursos</h2>
        <ResourceBar resources={village.resources} />
      </section>

      {/* Buildings */}
      <section className="village-section">
        <h2 className="section-title">
          Edificios ({village.buildings.length})
        </h2>
        {village.buildings.length === 0 ? (
          <p className="village-empty-text">
            No hay edificios aún. Disponibles en MO-05.
          </p>
        ) : (
          <ul className="building-list">
            {village.buildings.map((b) => (
              <li key={b.id} className="building-item">
                <span className="building-type">{b.buildingType}</span>
                <span className="building-level">Nv. {b.level}</span>
                {b.upgradeFinishAt && (
                  <span className="building-upgrading">🔨 Mejorando…</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {showRename && (
        <RenameModal
          currentName={displayName}
          villageId={village.id}
          onClose={() => setShowRename(false)}
          onRenamed={(n) => setLocalName(n)}
        />
      )}
    </main>
  );
}
