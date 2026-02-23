# Midgard Online — Pipeline Playbook

> Guía paso a paso para ejecutar el pipeline completo de agentes.
> Cada paso indica qué agente abrir, qué prompt pegar, y qué esperar.

## Cómo Interactuar con un Agente en VS Code

1. Abre **Copilot Chat** (⌘⇧I o el icono de chat)
2. En el input, escribe `@` y selecciona el agente (ej: `@producer`)
3. Pega el prompt indicado abajo
4. El agente leerá los archivos del workspace automáticamente según su configuración
5. **Revisa el output** — si está bien, copia las partes clave al siguiente paso
6. Si algo no te convence, pídele cambios en la misma ventana antes de avanzar

### Regla de Oro

> Después de cada paso, **revisa los archivos creados/modificados** antes de pasar al siguiente agente. Tú eres el Director del estudio — los agentes proponen, tú apruebas.

---

## PASO 0: Bootstrap (YA HECHO)

- [x] `games/midgard-online/game.json` creado
- [x] Carpetas `config/`, `docs/`, `sandbox-web/`, `backend/` creadas
- [x] `copilot-instructions.md` actualizado con arquitectura multi-juego

---

## PASO 1: @producer — Aprobar el Concepto

### Qué hace

El Producer evalúa tu idea desde el punto de vista de negocio: mercado, audiencia, monetización, KPIs, riesgos. Decide si el proyecto es viable.

### Prompt para pegar

```
Estoy trabajando en el juego `midgard-online`. Lee `games/midgard-online/game.json` para contexto.

Quiero crear **Midgard Online**, un juego de estrategia MMO en navegador inspirado en Travian (https://www.travian.com). Temática nórdica (vikingos, mitología nórdica).

**Concepto:**
- Juego web multijugador en tiempo real (no mobile, no Unity — 100% browser)
- Cada jugador tiene una aldea que crece en un mapa compartido con otros jugadores
- 4 recursos: Madera, Arcilla, Hierro, Trigo (como Travian)
- Edificios de producción de recursos + edificios militares + edificios de soporte
- Sistema de tropas con ataque y defensa
- Mapa del mundo con coordenadas donde los jugadores fundan aldeas
- Combate: envías tropas a otra aldea, el resultado se calcula por stats
- Alianzas entre jugadores
- Progresión: subir edificios → desbloquear tropas → expandir territorio → fundar nuevas aldeas

**Tech Stack previsto:**
- Frontend: React + Vite (en `games/midgard-online/sandbox-web/`)
- Backend: Node.js + Express (en `games/midgard-online/backend/`)
- Base de datos: PostgreSQL o SQLite para desarrollo
- Real-time: WebSocket para notificaciones en vivo

**Lo que necesito de ti:**
1. Evalúa la viabilidad del concepto con un análisis de mercado (Travian, Tribal Wars, Ikariam)
2. Define KPIs target (retención, monetización)
3. Define el modelo de monetización (Free-to-play + premium currency)
4. Crea un roadmap de 4 fases con scope claro por fase
5. Si apruebas, crea `games/midgard-online/docs/vision.md` con todo lo anterior
6. Indica el siguiente paso para @gamedesign
```

### Qué esperar

- Un análisis de mercado con competidores
- KPIs realistas (D1, D7, D30 retención; ARPDAU)
- Modelo de monetización definido
- Roadmap en 4 fases
- Archivo `games/midgard-online/docs/vision.md` creado
- Indicación de que @gamedesign es el siguiente

### Antes de avanzar

- [ ] Revisa `games/midgard-online/docs/vision.md` — ¿los KPIs son realistas?
- [ ] ¿El modelo de monetización te convence?
- [ ] ¿El roadmap tiene el alcance correcto?

> 💡 Si algo no te gusta, dile al producer **en la misma ventana**: "Cambia X por Y" o "Ajusta los KPIs de D7 a 20%"

---

## PASO 2: @gamedesign — Diseñar Recursos y Economía

