# 🗺️ Roadmap de Desarrollo — Midgard Online

> Plan de 4 fases para llevar Midgard Online de pre-producción a lanzamiento.
> Basado en las fases definidas en [vision.md](vision.md).
> KPIs y modelo de negocio: [vision.md](vision.md) | Stack técnico: [tech-stack.md](tech-stack.md)

---

## 📊 Resumen de Fases

| Fase   | Versión | Objetivo                             | Duración Estimada | Estado       |
| ------ | ------- | ------------------------------------ | ----------------- | ------------ |
| Fase 1 | v0.1.0  | Economía base — construir y producir | 4-6 semanas       | 🔵 En diseño |
| Fase 2 | v0.2.0  | Combate PvP funcional                | 4-6 semanas       | ⚪ Pendiente |
| Fase 3 | v0.3.0  | Alianzas y capa social               | 4-6 semanas       | ⚪ Pendiente |
| Fase 4 | v1.0.0  | Monetización y lanzamiento           | 6-8 semanas       | ⚪ Pendiente |

**Total estimado:** 18-26 semanas (~4-6 meses)

---

## 🏗️ Fase 1 — Fundación (v0.1.0)

**Duración:** 4-6 semanas  
**Objetivo:** Un jugador puede crear una aldea vikinga, construir edificios y producir los 4 recursos en tiempo real.

> **KPI de Fase:** El jugador puede jugar 30 minutos sin quedarse sin cosas que hacer.

### Features P0 (Bloqueantes de Lanzamiento)

| Feature                              | Descripción                                                   | Scope |
| ------------------------------------ | ------------------------------------------------------------- | ----- |
| Sistema de 4 recursos                | Madera, Arcilla, Hierro, Trigo generados en tiempo real       | S     |
| 6 edificios de producción/almacén    | Leñador, Cantera, Mina, Granja, Almacén, Granero              | M     |
| Gran Salón (edificio principal)      | Nivel 1–10, reduce tiempos de construcción, desbloquea otros  | S     |
| UI de aldea (grid de edificios)      | Vista isométrica/grid con slots de recursos e infraestructura | M     |
| Timers de construcción               | Cola de construcción, cuenta regresiva en tiempo real         | S     |
| Backend: auth + CRUD de aldeas       | Registro, login JWT, creación de aldea inicial, persistencia  | M     |
| Producción en tiempo real (servidor) | Tick de producción cada X segundos, acumulación de recursos   | M     |

### Criterios de Aceptación — Fase 1

- [ ] Un jugador puede registrarse y crear su aldea sin errores
- [ ] Los 4 recursos se producen y acumulan correctamente
- [ ] Construir un edificio descuenta los recursos y activa el timer
- [ ] El Gran Salón reduce tiempos de construcción según su nivel
- [ ] La producción se detiene al llenar el almacén (productionStopsOnFullStorage)
- [ ] El juego es jugable en desktop y mobile browser

### Dependencias — Fase 1

| Dependencia            | Tipo     | Descripción                                |
| ---------------------- | -------- | ------------------------------------------ |
| `BuildingsConfig.json` | Config   | Todos los niveles, costes y tiempos        |
| `ResourcesConfig.json` | Config   | Recursos base, capacidades, fórmulas       |
| PostgreSQL schema      | Técnico  | Tablas: users, villages, buildings, timers |
| React + Vite           | Frontend | SPA, componentes de aldea y recursos       |
| Node.js + Express      | Backend  | REST API, WebSocket setup inicial          |

---

## ⚔️ Fase 2 — Combate (v0.2.0)

**Duración:** 4-6 semanas  
**Objetivo:** PvP funcional. Los jugadores pueden enviarse tropas, combatir y saquear recursos.

> **KPI de Fase:** 60% de jugadores D3 hacen al menos 1 ataque.

### Features P0

| Feature                          | Descripción                                                                  | Scope |
| -------------------------------- | ---------------------------------------------------------------------------- | ----- |
| Edificios militares (3)          | Cuartel (Lv1-10), Establo (Lv1-10), Taller (Lv1-10)                          | M     |
| 8 tipos de tropas                | Bóndi, Berserker, Skjaldmær, Huskarl, Ulfhednar, Valkyria, Ariete, Catapulta | L     |
| Sistema de combate (fórmulas)    | ATK total vs DEF total, pérdidas proporcionales, saqueó                      | M     |
| Muralla (defensa)                | 10 niveles, bonus de defensa acumulativo (+8%/nivel)                         | S     |
| Mapa del mundo (grid)            | Grid 401×401, tipos de celda, aldeas y oasis visibles                        | L     |
| Enviar tropas + resolver combate | Envío de tropas, viaje en tiempo real, resolución al llegar                  | L     |

