# ⚔️ Sistema de Combate — Midgard Online

> Fórmulas de combate, muralla, simulaciones de ejemplo, y reglas de saqueo.
> Referencia: [troops.md](troops.md) | [economy.md](economy.md) | [buildings.md](buildings.md)

---

## 🎯 Resumen del Combate

1. El **atacante** selecciona tropas y una aldea enemiga como objetivo.
2. Las tropas viajan del punto A al punto B (velocidad = tropa más lenta del grupo).
3. Al llegar, se ejecuta el **cálculo de combate** en un solo tick.
4. Se determinan **pérdidas** proporcionales en ambos bandos.
5. El ganador **saquea recursos** hasta la carga total de sus tropas supervivientes.
6. Las tropas supervivientes del atacante regresan a casa con el botín.
7. Se genera un **reporte de batalla** para ambos jugadores.

---

## 📐 Fórmulas de Combate

### Paso 1 — Calcular Poder de Ataque Total

```
ATK_total = Σ (cantidad_tropa_i × ataque_tropa_i)
```

Ejemplo: 50 Berserkers + 20 Ulfhednar

```
ATK_total = (50 × 80) + (20 × 100) = 4,000 + 2,000 = 6,000
```

### Paso 2 — Calcular Poder de Defensa Total

La defensa depende de la **proporción de tipos de tropa del atacante** (infantería vs caballería):

```
ratio_inf = tropas_infanteria_atacante / total_tropas_atacante
ratio_cab = tropas_caballeria_atacante / total_tropas_atacante

DEF_total = Σ (cantidad_defensor_j × (def_inf_j × ratio_inf + def_cab_j × ratio_cab))
```

Ejemplo: Defensor tiene 30 Huskarl. Atacante es 50 inf + 20 cab (ratio: 71.4% inf / 28.6% cab):

```
DEF_huskarl = 80 × 0.714 + 40 × 0.286 = 57.12 + 11.44 = 68.56
DEF_total = 30 × 68.56 = 2,057
```

> **Nota:** Las máquinas de asedio (Ariete, Catapulta) no cuentan como infantería ni caballería para el cálculo de ratio. Se ignoran en el denominador de ratio.

### Paso 3 — Aplicar Bonus de Muralla

```
DEF_efectiva = DEF_total × (1 + bonus_muralla)

Donde bonus_muralla = nivel_muralla_efectivo × 0.08 (8% por nivel)

nivel_muralla_efectivo = max(0, nivel_muralla - reduccion_arietes)
reduccion_arietes = min(nivel_muralla, arietes_enviados × 0.5)

Nota: Se usan los arietes ENVIADOS (pre-combate). La reducción se aplica
antes del cálculo de combate principal. Los arietes luego participan y pueden morir.
```

### Paso 4 — Calcular Resultado

```
Si ATK_total > DEF_efectiva (Atacante gana):
  ratio_victoria = (ATK_total - DEF_efectiva) / ATK_total
  perdidas_atacante = 1 - ratio_victoria^1.5
  perdidas_defensor = 1.0 (todas las tropas del defensor mueren)

Si DEF_efectiva > ATK_total (Defensor gana):
  ratio_victoria = (DEF_efectiva - ATK_total) / DEF_efectiva
  perdidas_defensor = 1 - ratio_victoria^1.5
  perdidas_atacante = 1.0 (todas las tropas del atacante mueren)

Si ATK_total == DEF_efectiva (Empate):
  perdidas_atacante = 1.0
  perdidas_defensor = 1.0
```

> El exponente **1.5** suaviza las pérdidas: una victoria aplastante (ratio alta) resulta en pocas bajas del ganador. Una victoria ajustada (ratio baja) resulta en bajas severas para ambos.

### Paso 5 — Aplicar Pérdidas

```
supervivientes_atacante_i = round(cantidad_i × (1 - perdidas_atacante))
supervivientes_defensor_j = round(cantidad_j × (1 - perdidas_defensor))
```

### Paso 6 — Saqueo

```
Si atacante gana:
  carga_total = Σ (supervivientes_atacante_i × carga_tropa_i)
  recursos_disponibles = min(recursos_aldea_enemigo, almacen × 0.5)
  saqueo = min(carga_total, recursos_disponibles)

  Distribución del saqueo:
  - Se saquean los 4 recursos proporcionalmente a lo disponible
```

---

## 🏰 Muralla (Wall)

> Edificio defensivo que aumenta el poder de defensa de todas las tropas de la aldea.
> Requisito: Gran Salón nivel 3.

