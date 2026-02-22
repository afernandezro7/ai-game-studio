import { Link, Outlet, useLocation } from "react-router-dom";
import { GAME_REGISTRY } from "../games/registry";

export default function Layout() {
  const location = useLocation();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Top Navigation Bar */}
      <nav
        style={{
          background: "#1a1a2e",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          borderBottom: "2px solid #16213e",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#DAA520",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🎮 AI Game Studio
        </Link>

        <div
          style={{
            width: "1px",
            height: "24px",
            background: "#333",
          }}
        />

        {GAME_REGISTRY.map((game) => {
          const isActive = location.pathname.startsWith(`/${game.path}`);
          return (
            <Link
              key={game.id}
              to={`/${game.path}`}
              style={{
                color: isActive ? game.color : "#888",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? "bold" : "normal",
                padding: "6px 12px",
                borderRadius: "6px",
                background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {game.icon} {game.name}
            </Link>
          );
        })}

        <div style={{ flex: 1 }} />

        <span
          style={{
            color: "#555",
            fontSize: "12px",
            fontStyle: "italic",
          }}
        >
          Sandbox — NOT the final game
        </span>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}