### Features P1 (Post-MVP Combate)

| Feature                           | Descripción                                         | Scope |
| --------------------------------- | --------------------------------------------------- | ----- |
| Reportes de batalla               | Desglose completo: tropas enviadas, pérdidas, botín | M     |
| WebSocket: notificación de ataque | Alerta en tiempo real cuando te atacan              | M     |
| Scout (explorador)                | Misión de espionaje antes del ataque                | S     |

### Criterios de Aceptación — Fase 2

- [ ] Un jugador puede entrenar cada tipo de tropa
- [ ] Las tropas viajan al objetivo con el tiempo calculado por distancia/velocidad
- [ ] El combate se resuelve con las fórmulas de `CombatConfig.json`
- [ ] El saqueo máximo es el 50% de los recursos del defensor
- [ ] Los arietes reducen el nivel efectivo de la muralla antes del combate
- [ ] El mapa muestra las aldeas de todos los jugadores activos
- [ ] El consumo de trigo funciona: déficit causa deserción proporcional

### Dependencias — Fase 2

| Dependencia         | Tipo    | Descripción                              |
| ------------------- | ------- | ---------------------------------------- |
| `TroopsConfig.json` | Config  | Stats, costes, tiempos de cada tropa     |
| `CombatConfig.json` | Config  | Fórmulas de combate, misiones, muralla   |
| `MapConfig.json`    | Config  | Grid, tipos de celda, zonas              |
| PostgreSQL (troops) | Técnico | Tablas: troops, missions, battle_reports |
| WebSocket handlers  | Técnico | Notificaciones de ataque entrante        |

---

## 🤝 Fase 3 — Social (v0.3.0)

**Duración:** 4-6 semanas  
**Objetivo:** Alianzas y capa social que retiene a los jugadores a largo plazo.

> **KPI de Fase:** D30 retention alcanza 10%. 50% de jugadores activos están en una alianza.

### Features P0

| Feature              | Descripción                                          | Scope |
| -------------------- | ---------------------------------------------------- | ----- |
| Sistema de alianzas  | Crear, unirse, gestionar (hasta 60 miembros)         | M     |
| Chat de alianza      | WebSocket, historial 500 mensajes, rate limit 10/min | M     |
| Fundar segunda aldea | 3 colonos + requisitos + celda vacía                 | L     |

### Features P1

| Feature                                 | Descripción                                              | Scope |
| --------------------------------------- | -------------------------------------------------------- | ----- |
| Diplomacia (aliado/NAP/neutral/enemigo) | Cooldowns de transición, bonus de +10% ATK vs enemigos   | S     |
| Oasis (bonus de recursos en mapa)       | Reclamar oasis, animales defensores, bonus de producción | M     |
| Rankings (jugadores + alianzas)         | Puntuación por población, tropas entrenadas, batallas    | S     |

### Features P2

| Feature              | Descripción                               | Scope |
| -------------------- | ----------------------------------------- | ----- |
| Eventos del servidor | Incursión de Frost Giants, torneo semanal | M     |

### Criterios de Aceptación — Fase 3

- [ ] Un jugador puede crear/unirse a una alianza
- [ ] El chat funciona en tiempo real vía WebSocket
- [ ] El sistema de diplomacia aplica cooldowns correctamente
- [ ] Un jugador con Gran Salón 10 puede fundar una segunda aldea
- [ ] Los oasis dan el bonus de producción correcto
- [ ] Los rankings se actualizan en tiempo real

### Dependencias — Fase 3

| Dependencia            | Tipo    | Descripción                                    |
| ---------------------- | ------- | ---------------------------------------------- |
| `AlliancesConfig.json` | Config  | Roles, permisos, diplomacia, cooldowns         |
| `MapConfig.json`       | Config  | Oasis, colonización, requisitos                |
| PostgreSQL (alliances) | Técnico | Tablas: alliances, alliance_members, diplomacy |
| WebSocket (chat)       | Técnico | Canal de alianza en tiempo real                |

---

## 💰 Fase 4 — Monetización & Polish (v1.0.0)

