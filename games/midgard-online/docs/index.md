# 📚 Midgard Online — Índice de Documentación

> GDD completo del juego. Cada documento tiene números concretos y fórmulas explícitas.
> Todos los valores están referenciados en los JSON configs de `config/`.

---

## 🗺️ Navegación Rápida

| Documento                                | Descripción                                            | Estado       |
| ---------------------------------------- | ------------------------------------------------------ | ------------ |
| [vision.md](vision.md)                   | Concepto, mercado, KPIs, monetización, roadmap resumen | ✅ Completo  |
| [economy.md](economy.md)                 | Recursos, moneda premium, fórmulas de producción       | ✅ Completo  |
| [buildings.md](buildings.md)             | Todos los edificios — tablas de balance Niveles 1-10   | ✅ Completo  |
| [troops.md](troops.md)                   | 8 tropas + Colono — stats, costes, desbloqueos         | ✅ Completo  |
| [combat.md](combat.md)                   | Fórmulas de combate, muralla, simulaciones paso a paso | ✅ Completo  |
| [map.md](map.md)                         | Mapa 401×401, oasis, zonas, colonización               | ✅ Completo  |
| [alliances.md](alliances.md)             | Alianzas, roles, diplomacia, chat, rankings            | ✅ Completo  |
| [roadmap.md](roadmap.md)                 | 4 fases de desarrollo, criterios de aceptación         | ✅ Completo  |
| [tech-stack.md](tech-stack.md)           | React/Node.js/PostgreSQL, esquema DB, API endpoints    | ✅ Completo  |
| [art/style-guide.md](art/style-guide.md) | Paleta, wireframes, tipografía _(pendiente)_           | ⚪ Pendiente |

---

## 🎮 Vision General

**Midgard Online** es un MMO de estrategia en navegador con temática nórdica, inspirado en Travian.
Ver detalles completos en [vision.md](vision.md).

| Campo          | Valor                                               |
| -------------- | --------------------------------------------------- |
| **Género**     | Strategy MMO / City Builder — 100% browser          |
| **Core Loop**  | Producir → Construir → Entrenar → Atacar → Expandir |
| **Plataforma** | Web (React + Node.js)                               |
| **Target**     | Mid-core gamers, 16-40 años                         |
| **Versión**    | 0.0.1 (pre-producción)                              |

---

## 💰 Economía

**Doc:** [economy.md](economy.md) | **Config:** `config/ResourcesConfig.json`

| Recurso | Nombre Nórdico | Prod Base/h | Campos | Almacén |
| ------- | -------------- | ----------- | ------ | ------- |
| Madera  | Viðr           | 30          | 4      | Almacén |
| Arcilla | Leir           | 30          | 4      | Almacén |
| Hierro  | Járn           | 25          | 4      | Almacén |
| Trigo   | Korn           | 30          | 6      | Granero |

- **Recursos iniciales:** 750 de cada uno + 50 Runas de Odín
- **Producción máxima (Lv10):** Madera/Arcilla: 2,560/h · Hierro: 2,132/h · Trigo: 3,840/h
- **Fórmula producción:** `round(baseProd × 1.405^(level - 1))`
- **Fórmula coste:** `round(baseCost × 1.585^(level - 1))`

---

## 🏗️ Edificios

**Doc:** [buildings.md](buildings.md) | **Config:** `config/BuildingsConfig.json`

### Edificios de Recursos (anillo exterior — 18 slots)

| Edificio             | Recurso | Prod Lv1 | Prod Lv10 | Tiempo Lv10 |
| -------------------- | ------- | -------- | --------- | ----------- |
| Leñador de Yggdrasil | Madera  | 30/h     | 640/h     | 2h 35m      |
| Cantera de Midgard   | Arcilla | 30/h     | 640/h     | 2h 35m      |
| Mina de Hierro Enano | Hierro  | 25/h     | 533/h     | 3h 1m       |
| Granja de Freya      | Trigo   | 30/h     | 640/h     | 2h 10m      |

### Edificios de Infraestructura (centro — hasta 2 por tipo)

