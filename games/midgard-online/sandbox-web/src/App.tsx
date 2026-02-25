import { Routes, Route, Navigate } from "react-router-dom";
import Village from "./pages/Village";
import WorldMap from "./pages/WorldMap";
import Alliance from "./pages/Alliance";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Village />} />
      <Route path="/map" element={<WorldMap />} />
      <Route path="/alliance" element={<Alliance />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
