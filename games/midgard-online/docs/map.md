# 🗺️ Mapa del Mundo — Midgard Online

> Sistema de mapa completo: grid de coordenadas, celdas, oasis, colonización y viaje de tropas.
> Referencia: [economy.md](economy.md) | [troops.md](troops.md) | [combat.md](combat.md) | [alliances.md](alliances.md)

---

## 🌍 Especificación del Mapa

### Dimensiones

| Parámetro           | Valor                                        |
| ------------------- | -------------------------------------------- |
| **Tipo de grid**    | Cuadrado, coordenadas cartesianas (X, Y)     |
| **Rango X**         | -200 a +200                                  |
| **Rango Y**         | -200 a +200                                  |
| **Total celdas**    | 401 × 401 = **160,801**                      |
| **Centro del mapa** | (0, 0) — Yggdrasil (zona especial NPC)       |
| **Borde del mapa**  | Wrap-around: NO (el mapa tiene bordes fijos) |

### Densidad del Mapa

| Tipo de Celda          | Cantidad | % del Total | Distribución                               |
| ---------------------- | -------- | ----------- | ------------------------------------------ |
| **Vacía**              | ~145,000 | ~90.2%      | Disponible para colonización               |
| **Oasis**              | ~4,800   | ~3.0%       | Distribuidos uniformemente                 |
| **NPC (Natar)**        | ~800     | ~0.5%       | Concentrados hacia el centro               |
| **Reservada (spawn)**  | ~10,000  | ~6.2%       | Zonas de inicio de jugadores               |
| **Yggdrasil (centro)** | 1        | <0.01%      | Celda (0,0) — artefacto especial (Fase 4+) |

> **Nota de escala:** Para un servidor de 1,000-2,000 jugadores activos, el mapa ofrece ~80-160 celdas disponibles por jugador. Con expansión a 3+ aldeas, la tierra se vuelve escasa en Day 30-60 — generando conflicto territorial.

---

## 📐 Fórmula de Distancia

### Distancia Euclidiana

```
distancia(A, B) = sqrt((xB - xA)² + (yB - yA)²)
```

### Ejemplos

| Origen       | Destino    | Distancia                     |
| ------------ | ---------- | ----------------------------- |
| (0, 0)       | (3, 4)     | 5.0 campos                    |
| (10, 20)     | (15, 32)   | 13.0 campos                   |
| (-100, 50)   | (100, -50) | 223.6 campos                  |
| (-200, -200) | (200, 200) | 565.7 campos (máxima posible) |

---

## ⏱️ Velocidad de Viaje

### Fórmula

```
velocidad_grupo = min(velocidad_tropa_i para todas las tropas del grupo)
tiempo_viaje_horas = distancia / velocidad_grupo
tiempo_viaje_minutos = (distancia / velocidad_grupo) × 60
```

### Tabla de Tiempos de Viaje (distancias comunes)

| Tropa más lenta     | Vel   | 5 campos   | 15 campos  | 30 campos  | 50 campos   | 100 campos |
| ------------------- | ----- | ---------- | ---------- | ---------- | ----------- | ---------- |
| Ulfhednar (puro)    | 14    | 21m        | 1h 4m      | 2h 9m      | 3h 34m      | 7h 9m      |
| Valkyria            | 12    | 25m        | 1h 15m     | 2h 30m     | 4h 10m      | 8h 20m     |
| Bóndi               | 6     | 50m        | 2h 30m     | 5h 0m      | 8h 20m      | 16h 40m    |
| Berserker/Skjaldmær | 5     | 1h 0m      | 3h 0m      | 6h 0m      | 10h 0m      | 20h 0m     |
| Ariete              | 3     | 1h 40m     | 5h 0m      | 10h 0m     | 16h 40m     | 33h 20m    |
| Catapulta           | 2     | 2h 30m     | 7h 30m     | 15h 0m     | 25h 0m      | 50h 0m     |
| **Colono**          | **4** | **1h 15m** | **3h 45m** | **7h 30m** | **12h 30m** | **25h 0m** |

> **Implicación estratégica:** Un vecino a 5 campos puede ser atacado por Ulfhednar en 21 minutos — casi imposible de reaccionar. Un aliado a 100 campos tarda 7h en enviar refuerzos de caballería. La **posición geográfica importa**.

---

## 📍 Tipos de Celda

### 1. Celda Vacía

| Propiedad       | Valor                                   |
| --------------- | --------------------------------------- |
| **ID**          | `empty`                                 |
| **Interacción** | Se puede colonizar enviando 3 Colonos   |
| **Contenido**   | Nada — terreno neutro                   |
| **Visible**     | Siempre (no hay fog of war en Fase 1-2) |

