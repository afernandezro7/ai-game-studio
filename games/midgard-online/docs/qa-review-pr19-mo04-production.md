# QA Review — PR #19 (MO-04 Production)

**PR:** [#19](https://github.com/afernandezro7/ai-game-studio/pull/19) — [MO-04] Producción en tiempo real: Tick loop + Acumulación de recursos
**Issue:** [#10](https://github.com/afernandezro7/ai-game-studio/issues/10)
**Branch:** `feature/MO-04-production` → `develop`
**Commit:** `8d0b6be280c12c1d7ee647ef4e25d05232203e56` → `f18a12c` (B-001 fix)
**Reviewer:** @qa
**Fecha:** 2026-02-26 (initial) / 2026-02-27 (re-review)

---

## Decisión: ✅ APPROVED (tras fix B-001 en commit e73b08c)

---

## Archivos Revisados (11 files, +958 / -75)

| Archivo                                                | Cambio     | Rol                                                               |
| ------------------------------------------------------ | ---------- | ----------------------------------------------------------------- |
| `backend/src/services/productionService.ts`            | +209/-8    | calculateProduction, getStorageCaps, applyTick (core puro)        |
| `backend/src/cron/productionTick.ts`                   | +96/-10    | setInterval tick loop, query aldeanas activas, DB update, WS emit |
| `backend/src/services/villageService.ts`               | +74/-43    | Integración con productionService, W-003 fix                      |
| `backend/src/routes/villages.ts`                       | +11/-1     | GET /:id/resources retorna { resources, rates, caps }             |
| `backend/src/ws/socketServer.ts`                       | +19/-7     | join:village / leave:village rooms                                |
| `backend/src/index.ts`                                 | +2         | startProductionTick() on server start                             |
| `sandbox-web/src/hooks/useResources.ts`                | +219/-5    | React Query + interpolación 1s + WS listener                      |
| `sandbox-web/src/components/resources/ResourceBar.tsx` | +146 (new) | Barra de recursos con progreso, FULL badge, rates                 |
| `sandbox-web/src/components/resources/ResourceBar.css` | +131 (new) | Estilos nórdicos, responsive                                      |
| `sandbox-web/src/services/socketService.ts`            | +8         | joinVillage / leaveVillage                                        |
| `DEVLOG.md`                                            | +43/-1     | Entrada del developer                                             |

---

## Criterios de Aceptación (Issue #10): 4/5 PASS

| #   | Criterio                                            | Verificación                                                                                                               | Estado       |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | Los 4 recursos se producen según economy.md         | `calculateProduction` lee `levels[level-1].productionPerHour` del config; IDs correctos (woodcutter/claypit/ironMine/farm) | ✅           |
| 2   | Producción se detiene al 100% del almacén           | `Math.min(current + prod*dh, cap)` — cuando current >= cap, resultado = cap                                                | ✅           |
| 3   | Trigo con saldo negativo reduce recursos            | `applyTick`: wheatAfterProd - consumption\*dh, floor en 0; starvation logged                                               | ✅           |
| 4   | Cliente recibe `resources:tick` sin polling manual  | WS emit desde productionTick → useResources handleTick                                                                     | ⚠️ ver B-001 |
| 5   | Rates en UI coinciden con ResourcesConfig por nivel | `calculateProduction` lee directamente del config; no hardcoded                                                            | ✅           |

---

## ❌ B-001: WS tick emite rates parciales → NaN en interpolación de trigo

**Severidad:** BLOQUEANTE
**Archivo:** `backend/src/cron/productionTick.ts` línea ~82-88

### Problema

El tick emite solo 4 campos de rates:

```ts
rates: {
  woodPerHour: rates.woodPerHour,
  clayPerHour: rates.clayPerHour,
  ironPerHour: rates.ironPerHour,
  wheatPerHour: rates.wheatPerHour,  // net wheat
},
```

Pero el frontend `useResources.ts` necesita `wheatGrossPerHour` y `wheatConsumptionPerHour` para la interpolación:

```ts
base.wheat + (rates.wheatGrossPerHour - rates.wheatConsumptionPerHour) * deltaH;
```

### Flujo del bug

1. WS tick → handleTick → `ratesRef.current = payload.rates` (objeto con 4 campos)
2. Siguiente tick de interpolación (1s) lee `rates.wheatGrossPerHour` → `undefined`
3. `undefined - undefined` → `NaN` → wheat se muestra como `NaN`
4. `invalidateQueries` dispara refetch → ~200ms después los rates se restauran
5. **Resultado:** flash de "NaN" en wheat durante ~200ms cada 60s

### Fix

Emitir los 6 campos completos:

```ts
rates: {
  woodPerHour: rates.woodPerHour,
  clayPerHour: rates.clayPerHour,
  ironPerHour: rates.ironPerHour,
  wheatPerHour: rates.wheatPerHour,
  wheatGrossPerHour: rates.wheatGrossPerHour,         // ADD
  wheatConsumptionPerHour: rates.wheatConsumptionPerHour, // ADD
},
```

---

## ⚠️ Advertencias (No bloqueantes)

### W-006: WS room join sin ownership check

- **Severidad:** Media (seguridad)
- **Archivo:** `backend/src/ws/socketServer.ts` línea 33-37
- **Problema:** Cualquier cliente conectado puede emitir `join:village` con cualquier villageId y recibir `resources:tick` de aldeas ajenas. En un juego Travian-style, conocer la producción del enemigo es inteligencia valiosa.
- **Impacto:** Nulo en pre-producción (no hay PvP). Crítico antes de beta pública.
- **Fix futuro:** Verificar JWT en el WS handshake y validar ownership en `join:village`.

### W-007: Flag `productionStopsOnFullStorage` no se lee del config

- **Severidad:** Informativa
- **Archivo:** `backend/src/services/productionService.ts`
- **Problema:** `ResourcesConfig.antiExploit.productionStopsOnFullStorage: true` se declara en el tipo `ResourcesShape` pero nunca se lee. El comportamiento está hardcoded como siempre detener producción (correcto con `true`).
- **Impacto:** Nulo — el flag es `true`. Pero si un game designer lo cambiara a `false`, el código no lo respetaría.
- **Fix:** Minoría de prioridad. Leer el flag y condicionar.

### W-008: Procesamiento secuencial de aldeas en tick

- **Severidad:** Informativa (escalabilidad)
- **Archivo:** `backend/src/cron/productionTick.ts` línea 48 (`for (const village of villages)`)
- **Problema:** N queries secuenciales, una por aldea. Con 1,000 aldeas activas, el tick podría tardar 5-10 segundos.
- **Impacto:** Nulo en pre-producción. Relevante a escala.
- **Fix futuro:** Batch updates o `Promise.allSettled` con concurrencia limitada.

### W-009: `applyTick` clampa recursos POR DEBAJO del cap

- **Severidad:** Informativa (futura)
- **Archivo:** `backend/src/services/productionService.ts` línea 191
- **Problema:** `Math.min(current + prod*dh, cap)` — si `current > cap` (e.g., futuro raid que sobrepasa el cap), el tick REDUCE los recursos al cap. En Travian, los recursos sobre-cap se preservan pero la producción se detiene.
- **Impacto:** Nulo ahora — no hay mecanismo para superar el cap. Relevante cuando se implemente saqueo (MO-07+).
- **Fix futuro:** `current >= cap ? current : Math.min(current + prod*dh, cap)`

---

## Validación Técnica

| Check                          | Resultado                                                       |
| ------------------------------ | --------------------------------------------------------------- |
| `tsc --noEmit` backend         | ✅ 0 errores                                                    |
| `tsc --noEmit` frontend        | ✅ 0 errores                                                    |
| W-003 fix (await persist)      | ✅ Confirmado en getVillageState + getVillageResources          |
| Building IDs vs config         | ✅ woodcutter, claypit, ironMine, farm                          |
| wheatConsumption from config   | ✅ `resourcesCfg.wheatConsumption.populationPerHour`            |
| Storage caps from config       | ✅ `capacityPerResource` (warehouse), `capacityWheat` (granary) |
| Default cap 800                | ✅ Cuando no hay warehouse/granary                              |
| Multiple warehouse/granary sum | ✅ Iterates and sums capacities                                 |
| Prisma schema `lastLogin`      | ✅ Field exists, updated on login                               |
| Tick interval from env         | ✅ `PRODUCTION_TICK_INTERVAL_MS=60000`                          |
| Decimal rounding (2 places)    | ✅ `Math.round(x * 100) / 100`                                  |

---

## 5-Point QA Checklist

### 1. Soft-Lock Check 🔒 — ✅ PASS

- Jugador nuevo: 750/750/750/750, population=1, no buildings
- Wheat consumption: 1 × 1/h = 1 wheat/h
- Time to starvation (0 wheat): 750h = ~31 días
- Player can build buildings to generate production before starvation
- First building affordable with initial resources ✅

### 2. Inflation Check 📈 — ✅ PASS

- Production reads from config (no hardcoded values)
- Config values match economy.md formula: `round(baseProd × 1.405^(level-1))`
- Example verification: woodcutter L1=30, L2=42, L5=117, L10=640 ✅
- Default cap 800 limits early-game accumulation ✅
- `productionStopsOnFullStorage` effectively enforced ✅

### 3. Time Wall Check ⏰ — ✅ PASS (N/A)

- PR no introduce tiempos de construcción — producción es continua
- No time gates in this PR

### 4. Cross-Resource Dependency Check 🔄 — ✅ PASS

- Producción es independiente por tipo de edificio
- Wheat consumption comes from population (additive), not circular
- No building requires production from another building's output to function

### 5. FTUE Check 🆕 — ✅ PASS

- New player sees ResourceBar immediately: 🪵 750/800 (+0/h), 🧱 750/800 (+0/h), ⚙️ 750/800 (+0/h), 🌾 750/800 (-1/h)
- Progress bars visible ✅
- FULL badge logic ready (triggers at cap) ✅
- Wheat slowly decreasing (-1/h) provides visual feedback of "something happening" ✅

---

## Scenario Simulation

### 📊 Scenario: New village, 1 woodcutter L1, 1 farm L1

**Assumptions:**

- Starting resources: 750/750/750/750
- Population: 1 (base) + 1 (woodcutter) + 1 (farm) = 3
- Default cap: 800

**Hour-by-hour:**

| Hour | Action                    | Wood          | Clay           | Iron          | Wheat         | Notes                                   |
| ---- | ------------------------- | ------------- | -------------- | ------------- | ------------- | --------------------------------------- |
| 0    | Start + build WC1 + Farm1 | 750-40-80=630 | 750-100-20=630 | 750-50-30=670 | 750-60-40=650 | Costs from config                       |
| 1    | Production                | 660           | 630            | 670           | 677           | +30 wood, +30 wheat, -3 wheat (pop×1/h) |
| 2    | Production                | 690           | 630            | 670           | 704           |                                         |
| 4    | Production                | 750           | 630            | 670           | 758           |                                         |
| 6    | Cap reached               | 800           | 630            | 670           | 800           | FULL badge on wood + wheat              |
| 7+   | Stopped                   | 800           | 630            | 670           | 800           | Production stops at cap ✅              |

**Result:** Safe — no exploit, no soft-lock.

---

## Correcciones Incluidas vs Warnings Previos

| Warning                    | Estado              | Verificación                                                              |
| -------------------------- | ------------------- | ------------------------------------------------------------------------- |
| W-003 (fire-and-forget)    | ✅ RESUELTO         | `await prisma.resource.update()` en getVillageState + getVillageResources |
| W-004 (PATCH undocumented) | No aplica a este PR |                                                                           |
| W-005 (CSS fallbacks)      | No aplica a este PR |                                                                           |

---

## Resumen

- **4/5 criterios** de aceptación cumplidos (criterio 4 afectado por B-001)
- **1 bug bloqueante** (B-001): fix trivial — 2 campos faltantes en WS emit
- **4 advertencias** informativas (W-006 a W-009) — no bloquean merge
- **W-003 resuelto** correctamente ✅
- **tsc clean** en ambos proyectos
- Lógica de producción correcta vs config + economy.md

**✅ APPROVED** (tras fix B-001 en commit `e73b08c`).

---

## Re-Review (2026-02-27)

Commit `e73b08c` añadió `wheatGrossPerHour` y `wheatConsumptionPerHour` al emit. Verificado:

- Los 6 campos de `ProductionRates` se emiten completos
- `tsc --noEmit` backend: 0 errores
- Cambio mínimo (2 líneas), sin regresiones
- Criterios de aceptación: 5/5 PASS

## Siguiente Paso

Merge a develop. MO-05 — Construcción de Edificios.