### Qué hace

El GameDesign Agent diseña las mecánicas con números concretos. Empezamos por la base: recursos y edificios de producción.

### Prompt para pegar

```
Estoy trabajando en el juego `midgard-online`. Lee estos archivos para contexto:
- `games/midgard-online/game.json`
- `games/midgard-online/docs/vision.md`

Necesito que diseñes el **sistema de recursos y edificios de producción** completo para Midgard Online (juego tipo Travian web).

**Recursos (4 como Travian):**
- Madera (Yggdrasil Wood)
- Arcilla (Midgard Clay)
- Hierro (Dwarven Iron)
- Trigo (Freya's Wheat)

**Edificios de producción (1 por recurso):**
- Aserradero (produce Madera)
- Cantera (produce Arcilla)
- Mina de Hierro (produce Hierro)
- Granja (produce Trigo)

**Edificio principal:**
- Gran Salón (equivalente al Main Building de Travian — acelera construcción, desbloquea edificios)

**Lo que necesito:**
1. Tabla de balance para CADA edificio (Niveles 1-10): Coste por level, Tiempo de construcción, Producción/hora
2. Curvas de crecimiento con fórmulas explícitas
3. Recursos iniciales del jugador
4. Capacidad de almacén por level (máximo de recursos que puedes acumular)
5. Edificio de Almacén y Granero (limitan capacidad)
6. Análisis de progresión: ¿cuánto tarda un jugador en llegar a level 5 de todo? ¿Y a level 10?
7. Trigo como recurso de mantenimiento (cada edificio/tropa consume trigo — como en Travian)

**Formato:** Tablas Markdown con todos los números. Fórmulas explícitas. Cero ambigüedad.

Cuando termines, indica que @archivist debe documentar y @qa debe validar.
```

### Qué esperar

- Tablas completas (10 niveles) para cada edificio
- Fórmulas de coste/tiempo/producción
- Análisis de progresión temporal (Day 1, Day 3, Day 7)
- Sistema de consumo de trigo

### Antes de avanzar

- [ ] ¿Los tiempos de construcción son razonables? (Level 1 = minutos, Level 10 = horas)
- [ ] ¿La producción escala bien? (no lineal — exponencial suave)
- [ ] ¿Los costes están balanceados? (no se necesitan 3 días para Level 2)

---

## PASO 3: @gamedesign — Diseñar Tropas y Combate

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee:
- `games/midgard-online/game.json`
- `games/midgard-online/docs/vision.md`

Ya tenemos los recursos y edificios de producción diseñados (los verás documentados si @archivist ya los procesó, o si no, trabajo con el output del paso anterior).

Ahora necesito el **sistema de tropas y combate** estilo Travian:

**Edificios militares:**
- Cuartel (entrena infantería)
- Establo (entrena caballería)
- Taller (entrena máquinas de asedio)

**Tropas (mínimo 6-8 tipos):**
Para cada tropa necesito: Nombre temático nórdico, Tipo (infantería/caballería/asedio), Ataque, Defensa vs infantería, Defensa vs caballería, Velocidad, Capacidad de carga (saqueo), Coste de entrenamiento (4 recursos), Tiempo de entrenamiento, Consumo de trigo

**Sistema de combate:**
- Envías tropas a una aldea enemiga
- Cálculo: suma de ataque del atacante vs suma de defensa del defensor
- Pérdidas proporcionales en ambos bandos
- El ganador saquea recursos hasta la capacidad de carga
- Fórmula de combate explícita

**Defensas:**
- Muralla (aumenta defensa de la aldea)
- Bonificación de muralla por level

**Lo que necesito:**
1. Tabla completa de CADA tropa (stats, costes, tiempos)
2. Edificios militares (niveles 1-10, qué tropas desbloquean a cada level)
3. Fórmula de combate paso a paso
4. Tabla de la Muralla (10 niveles, bonificación de defensa)
5. Ejemplo de simulación de combate: "50 Berserkers atacan una aldea con 30 Defensores + Muralla Lv3"

