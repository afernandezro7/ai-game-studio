# 🔍 QA Post-Merge Review — PR #18 (MO-03 Villages)

**PR:** [#18](https://github.com/afernandezro7/ai-game-studio/pull/18) — [MO-03] Aldeas: Creación automática + CRUD + Recursos iniciales  
**Issue:** [#9](https://github.com/afernandezro7/ai-game-studio/issues/9) — [MO-03] Aldeas: Creación automática + CRUD + recursos iniciales  
**Branch:** `feature/MO-03-villages` → `develop`  
**Commit:** `35763f993da4fc9162c4d8fab8a5d775dc71258a`  
**Reviewer:** @qa  
**Fecha:** 2026-02-26  
**Nota:** PR mergeado sin review previo — revisión post-merge.

---

## Decisión: ✅ APPROVED (con 3 advertencias menores)

---

## Archivos Revisados (8 files, +1069 / -39)

### Archivos de implementación

| Archivo                                  | Cambio     | Rol                                                                                  |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `backend/src/services/villageService.ts` | +221 (new) | Coord generation, createVillageInTx, lazy tick, getVillageState, getVillageResources |
| `backend/src/routes/villages.ts`         | +147 / -10 | GET /:id, GET /:id/resources, PATCH /:id/name                                        |
| `backend/src/routes/auth.ts`             | +51 / -22  | Register con $transaction; login y /me devuelven villageId                           |
| `sandbox-web/src/pages/Village.tsx`      | +263 / -3  | Página completa con React Query v5, ResourceBar, RenameModal                         |
| `sandbox-web/src/pages/Village.css`      | +284 (new) | Tema nórdico, responsive                                                             |
| `sandbox-web/src/store/authStore.ts`     | +22 / -3   | villageId con persistencia localStorage                                              |
| `sandbox-web/src/store/gameStore.ts`     | +42 / -1   | currentVillage, fetchVillage, refreshResources                                       |
| `DEVLOG.md`                              | +39        | Entrada del developer                                                                |

---

## Criterios de Aceptación: 4/4 PASS

| #   | Criterio                                     | Verificación                                                            | Estado |
| --- | -------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| 1   | Registro crea aldea con 750/750/750/750      | `createVillageInTx` usa `resourcesConfig.startingResources`             | ✅     |
| 2   | `GET /villages/:id` devuelve estado completo | `getVillageState()` incluye resources + buildings, lazy tick aplicado   | ✅     |
| 3   | Aldea tiene nombre personalizable            | `PATCH /:id/name` con Zod validation (1-50 chars) + ownership check     | ✅     |
| 4   | Coordenadas en zona Media (80-160)           | `randomMediaCoords()` lee `MapConfig.json.zones.mid.distanceFromCenter` | ✅     |

---

## Contrato API vs tech-stack.md: ✅ MATCH

| Endpoint                      | Spec (tech-stack.md)        | Impl                                       | Match |
| ----------------------------- | --------------------------- | ------------------------------------------ | ----- |
| `GET /villages/:id`           | Estado completo de la aldea | ✅ Con Travian pattern: público vs privado | ✅    |
| `GET /villages/:id/resources` | Recursos con tick aplicado  | ✅ Lazy tick stub (MO-04 completará)       | ✅    |
| `PATCH /villages/:id/name`    | No en spec original         | ➕ Extra feature, coherente con issue #9   | ✅    |

---

## DB Schema vs tech-stack.md: ✅ MATCH

| Tabla       | Spec                                                                                     | Impl (Prisma)            | Match |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------------ | ----- |
| `villages`  | UUID PK, owner_id FK, name VARCHAR(50), map_x INT, map_y INT, population INT, created_at | ✅ Model exacto          | ✅    |
| `resources` | UUID PK, village_id FK, wood/clay/iron/wheat DECIMAL(10,2), last_updated                 | ✅ Model exacto          | ✅    |
| `map_cells` | PK (x,y), cell_type, village_id FK                                                       | ✅ Creado en transacción | ✅    |

---

## Seguridad: ✅ PASS

| Check                                       | Resultado                                                   |
| ------------------------------------------- | ----------------------------------------------------------- |
| Ownership check en GET /villages/:id        | ✅ Public basic info vs private resources (Travian pattern) |
| Ownership check en GET /:id/resources       | ✅ 403 si no es dueño                                       |
| Ownership check en PATCH /:id/name          | ✅ 403 si no es dueño                                       |
| authMiddleware en todas las rutas           | ✅ 3/3 endpoints protegidos                                 |
| try-catch + next(err) en todos los handlers | ✅ Consistente con W-001 fix                                |
| Transacción atómica (usuario + aldea)       | ✅ `prisma.$transaction`                                    |
| Coord collision handling                    | ✅ Retry loop + P2002 como fallback                         |
| No SQL injection                            | ✅ Prisma parameterized queries                             |

---

## Código: ✅ PASS

| Check                                          | Resultado                                         |
| ---------------------------------------------- | ------------------------------------------------- |
| `tsc --noEmit` backend                         | ✅ 0 errores                                      |
| `tsc --noEmit` frontend                        | ✅ 0 errores                                      |
| CSS variables con fallbacks                    | ✅ (ver W-005)                                    |
| authStore persiste villageId                   | ✅ localStorage + logout cleanup                  |
| gameStore fetch/refresh actions                | ✅                                                |
| React Query v5 en Village.tsx                  | ✅ useQuery + useMutation                         |
| Frontend villageService.ts                     | ✅ 3 funciones (getVillage, getResources, rename) |
| Recursos iniciales desde config (no hardcoded) | ✅ `gameData.resources.startingResources`         |
| Login/me devuelve villageId                    | ✅ findFirst(ownerId)                             |

---

## Economy Check (5-Point QA Checklist)

### 1. Soft-Lock Check 🔒

✅ PASS — Jugador empieza con 750/750/750/750 + 50 runes. No hay sinks todavía (buildings MO-05). Sin riesgo de soft-lock.

### 2. Starting Resources vs Config 📊

✅ PASS — `ResourcesConfig.json.startingResources` = `{wood:750, clay:750, iron:750, wheat:750}`. Código usa exactamente estos valores. Runes (50) correctamente en `users` table, no en `resources`.

### 3. Coordinate Generation 🗺️

✅ PASS — `MapConfig.json.zones.mid.distanceFromCenter = [80, 160]`. `randomMediaCoords()` genera ángulo aleatorio, distancia en rango, clamped a [-200, 200]. Retry hasta 10 veces por colisión.

### 4. Village Name Validation ✍️

✅ PASS — Zod: min 1, max 50, trimmed. Default: `"Aldea de ${username}"`.

### 5. FTUE Check 🆕

✅ PASS — Registro → aldea creada automáticamente → redirect a Village page → ve recursos 750/750/750/750. Banner sugiere renombrar.

---

## ⚠️ Advertencias (No bloqueantes)

### W-003: Fire-and-forget DB update en `getVillageState`

- **Severidad:** Menor (se vuelve crítica en MO-04)
- **Archivo:** `backend/src/services/villageService.ts` (~línea 165)
- **Problema:** `prisma.resource.update({ ... }).catch(() => { /* ignore */ })` — el update de `lastUpdated` es fire-and-forget. Si falla silenciosamente, el próximo lazy tick recalculará con un `deltaT` mayor, produciendo recursos "extra".
- **Impacto:** Nulo en MO-03 (production = 0). **Crítico a resolver en MO-04** cuando production > 0.
- **Fix:** Cambiar a `await prisma.resource.update(...)` en MO-04.

### W-004: `PATCH /villages/:id/name` no está en tech-stack.md

- **Severidad:** Informativa
- **Problema:** El endpoint se añadió para satisfacer "nombre personalizable" del issue #9, pero no está documentado en `tech-stack.md`.
- **Fix:** Añadir una fila en la tabla de endpoints de Aldeas en tech-stack.md.

### W-005: CSS hardcoded fallbacks divergen de index.css

- **Severidad:** Informativa
- **Archivo:** `sandbox-web/src/pages/Village.css`
- **Problema:** Los fallbacks CSS usan colores distintos a `index.css`:
  - `--bg-primary` fallback `#1a1a2e` vs index.css `#0f1923`
  - `--accent-gold` fallback `#d4af37` vs index.css no existe (usa `--btn-primary: #DAA520`)
  - `--bg-card` no existe en index.css
- **Impacto:** Solo visual. Los fallbacks no se ejecutan si index.css se carga.
- **Fix:** Usar las variables existentes o declararlas en index.css.

---

## Resumen Ejecutivo

- **4/4 criterios** de aceptación cumplidos
- **API** coincide con tech-stack.md + 1 endpoint extra documentable
- **DB Schema** coincide exactamente con spec
- **Seguridad:** Ownership checks en 3 endpoints, transacción atómica, auth middleware
- **Economy:** Recursos iniciales = config, runes separadas correctamente
- **3 advertencias** menores (W-003 para MO-04, W-004 doc, W-005 CSS)
- **tsc clean** en ambos proyectos

**✅ QA APPROVED POST-MERGE.**

---

## Siguiente Paso

1. MO-04 — Producción de Recursos (tick real basado en tiempo)
2. Resolver **W-003** obligatoriamente al implementar MO-04
3. Mantener flujo PR → QA review → merge para futuras issues