### Tabla de la Muralla — 10 Niveles

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Bonus Defensa | DEF Base | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ------------- | -------- | --- |
| 1     | 50     | 100     | 30     | 10    | 190    | 8m     | +8%           | 20       | 0   |
| 2     | 80     | 160     | 50     | 15    | 305    | 12m    | +16%          | 40       | 0   |
| 3     | 125    | 250     | 75     | 25    | 475    | 19m    | +24%          | 60       | 0   |
| 4     | 200    | 400     | 120    | 40    | 760    | 30m    | +32%          | 80       | 0   |
| 5     | 315    | 630     | 190    | 65    | 1,200  | 46m    | +40%          | 100      | 0   |
| 6     | 500    | 1,000   | 300    | 100   | 1,900  | 1h 12m | +48%          | 130      | 0   |
| 7     | 795    | 1,585   | 475    | 160   | 3,015  | 1h 51m | +56%          | 160      | 0   |
| 8     | 1,260  | 2,515   | 755    | 255   | 4,785  | 2h 53m | +64%          | 200      | 0   |
| 9     | 1,995  | 3,985   | 1,195  | 400   | 7,575  | 4h 28m | +72%          | 240      | 0   |
| 10    | 3,165  | 6,315   | 1,895  | 635   | 12,010 | 6h 56m | +80%          | 300      | 0   |

### Mecánica de la Muralla

- **Bonus Defensa:** Multiplica la DEF total de todas las tropas defensoras × (1 + bonus%). NO afecta al atacante.
- **DEF Base:** Incluso sin tropas, la muralla tiene defensa propia (útil contra ataques muy débiles).
- **Población:** 0 — la muralla no consume trigo.
- **Arietes:** Reducen el nivel efectivo de la muralla durante el combate (ver fórmula de Ariete en [troops.md](troops.md)).

### Impacto de la Muralla en Combate

| Muralla | Bonus | 1000 DEF se convierte en... | Arietes para neutralizar |
| ------- | ----- | --------------------------- | ------------------------ |
| L0      | +0%   | 1,000                       | 0                        |
| L1      | +8%   | 1,080                       | 2                        |
| L3      | +24%  | 1,240                       | 6                        |
| L5      | +40%  | 1,400                       | 10                       |
| L7      | +56%  | 1,560                       | 14                       |
| L10     | +80%  | 1,800                       | 20                       |

---

## 📊 Velocidad de Viaje

```
velocidad_grupo = min(velocidad_tropa_i para todas las tropas en el grupo)

tiempo_viaje_horas = distancia / velocidad_grupo

distancia = sqrt((x2 - x1)² + (y2 - y1)²)
```

### Tabla de Velocidades

| Tropa     | Velocidad (campos/h) | Viaje 10 campos | Viaje 50 campos | Viaje 100 campos |
| --------- | -------------------- | --------------- | --------------- | ---------------- |
| Bóndi     | 6                    | 1h 40m          | 8h 20m          | 16h 40m          |
| Berserker | 5                    | 2h 0m           | 10h 0m          | 20h 0m           |
| Skjaldmær | 5                    | 2h 0m           | 10h 0m          | 20h 0m           |
| Huskarl   | 5                    | 2h 0m           | 10h 0m          | 20h 0m           |
| Ulfhednar | 14                   | 43m             | 3h 34m          | 7h 9m            |
| Valkyria  | 12                   | 50m             | 4h 10m          | 8h 20m           |
| Ariete    | 3                    | 3h 20m          | 16h 40m         | 33h 20m          |
| Catapulta | 2                    | 5h 0m           | 25h 0m          | 50h 0m           |

> **Implicación estratégica:** Un ataque con catapultas a 50 campos tarda 25 HORAS. Esto da al defensor tiempo para prepararse si tiene buenas alianzas e inteligencia.

---

## 🎮 Simulación de Combate: Ejemplo Completo

### Escenario: 50 Berserkers + 5 Arietes atacan aldea con 30 Huskarl + Muralla L3

#### Datos del Atacante

| Tropa         | Cantidad | ATK cada | ATK Total |
| ------------- | -------- | -------- | --------- |
| Berserker     | 50       | 80       | 4,000     |
| Ariete        | 5        | 60       | 300       |
| **TOTAL ATK** |          |          | **4,300** |

#### Paso 1: Reducción de Muralla por Arietes

```
reduccion_arietes = min(3, 5 × 0.5) = min(3, 2.5) = 2.5 → 2 (floor)
nivel_muralla_efectivo = 3 - 2 = 1
bonus_muralla = 1 × 0.08 = 0.08 (8%)
```