Cuando termines, indica que @archivist debe documentar y @qa debe validar.
```

---

## PASO 4: @gamedesign — Diseñar Mapa y Alianzas

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee:
- `games/midgard-online/game.json`
- `games/midgard-online/docs/vision.md`

Necesito diseñar el **mapa del mundo y sistema de alianzas** estilo Travian:

**Mapa del mundo:**
- Grid de coordenadas (X, Y) — ej: 400×400 = 160,000 celdas
- Cada celda puede ser: vacía, aldea de jugador, oasis (bonus de recursos), o NPC
- Distancia entre aldeas determina tiempo de viaje de tropas
- Un jugador empieza con 1 aldea, puede fundar más al cumplir requisitos

**Oasis:**
- Celdas especiales que dan bonus de producción (+25% o +50% de un recurso)
- Para reclamar un oasis, debes enviar tropas a limpiar los animales salvajes
- Máximo de oasis por aldea según level del Héroe/Gran Salón

**Fundar nueva aldea:**
- Requisitos: edificios específicos a cierto level + recursos + un colono (tropa especial)
- Envías 3 colonos a una celda vacía → se funda nueva aldea

**Alianzas:**
- Un jugador crea una alianza, otros se unen
- Máximo de miembros (ej: 60)
- Roles: Líder, Oficial, Miembro
- Chat de alianza (futuro)
- Diplomacia: aliado/neutral/enemigo

**Lo que necesito:**
1. Especificación del mapa: tamaño, tipos de celda, fórmula de distancia
2. Tabla de oasis: tipos y bonificaciones
3. Requisitos para fundar nueva aldea
4. Colono: stats y coste de entrenamiento
5. Reglas de alianzas: creación, máx miembros, roles
6. Fórmula de velocidad de viaje: distancia × velocidad tropa

Cuando termines, indica que @archivist debe documentar.
```

---

## PASO 5: @archivist — Documentar Todo

### Qué hace

El Archivist toma todo el output de gamedesign y lo estructura en la documentación oficial del GDD.

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee `games/midgard-online/game.json`.

El @gamedesign ha completado el diseño de todos los sistemas del juego. Necesito que documentes TODA la información en los archivos correctos:

**Archivos a crear en `games/midgard-online/docs/`:**

1. `economy.md` — Sistema de recursos: tipos, producción, almacenamiento, trigo como mantenimiento
2. `buildings.md` — TODOS los edificios con sus tablas de balance (producción, militares, almacenes, muralla, Gran Salón)
3. `troops.md` — TODAS las tropas con stats, costes, tiempos
4. `combat.md` — Fórmulas de combate, simulaciones de ejemplo, sistema de defensas
5. `map.md` — Mapa del mundo, coordenadas, oasis, fundar aldeas
6. `alliances.md` — Sistema de alianzas, roles, diplomacia
7. `roadmap.md` — Fases de desarrollo (usa las fases que definió @producer en vision.md)
8. `tech-stack.md` — Stack técnico: React, Node.js, PostgreSQL, WebSocket
9. `index.md` — Índice con links a todos los documentos

**IMPORTANTE:**
- Lee `games/midgard-online/docs/vision.md` como referencia base
- Cada dato debe tener un NÚMERO concreto (costes, tiempos, rates)
- Usa tablas Markdown para todos los datos tabulares
- Añade cross-references entre documentos (ej: en buildings.md linkear a economy.md)
- Verifica que no haya contradicciones entre documentos

