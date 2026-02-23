# 🏗️ Edificios de Midgard Online

> Documento maestro de todos los edificios con tablas de balance (Niveles 1-10).
> Todas las fórmulas derivadas de [economy.md](economy.md). Los JSON configs en `config/BuildingsConfig.json` deben coincidir EXACTAMENTE.

---

## 📐 Estructura de la Aldea

Cada aldea tiene dos zonas:

### Anillo Exterior — Campos de Recursos (18 slots fijos)

| Tipo      | Slots  | Edificio             | Recurso Producido |
| --------- | ------ | -------------------- | ----------------- |
| Madera    | 4      | Leñador de Yggdrasil | Madera (Viðr)     |
| Arcilla   | 4      | Cantera de Midgard   | Arcilla (Leir)    |
| Hierro    | 4      | Mina de Hierro Enano | Hierro (Járn)     |
| Trigo     | 6      | Granja de Freya      | Trigo (Korn)      |
| **Total** | **18** |                      |                   |

> **Nota:** La distribución 4-4-4-6 es fija para aldeas estándar. Las aldeas tipo "Cropper" (3-3-3-9) se introducirán en Fase 3.

### Centro de la Aldea — Edificios de Infraestructura

| Edificio         | Máximo por Aldea | Categoría         |
| ---------------- | ---------------- | ----------------- |
| Gran Salón       | 1                | Principal         |
| Almacén          | 2                | Almacenamiento    |
| Granero          | 2                | Almacenamiento    |
| Cuartel          | 1                | Militar (Fase 2)  |
| Establo          | 1                | Militar (Fase 2)  |
| Taller de Asedio | 1                | Militar (Fase 2)  |
| Muralla          | 1                | Defensa (Fase 2)  |
| Mercado          | 1                | Comercio (Fase 3) |
| Embajada         | 1                | Social (Fase 3)   |
| Academia         | 1                | Avanzado (Fase 3) |

---

## 📊 Fórmulas Globales

### Producción por Hora

```
produccion(nivel) = round(base_prod × 1.405^(nivel - 1))
```

| Nivel | Multiplicador |
| ----- | ------------- |
| 1     | 1.000×        |
| 2     | 1.405×        |
| 3     | 1.974×        |
| 4     | 2.773×        |
| 5     | 3.896×        |
| 6     | 5.474×        |
| 7     | 7.691×        |
| 8     | 10.808×       |
| 9     | 15.185×       |
| 10    | 21.335×       |

### Coste de Construcción

```
coste(nivel) = round(base_coste × 1.585^(nivel - 1))
```

| Nivel | Multiplicador |
| ----- | ------------- |
| 1     | 1.000×        |
| 2     | 1.585×        |
| 3     | 2.512×        |
| 4     | 3.982×        |
| 5     | 6.312×        |
| 6     | 10.004×       |
| 7     | 15.857×       |
| 8     | 25.133×       |
| 9     | 39.836×       |
| 10    | 63.140×       |

### Tiempo de Construcción

```
tiempo_seg(nivel) = round(base_tiempo_seg × 1.55^(nivel - 1))

Tiempo real = tiempo_seg × (1 - 0.03 × nivel_gran_salon)
```

| Nivel | Multiplicador |
| ----- | ------------- |
| 1     | 1.000×        |
| 2     | 1.550×        |
| 3     | 2.403×        |
| 4     | 3.724×        |
| 5     | 5.772×        |
| 6     | 8.946×        |
| 7     | 13.867×       |
| 8     | 21.494×       |
| 9     | 33.316×       |
| 10    | 51.640×       |

### Población (Consumo de Trigo)

```
Campos de recursos: pop(nivel) = base_pop + floor((nivel - 1) × 0.5)
Infraestructura:    pop(nivel) = base_pop + floor((nivel - 1) × 0.45)
```

---

## 🪓 Leñador de Yggdrasil (Woodcutter)

> Produce **Madera (Viðr)** por hora. Fundamento económico de la construcción civil.

