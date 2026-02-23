# 💰 Economía de Midgard Online

> Sistema económico completo: recursos, moneda premium, flujo económico, almacenamiento, y protecciones.
> Para tablas detalladas de edificios, ver [buildings.md](buildings.md).

---

## 🪵 Recursos Base (4)

| #   | Recurso     | Nombre Nórdico | Color UI  | Icono            | Edificio Productor   | Almacenado En | Rol Económico                        |
| --- | ----------- | -------------- | --------- | ---------------- | -------------------- | ------------- | ------------------------------------ |
| 1   | **Madera**  | Viðr           | `#8B4513` | Troncos apilados | Leñador de Yggdrasil | Almacén       | Construcción civil                   |
| 2   | **Arcilla** | Leir           | `#CD853F` | Ladrillos        | Cantera de Midgard   | Almacén       | Construcción defensiva               |
| 3   | **Hierro**  | Járn           | `#708090` | Lingotes         | Mina de Hierro Enano | Almacén       | Militar (tropas, mejoras)            |
| 4   | **Trigo**   | Korn           | `#DAA520` | Espigas          | Granja de Freya      | Granero       | **Mantenimiento** (consumo continuo) |

### Asimetría de Recursos

| Recurso | Base Prod/h | Campos/Aldea | Prod Total L10 | Escasez                                          |
| ------- | ----------- | ------------ | -------------- | ------------------------------------------------ |
| Madera  | 30          | 4            | 2,560/h        | Normal                                           |
| Arcilla | 30          | 4            | 2,560/h        | Normal                                           |
| Hierro  | **25**      | 4            | **2,132/h**    | **Alta** — 17% menos que otros                   |
| Trigo   | 30          | **6**        | **3,840/h**    | Especial — más campos, pero consumido por tropas |

> El hierro se produce un 17% menos que madera/arcilla. Esto convierte al hierro en el recurso más disputado del juego — incentivando el comercio, la diplomacia y el saqueo.

---

## 💹 Moneda Premium: Runas de Odín

| Atributo           | Valor                                       |
| ------------------ | ------------------------------------------- |
| **Nombre**         | Runas de Odín                               |
| **Color UI**       | `#9B59B6` (púrpura místico)                 |
| **Icono**          | Piedra rúnica brillante                     |
| **Obtención F2P**  | 5/día (misiones diarias) + logros + eventos |
| **Obtención Pago** | Packs IAP ($0.99 - $99.99)                  |
| **Inicio**         | 50 Runas (tutorial)                         |

### Tabla de Conversión de Runas

| Uso                        | Ratio                                         | Nota                           |
| -------------------------- | --------------------------------------------- | ------------------------------ |
| Acelerar tiempo (0-60 min) | 1 Runa = 1 minuto                             | Lineal                         |
| Acelerar tiempo (>60 min)  | `runas = 60 + (minutos_restantes - 60) × 0.5` | Escala logarítmica             |
| Completar construcción     | Equivalente a minutos restantes               | Usa fórmula de arriba          |
| Comprar recursos           | 1 Runa = 150 unidades                         | Ineficiente — desincentiva P2W |
| 2do slot de construcción   | 25 Runas/día                                  | Desbloqueo temporal            |

---

## 📐 Fórmulas Maestras

### Producción por Hora

```
produccion(nivel) = round(base_prod × 1.405^(nivel - 1))

Constantes:
  GROWTH_PROD = 1.405
  Multiplicador L1→L10 = ×21.3
```

### Coste de Construcción

```
coste(nivel) = round(base_coste × 1.585^(nivel - 1))

Constantes:
  GROWTH_COST = 1.585
  Multiplicador L1→L10 = ×63.1
```

> **Nota:** Los costes crecen 3× más rápido que la producción. Esto garantiza que **nunca hay abundancia**: un campo L10 tarda ~25h en "pagarse" aunque produzca 21× más que L1.

### Tiempo de Construcción

