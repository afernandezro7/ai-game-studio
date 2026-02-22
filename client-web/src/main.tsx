import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Launcher from "./pages/Launcher";
import ValhallaPrototype from "./games/valhalla/ValhallaPrototype";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Launcher />} />
          <Route path="valhalla" element={<ValhallaPrototype />} />
          {/* Add new game routes here:
            <Route path="samurai" element={<SamuraiPrototype />} />
          */}
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