**Base:** prod=30/h | tiempo=180s | pop=1

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Prod/h | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ------ | --- |
| 1     | 40     | 100     | 50     | 60    | 250    | 3m     | 30     | 1   |
| 2     | 65     | 160     | 80     | 95    | 400    | 5m     | 42     | 1   |
| 3     | 100    | 250     | 125    | 150   | 625    | 7m     | 59     | 2   |
| 4     | 160    | 400     | 200    | 240   | 1,000  | 11m    | 83     | 2   |
| 5     | 255    | 630     | 315    | 380   | 1,580  | 17m    | 117    | 3   |
| 6     | 400    | 1,000   | 500    | 600   | 2,500  | 27m    | 164    | 3   |
| 7     | 635    | 1,585   | 795    | 950   | 3,965  | 42m    | 231    | 4   |
| 8     | 1,005  | 2,515   | 1,255  | 1,510 | 6,285  | 1h 5m  | 324    | 4   |
| 9     | 1,595  | 3,985   | 1,990  | 2,390 | 9,960  | 1h 40m | 456    | 5   |
| 10    | 2,525  | 6,315   | 3,155  | 3,790 | 15,785 | 2h 35m | 640    | 5   |

### Economía del Leñador

- **ROI Level 1:** Produce 30 madera/h, costó 250 total → se paga en ~8h de producción
- **ROI Level 10:** Produce 640 madera/h, costó 15,785 total → se paga en ~25h
- **Con 4 leñadores L10:** 2,560 madera/h total

---

## 🧱 Cantera de Midgard (Claypit)

> Produce **Arcilla (Leir)** por hora. Recurso base para edificios defensivos y fortificaciones.

**Base:** prod=30/h | tiempo=180s | pop=1

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Prod/h | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ------ | --- |
| 1     | 80     | 40      | 80     | 50    | 250    | 3m     | 30     | 1   |
| 2     | 125    | 65      | 125    | 80    | 395    | 5m     | 42     | 1   |
| 3     | 200    | 100     | 200    | 125   | 625    | 7m     | 59     | 2   |
| 4     | 320    | 160     | 320    | 200   | 1,000  | 11m    | 83     | 2   |
| 5     | 505    | 255     | 505    | 315   | 1,580  | 17m    | 117    | 3   |
| 6     | 800    | 400     | 800    | 500   | 2,500  | 27m    | 164    | 3   |
| 7     | 1,270  | 635     | 1,270  | 795   | 3,970  | 42m    | 231    | 4   |
| 8     | 2,010  | 1,005   | 2,010  | 1,255 | 6,280  | 1h 5m  | 324    | 4   |
| 9     | 3,185  | 1,595   | 3,185  | 1,990 | 9,955  | 1h 40m | 456    | 5   |
| 10    | 5,050  | 2,525   | 5,050  | 3,155 | 15,780 | 2h 35m | 640    | 5   |

### Nota de Diseño

La cantera requiere proporcionalmente más madera y hierro (vs. el leñador que requiere más arcilla). Esto crea **interdependencia entre recursos** — no puedes maxear un tipo sin producir los otros.

---

## ⛏️ Mina de Hierro Enano (Iron Mine)

> Produce **Hierro (Járn)** por hora. Recurso estratégico para tropas y mejoras militares.

**Base:** prod=25/h | tiempo=210s | pop=1

> ⚠️ El hierro produce **menos** por hora (25 base vs 30 de los otros) y tarda **más** en construirse. Esto lo convierte en el recurso más escaso, incentivando el comercio y el saqueo.

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Prod/h | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ------ | --- |
| 1     | 100    | 80      | 30     | 60    | 270    | 4m     | 25     | 1   |
| 2     | 160    | 125     | 50     | 95    | 430    | 5m     | 35     | 1   |
| 3     | 250    | 200     | 75     | 150   | 675    | 8m     | 49     | 2   |
| 4     | 400    | 320     | 120    | 240   | 1,080  | 13m    | 69     | 2   |
| 5     | 630    | 505     | 190    | 380   | 1,705  | 20m    | 97     | 3   |
| 6     | 1,000  | 800     | 300    | 600   | 2,700  | 31m    | 137    | 3   |
| 7     | 1,585  | 1,270   | 475    | 950   | 4,280  | 49m    | 192    | 4   |
| 8     | 2,515  | 2,010   | 755    | 1,510 | 6,790  | 1h 15m | 270    | 4   |
| 9     | 3,985  | 3,185   | 1,195  | 2,390 | 10,755 | 1h 57m | 380    | 5   |
| 10    | 6,315  | 5,050   | 1,895  | 3,790 | 17,050 | 3h 1m  | 533    | 5   |

