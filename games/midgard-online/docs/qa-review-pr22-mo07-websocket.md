# 🔍 QA Report: PR #22 — MO-07 WebSocket: JWT auth + join_village + Toast

**PR:** [#22](https://github.com/afernandezro7/ai-game-studio/pull/22) `feature/MO-07-websocket` → `develop`
**Issue:** [#13](https://github.com/afernandezro7/ai-game-studio/issues/13)
**Head SHA:** `b41d9bccdd3db2907ef78535266eeb9f7fad122c`
**Reviewer:** @qa
**Fecha:** 2026-03-06
**Archivos:** 11 cambiados, +517/−63 LOC (4 backend, 7 frontend)

---

## Verdict: ❌ BLOCKED

1 bug bloqueante (B-004) + 4 warnings no bloqueantes.

---

## Criterios de Aceptación (Issue #13)

| # | Criterio | Estado |
|---|----------|--------|
| 1 | La conexión WebSocket se establece tras login exitoso | ✅ PASS — `authStore.login()` → `socketService.connect(token)` |
| 2 | Los recursos se actualizan en cliente sin reload cada 60s vía `resources:tick` | ✅ PASS — productionTick emite, useResources escucha |
| 3 | Cuando completa una construcción, el jugador ve toast en <1s vía `building:complete` | ✅ PASS — useWebSocket muestra toast, useBuildings invalida queries |
| 4 | Desconexión y reconexión automática si la conexión se pierde | ❌ FAIL — el socket reconecta pero **no re-emite `join_village`** (ver B-004) |
| 5 | No hay memory leaks: socket cleanup al desmontar componentes | ✅ PASS — todos los useEffect tienen cleanup con `off()` |

**Resultado: 4/5 PASS, 1 FAIL.**

---

## Checks Performed

- [x] Acceptance criteria (5 ítems)
- [x] Event names vs tech-stack.md
- [x] JWT auth en handshake (server middleware)
- [x] Room ownership validation (Prisma query en `join_village`)
- [x] Socket.io reconnect behavior
- [x] Listener cleanup (memory leaks)
- [x] Double listener / double join analysis
- [x] Type safety (no `any`, no `@ts-ignore`)
- [x] `tsc --noEmit` backend → EXIT:0 ✅
- [x] `tsc --noEmit` frontend → EXIT:0 ✅

---

## Issues Found

### B-004 — Room re-join missing on WebSocket reconnect (BLOQUEANTE)

**Ubicación:** `sandbox-web/src/hooks/useWebSocket.ts:82-89`

**Problema:**

Cuando Socket.io reconecta automáticamente (ej: red móvil, laptop en sleep), el *client socket* es la misma instancia (listeners preservados), pero el **server crea un nuevo socket** sin rooms. El handler `io.on("connection")` se ejecuta de nuevo en el servidor, pero el cliente NO re-emite `join_village` porque:

```typescript
// useWebSocket.ts L82-89
useEffect(() => {
  if (!villageId) return;
  if (joinedVillageRef.current === villageId) return; // ← GUARD impide re-join
  socketService.joinVillage(villageId);
  joinedVillageRef.current = villageId;
}, [villageId]); // ← isConnected NO está en deps
```

`joinedVillageRef.current === villageId` → true → skip. El efecto no depende de `isConnected`, así que no re-ejecuta cuando el socket pasa de disconnected → connected.

**Impacto:**
- `resources:tick`: el servidor emite a `village:${id}` pero el socket no está en la room → **no llega al cliente**
- `building:complete`: mismo problema → **toast nunca aparece**
- **Silencioso**: el usuario no recibe ningún error ni indicación de que los eventos dejaron de llegar
- **useResources.ts:198-207** tiene el mismo problema: su `joinVillage` también corre solo cuando `villageId` cambia
- El React Query fallback (refetch cada 60s) rescata parcialmente los recursos, pero el toast de building:complete se pierde por completo

**Afecta al 100% de los escenarios de reconexión** (red inestable, sleep, cambio de WiFi). Criterio de aceptación #4 NO se cumple.

**Fix propuesto (elegir uno):**

**Opción A — Añadir `isConnected` a deps y eliminar ref guard:**
```typescript
useEffect(() => {
  if (!villageId || !isConnected) return;
  socketService.joinVillage(villageId);
}, [villageId, isConnected]);
```

**Opción B — Resetear ref en `onConnect`:**
```typescript
const onConnect = () => {
  setIsConnected(true);
  joinedVillageRef.current = null; // ← fuerza re-join
};
```

Opción A es más limpia y idiomática para React.

---

### W-018 — Double `join_village` en initial mount

**Ubicación:** `useWebSocket.ts:87` + `useResources.ts:201`

Ambos hooks llaman a `socketService.joinVillage(villageId)` en sus respectivos `useEffect`. Como ambos se montan en `AppLayout`, el servidor recibe 2 emisiones de `join_village` y ejecuta la query Prisma 2 veces.

`socket.join()` es idempotente en el servidor (no duplica la membresía), pero la consulta DB `prisma.village.findFirst({ id, ownerId })` se ejecuta innecesariamente 2 veces.

**Severidad:** Baja — no rompe nada, es redundante.
**Sugerencia:** Centralizar el join en `useWebSocket` y eliminar el `joinVillage` de `useResources` (que ya no necesita gestionar rooms si `useWebSocket` lo hace).

---

### W-019 — Double `building:complete` query invalidation

**Ubicación:** `useWebSocket.ts:95-106` + `useBuildings.ts:102-115`

Ambos hooks escuchan `building:complete` y ambos llaman a:
- `queryClient.invalidateQueries({ queryKey: ["buildings", villageId] })`
- `queryClient.invalidateQueries({ queryKey: ["resources", villageId] })`

React Query deduplica refetches automáticamente, así que no hay solicitudes HTTP duplicadas. Pero es semántica redundante.

**Severidad:** Baja — sin impacto funcional.

---

### W-020 — `ResourcesTickPayload` type incompleto

**Ubicación:** `backend/src/ws/socketServer.ts:11-16`

El tipo exportado solo declara `{wood, clay, iron, wheat}`, pero `productionTick.ts:80-96` emite `{wood, clay, iron, wheat, rates, caps}`. El frontend (`useResources.ts:175`) espera el payload completo con rates y caps.

El tipo no se usa actualmente como constraint, pero es engañoso para futuros consumidores.

**Severidad:** Baja — no rompe nada, el payload real es correcto.

---

### W-021 — Toast slide-out animation inexistente

**Ubicación:** `Toast.tsx:63` + `Toast.css`

El comentario dice "Begin slide-out animation 300 ms before store removes" pero no existe CSS `toast-slide-out` ni ninguna animación de salida. El toast desaparece abruptamente del DOM. Solo existe `toast-slide-in`.

**Severidad:** Cosmética — no afecta funcionalidad.

---

## Validaciones Positivas

### Backend

| Aspecto | Resultado |
|---------|-----------|
| JWT middleware en handshake | ✅ `jwt.verify(token, env.JWT_SECRET)` — rechaza sin token o con token inválido |
| Ownership check en `join_village` | ✅ `prisma.village.findFirst({ id, ownerId })` — **W-006 de MO-04 ahora RESUELTO** |
| Error handling en `join_village` | ✅ try/catch con `socket.emit("error", ...)` |
| Payload `resources:tick` redondeado | ✅ `Math.round(x * 100) / 100` |
| Stubs etiquetados con versión | ✅ `TODO v0.2.0` / `TODO v0.3.0` |
| Event names vs tech-stack.md | ✅ `resources:tick`, `building:complete`, `join_village` |
| `leave:village` eliminado | ✅ Socket.io limpia rooms en disconnect automáticamente |

### Frontend

| Aspecto | Resultado |
|---------|-----------|
| Socket singleton con auto-connect | ✅ Constructor lee `localStorage("midgard_token")` |
| `connect()` idempotente | ✅ 3 ramas: ya conectado → no-op, socket existe → reconnect, sin socket → init |
| `onEvent<T>` / `offEvent<T>` type-safe | ✅ |
| authStore connect/disconnect | ✅ login → connect, register → connect, logout → disconnect |
| Toast Zustand store | ✅ imperativo `toast(msg)`, auto-dismiss 5s |
| Toast accessibility | ✅ `role="alert"`, `aria-live`, `aria-label` |
| `transports: ["websocket"]` | ✅ sin polling fallback (coherente con juego en tiempo real) |
| Reconnection config | ✅ `reconnectionDelay: 1s`, `reconnectionDelayMax: 10s` |
| No `any` / no `@ts-ignore` | ✅ |
| useEffect cleanup | ✅ Todas las suscripciones tienen cleanup |

### Resolución de W-006 (de MO-04)

W-006 reportaba: "WS room join sin ownership check — cualquier cliente puede escuchar ticks de otras aldeas". Ahora `join_village` valida `ownerId === userId` con Prisma antes de `socket.join()`.

**W-006: ✅ RESUELTO en este PR.**

---

## Compilation Check

| Target | Command | Result |
|--------|---------|--------|
| Backend | `npx tsc --noEmit` | EXIT:0 ✅ |
| Frontend | `npx tsc --noEmit` | EXIT:0 ✅ |

---

## Issue Tracker

| ID | Severidad | Descripción | Archivo | Estado |
|----|-----------|-------------|---------|--------|
| B-004 | 🔴 BLOQUEANTE | Room re-join missing on WS reconnect | useWebSocket.ts:82 | OPEN |
| W-018 | 🟡 Warning | Double `join_village` on mount | useWebSocket.ts + useResources.ts | OPEN |
| W-019 | 🟡 Warning | Double `building:complete` invalidation | useWebSocket.ts + useBuildings.ts | OPEN |
| W-020 | 🟡 Warning | `ResourcesTickPayload` type incompleto | socketServer.ts:11 | OPEN |
| W-021 | 🟡 Warning | Toast slide-out animation missing | Toast.tsx + Toast.css | OPEN |

### Warnings de PRs anteriores (abiertos)

| ID | PR | Descripción | Estado |
|----|-----|-------------|--------|
| W-004 | #18 | PATCH `/villages/:id/name` no documentado en tech-stack.md | OPEN |
| W-005 | #18 | CSS fallback divergence | OPEN |
| ~~W-006~~ | ~~#19~~ | ~~WS room join sin ownership check~~ | ✅ RESUELTO en PR #22 |
| W-007 | #19 | `productionStopsOnFullStorage` flag no leído del config | OPEN |
| W-008 | #19 | Sequential tick processing O(n) | OPEN |
| W-009 | #19 | `applyTick` clampa overcap al cap | OPEN |

---

## Acción Requerida

@developer corregir **B-004** — añadir re-join de village room tras reconnect del socket. Fix propuesto: añadir `isConnected` a los deps del effect de join en `useWebSocket.ts` y eliminar el ref guard.

@qa re-valida tras fix.
