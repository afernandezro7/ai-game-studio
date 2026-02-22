import { Link } from "react-router-dom";
import { GAME_REGISTRY } from "../games/registry";

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "pre-production": { label: "Pre-Production", color: "#FF8C00" },
  prototype: { label: "Prototype", color: "#4CAF50" },
  alpha: { label: "Alpha", color: "#2196F3" },
  beta: { label: "Beta", color: "#9C27B0" },
  live: { label: "Live", color: "#4CAF50" },
};

export default function Launcher() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.4em", marginBottom: "8px" }}>
          🎮 AI Game Studio
        </h1>
        <p style={{ color: "#888", fontSize: "16px" }}>
          Multi-agent game development platform — Select a prototype to preview
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {GAME_REGISTRY.map((game) => {
          const badge =
            STATUS_BADGES[game.status] ?? STATUS_BADGES["pre-production"];
          return (
            <Link
              key={game.id}
              to={`/${game.path}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: `2px solid ${game.color}33`,
                  borderRadius: "16px",
                  padding: "28px",
                  background: "#16213e",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = game.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${game.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${game.color}33`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "40px" }}>{game.icon}</span>
                  <span
                    style={{
                      background: badge.color + "22",
                      color: badge.color,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <h2
                  style={{
                    color: game.color,
                    margin: "0 0 8px 0",
                    fontSize: "22px",
                  }}
                >
                  {game.name}
                </h2>

                <p
                  style={{
                    color: "#aaa",
                    margin: "0 0 12px 0",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {game.description}
                </p>

                <div
                  style={{
                    color: "#666",
                    fontSize: "12px",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <span>🎨 {game.theme}</span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Placeholder for adding new games */}
        <div
          style={{
            border: "2px dashed #333",
            borderRadius: "16px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            color: "#444",
          }}
        >
          <span style={{ fontSize: "40px", marginBottom: "12px" }}>➕</span>
          <p style={{ margin: 0, fontSize: "14px" }}>
            New game? Add to <code>games/registry.ts</code>
          </p>
        </div>
      </div>
    </div>
  );
}