### Economía del Hierro

- **Producción total L10 (4 minas):** 2,132 hierro/h
- **vs Madera/Arcilla L10 (4 campos):** 2,560/h — el hierro produce un **17% menos**
- **Impacto:** Tropas avanzadas requieren hierro → siempre será el cuello de botella militar

---

## 🌾 Granja de Freya (Farm / Cropland)

> Produce **Trigo (Korn)** por hora. El único recurso de **mantenimiento continuo** — tropas y población lo consumen cada hora.

**Base:** prod=30/h | tiempo=150s | pop=0

> ⚠️ La granja tiene **coste de trigo bajo** y **menor población** que otros campos. Esto es intencional: el trigo es vital para el mantenimiento, así que las granjas deben ser baratas de operar.

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Prod/h | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ------ | --- |
| 1     | 70     | 90      | 70     | 20    | 250    | 3m     | 30     | 0   |
| 2     | 110    | 145     | 110    | 30    | 395    | 4m     | 42     | 0   |
| 3     | 175    | 225     | 175    | 50    | 625    | 6m     | 59     | 1   |
| 4     | 280    | 360     | 280    | 80    | 1,000  | 9m     | 83     | 1   |
| 5     | 445    | 570     | 445    | 125   | 1,585  | 14m    | 117    | 1   |
| 6     | 700    | 900     | 700    | 200   | 2,500  | 22m    | 164    | 1   |
| 7     | 1,110  | 1,425   | 1,110  | 315   | 3,960  | 35m    | 231    | 2   |
| 8     | 1,760  | 2,260   | 1,760  | 500   | 6,280  | 54m    | 324    | 2   |
| 9     | 2,790  | 3,580   | 2,790  | 795   | 9,955  | 1h 23m | 456    | 2   |
| 10    | 4,420  | 5,675   | 4,420  | 1,260 | 15,775 | 2h 10m | 640    | 2   |

### Balance del Trigo

**Producción total con 6 granjas:**

| Nivel Granjas | Producción Total/h | Pop de las Granjas | Neto Trigo/h |
| ------------- | ------------------ | ------------------ | ------------ |
| Todas L1      | 180                | 0                  | 180          |
| Todas L5      | 702                | 6                  | 696          |
| Todas L10     | 3,840              | 12                 | 3,828        |

> Ver sección de **Balance de Trigo** más abajo para consumo completo con tropas.

---

## 🏛️ Gran Salón (Main Building)

> Edificio principal de la aldea. Reduce el tiempo de construcción de todos los demás edificios y desbloquea nuevos edificios al subir de nivel.

**Base:** tiempo=300s | pop=2 | NO produce recursos

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Reducción Tiempo | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ---------------- | --- |
| 1     | 70     | 40      | 60     | 20    | 190    | 5m     | -3%              | 2   |
| 2     | 110    | 65      | 95     | 30    | 300    | 8m     | -6%              | 2   |
| 3     | 175    | 100     | 150    | 50    | 475    | 12m    | -9%              | 3   |
| 4     | 280    | 160     | 240    | 80    | 760    | 19m    | -12%             | 3   |
| 5     | 445    | 255     | 380    | 125   | 1,205  | 29m    | -15%             | 4   |
| 6     | 700    | 400     | 600    | 200   | 1,900  | 45m    | -18%             | 4   |
| 7     | 1,110  | 635     | 950    | 315   | 3,010  | 1h 9m  | -21%             | 5   |
| 8     | 1,760  | 1,005   | 1,510  | 500   | 4,775  | 1h 47m | -24%             | 5   |
| 9     | 2,790  | 1,595   | 2,390  | 795   | 7,570  | 2h 47m | -27%             | 6   |
| 10    | 4,420  | 2,525   | 3,790  | 1,260 | 11,995 | 4h 18m | -30%             | 6   |

### Desbloqueo de Edificios

| Nivel Gran Salón | Edificios Desbloqueados              |
| ---------------- | ------------------------------------ |
| 1                | Campos de recursos, Almacén, Granero |
| 2                | —                                    |
| 3                | Mercado, Embajada                    |
| 5                | Cuartel (infantería)                 |
| 7                | Establo (caballería)                 |
| 10               | Taller de Asedio, Academia           |

### Reducción de Tiempo — Ejemplos