Cuando termines, indica que @qa debe validar la documentación.
```

### Antes de avanzar

- [ ] Revisa que TODOS los archivos se crearon
- [ ] Abre cada archivo y verifica que los datos son coherentes
- [ ] ¿El index.md tiene links a todos los docs?

---

## PASO 6: @qa — Validar el Diseño Completo

### Qué hace

QA audita TODA la economía y busca exploits, soft-locks, y problemas de balance.

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee TODOS los archivos en `games/midgard-online/docs/` y `games/midgard-online/config/`.

Ejecuta una **auditoría completa** del diseño del juego:

1. **5-Point Validation Checklist** (de tu agent file) sobre la economía de recursos
2. **Soft-Lock Check**: ¿Puede un jugador con 0 recursos premium progresar sin quedarse atascado?
3. **Inflation Check**: ¿La producción de recursos escala más rápido que los costes? ¿Hay inflación?
4. **Exploit Check**: ¿Hay formas de explotar el sistema? (ej: producir infinito de un recurso, atacar repetidamente sin coste)
5. **Trigo Check**: ¿El consumo de trigo puede causar un soft-lock donde las tropas mueran de hambre?
6. **Combat Balance**: ¿Hay una tropa/estrategia que domine a todas las demás?
7. **Progresión temporal**: Simula un jugador activo Day 1, Day 7, Day 30. ¿El pacing es correcto?
8. **Elegance Validation** (usa tu skill `elegance-validation`): ¿Hay features gratuitas sin desafío vinculado?

**Formato de output:**
- Para cada check: ✅ PASS o ❌ FAIL con explicación y datos
- Para cada FAIL: propuesta de fix concreta con números
- Al final: veredicto global (GO / NEEDS REVISION / BLOCKER)

Si hay FAILs, indica qué agente debe actuar (@gamedesign para redesign, @developer para fix).
```

### Antes de avanzar

- [ ] ¿Todos los checks pasaron? Si hay FAILs, vuelve al agente indicado
- [ ] ¿Las simulaciones de progresión tienen sentido?
- [ ] ¿QA aprobó explícitamente con "✅ QA APPROVED"?

> ⚠️ Si QA detecta problemas graves, vuelve a **@gamedesign** con el reporte de QA y pídele que ajuste. Luego repite QA.

---

## PASO 7: @developer — Crear Configs JSON

### Qué hace

El Developer transforma los docs aprobados en JSON configs y define la arquitectura del tech stack.

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee:
- `games/midgard-online/game.json`
- TODOS los archivos en `games/midgard-online/docs/`

**Fase 1 — JSON Configs:**
Genera TODOS los JSON configs en `games/midgard-online/config/` basándote EXACTAMENTE en los docs:

1. `ResourcesConfig.json` — Los 4 recursos con sus propiedades
2. `BuildingsConfig.json` — TODOS los edificios con sus 10 niveles de stats
3. `TroopsConfig.json` — TODAS las tropas con stats, costes, tiempos
4. `CombatConfig.json` — Fórmulas y parámetros de combate
5. `MapConfig.json` — Configuración del mapa (tamaño, tipos de celda, oasis)
6. `AlliancesConfig.json` — Reglas de alianzas

**REGLA:** Los números en los JSON DEBEN coincidir EXACTAMENTE con los docs. Ni un número diferente.

**Fase 2 — Tech Stack Doc:**
Crea `games/midgard-online/docs/tech-stack.md` con:
- Arquitectura: React frontend ↔ Node.js/Express API ↔ PostgreSQL
- WebSocket para eventos en tiempo real
- Estructura de carpetas para sandbox-web/ y backend/
- Esquema de base de datos (tablas principales: users, villages, buildings, troops, alliances, map_cells)
- API endpoints principales (REST)
- Diagrama de arquitectura en Mermaid