#### Paso 2: Defensa del Defensor

Proporción del ataque: Berserkers son infantería (50), Arietes son asedio (ignorados en ratio):

```
ratio_inf = 50 / 50 = 1.0  (100% infantería)
ratio_cab = 0 / 50 = 0.0

DEF por Huskarl = 80 × 1.0 + 40 × 0.0 = 80
DEF_total = 30 × 80 = 2,400
```

Con muralla:

```
DEF_base_muralla = 20 (muralla L1 efectiva)
DEF_efectiva = (2,400 + 20) × 1.08 = 2,613.6 → 2,614
```

#### Paso 3: Resultado

```
ATK_total = 4,300
DEF_efectiva = 2,614

ATK > DEF → Atacante gana

ratio_victoria = (4,300 - 2,614) / 4,300 = 0.392
perdidas_atacante = 1 - 0.392^1.5 = 1 - 0.245 = 0.755
perdidas_defensor = 1.0 (todas las tropas del defensor mueren)
```

#### Paso 4: Supervivientes

| Tropa              | Antes | Pérdida (75.5%) | Después |
| ------------------ | ----- | --------------- | ------- |
| Berserker          | 50    | 38              | **12**  |
| Ariete             | 5     | 4               | **1**   |
| Huskarl (defensor) | 30    | 30              | **0**   |

#### Paso 5: Saqueo

```
carga_supervivientes = 12 × 30 + 1 × 0 = 360 recursos

Si la aldea enemiga tiene 2,000 de cada recurso y almacén de 4,400:
  disponible por recurso = min(2000, 4400 × 0.5) = 2,000
  total disponible = 8,000

Saqueo = min(360, 8000) = 360 recursos
Distribución: ~90 madera + 90 arcilla + 90 hierro + 90 trigo
```

#### Resumen del Combate

```
═══════════════════════════════════════════════════════
              REPORTE DE BATALLA
═══════════════════════════════════════════════════════
  Atacante: Ragnar (aldea: Kattegat)
  Defensor: Bjorn (aldea: Uppsala)

  RESULTADO: ⚔️ VICTORIA DEL ATACANTE

  ┌─────────────┬─────────┬─────────┬──────────────┐
  │ Tropa       │ Enviados│ Caídos  │ Supervivientes│
  ├─────────────┼─────────┼─────────┼──────────────┤
  │ Berserker   │ 50      │ 38      │ 12           │
  │ Ariete      │ 5       │ 4       │ 1            │
  ├─────────────┼─────────┼─────────┼──────────────┤
  │ Huskarl     │ 30      │ 30      │ 0            │
  │ Muralla     │ L3      │         │ L1 (dañada)  │
  └─────────────┴─────────┴─────────┴──────────────┘

  Botín: 🪵90 🧱90 ⛏️90 🌾90 = 360 total
═══════════════════════════════════════════════════════
```

> **Análisis:** El atacante ganó pero perdió el **75.5% de sus tropas** (un coste enorme). Los 5 arietes redujeron la muralla de L3 a L1 efectivo, sin eso la DEF habría sido 2,976 y el resultado más sangriento. Conclusión: **los arietes son esenciales para atacar aldeas con muralla alta**.

---

## 🧮 Simulación 2: Raid Rápido — 30 Ulfhednar vs Aldea Sin Defensores

### Datos

| Tropa     | Cantidad | ATK | Total |
| --------- | -------- | --- | ----- |
| Ulfhednar | 30       | 100 | 3,000 |

Defensor: 0 tropas, Muralla L2 (DEF base = 40)

### Cálculo

```
DEF_efectiva = 40 × (1 + 0.16) = 46.4 → 46

ATK (3,000) >>> DEF (46)

ratio_victoria = (3000 - 46) / 3000 = 0.985
perdidas_atacante = 1 - 0.985^1.5 = 1 - 0.970 = 0.030
```

### Resultado

| Tropa     | Antes | Pérdida (3%) | Después |
| --------- | ----- | ------------ | ------- |
| Ulfhednar | 30    | 1            | **29**  |

**Saqueo:** 29 × 80 = **2,320 recursos** saqueados. Con velocidad 14, llegan y vuelven rápido.

> **Análisis:** Un raid de Ulfhednar contra una aldea desprotegida es devastador. Pierde solo 1 jinete y se lleva 2,320 recursos. Esto incentiva al defensor a SIEMPRE tener tropas defensivas en casa (o pagar una muralla alta).