| Edificio + Nivel | Tiempo Base | Con GS L5 (-15%) | Con GS L10 (-30%) |
| ---------------- | ----------- | ---------------- | ----------------- |
| Leñador L5       | 17m         | 14m 27s          | 11m 54s           |
| Leñador L10      | 2h 35m      | 2h 12m           | 1h 49m            |
| Almacén L10      | 3h 27m      | 2h 56m           | 2h 25m            |

---

## 📦 Almacén (Warehouse)

> Almacena **Madera, Arcilla y Hierro**. La capacidad aplica a CADA recurso por separado. Se pueden construir hasta **2 por aldea** (capacidades se suman).

**Base:** tiempo=240s | pop=1

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Capacidad/Recurso | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ----------------- | --- |
| 1     | 130    | 160     | 90     | 40    | 420    | 4m     | 1,200             | 1   |
| 2     | 205    | 255     | 145    | 65    | 670    | 6m     | 1,700             | 1   |
| 3     | 325    | 400     | 225    | 100   | 1,050  | 10m    | 2,350             | 1   |
| 4     | 515    | 640     | 360    | 160   | 1,675  | 15m    | 3,250             | 1   |
| 5     | 820    | 1,010   | 570    | 255   | 2,655  | 23m    | 4,400             | 2   |
| 6     | 1,300  | 1,600   | 900    | 400   | 4,200  | 36m    | 5,900             | 2   |
| 7     | 2,060  | 2,535   | 1,425  | 635   | 6,655  | 55m    | 7,900             | 2   |
| 8     | 3,265  | 4,020   | 2,260  | 1,005 | 10,550 | 1h 26m | 10,500            | 2   |
| 9     | 5,175  | 6,370   | 3,580  | 1,595 | 16,720 | 2h 13m | 13,900            | 3   |
| 10    | 8,200  | 10,100  | 5,675  | 2,525 | 26,500 | 3h 27m | 18,400            | 3   |

### Capacidad Efectiva

| Configuración  | Cap por Recurso | Nota           |
| -------------- | --------------- | -------------- |
| 1× Almacén L1  | 1,200           | Estado inicial |
| 1× Almacén L5  | 4,400           | Mid-game       |
| 1× Almacén L10 | 18,400          | Late-game      |
| 2× Almacén L10 | 36,800          | Maximum        |

### Cuándo Subir el Almacén

| Almacén Nivel | Cap/Recurso | Producción que Llena en 8h | Nivel Campo Equivalente |
| ------------- | ----------- | -------------------------- | ----------------------- |
| 1             | 1,200       | 150/h (campos L5 ×1)       | 1 campo L5              |
| 5             | 4,400       | 550/h (campos L7 ×2)       | 2 campos L7             |
| 10            | 18,400      | 2,300/h (campos L10 ×4)    | 4 campos L10            |

> **Regla:** El jugador debe subir el almacén cuando su producción por hora × 8 > capacidad actual. Esto ocurre naturalmente cada ~2-3 niveles de campos.

---

## 🌾 Granero (Granary)

> Almacena **solo Trigo (Korn)**. Misma mecánica que el Almacén pero exclusivo para trigo. Hasta **2 por aldea**.

**Base:** tiempo=210s | pop=1

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Capacidad Trigo | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | --------------- | --- |
| 1     | 80     | 100     | 70     | 20    | 270    | 4m     | 1,200           | 1   |
| 2     | 125    | 160     | 110    | 30    | 425    | 5m     | 1,700           | 1   |
| 3     | 200    | 250     | 175    | 50    | 675    | 8m     | 2,350           | 1   |
| 4     | 320    | 400     | 280    | 80    | 1,080  | 13m    | 3,250           | 1   |
| 5     | 505    | 630     | 445    | 125   | 1,705  | 20m    | 4,400           | 2   |
| 6     | 800    | 1,000   | 700    | 200   | 2,700  | 31m    | 5,900           | 2   |
| 7     | 1,270  | 1,585   | 1,110  | 315   | 4,280  | 49m    | 7,900           | 2   |
| 8     | 2,010  | 2,515   | 1,760  | 500   | 6,785  | 1h 15m | 10,500          | 2   |
| 9     | 3,185  | 3,985   | 2,790  | 795   | 10,755 | 1h 57m | 13,900          | 3   |
| 10    | 5,050  | 6,315   | 4,420  | 1,260 | 17,045 | 2h 58m | 18,400          | 3   |