```
tiempo_seg(nivel) = round(base_tiempo × 1.55^(nivel - 1))

Tiempo efectivo = tiempo_seg × (1 - 0.03 × nivel_gran_salon)

Constantes:
  GROWTH_TIME = 1.55
  Multiplicador L1→L10 = ×51.6
  Reducción Gran Salón = -3% por nivel (máx -30% a L10)
```

### Capacidad de Almacenamiento

```
capacidad(nivel) = valores_fijos[nivel]

Valores (manuales, inspirados en Travian):
  L1=1200, L2=1700, L3=2350, L4=3250, L5=4400,
  L6=5900, L7=7900, L8=10500, L9=13900, L10=18400

Aproximación: capacidad ≈ 1200 × 1.33^(nivel - 1)
```

---

## 🔄 Flujo Económico

### Fuentes (Sources)

| Fuente               | Frecuencia         | Escala     | Fase |
| -------------------- | ------------------ | ---------- | ---- |
| Campos de producción | Constante/hora     | Principal  | 1    |
| Saqueo PvP           | Por ataque         | Variable   | 2    |
| Oasis controlados    | Bonus % producción | Secundario | 3    |
| Misiones diarias     | 24h cooldown       | Menor      | 1    |
| Comercio (mercado)   | Por transacción    | Variable   | 3    |
| Eventos de servidor  | Semanal            | Bonus      | 4    |

### Sumideros (Sinks)

| Sumidero                      | Tipo             | Escala        | Fase |
| ----------------------------- | ---------------- | ------------- | ---- |
| Construcción/mejora edificios | One-time         | Principal     | 1    |
| Entrenamiento de tropas       | One-time         | Principal     | 2    |
| Consumo trigo (población)     | Continuo/hora    | Mantenimiento | 1    |
| Consumo trigo (tropas)        | Continuo/hora    | Mantenimiento | 2    |
| Fundar nueva aldea            | One-time, masivo | Endgame       | 3    |
| Tasas de comercio             | Por transacción  | Menor         | 3    |

### Balance Target

```
Ratio Sink:Source = 3:1

Significado: Por cada hora de producción, el jugador tiene ~3 horas
de costes pendientes. El jugador SIEMPRE siente escasez leve.
```

---

## 🎒 Almacenamiento

### Mecánica

- **Almacén** guarda Madera, Arcilla, Hierro (capacidad POR recurso)
- **Granero** guarda solo Trigo
- Máximo **2 de cada** por aldea (capacidades se suman)
- Cuando almacén lleno → **producción se detiene** (no se pierde)
- UI muestra advertencia cuando > 80% capacidad
- Recursos saqueados que excedan capacidad **sí se pierden**

### Tabla de Capacidades

| Nivel | Cap/Recurso | Con 2 Almacenes |
| ----- | ----------- | --------------- |
| 1     | 1,200       | 2,400           |
| 2     | 1,700       | 3,400           |
| 3     | 2,350       | 4,700           |
| 4     | 3,250       | 6,500           |
| 5     | 4,400       | 8,800           |
| 6     | 5,900       | 11,800          |
| 7     | 7,900       | 15,800          |
| 8     | 10,500      | 21,000          |
| 9     | 13,900      | 27,800          |
| 10    | 18,400      | 36,800          |

---

## 🎒 Recursos Iniciales del Jugador

| Estado Inicial | Valor                                   |
| -------------- | --------------------------------------- |
| Madera         | 750                                     |
| Arcilla        | 750                                     |
| Hierro         | 750                                     |
| Trigo          | 750                                     |
| Runas de Odín  | 50                                      |
| Gran Salón     | Nivel 1 (pre-construido)                |
| Almacén        | Nivel 1 (pre-construido, 1,200/recurso) |
| Granero        | Nivel 1 (pre-construido, 1,200 trigo)   |
| Campos         | 18 slots vacíos (4W + 4C + 4I + 6Wh)    |

### Bonus de Principiante

