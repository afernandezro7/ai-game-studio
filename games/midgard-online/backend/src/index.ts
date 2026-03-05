import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { env } from "./config/env.js";
import { setupSocketServer } from "./ws/socketServer.js";
import { startProductionTick } from "./cron/productionTick.js";
import { startBuildingChecker } from "./cron/buildingChecker.js";
import { authRouter } from "./routes/auth.js";
import { villagesRouter } from "./routes/villages.js";
import { buildingsRouter } from "./routes/buildings.js";
import { troopsRouter } from "./routes/troops.js";
import { combatRouter } from "./routes/combat.js";
import { mapRouter } from "./routes/map.js";
import { alliancesRouter } from "./routes/alliances.js";

const app = express();
const httpServer = createServer(app);

// ── Middleware ──
app.use(helmet());
app.use(cors({ origin: env.WS_CORS_ORIGIN }));
app.use(express.json());

// ── Health check ──
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    game: "midgard-online",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use("/api/auth", authRouter);
app.use("/api/villages", villagesRouter);
app.use("/api/buildings", buildingsRouter);
app.use("/api/troops", troopsRouter);
app.use("/api/combat", combatRouter);
app.use("/api/map", mapRouter);
app.use("/api/alliances", alliancesRouter);

// ── WebSocket ──
setupSocketServer(httpServer);

// ── Start ──
httpServer.listen(env.PORT, () => {
  console.log(`⚔️  Midgard Online API running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  startProductionTick();
  startBuildingChecker();
});

// ── Global error handler (W-001: catches unhandled async errors in Express 4) ──
// Must be defined with 4 args so Express recognises it as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err.message, err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
