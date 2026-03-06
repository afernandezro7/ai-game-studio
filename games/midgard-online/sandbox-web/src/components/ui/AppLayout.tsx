/**
 * AppLayout — Persistent shell: header + resource bar + main content.
 * Header: logo (Cinzel) + nav tabs (Aldea | Mapa | Alianza).
 * Resource bar pinned below header.
 */

import { NavLink } from "react-router-dom";
import ResourceBar from "@/components/resources/ResourceBar";
import { useResources } from "@/hooks/useResources";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const villageId = useAuthStore((s) => s.villageId);
  const runes = useAuthStore((s) => s.user?.runes ?? 0);
  const { wood, clay, iron, wheat, rates, caps, isFull } =
    useResources(villageId);

  // WebSocket: maintain connection + village room + building toast
  useWebSocket(villageId);

  return (
    <div className="app-layout">
      {/* ── Header ── */}
      <header className="app-header">
        <span className="app-header__logo">Midgard Online</span>
        <nav className="app-header__nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "app-header__tab app-header__tab--active"
                : "app-header__tab"
            }
          >
            ⚔️ Aldea
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive
                ? "app-header__tab app-header__tab--active"
                : "app-header__tab"
            }
          >
            🗺️ Mapa
          </NavLink>
          <NavLink
            to="/alliance"
            className={({ isActive }) =>
              isActive
                ? "app-header__tab app-header__tab--active"
                : "app-header__tab"
            }
          >
            🛡️ Alianza
          </NavLink>
        </nav>
      </header>

      {/* ── Pinned resource bar ── */}
      <div className="app-resource-bar">
        <ResourceBar
          wood={wood}
          clay={clay}
          iron={iron}
          wheat={wheat}
          rates={rates}
          caps={caps}
          isFull={isFull}
          runes={runes}
        />
      </div>

      {/* ── Page content ── */}
      <main className="app-content">{children}</main>

      {/* ── Toast notifications ── */}
      <ToastContainer />
    </div>
  );
}