**Duración:** 6-8 semanas  
**Objetivo:** Free-to-play viable, juego estable con 500+ jugadores concurrentes.

> **KPI de Fase:** Conversion rate 3%. ARPDAU $0.08. Servidor estable con 500+ jugadores.

### Features P0

| Feature                            | Descripción                                                    | Scope |
| ---------------------------------- | -------------------------------------------------------------- | ----- |
| Runas de Odín (moneda premium)     | Obtención F2P (5/día), packs IAP, sin compra directa de tropas | M     |
| Speed-ups con Runas                | Completar construcción/entrenamiento, 1 Runa = 1 minuto        | S     |
| 2º slot de construcción            | Construir 2 edificios simultáneamente, 25 Runas/día            | S     |
| Battle Pass "Camino del Einherjar" | Recompensas diarias, cosméticos exclusivos, $4.99/mes          | L     |
| Tutorial/onboarding guiado         | 7 pasos interactivos, recompensas de recursos por completar    | M     |
| Balanceo post-beta                 | Ajustes de balance basados en datos de jugadores               | L     |

### Features P1

| Feature                           | Descripción                                             | Scope |
| --------------------------------- | ------------------------------------------------------- | ----- |
| Cosmetics (skins aldea, avatares) | Skins de edificios, marcos de perfil, efectos           | M     |
| Servidor de lanzamiento           | Configuración de servidor dedicado, escalado, monitoreo | M     |
| Landing page + marketing          | Landing de conversión, SEO, captación                   | M     |

### Criterios de Aceptación — Fase 4

- [ ] Las Runas no se pueden convertir directamente en tropas o recursos base
- [ ] El 2º constructor funciona con suscripción de Runas
- [ ] El Battle Pass entrega recompensas diarias correctamente
- [ ] El tutorial guía al jugador hasta su primer ataque PvP
- [ ] El servidor aguanta 500+ jugadores concurrentes sin degradación
- [ ] ARPDAU medido ≥ $0.05 en soft launch

---

## 📈 Simulación de Progresión del Jugador

### Player Journey por Fase

| Hito                       | Fase | Tiempo Estimado | Evento Clave                         |
| -------------------------- | ---- | --------------- | ------------------------------------ |
| Primera aldea creada       | 1    | Minuto 0        | Onboarding completado                |
| Todos los recursos Lv3     | 1    | ~1 hora         | Producción estable                   |
| Gran Salón Lv5             | 1    | ~3-6 horas      | Cuartel desbloqueado                 |
| Primeras tropas entrenadas | 2    | ~1 día          | Primer Bóndi/Ulfhednar listo         |
| Primer ataque PvP          | 2    | ~2 días         | KPI D2 medido aquí                   |
| Unido a alianza            | 3    | ~3-5 días       | Activación social                    |
| Segunda aldea fundada      | 3    | ~2-4 semanas    | Double producción, commitment fuerte |
| Primera compra de Runas    | 4    | Variable        | KPI conversión medido aquí           |

---

## 🔄 Dependencias entre Fases

```
Fase 1 (Fundación)
  ↓
Fase 2 (Combate) — requiere edificios + producción estable
  ↓
Fase 3 (Social) — requiere mapa + tropas funcionales + aldeas
  ↓
Fase 4 (Monetización) — requiere todo funcional para monetizar
```

> ⚠️ No iniciar una fase antes de que la anterior haya pasado QA.

---

## ✅ Estado de Documentación

| Documento                      | Estado      | Verificado por QA |
| ------------------------------ | ----------- | ----------------- |
| [vision.md](vision.md)         | ✅ Completo | Pendiente         |
| [economy.md](economy.md)       | ✅ Completo | Pendiente         |
| [buildings.md](buildings.md)   | ✅ Completo | Pendiente         |
| [troops.md](troops.md)         | ✅ Completo | Pendiente         |
| [combat.md](combat.md)         | ✅ Completo | Pendiente         |
| [map.md](map.md)               | ✅ Completo | Pendiente         |
| [alliances.md](alliances.md)   | ✅ Completo | Pendiente         |
| [roadmap.md](roadmap.md)       | ✅ Completo | Pendiente         |
| [tech-stack.md](tech-stack.md) | ✅ Completo | Pendiente         |

---

## 📌 Next Step

> **@qa** debe auditar TODA la documentación antes de que **@developer** genere los configs JSON definitivos.

---

_Diseñado por `@producer`. Documentado por `@archivist` — 2026-02-23._