---

## 📜 Reglas Especiales de Combate

### Tipos de Misión

| Misión       | Descripción                                             | Saqueo          | Destrucción |
| ------------ | ------------------------------------------------------- | --------------- | ----------- |
| **Ataque**   | Ataque normal — combate + saqueo                        | Sí              | No          |
| **Raid**     | Saqueo seguro — ATK completo, botín reducido            | Sí (×0.5 botín) | No          |
| **Asedio**   | Ataque con catapultas — puede destruir edificios        | Sí              | Sí          |
| **Scout**    | Envía espías para ver tropas/recursos enemigos (Fase 3) | No              | No          |
| **Refuerzo** | Envía tropas a defender aldea de aliado                 | No              | No          |

### Mecánica de Raid

```
En modo Raid:
  ATK_total = ATK_total completo (sin reducción de ataque)
  Saqueo = min(carga_total × 0.5, recursos_disponibles)   // solo la MITAD del botín
  Si el atacante gana:
    perdidas_atacante = mínimo(perdidas_calculadas, 0.10)  // máximo 10% de bajas
  Si el atacante pierde:
    Las tropas huyen → pierden solo un 15% (en vez de 100%)
```

> Los raids intercambian **botín por seguridad**: ATK completo pero solo te llevas la mitad de recursos. El safety net (10% max win / 15% retreat) los hace perfectos para saquear objetivos inciertos o granjas inactivas.

### Mecánica de Catapulta

```
Si la misión es "Asedio" y hay catapultas supervivientes:
  edificio_objetivo = elegido por el atacante antes del envío

  daño = catapultas_supervivientes × 0.07
  P_destruir = min(0.80, daño)

  roll = random(0, 1)
  Si roll < P_destruir:
    edificio pierde 1 nivel (mín 0)
```

| Catapultas Supervivientes | Probability de -1 Nivel |
| ------------------------- | ----------------------- |
| 1                         | 7%                      |
| 3                         | 21%                     |
| 5                         | 35%                     |
| 8                         | 56%                     |
| 10                        | 70%                     |
| 12+                       | 80% (cap)               |

---

## 🛡️ Tabla Resumen de Defensa

### Escenarios de Defensa por Inversión

| Configuración Defensiva      | DEF Inf Total | DEF Cab Total | Coste Total | Trigo/h |
| ---------------------------- | ------------- | ------------- | ----------- | ------- |
| 50 Skjaldmær                 | 3,250         | 2,500         | 21,000      | 50      |
| 30 Huskarl                   | 2,400         | 1,200         | 20,400      | 60      |
| 50 Skjaldmær + 30 Huskarl    | 5,650         | 3,700         | 41,400      | 110     |
| 50 Sk + 30 Hu + Muralla L5   | 7,910         | 5,180         | 42,600      | 110     |
| 100 Sk + 50 Hu + Muralla L10 | 17,200        | 12,600        | 83,400      | 200     |

> **Observación:** La muralla L5 convierte 5,650 DEF inf en 7,910 — un **40% gratis** sin trigo adicional. La muralla es la inversión defensiva más eficiente del juego.

---

## 🔍 Edge Cases & Exploit Check

| Escenario                         | Resultado                                                                                                 | Veredicto                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Atacar con 1 Bóndi para "testear" | Muere contra cualquier defensa, no saquea → desperdicio                                                   | ✅ Seguro                              |
| Spam 1000 Bóndi vs Muralla L10    | ATK 40,000 vs DEF_muralla sola (300 × 1.8 = 540) → gana easy pero sin tropas defensoras pierde solo ~1.5% | ✅ Funciona — la muralla sola no basta |
| Raid infinito a inactivo          | 50% cap + decaimiento de recursos de inactivo → rendimientos decrecientes                                 | ✅ Anti-granja funciona                |
| Catapultas destruyen Gran Salón   | Posible pero requiere GS L10 + ejército enorme + 25h de viaje mínimo → costosísimo                        | ✅ Balanceado                          |
| Defensor pone solo Valkyrias      | Excelente vs raids de Ulfhednar pero débil vs infantería masiva                                           | ✅ No hay defensa universal            |

---

## 📌 Next Step

> **@archivist** debe integrar el sistema de combate en la documentación oficial del GDD.
> **@qa** debe validar: fórmula de combate (inputs/outputs), simulaciones del ejemplo, balance de la muralla, y ausencia de estrategia dominante tanto ofensiva como defensiva.

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
