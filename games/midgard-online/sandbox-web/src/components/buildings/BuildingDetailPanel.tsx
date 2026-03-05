/**
 * BuildingDetailPanel — Positioned wrapper around BuildingPanel.
 * Desktop: fixed right column. Mobile: bottom sheet modal.
 * Adds Norse flavor text header per building type.
 */

import type { BuildingData } from "@/services/buildingService";
import { BuildingPanel } from "@/components/buildings/BuildingPanel";
import "./BuildingDetailPanel.css";

// ── Norse flavor text ─────────────────────────────────────────

const FLAVOR: Record<string, string> = {
  woodcutter:
    "Los leñadores de Yggdrasil talan el bosque sagrado bajo la sombra del Gran Árbol.",
  claypit:
    "Las canteras de Midgard extraen la arcilla que da forma a los muros de la aldea.",
  ironMine:
    "Los enanos forjan su destino en las profundidades de la tierra, extrayendo hierro rúnico.",
  farm: "Los campos de Freya sustituyen la sangre de la guerra por el grano de la vida.",
  mainBuilding:
    "El Gran Salón alberga el espíritu de la aldea. Su tamaño reduce el tiempo de toda construcción.",
  warehouse:
    "El almacén protege la madera, arcilla y hierro de los saqueos enemigos.",
  granary:
    "El granero guarda el trigo que alimenta a guerreros y aldeanos por igual.",
  barracks:
    "En el cuartel de Odín se forjan los guerreros que defenderán o conquistarán.",
  stable:
    "Las cuadras albergan los caballos de guerra que rompen las líneas enemigas.",
  workshop:
    "El taller élite construye las máquinas de asedio que derrumban murallas.",
  marketplace:
    "En el mercado se intercambian los excedentes entre aldeas aliadas.",
  embassy:
    "La embajada forja los lazos diplomáticos con otras aldeas del Midgard.",
  academy:
    "En la academia se descubren las artes olvidadas de la guerra nórdica.",
};

// ── Props ───────────────────────────────────────────────────

interface BuildingDetailPanelProps {
  building: BuildingData | null;
  mainBuildingLevel: number;
  resources: { wood: number; clay: number; iron: number; wheat: number };
  hasQueueSlot: boolean;
  onUpgrade: (buildingType: string) => Promise<void>;
  onCancel: (buildingId: string) => Promise<void>;
  onClose: () => void;
  isUpgrading: boolean;
}

// ── Component ─────────────────────────────────────────────────

export default function BuildingDetailPanel({
  building,
  mainBuildingLevel,
  resources,
  hasQueueSlot,
  onUpgrade,
  onCancel,
  onClose,
  isUpgrading,
}: BuildingDetailPanelProps) {
  if (!building) return null;

  const flavor =
    FLAVOR[building.buildingType] ?? "Un edificio de la aldea nórdica.";

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="detail-panel__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="detail-panel"
        role="complementary"
        aria-label={`Detalles: ${building.name}`}
      >
        {/* Norse flavor */}
        <p className="detail-panel__flavor">{flavor}</p>

        {/* Delegate to BuildingPanel for full stat/cost display */}
        <BuildingPanel
          building={building}
          mainBuildingLevel={mainBuildingLevel}
          resources={resources}
          hasQueueSlot={hasQueueSlot}
          onUpgrade={onUpgrade}
          onCancel={onCancel}
          onClose={onClose}
          isUpgrading={isUpgrading}
        />
      </aside>
    </>
  );
}