Cuando termines, indica que @artdirector debe definir la dirección visual.
```

### Antes de avanzar

- [ ] Abre cada JSON config — ¿los números coinciden con los docs?
- [ ] ¿El tech-stack.md tiene sentido para un juego web?
- [ ] ¿El esquema de BD cubre todos los sistemas?

---

## PASO 8: @artdirector — Dirección Visual

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee:
- `games/midgard-online/game.json`
- `games/midgard-online/docs/vision.md`
- `games/midgard-online/docs/buildings.md`
- `games/midgard-online/docs/troops.md`

Define la **dirección visual completa** para Midgard Online (juego web tipo Travian, temática nórdica):

1. **Paleta de colores**: Hex codes para recursos, UI, estados, facciones
2. **Style guide web**: Tipografía, botones, cards, tablas — para un juego web (no mobile)
3. **Wireframes** (en ASCII o Mermaid):
   - Vista de aldea (grid de edificios)
   - Vista de mapa del mundo (grid de coordenadas)
   - Panel de edificio (info + upgrade)
   - Panel de cuartel (entrenar tropas)
   - Panel de ataque (seleccionar tropas + target)
4. **Iconografía**: Descripción de iconos para cada recurso, edificio, tropa
5. **Diagrama de navegación**: Mermaid flowchart de todas las pantallas

Guarda todo en `games/midgard-online/docs/art/style-guide.md`.

Cuando termines, indica que @release debe preparar el plan de release.
```

---

## PASO 9: @release — Preparar v0.1.0

### Prompt para pegar

```
Estoy trabajando en `midgard-online`. Lee:
- `games/midgard-online/game.json`
- `games/midgard-online/docs/roadmap.md`
- `games/midgard-online/docs/vision.md`
- `DEVLOG.md`

Prepara el **plan de release para v0.1.0** de Midgard Online:

1. Define qué incluye v0.1.0 (Fase 1 del roadmap)
2. Checklist de pre-release: ¿Todos los docs existen? ¿Configs JSON generados? ¿QA aprobó?
3. Issues de GitHub a crear para implementar v0.1.0 (lista de tasks)
4. Criterios de aceptación por feature
5. Actualiza el DEVLOG.md con la entrada del pipeline completo

**Formato:** Checklist Markdown con status provisional.
```

---

## Resumen del Flujo

```
┌─────────────────────────────────────────────────────────┐
│                    TÚ (Director)                        │
│         Revisas y apruebas entre cada paso              │
└────────────┬────────────────────────────────────────────┘
             │
   PASO 1    ▼
        @producer ──────► vision.md + roadmap
             │
   PASO 2    ▼
        @gamedesign ────► recursos + edificios (tablas)
             │
   PASO 3    ▼
        @gamedesign ────► tropas + combate (tablas)
             │
   PASO 4    ▼
        @gamedesign ────► mapa + alianzas (tablas)
             │
   PASO 5    ▼
        @archivist ─────► docs/ completos y cross-linked
             │
   PASO 6    ▼
        @qa ────────────► auditoría completa
             │              ❌ FAIL? → vuelve a @gamedesign
   PASO 7    ▼
        @developer ─────► JSON configs + tech-stack
             │
   PASO 8    ▼
        @artdirector ───► style guide + wireframes
             │
   PASO 9    ▼
        @release ───────► plan v0.1.0 + DEVLOG
             │
             ▼
        🎉 Pipeline completado — listo para implementar
```

---

## Tips Importantes

1. **Los agentes NO comparten historial.** Cada ventana de agente es una conversación nueva. Por eso los prompts son autocontenidos — incluyen todo el contexto necesario.

2. **Los agentes SÍ leen el workspace.** Después del Paso 5 (Archivist), todos los datos están en archivos del workspace. Los agentes posteriores (QA, Developer, etc.) pueden leer esos archivos directamente.

3. **Tú eres el pegamento.** Entre cada paso, revisa el output. Si algo no te convence, ajústalo ANTES de pasar al siguiente agente.

4. **Si un agente produce mucho output**, puedes dividir en sub-prompts. Ej: "Diseña solo las tropas de infantería" → "Ahora las de caballería".

5. **Si @qa rechaza algo**, NO sigas adelante. Vuelve a @gamedesign con el reporte de QA como input.

6. **Puedes iterar.** El pipeline no es de una sola pasada. Después de v0.1.0, repites con mejoras.
