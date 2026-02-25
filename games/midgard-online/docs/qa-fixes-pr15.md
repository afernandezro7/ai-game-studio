# QA Fixes — PR #15 (MO-01 Project Setup)

**Fecha:** 2026-02-25  
**Autor:** Alberto Fernández  
**Branch:** `feature/MO-01-setup`  
**Review:** [qa-review-pr15-mo01-setup.md](qa-review-pr15-mo01-setup.md)

---

## Blockers Resueltos

### B-001 — Node.js version mismatch

- **Problema:** `.tool-versions` declaraba Node 22 pero `tech-stack.md` decía Node 20.
- **Fix:** Actualizado `tech-stack.md` → Node 22 LTS (se mantiene el runtime real).

### B-002 — mission_troops PK incorrecta

- **Problema:** `mission_troops` tenía UUID como PK, permitiendo duplicados (mismo troop_type en la misma misión).
- **Fix:** Cambiado a PK compuesta `@@id([missionId, troopType])` en `schema.prisma`. Migración aplicada: `20260225135612_fix_mission_troops_composite_pk`.

### B-003 — Prisma version mismatch

- **Problema:** `package.json` usa Prisma 7.4.1 pero `tech-stack.md` decía Prisma 5.
- **Fix:** Actualizado `tech-stack.md` → Prisma 7 con justificación actualizada (driver adapter nativo).

## Minor Issues Resueltos

### M-001 — Placeholders WebSocket faltantes

- **Problema:** `tech-stack.md` listaba `attackNotifier.ts` y `chatHandler.ts` pero no existían.
- **Fix:** Creados `backend/src/ws/attackNotifier.ts` y `backend/src/ws/chatHandler.ts` con stubs tipados.

### M-002 — Placeholders Services faltantes

- **Problema:** `tech-stack.md` listaba `villageService.ts` y `troopsService.ts` en frontend pero no existían.
- **Fix:** Creados `sandbox-web/src/services/villageService.ts` y `sandbox-web/src/services/troopsService.ts` con stubs tipados.

---

## Verificación

| Check                     | Resultado    |
| ------------------------- | ------------ |
| `tsc --noEmit` (backend)  | ✅ EXIT:0    |
| `tsc --noEmit` (frontend) | ✅ EXIT:0    |
| Prisma migrate            | ✅ Applied   |
| DB schema (composite PK)  | ✅ Verified  |
| Archivos creados (4)      | ✅ All exist |

## Archivos Modificados

```
games/midgard-online/docs/tech-stack.md              (Node 22, Prisma 7)
games/midgard-online/backend/src/database/schema.prisma  (composite PK)
games/midgard-online/backend/src/ws/attackNotifier.ts     (NEW)
games/midgard-online/backend/src/ws/chatHandler.ts        (NEW)
games/midgard-online/sandbox-web/src/services/villageService.ts  (NEW)
games/midgard-online/sandbox-web/src/services/troopsService.ts   (NEW)
```