---

## ⚖️ Balance de Trigo — Análisis Detallado

### Consumo de Trigo por Entidad

| Entidad                       | Consumo/Hora       |
| ----------------------------- | ------------------ |
| Población de edificios        | 1 por punto de Pop |
| Infantería básica (Bóndi)     | 1/unidad           |
| Infantería pesada (Berserker) | 2/unidad           |
| Caballería (Ulfhednar)        | 3/unidad           |
| Maquinaria de asedio (Ariete) | 4/unidad           |

### Escenarios de Balance

#### Escenario 1: Jugador Day 5 — Sin Tropas

| Edificio            | Nivel  | Cantidad | Pop Total     |
| ------------------- | ------ | -------- | ------------- |
| Leñador             | 4      | 4        | 8             |
| Cantera             | 4      | 4        | 8             |
| Mina                | 4      | 4        | 8             |
| Granja              | 4      | 6        | 6             |
| Gran Salón          | 3      | 1        | 3             |
| Almacén             | 3      | 1        | 1             |
| Granero             | 3      | 1        | 1             |
| **Total Pop**       |        |          | **35**        |
| **Trigo Producido** | 6 × 83 |          | **498/h**     |
| **Trigo Neto**      |        |          | **+463/h ✅** |

#### Escenario 2: Jugador Day 14 — 500 Tropas Mixtas

| Entidad                            | Cantidad | Consumo/h     |
| ---------------------------------- | -------- | ------------- |
| Edificios (campos L6-7 + infra)    | —        | 80            |
| Infantería básica                  | 300      | 300           |
| Infantería pesada                  | 100      | 200           |
| Caballería                         | 100      | 300           |
| **Total Consumo**                  |          | **880/h**     |
| **Trigo Producido** (6 granjas L7) |          | **1,386/h**   |
| **Trigo Neto**                     |          | **+506/h ✅** |

#### Escenario 3: Jugador Day 30 — 2,000 Tropas

| Entidad                             | Cantidad | Consumo/h    |
| ----------------------------------- | -------- | ------------ |
| Edificios (maxed)                   | —        | 120          |
| Infantería básica                   | 1,000    | 1,000        |
| Infantería pesada                   | 400      | 800          |
| Caballería                          | 400      | 1,200        |
| Asedio                              | 200      | 800          |
| **Total Consumo**                   |          | **3,920/h**  |
| **Trigo Producido** (6 granjas L10) |          | **3,840/h**  |
| **Trigo Neto**                      |          | **-80/h ⚠️** |

> **⚠️ A 2,000 tropas con mix pesado, el trigo se vuelve negativo.** Esto es INTENCIONAL — obliga al jugador a:
>
> 1. Fundar aldeas "cropper" (más granjas) para alimentar al ejército
> 2. Balancear tamaño del ejército vs. producción de trigo
> 3. Saquear trigo de otros jugadores
>
> **Mecánica de hambruna:** Si trigo neto < 0, las tropas desertan a razón de 1% del déficit por hora.

---

## ⏱️ Análisis de Progresión

### Estado Inicial del Jugador

| Elemento           | Valor                               |
| ------------------ | ----------------------------------- |
| Madera             | 750                                 |
| Arcilla            | 750                                 |
| Hierro             | 750                                 |
| Trigo              | 750                                 |
| Runas de Odín      | 50                                  |
| Gran Salón         | Nivel 1 (pre-construido)            |
| Almacén            | Nivel 1 (pre-construido, 1,200 cap) |
| Granero            | Nivel 1 (pre-construido, 1,200 cap) |
| Campos de recursos | 18 slots vacíos (nivel 0)           |

### Primera Sesión (0-30 minutos)

**Build Order óptimo (tutorial):**

| #   | Acción     | Coste Total | Tiempo  | Recursos Restantes                           |
| --- | ---------- | ----------- | ------- | -------------------------------------------- |
| 1   | Granja L1  | 250         | 3m      | 680W, 660C, 680I, 730Wh                      |
| 2   | Leñador L1 | 250         | 3m      | 640W, 560C, 630I, 670Wh                      |
| 3   | Cantera L1 | 250         | 3m      | 560W, 520C, 550I, 620Wh                      |
| 4   | Mina L1    | 270         | 4m      | 460W, 440C, 520I, 560Wh                      |
| 5   | Granja L2  | 395         | 4m      | 350W, 295C, 410I, 530Wh                      |
| 6   | Leñador L2 | 400         | 5m      | 285W, 135C, 330I, 435Wh                      |
|     | **Total**  |             | **22m** | Producción activa: 72W + 42C + 25I + 72Wh /h |