| Bonus                | Duración              | Efecto                           |
| -------------------- | --------------------- | -------------------------------- |
| Escudo de protección | 72 horas              | No atacable                      |
| Bonus de producción  | 7 días                | +25% producción todos los campos |
| Recursos de tutorial | Al completar tutorial | +500 de cada recurso             |

---

## ⚖️ Balance del Trigo (Mecánica Crítica)

### Consumo de Trigo

El trigo es el **recurso limitante universal** que impide ejércitos infinitos.

```
trigo_neto = produccion_granjas - consumo_poblacion - consumo_tropas

Si trigo_neto < 0:
  Las tropas desertan: rate = 1% × |trigo_neto| / produccion_granjas por hora
  UI: "¡El pueblo de Midgard pasa hambre! Tus guerreros abandonan."
```

### Tabla de Consumo

| Entidad                | Consumo/Hora       |
| ---------------------- | ------------------ |
| Población de edificios | 1 por punto de Pop |
| Infantería básica      | 1/unidad           |
| Infantería pesada      | 2/unidad           |
| Caballería             | 3/unidad           |
| Maquinaria de asedio   | 4/unidad           |

### Balance Objetivo por Fase

| Día | Tropas Típicas | Consumo Tropas/h | Prod Trigo/h | Neto     | Estado             |
| --- | -------------- | ---------------- | ------------ | -------- | ------------------ |
| 1   | 0              | 0                | 30-60        | +30      | Cómodo             |
| 7   | 100            | 150              | 700-1,000    | +550     | Holgado            |
| 14  | 500            | 700              | 1,400-2,000  | +700     | Justo              |
| 30  | 2,000          | 3,500            | 3,500-3,840  | ±0       | **Tensión**        |
| 60  | 5,000+         | 8,000+           | Multi-aldea  | Variable | **Gestión activa** |

---

## 🗓️ Progresión Económica por Día

| Día | Prod/h por Recurso | Total Acumulado | Focus del Jugador          |
| --- | ------------------ | --------------- | -------------------------- |
| 1   | 100-200            | ~5,000          | Tutorial, campos L1-2      |
| 3   | 300-500            | ~25,000         | Campos L3-4, Gran Salón L3 |
| 7   | 800-1,500          | ~120,000        | Campos L5-6, militar       |
| 14  | 2,000-4,000        | ~500,000        | Campos L7-8, 2ª aldea      |
| 30  | 5,000-10,000       | ~2,500,000      | Múltiples aldeas, guerras  |

---

## 🔒 Protecciones Anti-Exploit

| Mecánica               | Límite                              | Razón                      |
| ---------------------- | ----------------------------------- | -------------------------- |
| Saqueo máximo          | 50% de almacén enemigo              | No destruir jugadores      |
| Jugadores inactivos    | Recursos decaen 10%/día tras 7 días | Evitar "granjas" infinitas |
| Trading ratio          | Máx 1:3 entre recursos              | Evitar dumping             |
| Runas → Recursos       | 1:150 (ineficiente)                 | Desincentiva P2W directo   |
| Producción máx offline | Se detiene al llenar almacén        | Incentiva check-ins        |

---

## 📐 Métricas para @qa

| Escenario                   | Criterio                   | Target                           |
| --------------------------- | -------------------------- | -------------------------------- |
| F2P Day 1, solo producción  | ¿Gran Salón L2 alcanzable? | < 3 horas activas                |
| F2P Day 5, sin runas        | 18 campos L4-5             | Producción > 400/h               |
| Trigo negativo 24h          | Pérdida de ejército        | < 25% de tropas                  |
| Almacén L1 vs producción L5 | ¿Se llena?                 | Sí, en ~10h → presión para subir |
| 1000 tropas tier mixto      | Consumo trigo              | ~1,500/h → necesita granjas L8+  |
| Whale con speedup completo  | ¿Ventaja de stats?         | NO — solo ahorra tiempo          |

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