### 2. Aldea de Jugador

| Propiedad        | Valor                                                      |
| ---------------- | ---------------------------------------------------------- |
| **ID**           | `player_village`                                           |
| **Interacción**  | Atacar, reforzar (aliado), espiar (futuro)                 |
| **Info visible** | Nombre del jugador, nombre de la aldea, alianza, población |
| **Info oculta**  | Edificios exactos, tropas, recursos — requiere espionaje   |

### 3. Oasis

| Propiedad       | Valor                                                             |
| --------------- | ----------------------------------------------------------------- |
| **ID**          | `oasis`                                                           |
| **Interacción** | Limpiar animales → reclamar → bonus de producción a aldea cercana |
| **Tipos**       | 7 variantes (ver tabla abajo)                                     |
| **Animales**    | Fauna salvaje nórdica que debe eliminarse para reclamar           |

### 4. Aldea NPC (Natar)

| Propiedad          | Valor                                         |
| ------------------ | --------------------------------------------- |
| **ID**             | `npc_village`                                 |
| **Interacción**    | Atacar y saquear (buen ingreso de recursos)   |
| **Dificultad**     | Proporcional a la cercanía al centro del mapa |
| **Regeneración**   | Tropas NPC se regeneran lentamente (10%/día)  |
| **No colonizable** | No se puede fundar aldea en una celda NPC     |

### 5. Yggdrasil (Centro del Mapa)

| Propiedad          | Valor                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| **ID**             | `yggdrasil`                                                             |
| **Posición**       | (0, 0)                                                                  |
| **Interacción**    | Fase 4+ — evento de fin de servidor: conquistar Yggdrasil gana la ronda |
| **Estado inicial** | Bloqueado, inaccesible — se abre tras X días de servidor                |

---

## 🌿 Sistema de Oasis

### Tipos de Oasis (7 variantes)

| #   | Tipo                 | Bonus                     | Descripción Temática                        | Frecuencia |
| --- | -------------------- | ------------------------- | ------------------------------------------- | ---------- |
| 1   | **Bosque de Robles** | +25% Madera               | Arboleda sagrada protegida por lobos        | Común      |
| 2   | **Ribera Arcillosa** | +25% Arcilla              | Orilla de fiordo con arcilla rica           | Común      |
| 3   | **Veta de Hierro**   | +25% Hierro               | Afloramiento mineral guardado por trolls    | Común      |
| 4   | **Valle Fértil**     | +25% Trigo                | Pradera protegida por jabalíes              | Común      |
| 5   | **Bosque + Pradera** | +25% Madera, +25% Trigo   | Claro boscoso con pastos                    | Raro       |
| 6   | **Minas + Ribera**   | +25% Hierro, +25% Arcilla | Cañón mineral junto a río                   | Raro       |
| 7   | **Llanura Dorada**   | +50% Trigo                | Extenso campo de cereal bendecido por Freya | Muy Raro   |

### Distribución en el Mapa

| Tipo                      | Cantidad         | % de Oasis |
| ------------------------- | ---------------- | ---------- |
| Simples (+25% un recurso) | ~3,600 (900 c/u) | 75%        |
| Dobles (+25%/+25%)        | ~960 (480 c/u)   | 20%        |
| Especiales (+50% Trigo)   | ~240             | 5%         |
| **Total**                 | **~4,800**       | **100%**   |

### Fauna Salvaje (Defensas de Oasis)

Cada oasis está protegido por animales salvajes nórdicos. Para reclamarlo, debes enviar tropas y derrotarlos en combate normal.