> En 22 minutos el jugador tiene 4 campos activos y 2 a nivel 2. Le quedan ~300 de cada recurso para seguir construyendo. **Rule of First Session: ✅ 6 acciones en <25 min.**

### Progresión a Level 5 Todo

**Tiempo de construcción secuencial (1 cola de construcción):**

| Edificio         | Niveles      | Tiempo por Campo | Campos | Total            |
| ---------------- | ------------ | ---------------- | ------ | ---------------- |
| Leñador L1→L5    | 3+5+7+11+17  | 43m              | ×4     | 172m             |
| Cantera L1→L5    | 3+5+7+11+17  | 43m              | ×4     | 172m             |
| Mina L1→L5       | 4+5+8+13+20  | 50m              | ×4     | 200m             |
| Granja L1→L5     | 3+4+6+9+14   | 36m              | ×6     | 216m             |
| Gran Salón L1→L5 | 5+8+12+19+29 | 73m              | ×1     | 73m              |
| Almacén L1→L5    | 4+6+10+15+23 | 58m              | ×1     | 58m              |
| Granero L1→L5    | 4+5+8+13+20  | 50m              | ×1     | 50m              |
| **TOTAL**        |              |                  |        | **941m ≈ 15.7h** |

**Coste total de recursos:**

| Recurso | Campos (18) | Infra (3) | Total   |
| ------- | ----------- | --------- | ------- |
| Madera  | ~17,000     | ~3,500    | ~20,500 |
| Arcilla | ~18,500     | ~4,000    | ~22,500 |
| Hierro  | ~14,000     | ~2,800    | ~16,800 |
| Trigo   | ~10,500     | ~1,200    | ~11,700 |

**Producción media durante los primeros 5 días:** ~350/h por recurso → ~42,000 por recurso + 750 iniciales.

**Resultado:** ✅ Recursos suficientes. Tiempo de build ~16h → alcanzable en **3-5 días** (3-5 sesiones/día, cola de construcción activa).

### Progresión a Level 10 Todo

| Concepto                | Valor              |
| ----------------------- | ------------------ |
| Tiempo total de build   | ~160h (secuencial) |
| Con GS L10 (-30%)       | ~112h              |
| Días estimados          | 25-40 días         |
| Coste total por recurso | ~250,000-350,000   |
| Producción media D7-D30 | ~3,000-8,000/h     |

> **Nota:** Maxear una aldea no es el objetivo principal. Los jugadores fundan 2ª y 3ª aldeas antes de llegar a L10 en la primera. El endgame es gestionar múltiples aldeas, no maxear una sola.

---

## 🔍 Edge Cases & Exploit Check

| Escenario                              | Resultado                                                             | Veredicto                               |
| -------------------------------------- | --------------------------------------------------------------------- | --------------------------------------- |
| Jugador construye SOLO granjas (6×L10) | 3,840 trigo/h pero 0 de otros recursos → no puede hacer nada          | ✅ Seguro — auto-castigo                |
| Jugador ignora trigo completamente     | 0 trigo → no puede alimentar tropas → sin ejército                    | ✅ Seguro — el juego enseña en tutorial |
| Whale compra runas → speedup todo      | Ahorra tiempo pero NO recursos → igualmente limitado por producción   | ✅ Seguro                               |
| 2 almacenes L10 máximo                 | 36,800 cap por recurso → suficiente para L10 upgrades (max ~17,000)   | ✅ Correcto                             |
| Producción > almacén sin login         | Producción para cuando almacén llena → incentiva check-ins frecuentes | ✅ Diseño intencional                   |
| F2P Day 1 sin runas                    | Puede construir 6+ edificios → no hay dead end                        | ✅ Sin soft-lock                        |

---

## 📌 Next Step

> **@archivist** debe integrar estas tablas en la documentación oficial del GDD.
> **@qa** debe validar: fórmulas, progresión temporal (D1/D7/D30), balance de trigo, y ausencia de soft-locks.

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