| Edificio   | Función principal                | Capacidad Lv1 | Capacidad Lv10 |
| ---------- | -------------------------------- | ------------- | -------------- |
| Gran Salón | -3%/nivel tiempo de construcción | —             | -30% tiempo    |
| Almacén    | Almacena Madera, Arcilla, Hierro | 1,200/recurso | 18,400/recurso |
| Granero    | Almacena Trigo                   | 1,200         | 18,400         |

### Edificios Militares (centro)

| Edificio   | Entrena    | Requiere                      | Tropas que desbloquea                                |
| ---------- | ---------- | ----------------------------- | ---------------------------------------------------- |
| Cuartel    | Infantería | Gran Salón Lv5                | Bóndi(L1), Berserker(L3), Skjaldmær(L5), Huskarl(L7) |
| Establo    | Caballería | Gran Salón Lv7 + Cuartel Lv3  | Ulfhednar(L1), Valkyria(L5)                          |
| Taller     | Asedio     | Gran Salón Lv10 + Cuartel Lv5 | Ariete(L1), Catapulta(L5)                            |
| Muralla    | —          | Gran Salón Lv3                | +8% DEF por nivel (máx +80%)                         |
| Residencia | —          | Gran Salón Lv10               | Desbloquea Colonos (fundar aldea = late-game)        |

---

## ⚔️ Tropas

**Doc:** [troops.md](troops.md) | **Config:** `config/TroopsConfig.json`

| #   | Nombre                     | Tipo       | ATK | DEF Inf | DEF Cab | Vel | Carga | Trigo/h | Coste total |
| --- | -------------------------- | ---------- | --- | ------- | ------- | --- | ----- | ------- | ----------- |
| 1   | **Bóndi**                  | Infantería | 40  | 20      | 25      | 6   | 50    | 1       | 240         |
| 2   | **Berserker**              | Infantería | 80  | 40      | 20      | 5   | 30    | 2       | 500         |
| 3   | **Skjaldmær**              | Infantería | 30  | 65      | 50      | 5   | 35    | 1       | 420         |
| 4   | **Huskarl**                | Infantería | 60  | 80      | 40      | 5   | 40    | 2       | 680         |
| 5   | **Ulfhednar**              | Caballería | 100 | 25      | 30      | 14  | 80    | 3       | 900         |
| 6   | **Valkyria**               | Caballería | 70  | 40      | 95      | 12  | 60    | 2       | 800         |
| 7   | **Ariete de Jörmungandr**  | Asedio     | 60  | 10      | 10      | 3   | 0     | 4       | 1,300       |
| 8   | **Catapulta de Surtr**     | Asedio     | 40  | 10      | 10      | 2   | 0     | 4       | 1,700       |
| 9   | **Landnámsmaður** (Colono) | Civil      | 0   | 0       | 0       | 4   | 0     | 1       | 16,000      |

---

## ⚔️ Combate

**Doc:** [combat.md](combat.md) | **Config:** `config/CombatConfig.json`

### Fórmulas Clave

```
ATK_total = Σ(cantidad_i × ataque_i)
DEF_base  = Σ(cantidad_j × (defInf_j × ratioInf + defCav_j × ratioCav))
DEF_eff   = (DEF_base + wallBase) × (1 + wallLevel × 0.08)

victoryRatio = (ATK - DEF_eff) / ATK      [si ATK gana]
attackerLosses = 1 - victoryRatio^1.5
```

### Tipos de Misión

| Tipo     | Combate completo | Saqueo | Puede destruir edificios |
| -------- | ---------------- | ------ | ------------------------ |
| Ataque   | Sí               | 100%   | No                       |
| Raid     | Sí               | 50%¹   | No                       |
| Asedio   | Sí               | 100%   | Sí (con catapultas)      |
| Refuerzo | —                | No     | No                       |

> ¹ Raid: loot = `min(carga × 0.5, recursos disponibles)`. Máx 10% bajas si gana, 15% si pierde. Ver detalle en [combat.md](combat.md).

---

## 🗺️ Mapa

**Doc:** [map.md](map.md) | **Config:** `config/MapConfig.json`

