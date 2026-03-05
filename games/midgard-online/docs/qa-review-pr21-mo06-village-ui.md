# 🔍 QA Report: PR #21 — MO-06 Village UI

**PR:** [#21 — [MO-06] UI de Aldea: Grid + Barra de Recursos + Panel de Edificio](https://github.com/afernandezro7/ai-game-studio/pull/21)
**Branch:** `feature/MO-06-village-ui` → `develop`
**Head SHA:** `19074f1ff08ffda9510bf2c17d1e088f3ab1e179`
**Autor PR:** `@developer`
**Reviewer:** `@qa`
**Fecha:** 2026-03-05
**Verdict:** ✅ APPROVED (tras re-review — ver sección al final)

---

## Resumen del cambio

PR puramente frontend (0 cambios en backend). Reescritura de la página Village con:

- 10 archivos nuevos (5 componentes + 5 CSS)
- 4 archivos modificados (ResourceBar, Village.tsx/css)
- +1127 / -245 LOC

**Layout:** Header sticky (AppLayout) → ResourceBar pinnada → Grid 3 columnas (campos recurso | centro aldea | panel detalle). Mobile: columnas apiladas + bottom sheet.

---

## Checks realizados

### 1. Soft-Lock Check 🔒 — ✅ N/A (sólo UI)

No hay cambios de economía ni backend. Soft-lock check delegado a MO-05 (ya aprobado).

### 2. Inflation Check 📈 — ✅ N/A (sólo UI)

Sin cambios en producción ni en costes.

### 3. Time Wall Check ⏰ — ✅ N/A (sólo UI)

Sin cambios en tiempos de edificios.

### 4. Cross-Resource Dependency Check 🔄 — ✅ N/A (sólo UI)

Sin cambios en dependencias de recursos.

### 5. FTUE Check 🆕 — ❌ FALLA

El grid de 21 slots muestra correctamente los edificios al inicio (todos Lv 0). **Pero tras el primer upgrade de un edificio de recurso, el ciclo visual se rompe** (ver B-003).

- ✅ Player sees all 21 building slots on first load
- ✅ Resource bar visible immediately (sticky header)
- ✅ Clicking a slot opens detail panel
- ❌ **After upgrading a resource building, no visual feedback** (no timer, no golden pulse)
- ❌ **Cancel button absent** for resource building upgrades
- ❌ **Level display stale** after upgrade completion

---

## Issues encontrados

### ❌ B-003 (BLOQUEANTE): `buildingByType` Map — upgrades de recurso invisibles

**Archivo:** `Village.tsx:52`

```typescript
const buildingByType = new Map(buildings.map((b) => [b.buildingType, b]));
```

**Causa raíz:** El backend (`getVillageBuildings`) retorna 21 filas individuales ordenadas por `slotIndex ASC`. El Map colapsa todas las filas del mismo `buildingType` en UNA entrada (last-writer-wins → siempre el slotIndex más alto). Pero `startUpgrade(findFirst)` mejora el slotIndex más BAJO.

**Flujo de fallo:**

| Paso     | Backend                                                | Frontend (Map)                                                            |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| Inicio   | 4 woodcutters: slot 0-3, todos Lv 0                    | Map: `woodcutter → slot 3 (Lv 0)` ✅ OK                                   |
| Upgrade  | `findFirst` → mejora slot 0, `upgradeFinishAt = T+60s` | Map: `woodcutter → slot 3 (Lv 0, no upgradeFinishAt)` ❌                  |
| UI       | —                                                      | 4 slots muestran `--built` Lv 0, NO `--upgrading`. Sin timer. Sin cancel. |
| Completa | slot 0 → Lv 1. Slots 1-3 → Lv 0                        | Map: `woodcutter → slot 3 (Lv 0)` ❌ UI muestra Lv 0                      |

**Impacto:**

- Los 18 slots de recurso (woodcutter×4 + claypit×4 + ironMine×4 + farm×6) afectados
- Los 3 slots interiores (mainBuilding, warehouse, granary) NO afectados (un solo slot por tipo)
- El jugador no puede ver ni cancelar upgrades de recurso desde la UI
- El upgrade button en el panel de detalle sigue activo (muestra slot 3 que NO está upgrading) → si el jugador pulsa de nuevo, recibe error de cola llena sin entender por qué

**Fix recomendado (frontend only, sin cambiar backend):**

Opción A — Smart selector (menor cambio):

```typescript
// En lugar de last-writer-wins Map, usar selector inteligente
function pickForType(
  type: string,
  buildings: BuildingData[],
): BuildingData | undefined {
  const ofType = buildings.filter((b) => b.buildingType === type);
  // Priorizar el que está upgrading
  const upgrading = ofType.find((b) => b.upgradeFinishAt);
  if (upgrading) return upgrading;
  // Si no, el de mayor nivel (refleja completados)
  return ofType.sort((a, b) => b.level - a.level)[0];
}
```

Opción B — Map por slotIndex (render per-slot):

```typescript
const buildingBySlot = new Map(buildings.map((b) => [b.slotIndex, b]));
// Cada slot: buildingBySlot.get(slot.slotIndex)
```

Requiere cambiar `selectedType` → `selectedSlotIndex` y adaptar el panel de detalle.

**Recomendación:** Opción A para fix mínimo. Opción B si el diseño evoluciona a per-slot upgrades.

---

### ⚠️ W-015: VillageGrid.tsx — código muerto

**Archivo:** `VillageGrid.tsx` (nuevo, 94 LOC)

Creado pero nunca importado en `Village.tsx`. La página renderiza `BuildingSlot` directamente.  
**Nota:** VillageGrid tiene MEJOR lógica de cancel que Village.tsx:

```typescript
// VillageGrid (no usado):
const upgradingBuilding = buildings.find(
  (b) => b.buildingType === slot.buildingType && b.upgradeFinishAt,
);
// → busca en el array completo, no en el Map
```

Pero sigue usando `buildingByType` para el level display (mismo bug B-003).

**Fix:** Eliminar VillageGrid.tsx o integrarlo en Village.tsx (reutilizando la lógica `buildings.find` para cancel).

---

### ⚠️ W-016: AppLayout no pasa `runes` a ResourceBar

**Archivos:** `AppLayout.tsx`, `ResourceBar.tsx`

Se añadió `runes?: number` prop + CSS premium styling a ResourceBar, pero AppLayout nunca lo conecta:

```tsx
// AppLayout.tsx — lee villageId pero NO runes
const villageId = useAuthStore((s) => s.villageId);
// Falta: const runes = useAuthStore((s) => s.user?.runes);

// ResourceBar recibe todo menos runes:
<ResourceBar
  wood={wood}
  clay={clay}
  iron={iron}
  wheat={wheat}
  rates={rates}
  caps={caps}
  isFull={isFull}
  // runes={runes}  ← FALTA
/>;
```

**Impacto:** Feature implementada pero inutilizada. No es funcional break, pero es dead code path.

**Fix:** Añadir `const runes = useAuthStore((s) => s.user?.runes)` y pasar `runes={runes}` al componente.

---

### ⚠️ W-017: Bottom sheet sin Escape key handler (a11y)

**Archivo:** `BuildingDetailPanel.tsx`

El mobile bottom sheet cierra con backdrop click (`onClick={onClose}`) pero no responde a tecla Escape. En mobile real no es problema (no hay teclado), pero en testing responsive de desktop sí afecta a11y.

**Fix:** Añadir `useEffect` con `keydown` handler para Escape.

---

## Compilación

| Proyecto                 | Resultado                     |
| ------------------------ | ----------------------------- |
| Frontend (`sandbox-web`) | ✅ `tsc --noEmit` — 0 errores |

---

## Validaciones positivas

- ✅ `SLOT_DEFINITIONS` (21 slots: 0-3 woodcutter, 4-7 claypit, 8-11 ironMine, 12-17 farm, 18 mainBuilding, 19 warehouse, 20 granary) matchea exactamente con el seed de `createVillageInTx` (B-002 fix en MO-05)
- ✅ `BuildingDetailPanel` props matchean 1:1 con `BuildingPanelProps` interface
- ✅ `FLAVOR` dict cubre los 7 tipos actuales + 6 tipos futuros (barracks, stable, workshop, marketplace, embassy, academy) con fallback genérico
- ✅ `ConstructionTimer` maneja `effectiveBuildTimeSec: null` con fallback `?? 1` sin division-by-zero
- ✅ `ConstructionTimer` cleanup: `clearInterval(id)` en useEffect return
- ✅ CSS responsive: mobile breakpoint 768px consistente en todos los archivos
- ✅ Bottom sheet `z-index` hierarchy: backdrop 199, panel 200, header 100 (correcto)
- ✅ `BuildingSlot` 3 estados visuales (empty/built/upgrading) con transiciones CSS
- ✅ AppLayout sticky header (52px) + resource bar (48px) con correcto `top` offset
- ✅ Tipos estrictos sin `any` ni `@ts-ignore`

---

## Issue Tracker

| ID    | Severidad     | Descripción                                                            | Estado  |
| ----- | ------------- | ---------------------------------------------------------------------- | ------- |
| B-003 | ❌ BLOQUEANTE | `buildingByType` Map: upgrades recurso invisibles + cancel inaccesible | ✅ FIXED (`f7df0d8`) |
| W-015 | ⚠️ Warning    | VillageGrid.tsx dead code (94 LOC no importado)                        | ✅ FIXED (`f7df0d8`) |
| W-016 | ⚠️ Warning    | AppLayout no pasa `runes` a ResourceBar                                | ✅ FIXED (`f7df0d8`) |
| W-017 | ⚠️ Warning    | Bottom sheet sin Escape key handler (a11y)                             | ✅ FIXED (`f7df0d8`) |

---

## Next Step

~~@developer debe corregir B-003~~ → COMPLETADO en `f7df0d8`.

---

## Re-Review (2026-03-05) — Commits `f7df0d8` + `a0a039a`

**Verdict:** ✅ QA APPROVED

### Verificación de fixes

| Issue | Fix aplicado | Verificado |
|-------|-------------|------------|
| **B-003** | Map eliminado → `pickForType()` filtra por tipo, prioriza `upgradeFinishAt`, luego ordena por level desc. Aplicado en `selectedBuilding`, `mainBuildingLevel`, y ambos loops de resource/inner slots. | ✅ Timer visible, cancel accesible, nivel correcto para multi-slot types |
| **W-015** | `VillageGrid.tsx` + `VillageGrid.css` eliminados (145 LOC). | ✅ Archivos eliminados, sin imports huérfanos |
| **W-016** | `AppLayout.tsx`: añadido `const runes = useAuthStore(s => s.user?.runes ?? 0)` y pasado como prop `runes={runes}` a ResourceBar. | ✅ Runas premium visibles en barra de recursos |
| **W-017** | `BuildingDetailPanel.tsx`: añadido `useEffect` con `keydown` handler para Escape → `onClose()`. Cleanup en return. | ✅ Panel cierra con Escape |

### `pickForType` — Análisis de corrección

```typescript
function pickForType(type: string, buildings: BuildingData[]): BuildingData | undefined {
  const ofType = buildings.filter((b) => b.buildingType === type);
  const upgrading = ofType.find((b) => b.upgradeFinishAt);
  if (upgrading) return upgrading;
  return ofType.sort((a, b) => b.level - a.level)[0];
}
```

**Escenarios validados:**

| Escenario | Backend state | `pickForType` retorna | UI resultado |
|-----------|--------------|----------------------|-------------|
| 4 woodcutters Lv 0, ninguno upgrading | slots 0-3 Lv 0 | slot 0 (primer Lv 0) | Muestra Lv 0 ✅ |
| slot 0 upgrading a Lv 1 | slot 0: `upgradeFinishAt=T+60s` | slot 0 (prioriza upgrading) | Timer dorado + cancel ✅ |
| slot 0 completado (Lv 1), rest Lv 0 | slot 0: Lv 1, slots 1-3: Lv 0 | slot 0 (mayor level) | Muestra Lv 1 ✅ |
| mainBuilding (único) | slot 18: Lv 3 | slot 18 | `mainBuildingLevel=3` ✅ |

### TypeScript

| Proyecto | Resultado |
|----------|----------|
| Frontend (`sandbox-web`) | ✅ `tsc --noEmit` — 0 errores |

### Conclusión

Todos los issues (1 bloqueante + 3 warnings) resueltos correctamente. Compilación limpia. `pickForType` resuelve la colisión multi-slot de forma elegante.

Warnings pendientes de PRs anteriores (no afectan a MO-06): W-004, W-005, W-006, W-007, W-008, W-009.

**Listo para merge a develop.**

---

_Informe actualizado por @qa — 2026-03-05_