| Animal                      | ATK | DEF Inf | DEF Cab | Cantidad por Oasis (rango) |
| --------------------------- | --- | ------- | ------- | -------------------------- |
| **Lobo (Fenrir's Pup)**     | 20  | 15      | 10      | 5-20                       |
| **Jabalí (Sæhrímnir)**      | 15  | 30      | 15      | 5-15                       |
| **Oso (Björn)**             | 40  | 20      | 25      | 3-10                       |
| **Troll**                   | 60  | 40      | 30      | 2-8                        |
| **Dragón Menor (Níðhöggr)** | 100 | 60      | 50      | 1-3 (solo oasis raros)     |

### Fuerza del Oasis por Tipo

| Tipo de Oasis     | Enemigos Típicos      | ATK Aprox. | DEF Inf Aprox. | Ejército Mínimo Sugerido |
| ----------------- | --------------------- | ---------- | -------------- | ------------------------ |
| Simple (+25%)     | 10 Lobos + 5 Jabalíes | 275        | 300            | 20 Bóndi                 |
| Doble (+25%/+25%) | 8 Osos + 3 Trolls     | 500        | 280            | 15 Berserker             |
| Especial (+50%)   | 5 Trolls + 2 Dragones | 500        | 320            | 30 Berserker             |

> **Regeneración:** Los animales de un oasis no reclamado se regeneran al 100% cada 7 días. Un oasis reclamado no regenera animales mientras esté ocupado.

### Mecánica de Reclamar Oasis

```
1. El jugador envía tropas a un oasis (misión: "Reclamar Oasis")
2. Las tropas combaten contra la fauna usando el sistema de combate estándar
3. Si el atacante gana → el oasis se vincula a la aldea más cercana del jugador
4. El bonus de producción se aplica INMEDIATAMENTE a los campos de recursos correspondientes

Restricciones:
  - Un oasis solo puede vincularse a una aldea que esté a ≤ 7 campos de distancia
  - El oasis debe ser el más cercano disponible del tipo deseado
  - Si el jugador pierde la aldea vinculada → pierde el oasis automáticamente
```

### Máximo de Oasis por Aldea

| Nivel Gran Salón | Oasis Máximos | Requisito Adicional |
| ---------------- | ------------- | ------------------- |
| 1-4              | 0             | —                   |
| 5-7              | 1             | —                   |
| 8-9              | 2             | —                   |
| 10               | 3             | —                   |

### Bonus Acumulativo

```
bonus_produccion(recurso) = produccion_base × (1 + Σ bonus_oasis_recurso)

Ejemplo: Granja L7 (prod 230/h) + oasis +25% trigo + oasis +50% trigo:
  = 230 × (1 + 0.25 + 0.50) = 230 × 1.75 = 402.5 → 403/h
```

> **Implicación estratégica:** Los oasis +50% trigo son los más valiosos del juego (trigo es el recurso limitante). Las alianzas pelearán por controlar zonas con oasis raros.

---

## 🏘️ Fundar Nueva Aldea (Colonización)

### Requisitos para Fundar

| Requisito                 | Valor                     | Justificación                |
| ------------------------- | ------------------------- | ---------------------------- |
| **Gran Salón**            | Nivel 10                  | Progresión late-game         |
| **Almacén**               | Nivel 10                  | Necesitas acumular recursos  |
| **Granero**               | Nivel 10                  | Necesitas trigo para colonos |
| **Residencia**            | Nivel 10 (edificio nuevo) | Edificio que entrena colonos |
| **Colonos**               | 3 unidades                | Tropa especial (ver abajo)   |
| **Recursos para colonos** | 3 × coste del Colono      | Alto coste acumulado         |

### Residencia (Edificio Nuevo)

> Edificio civil que permite entrenar Colonos. Requisito: Gran Salón nivel 10.
> No tiene otros usos — su único propósito es la expansión territorial.

| Nivel | Madera | Arcilla | Hierro | Trigo  | Total  | Tiempo  | Efecto            | Pop |
| ----- | ------ | ------- | ------ | ------ | ------ | ------- | ----------------- | --- |
| 1     | 580    | 460     | 350    | 180    | 1,570  | 25m     | Entrena Colonos   | 2   |
| 2     | 920    | 730     | 555    | 285    | 2,490  | 39m     | -5% coste Colono  | 2   |
| 3     | 1,455  | 1,155   | 880    | 450    | 3,940  | 1h 0m   | -10% coste Colono | 3   |
| 4     | 2,310  | 1,835   | 1,395  | 715    | 6,255  | 1h 33m  | -15% coste Colono | 3   |
| 5     | 3,660  | 2,905   | 2,210  | 1,135  | 9,910  | 2h 24m  | -20% coste Colono | 4   |
| 6     | 5,805  | 4,605   | 3,505  | 1,800  | 15,715 | 3h 43m  | -25% coste Colono | 4   |
| 7     | 9,200  | 7,300   | 5,555  | 2,850  | 24,905 | 5h 46m  | -30% coste Colono | 5   |
| 8     | 14,585 | 11,575  | 8,805  | 4,520  | 39,485 | 8h 56m  | -35% coste Colono | 5   |
| 9     | 23,120 | 18,345  | 13,955 | 7,165  | 62,585 | 13h 52m | -40% coste Colono | 6   |
| 10    | 36,650 | 29,080  | 22,120 | 11,355 | 99,205 | 21h 29m | -45% coste Colono | 6   |

### Colono (Tropa Especial)

> El Colono es una tropa civil, no militar. No combate — solo funda aldeas.

| Stat                      | Valor                  |
| ------------------------- | ---------------------- |
| **Nombre**                | Landnámsmaður (Colono) |
| **Nombre Inglés**         | Settler                |
| **Tipo**                  | Civil (no combate)     |
| **Ataque**                | 0                      |
| **Defensa vs Infantería** | 0                      |
| **Defensa vs Caballería** | 0                      |
| **Velocidad**             | 4 campos/hora          |
| **Carga**                 | 0                      |
| **Consumo de trigo**      | 1/hora                 |

**Coste de entrenamiento (1 Colono):**

| Madera | Arcilla | Hierro | Trigo | Total  | Tiempo |
| ------ | ------- | ------ | ----- | ------ | ------ |
| 5,800  | 4,600   | 3,500  | 2,100 | 16,000 | 3h 20m |

**Coste de 3 Colonos (fundar aldea):**

| Madera | Arcilla | Hierro | Trigo | Total  | Tiempo Total |
| ------ | ------- | ------ | ----- | ------ | ------------ |
| 17,400 | 13,800  | 10,500 | 6,300 | 48,000 | 10h 0m       |

> Con Residencia L5 (-20%): Coste por colono = 12,800 → 3 colonos = 38,400 total.
> Con Residencia L10 (-45%): Coste por colono = 8,800 → 3 colonos = 26,400 total.

### Proceso de Colonización

```
1. Entrena 3 Colonos en la Residencia (10h base)
2. Selecciona una celda VACÍA del mapa como destino
3. Envía los 3 Colonos (misión: "Fundar Aldea")
4. Los Colonos viajan a velocidad 4 campos/h hasta la celda destino
5. Al llegar, la celda se convierte en una aldea nueva
6. Los 3 Colonos "desaparecen" (se establecen)
7. La nueva aldea empieza con:
   - Gran Salón L1 (pre-construido)
   - Almacén L1
   - Granero L1
   - 500 de cada recurso (menos que la primera aldea: 750)
   - 18 campos de recurso vacíos
   - Sin escudo de principiante (vulnerable desde el primer momento)
```

### Restricciones de Colonización

| Regla                    | Valor                                          | Justificación             |
| ------------------------ | ---------------------------------------------- | ------------------------- |
| Celda debe estar vacía   | No se puede fundar sobre oasis/NPC/otra aldea  | Obvio                     |
| Colonos no combaten      | Si son atacados en ruta → mueren sin pelear    | Necesitan escolta         |
| Máximo de aldeas/jugador | Sin límite técnico, pero limitado por economía | Cada aldea consume trigo  |
| Distancia mínima         | No hay mínimo                                  | Puedes fundar al lado     |
| Distancia máxima         | No hay máximo                                  | Pero el viaje será eterno |

### Progresión de Aldeas por Día

| Aldea # | Día Estimado (F2P) | Coste Acumulado Total       | Requisitos                        |
| ------- | ------------------ | --------------------------- | --------------------------------- |
| 1ª      | Day 0 (inicio)     | 0 (gratis)                  | Registro                          |
| 2ª      | Day 20-30          | ~48,000 + edificios L10     | GS/Almacén/Granero/Residencia L10 |
| 3ª      | Day 40-55          | ~48,000 (desde aldea 1 o 2) | Otra aldea con requisitos         |
| 4ª      | Day 60-80          | Similar                     | Optimización multi-aldea          |

> **Implicación estratégica:** La 2ª aldea es un HITO enorme (~Day 25). Los jugadores que la consigan primero tienen ventaja exponencial (doble producción). Las alianzas pueden coordinar escolta de colonos para proteger la expansión.

---

## 🗺️ Zonas del Mapa

### Distribución Radial

El mapa se divide en 4 zonas concéntricas desde el centro (0,0):

```
         ┌─────────────────────────────────┐
         │          BORDE (Rim)            │  160-200 celdas del centro
         │  ┌─────────────────────────┐    │
         │  │     MEDIA (Mid)          │    │  80-160 celdas
         │  │  ┌─────────────────┐    │    │
         │  │  │  INTERIOR (Inner)│    │    │  30-80 celdas
         │  │  │  ┌──────────┐   │    │    │
         │  │  │  │ CENTRO   │   │    │    │  0-30 celdas
         │  │  │  │ Yggdrasil│   │    │    │
         │  │  │  └──────────┘   │    │    │
         │  │  └─────────────────┘    │    │
         │  └─────────────────────────┘    │
         └─────────────────────────────────┘
```

| Zona         | Distancia al Centro | Densidad NPC           | Densidad Oasis | Jugadores                  |
| ------------ | ------------------- | ---------------------- | -------------- | -------------------------- |
| **Centro**   | 0-30                | Muy Alta (NPC fuertes) | Baja           | Pocos (tardío)             |
| **Interior** | 30-80               | Alta                   | Media          | Overflow spawn + expansión |
| **Media**    | 80-160              | Media                  | Alta           | La mayoría spawneán aquí   |
| **Borde**    | 160-200             | Baja                   | Baja           | Principiantes, tranquilo   |

### Spawn de Jugadores Nuevos

```
Algoritmo de Spawn:
1. Buscar celda vacía en zona Media (80-160 del centro)
2. Preferir celdas a > 5 campos de otra aldea de jugador
3. Si la zona Media está llena → overflow a Interior (playerSpawn: true, prioridad overflow) o Borde
4. Nunca spawnear en Centro (reservado para late-game)

Distribución: Los jugadores se spawnean distribuidos en los 4 cuadrantes
para evitar concentración en una sola área.
```

---

## 📊 Análisis de Viaje y Alcance

### Radio de Influencia por Tipo de Tropa

| Tropa            | Vel | Radio en 1h | Radio en 4h | Radio en 12h |
| ---------------- | --- | ----------- | ----------- | ------------ |
| Ulfhednar        | 14  | 14 campos   | 56 campos   | 168 campos   |
| Valkyria         | 12  | 12 campos   | 48 campos   | 144 campos   |
| Bóndi            | 6   | 6 campos    | 24 campos   | 72 campos    |
| Infantería media | 5   | 5 campos    | 20 campos   | 60 campos    |
| Colono           | 4   | 4 campos    | 16 campos   | 48 campos    |
| Ariete           | 3   | 3 campos    | 12 campos   | 36 campos    |
| Catapulta        | 2   | 2 campos    | 8 campos    | 24 campos    |

> **Conclusión:** Las raids de caballería dominan un radio enorme (14 campos = ~600 celdas de área). Las catapultas son armas de corto alcance efectivo (>8 campos = >4h de viaje, da mucho tiempo al defensor).

### Velocidad en Misiones Especiales

| Misión        | Velocidad                               |
| ------------- | --------------------------------------- |
| Ataque normal | Tropa más lenta del grupo               |
| Raid          | Tropa más lenta × 1.0 (misma velocidad) |
| Refuerzo      | Tropa más lenta del grupo               |
| Colonización  | 4 campos/hora (velocidad del Colono)    |
| Regreso       | Misma velocidad que ida                 |

---

## 🔍 Edge Cases & Exploit Check

| Escenario                                 | Resultado                                                           | Veredicto                             |
| ----------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| Fundar aldea en borde del mapa (200, 200) | Lejos de todo → difícil de atacar PERO difícil de reforzar          | ✅ Trade-off válido                   |
| Spam de aldeas juntas (cluster)           | Posible, pero cada aldea consume trigo → límite económico           | ✅ Self-limiting                      |
| Reclamar todos los oasis cercanos         | Max 3 por aldea (GS L10). Para más, necesitas más aldeas            | ✅ Limita dominio                     |
| Colono sin escolta                        | Puede ser interceptado en ruta → 0 DEF → muere                      | ✅ Requiere estrategia                |
| NPC farming infinito                      | Se regeneran al 10%/día, no al instante → rendimientos decrecientes | ✅ Balanceado                         |
| Oasis a >7 campos                         | No reclamable → posición geográfica importa                         | ✅ Incentiva colonización estratégica |
| Jugador inactivo ocupa celda              | Después de 30 días inactivo → aldea se convierte en NPC (Fase 3+)   | ✅ Recicla celdas                     |

---

## 📌 Fórmulas Resumen

```
# Distancia
dist(A,B) = sqrt((xB-xA)² + (yB-yA)²)

# Tiempo de viaje
tiempo_horas = dist(A,B) / min(velocidad_tropas_grupo)

# Bonus de oasis
prod_efectiva = prod_base × (1 + Σ bonus_oasis)

# Coste de colono con Residencia
coste_colono = base_coste × (1 - (residencia_level - 1) × 0.05)  [L1=0%, L2=-5%, L10=-45%]

# Capacidad de spawn
aldeas_por_jugador = ilimitado (limitado por economía, no por regla)
```

---

## 📌 Next Step

> **@archivist** debe integrar el mapa en la documentación oficial del GDD.
> **@qa** debe validar: balance de oasis, coste de colonización vs progresión económica, y tiempos de viaje razonables.

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
