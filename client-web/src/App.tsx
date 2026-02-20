import { useState, useEffect } from "react";
import resourcesConfig from "../../src/config/ResourcesConfig.json";
import buildingsConfig from "../../src/config/BuildingsConfig.json";
import "./App.css";

interface ResourceState {
  wood_yggdrasil: number;
  steel_dwarf: number;
  runes: number;
}

interface BuildingState {
  [key: string]: number;
}

function App() {
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

        // Pasiva del Gran Salón
        const ghStart = buildingsConfig.buildings.find(
          (b) => b.id === "great_hall",
        );
        const ghLevel = buildings["great_hall"] || 0;
        if (ghStart && ghLevel > 0) {
          const stats = ghStart.levels.find((l) => l.level === ghLevel);
          // @ts-ignore
          if (stats && stats.passiveProduction) {
            // @ts-ignore
            woodProd += stats.passiveProduction.wood_yggdrasil || 0;
            // @ts-ignore
            steelProd += stats.passiveProduction.steel_dwarf || 0;
          }
        }

        // Aserradero
        const lmStart = buildingsConfig.buildings.find(
          (b) => b.id === "lumber_mill",
        );
        const lmLevel = buildings["lumber_mill"] || 0;
        if (lmStart && lmLevel > 0) {
          const stats = lmStart.levels.find((l) => l.level === lmLevel);
          // @ts-ignore
          if (stats) woodProd += stats.productionRatePerHour || 0;
        }

        // Mina
        const smStart = buildingsConfig.buildings.find(
          (b) => b.id === "steel_mine",
        );
        const smLevel = buildings["steel_mine"] || 0;
        if (smStart && smLevel > 0) {
          const stats = smStart.levels.find((l) => l.level === smLevel);
          // @ts-ignore
          if (stats) steelProd += stats.productionRatePerHour || 0;
        }

        // Production is per HOUR in config, so divide by 3600 for per SECOND
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

    // Check cost
    if (
      resources.wood_yggdrasil >= nextLevelStats.cost.wood_yggdrasil &&
      resources.steel_dwarf >= nextLevelStats.cost.steel_dwarf
    ) {
      // Pay cost
      setResources((prev) => ({
        ...prev,
        wood_yggdrasil:
          prev.wood_yggdrasil - nextLevelStats.cost.wood_yggdrasil,
        steel_dwarf: prev.steel_dwarf - nextLevelStats.cost.steel_dwarf,
      }));

      // Upgrade
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
    <div className="app-container">
      <h1>Project Valhalla - Web Prototype</h1>

      <div className="resources-panel">
        <div
          className="resource-card wooden"
          style={{
            border: "2px solid #8B4513",
            padding: "10px",
            background: "#D2691E",
            color: "white",
          }}
        >
          <h3>🌲 Madera</h3>
          <p>{Math.floor(resources.wood_yggdrasil)}</p>
        </div>
        <div
          className="resource-card steel"
          style={{
            border: "2px solid #708090",
            padding: "10px",
            background: "#B0C4DE",
            color: "black",
          }}
        >
          <h3>⛏️ Acero</h3>
          <p>{Math.floor(resources.steel_dwarf)}</p>
        </div>
        <div
          className="resource-card rune"
          style={{
            border: "2px solid #4B0082",
            padding: "10px",
            background: "#9370DB",
            color: "white",
          }}
        >
          <h3>💎 Runas</h3>
          <p>{Math.floor(resources.runes)}</p>
        </div>
      </div>

      <div
        className="buildings-grid"
        style={{ display: "flex", gap: "20px", marginTop: "20px" }}
      >
        {buildingsConfig.buildings.map((b) => {
          const currentLevel = buildings[b.id] || 0;
          const nextLevel =
            b.levels.find((l) => l.level === currentLevel + 1) || null;

          return (
            <div
              key={b.id}
              className="building-card"
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "8px",
                width: "300px",
              }}
            >
              <h3>
                {b.name} (Lvl {currentLevel})
              </h3>
              <p>{b.description}</p>

              {nextLevel ? (
                <button
                  onClick={() => build(b.id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Mejorar/Construir <br />
                  (Coste: 🌲 {nextLevel.cost.wood_yggdrasil} | ⛏️{" "}
                  {nextLevel.cost.steel_dwarf})
                </button>
              ) : (
                <button disabled>Nivel Máximo Alcanzado</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
