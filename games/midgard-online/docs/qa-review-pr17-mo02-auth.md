# 🔍 QA Review — PR #17 (MO-02 Auth)

**PR:** [#17](https://github.com/afernandezro7/ai-game-studio/pull/17) — [MO-02] Authentication: JWT Register + Login  
**Issue:** [#8](https://github.com/afernandezro7/ai-game-studio/issues/8) — [MO-02] Autenticación: Registro + Login JWT  
**Branch:** `feature/MO-02-auth` → `develop`  
**Commit:** `db192ce43bac86b05943dcdae0caaec901965c8d`  
**Reviewer:** @qa  
**Fecha:** 2025-07-24

---

## Decisión: ✅ APPROVED (con 2 advertencias menores)

---

## Archivos Revisados (12 files, +2696 / -829)

### Archivos de implementación (dentro de scope)

| Archivo                          | Cambio     | Rol                                         |
| -------------------------------- | ---------- | ------------------------------------------- |
| `backend/src/routes/auth.ts`     | +156 / -13 | Register, Login, /me endpoints              |
| `backend/src/middleware/auth.ts` | +40 / -9   | JWT Bearer auth middleware                  |
| `sandbox-web/src/pages/Auth.tsx` | +215 / -4  | Login/Register UI con tabs                  |
| `sandbox-web/src/pages/Auth.css` | +189 (new) | Estilos Nordic responsive                   |
| `sandbox-web/src/App.tsx`        | +43 / -4   | Route guards (PrivateRoute/PublicOnlyRoute) |
| `backend/package.json`           | +1         | `postinstall: prisma generate`              |

### Archivos auxiliares (fuera de scope del issue)

| Archivo                                 | Cambio      | Comentario                            |
| --------------------------------------- | ----------- | ------------------------------------- |
| `DEVLOG.md`                             | +35         | Entrada del developer                 |
| `docs/developer-prompts.md`             | +828 (new)  | Prompts para futuras issues           |
| `valhalla/docs/unity-setup-tutorial.md` | +1 / -1     | Fix enlace (cross-game)               |
| `mlc_config.json`                       | +6          | Ignore patterns markdown link checker |
| `backend/package-lock.json`             | +681 / -530 | Lock update                           |
| `sandbox-web/package-lock.json`         | +501 / -268 | Lock update                           |

---

## Criterios de Aceptación: 5/5 PASS

| #   | Criterio                                 | Verificación                                                            | Estado |
| --- | ---------------------------------------- | ----------------------------------------------------------------------- | ------ |
| 1   | Registro con email + username + password | Zod `registerSchema`: username 3-20 alphanum, email válido, password ≥8 | ✅     |
| 2   | Runes: 50 automáticos al registrar       | `prisma.user.create({ data: { ..., runes: 50 } })` explícito            | ✅     |
| 3   | Login retorna JWT (expira 7d)            | `signToken()` usa `env.JWT_EXPIRES_IN` ("7d")                           | ✅     |
| 4   | Rutas protegidas retornan 401 sin token  | `authMiddleware` → `{ error: "Unauthorized" }` con 401                  | ✅     |
| 5   | Login/Register responsive                | `@media (max-width: 480px)`, card centrada desktop, full-width mobile   | ✅     |

---

## Contrato API vs tech-stack.md: ✅ MATCH

| Endpoint              | Spec                                            | Impl                                 | Match |
| --------------------- | ----------------------------------------------- | ------------------------------------ | ----- |
| `POST /auth/register` | `{username, email, password}` → `{token, user}` | ✅                                   | ✅    |
| `POST /auth/login`    | `{email, password}` → `{token, user}`           | ✅                                   | ✅    |
| `GET /auth/me`        | — → `{user}`                                    | ✅ Protegido + 404 si user eliminado | ✅    |

---

## Seguridad: ✅ PASS

| Check                               | Resultado                                       |
| ----------------------------------- | ----------------------------------------------- |
| `passwordHash` nunca expuesto       | ✅ `sanitizeUser()` helper + `select` explícito |
| bcrypt salt rounds                  | ✅ 12 (≥10 requerido)                           |
| JWT_SECRET desde env                | ✅ Validado con `z.string().min(32)`            |
| Login no revela existencia de email | ✅ `"Invalid credentials"` genérico             |
| JWT payload                         | ✅ Solo `{ userId, username }`                  |
| Token storage                       | ✅ localStorage (aceptable v0.1.0)              |

---

## Código: ✅ PASS

| Check                              | Resultado                             |
| ---------------------------------- | ------------------------------------- |
| TypeScript strict (`tsc --noEmit`) | ✅ Clean                              |
| CSS variables mapeadas a index.css | ✅ Todas existen, fallbacks correctos |
| authStore compatible               | ✅ `data.token` + `data.user` match   |
| Axios interceptor Bearer           | ✅ Adjunta token + maneja 401 global  |
| Route guards                       | ✅ `PrivateRoute` + `PublicOnlyRoute` |
| No deps nuevas no autorizadas      | ✅ Todo pre-existente                 |

---

## ⚠️ Advertencias (No bloqueantes)

### W-001: Async handlers sin try-catch (Express 4)

- **Severidad:** Menor
- **Archivo:** `backend/src/routes/auth.ts`
- **Problema:** Express 4.x no captura promesas rechazadas en `async` handlers. Si Prisma lanza error (DB caída, constraint P2002), el request cuelga sin respuesta.
- **Fix sugerido:** `import 'express-async-errors'` en `index.ts` **o** envolver handlers con try-catch.
- **Impacto:** Bajo en v0.1.0 (solo si DB falla). Resolver antes de v0.2.0.

### W-002: Race condition TOCTOU en register

- **Severidad:** Informativa
- **Archivo:** `backend/src/routes/auth.ts` (register)
- **Problema:** `findFirst` → `create` tiene ventana donde dos requests concurrentes pueden pasar el check de unicidad. El segundo `create` lanza P2002 no manejado.
- **Fix:** Se resuelve automáticamente al implementar W-001 (catch P2002 → 409).
- **Impacto:** Extremadamente bajo. La constraint de DB previene corrupción.

---

## Resumen Ejecutivo

- **5/5 criterios** de aceptación cumplidos
- **Contrato API** coincide exactamente con `tech-stack.md`
- **Seguridad** sin vulnerabilidades
- **2 advertencias** menores para trackear en issues futuras
- **Código limpio**, bien organizado, TypeScript strict

**✅ QA APPROVED — PR #17 listo para merge.**

---

## Siguiente Paso

1. Mergear PR #17 a `develop`
2. Siguiente tarea: MO-03 — Villages (issue #9)
3. Trackers W-001/W-002 para resolver en MO-03 o MO-04