| Parámetro             | Valor                                    |
| --------------------- | ---------------------------------------- |
| **Grid**              | 401×401 = 160,801 celdas                 |
| **Centro**            | (0, 0) — Yggdrasil                       |
| **Oasis disponibles** | ~4,800 (~3% del mapa)                    |
| **Spawn por defecto** | Zona Media (distancia 80–160 del centro) |
| **Fórmula distancia** | `√((x₂-x₁)² + (y₂-y₁)²)`                 |

**Requisitos para fundar aldea:** Gran Salón Lv10 + Almacén Lv10 + Granero Lv10 + 3 Colonos

---

## 🛡️ Alianzas

**Doc:** [alliances.md](alliances.md) | **Config:** `config/AlliancesConfig.json`

| Parámetro                | Valor                                       |
| ------------------------ | ------------------------------------------- |
| **Máximo miembros**      | 60                                          |
| **Roles**                | Jarl, Thane (max 3), Hirdman (max 10), Karl |
| **Estados diplomáticos** | Aliado / NAP / Neutral / Enemigo            |
| **Máx alianzas aliadas** | 3                                           |
| **Chat**                 | WebSocket, historial 500 mensajes           |

---

## 🔧 Stack Técnico

**Doc:** [tech-stack.md](tech-stack.md)

| Capa          | Tecnología                        |
| ------------- | --------------------------------- |
| Frontend      | React 18 + Vite + TypeScript      |
| Backend       | Node.js 20 + Express + TypeScript |
| Base de datos | PostgreSQL 16 + Prisma ORM        |
| Real-time     | Socket.io 4 (WebSocket)           |
| Auth          | JWT + bcrypt                      |

---

## 📈 Roadmap

**Doc:** [roadmap.md](roadmap.md)

| Fase | Versión | Objetivo                           | Duración    |
| ---- | ------- | ---------------------------------- | ----------- |
| 1    | v0.1.0  | Economía base — construir/producir | 4-6 semanas |
| 2    | v0.2.0  | Combate PvP funcional              | 4-6 semanas |
| 3    | v0.3.0  | Alianzas y capa social             | 4-6 semanas |
| 4    | v1.0.0  | Monetización y lanzamiento         | 6-8 semanas |

---

## ✅ Consistencia de Datos

Los siguientes valores deben ser idénticos en docs y configs:

| Valor                | Documento           | Config JSON          | ¿Coincide? |
| -------------------- | ------------------- | -------------------- | ---------- |
| Prod Leñador Lv10    | buildings.md: 640/h | BuildingsConfig: 640 | ✅         |
| Prod Hierro Lv1      | economy.md: 25/h    | ResourcesConfig: 25  | ✅         |
| ATK Berserker        | troops.md: 80       | TroopsConfig: 80     | ✅         |
| ATK Ulfhednar        | troops.md: 100      | TroopsConfig: 100    | ✅         |
| Wall bonus/level     | combat.md: +8%      | CombatConfig: 0.08   | ✅         |
| Mapa celdas total    | map.md: 160,801     | MapConfig: 160,801   | ✅         |
| Máx miembros alianza | alliances.md: 60    | AlliancesConfig: 60  | ✅         |
| Recursos iniciales   | economy.md: 750 c/u | ResourcesConfig: 750 | ✅         |
| Colonos para fundar  | map.md: 3           | MapConfig: 3         | ✅         |

> **[MISMATCH]:** Ninguno tras auditoría completa (2026-02-23). Valkyria corregida en esta revisión.

---

## 🔄 Cross-References

### Mapa de Dependencias

```
vision.md
  ├── economy.md (recursos, producción)
  │     └── buildings.md (edificios, costes)
  │           ├── troops.md (militares, desbloqueos)
  │           │     └── combat.md (fórmulas, simulaciones)
  │           │           └── map.md (viaje, oasis)
  │           │                 └── alliances.md (diplomacia, refuerzos)
  │           └── tech-stack.md (implementación)
  └── roadmap.md (fases derivadas de vision)
```

---

_Documentado por `@archivist` — 2026-02-23._
