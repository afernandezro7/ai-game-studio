import { useState, useEffect } from "react";
import resourcesConfig from "../../../../games/valhalla/config/ResourcesConfig.json";
import buildingsConfig from "../../../../games/valhalla/config/BuildingsConfig.json";

interface ResourceState {
  wood_yggdrasil: number;
  steel_dwarf: number;
  runes: number;
}

interface BuildingState {
  [key: string]: number;
}

export default function ValhallaPrototype() {
  const [resources, setResources] = useState<ResourceState>(
    resourcesConfig.initialResources,
  );
  const [buildings, setBuildings] = useState<BuildingState>({
    great_hall: 1,
    lumber_mill: 0,
    steel_mine: 0,
  });

  // Production Loop (every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prev) => {
        let woodProd = 0;
        let steelProd = 0;

        // Great Hall passive production
        const ghConfig = buildingsConfig.buildings.find(
          (b) => b.id === "great_hall",
        );
        const ghLevel = buildings["great_hall"] || 0;
        if (ghConfig && ghLevel > 0) {
          const stats = ghConfig.levels.find((l) => l.level === ghLevel);
          if (stats && "passiveProduction" in stats) {
            const passive = stats.passiveProduction as Record<string, number>;
            woodProd += passive.wood_yggdrasil || 0;
            steelProd += passive.steel_dwarf || 0;
          }
        }

        // Lumber Mill
        const lmConfig = buildingsConfig.buildings.find(
          (b) => b.id === "lumber_mill",
        );
        const lmLevel = buildings["lumber_mill"] || 0;
        if (lmConfig && lmLevel > 0) {
          const stats = lmConfig.levels.find((l) => l.level === lmLevel);
          if (stats && "productionRatePerHour" in stats) {
            woodProd += (stats as { productionRatePerHour: number })
              .productionRatePerHour;
          }
        }

        // Steel Mine
        const smConfig = buildingsConfig.buildings.find(
          (b) => b.id === "steel_mine",
        );
        const smLevel = buildings["steel_mine"] || 0;
        if (smConfig && smLevel > 0) {
          const stats = smConfig.levels.find((l) => l.level === smLevel);
          if (stats && "productionRatePerHour" in stats) {
            steelProd += (stats as { productionRatePerHour: number })
              .productionRatePerHour;
          }
        }

        // Production is per HOUR in config, divide by 3600 for per SECOND
        return {
          ...prev,
          wood_yggdrasil: prev.wood_yggdrasil + woodProd / 3600,
          steel_dwarf: prev.steel_dwarf + steelProd / 3600,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [buildings]);

  const build = (buildingId: string) => {
    const currentLevel = buildings[buildingId] || 0;
    const config = buildingsConfig.buildings.find((b) => b.id === buildingId);
    if (!config) return;

    const nextLevelStats = config.levels.find(
      (l) => l.level === currentLevel + 1,
    );

    if (!nextLevelStats) {
      alert("Max Level Reached!");
      return;
    }

    if (
      resources.wood_yggdrasil >= nextLevelStats.cost.wood_yggdrasil &&
      resources.steel_dwarf >= nextLevelStats.cost.steel_dwarf
    ) {
      setResources((prev) => ({
        ...prev,
        wood_yggdrasil:
          prev.wood_yggdrasil - nextLevelStats.cost.wood_yggdrasil,
        steel_dwarf: prev.steel_dwarf - nextLevelStats.cost.steel_dwarf,
      }));

      setBuildings((prev) => ({
        ...prev,
        [buildingId]: currentLevel + 1,
      }));
    } else {
      alert(
        "Not enough resources! Need: " + JSON.stringify(nextLevelStats.cost),
      );
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, color: "#DAA520" }}>⚔️ Project Valhalla</h1>
        <span
          style={{
            background: "#FF8C0022",
            color: "#FF8C00",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Pre-Production
        </span>
      </div>

      {/* Resource Bar */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div
          style={{
            flex: 1,
            border: "2px solid #8B4513",
            padding: "16px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            🪵 Madera Yggdrasil
          </div>
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {Math.floor(resources.wood_yggdrasil)}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            border: "2px solid #708090",
            padding: "16px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #708090 0%, #B0C4DE 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8 }}>⛏️ Acero Enano</div>
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {Math.floor(resources.steel_dwarf)}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            border: "2px solid #4B0082",
            padding: "16px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #4B0082 0%, #9370DB 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.8 }}>💎 Runas</div>
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {Math.floor(resources.runes)}
          </div>
        </div>
      </div>

      {/* Buildings */}
      <h2 style={{ color: "#ccc", marginBottom: "16px" }}>🏗️ Edificios</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {buildingsConfig.buildings.map((b) => {
          const currentLevel = buildings[b.id] || 0;
          const nextLevel =
            b.levels.find((l) => l.level === currentLevel + 1) || null;

          return (
            <div
              key={b.id}
              style={{
                border: "1px solid #333",
                padding: "20px",
                borderRadius: "12px",
                width: "280px",
                background: "#16213e",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, color: "#DAA520" }}>{b.name}</h3>
                <span
                  style={{
                    background: "#DAA52022",
                    color: "#DAA520",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Lvl {currentLevel}
                </span>
              </div>
              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  margin: "8px 0 16px",
                }}
              >
                {b.description}
              </p>

              {nextLevel ? (
                <button
                  onClick={() => build(b.id)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {currentLevel === 0 ? "Construir" : "Mejorar"} → Lvl{" "}
                  {nextLevel.level}
                  <br />
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>
                    🪵 {nextLevel.cost.wood_yggdrasil} | ⛏️{" "}
                    {nextLevel.cost.steel_dwarf}
                  </span>
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    opacity: 0.5,
                  }}
                >
                  Nivel Máximo
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
