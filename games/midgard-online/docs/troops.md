# ⚔️ Tropas de Midgard Online

> Sistema de tropas completo: 8 unidades, 3 edificios militares, costes, stats y desbloqueos.
> Referencia de economía: [economy.md](economy.md) | Edificios: [buildings.md](buildings.md) | Combate: [combat.md](combat.md)

---

## 🗡️ Resumen de Tropas

### Vista Rápida (8 Unidades)

| #   | Nombre                    | Tipo       | ATK | DEF Inf | DEF Cab | Vel | Carga | Trigo/h | Edificio   |
| --- | ------------------------- | ---------- | --- | ------- | ------- | --- | ----- | ------- | ---------- |
| 1   | **Bóndi**                 | Infantería | 40  | 20      | 25      | 6   | 50    | 1       | Cuartel L1 |
| 2   | **Berserker**             | Infantería | 80  | 40      | 20      | 5   | 30    | 2       | Cuartel L3 |
| 3   | **Skjaldmær**             | Infantería | 30  | 65      | 50      | 5   | 35    | 1       | Cuartel L5 |
| 4   | **Huskarl**               | Infantería | 60  | 80      | 40      | 5   | 40    | 2       | Cuartel L7 |
| 5   | **Ulfhednar**             | Caballería | 100 | 25      | 30      | 14  | 80    | 3       | Establo L1 |
| 6   | **Valkyria**              | Caballería | 70  | 50      | 70      | 12  | 60    | 3       | Establo L5 |
| 7   | **Ariete de Jörmungandr** | Asedio     | 60  | 10      | 10      | 3   | 0     | 4       | Taller L1  |
| 8   | **Catapulta de Surtr**    | Asedio     | 40  | 10      | 10      | 2   | 0     | 4       | Taller L5  |

### Roles Estratégicos

| Rol                  | Tropas              | Uso                                     |
| -------------------- | ------------------- | --------------------------------------- |
| **Raid rápido**      | Ulfhednar           | Saqueos de recursos, golpe y huida      |
| **Ataque frontal**   | Berserker + Ariete  | Destruir defensas y edificios           |
| **Defensa de aldea** | Skjaldmær + Huskarl | Defender contra ataques entrantes       |
| **Defensa anti-cab** | Valkyria            | Interceptar raids de caballería         |
| **Destrucción**      | Catapulta de Surtr  | Destruir edificios enemigos (no saquea) |
| **Reconocimiento**   | Bóndi (masa)        | Exploración barata, primeros ataques    |

---

## 🪖 Infantería (Cuartel)

### 1. Bóndi (Granjero Guerrero)

> El guerrero más básico de la aldea. Barato, versátil, buen saqueador. El pilar del ejército temprano.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Infantería    |
| **Ataque**                | 40            |
| **Defensa vs Infantería** | 20            |
| **Defensa vs Caballería** | 25            |
| **Velocidad**             | 6 campos/hora |
| **Carga (saqueo)**        | 50 recursos   |
| **Consumo de trigo**      | 1/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 95     | 75      | 40     | 30    | 240   | 18 min |

**Diseño:** El Bóndi es el "Legionnaire" de Travian — económico, alta carga para saqueo. Su defensa es débil, así que no sirve como defensor puro, pero en masa puede abrumar.

---

### 2. Berserker (Guerrero Frenético)

> Unidad ofensiva de élite. Daño devastador pero defensa mediocre. Se lanza sin pensar — su furia es su arma.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Infantería    |
| **Ataque**                | 80            |
| **Defensa vs Infantería** | 40            |
| **Defensa vs Caballería** | 20            |
| **Velocidad**             | 5 campos/hora |
| **Carga (saqueo)**        | 30 recursos   |
| **Consumo de trigo**      | 2/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 150    | 100     | 200    | 50    | 500   | 28 min |

**Diseño:** El Berserker es la espada ofensiva de infantería. Alto ATK (80) justifica su coste elevado (200 hierro). Débil contra caballería (20 DEF cab) — vulnerable a contra-ataques de Ulfhednar.

---

### 3. Skjaldmær (Doncella Escudera)

> Guerrera defensiva especializada. Su escudo es legendario — la mejor defensa de infantería del juego.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Infantería    |
| **Ataque**                | 30            |
| **Defensa vs Infantería** | 65            |
| **Defensa vs Caballería** | 50            |
| **Velocidad**             | 5 campos/hora |
| **Carga (saqueo)**        | 35 recursos   |
| **Consumo de trigo**      | 1/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 120    | 160     | 100    | 40    | 420   | 24 min |

**Diseño:** La Skjaldmær es la columna vertebral de la defensa de aldea. Baja en ataque (30) pero excelente defensa dual (65/50). Coste de trigo bajo (1/h) — se puede mantener un ejército defensivo grande sin arruinar la economía.

---

### 4. Huskarl (Guardián del Jarl)

> Guerrero de élite defensivo. Caro pero insuperable en defensa contra infantería. La última línea de batalla.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Infantería    |
| **Ataque**                | 60            |
| **Defensa vs Infantería** | 80            |
| **Defensa vs Caballería** | 40            |
| **Velocidad**             | 5 campos/hora |
| **Carga (saqueo)**        | 40 recursos   |
| **Consumo de trigo**      | 2/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 200    | 180     | 220    | 80    | 680   | 35 min |

**Diseño:** El Huskarl sacrifica eficiencia de trigo (2/h) por la mejor DEF inf del juego (80). Ataque decente (60) — puede funcionar como tropa híbrida ofensiva/defensiva para jugadores avanzados. Coste alto en hierro (220) lo convierte en una inversión significativa.

---

## 🐴 Caballería (Establo)

### 5. Ulfhednar (Jinete Lobo)

> Caballería de ataque rápida. El raid perfecto: alta velocidad, alto ataque, alta carga. Pero frágil en defensa.

| Stat                      | Valor          |
| ------------------------- | -------------- |
| **Tipo**                  | Caballería     |
| **Ataque**                | 100            |
| **Defensa vs Infantería** | 25             |
| **Defensa vs Caballería** | 30             |
| **Velocidad**             | 14 campos/hora |
| **Carga (saqueo)**        | 80 recursos    |
| **Consumo de trigo**      | 3/hora         |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 280    | 180     | 340    | 100   | 900   | 40 min |

**Diseño:** La joya ofensiva del juego. ATK 100 + Carga 80 + Velocidad 14 lo hacen el raider perfecto. Pero a 3 trigo/h y 900 de coste, mantener una horda es MUY caro. Su defensa pésima (25/30) significa que si el defensor tiene tropas, el Ulfhednar muere rápido.

---

### 6. Valkyria (Jinete de los Caídos)

> Caballería defensiva. Excelente contra otras caballerías. Única unidad con DEF cab > DEF inf.

| Stat                      | Valor          |
| ------------------------- | -------------- |
| **Tipo**                  | Caballería     |
| **Ataque**                | 70             |
| **Defensa vs Infantería** | 50             |
| **Defensa vs Caballería** | 70             |
| **Velocidad**             | 12 campos/hora |
| **Carga (saqueo)**        | 60 recursos    |
| **Consumo de trigo**      | 3/hora         |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 250    | 220     | 280    | 120   | 870   | 38 min |

**Diseño:** La contra a las raids de Ulfhednar. DEF cab 70 la hace excelente interceptora. Su ataque (70) es decente para raids mixtas. El coste es comparable al Ulfhednar pero con mejor balance defensivo.

---

## 🏗️ Asedio (Taller)

### 7. Ariete de Jörmungandr (Battering Ram)

> Máquina de asedio que reduce el bonus defensivo de la Muralla. NO saquea recursos.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Asedio        |
| **Ataque**                | 60            |
| **Defensa vs Infantería** | 10            |
| **Defensa vs Caballería** | 10            |
| **Velocidad**             | 3 campos/hora |
| **Carga (saqueo)**        | 0 (no saquea) |
| **Consumo de trigo**      | 4/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 500    | 400     | 300    | 100   | 1,300 | 50 min |

**Efecto especial:**

```
reduccion_muralla = min(nivel_muralla, arietes_enviados × 0.5)

Ejemplo: 4 arietes enviados → reducen Muralla en 2 niveles (se aplica ANTES del combate principal).
```

> **Nota:** La reducción de muralla se calcula con los arietes **enviados** (pre-combate), no con los supervivientes. Los arietes luego participan en el combate normal y pueden morir.

**Diseño:** El ariete es ESENCIAL para atacar aldeas fortificadas. Sin él, la Muralla hace que cualquier ataque pierda muchas tropas. Lento (3/h) y caro (1,300), pero su efecto especial justifica la inversión.

---

### 8. Catapulta de Surtr (Catapult)

> Máquina de destrucción que puede **destruir edificios enemigos**. El arma definitiva de guerra total.

| Stat                      | Valor         |
| ------------------------- | ------------- |
| **Tipo**                  | Asedio        |
| **Ataque**                | 40            |
| **Defensa vs Infantería** | 10            |
| **Defensa vs Caballería** | 10            |
| **Velocidad**             | 2 campos/hora |
| **Carga (saqueo)**        | 0 (no saquea) |
| **Consumo de trigo**      | 4/hora        |

**Coste de entrenamiento:**

| Madera | Arcilla | Hierro | Trigo | Total | Tiempo |
| ------ | ------- | ------ | ----- | ----- | ------ |
| 600    | 500     | 450    | 150   | 1,700 | 60 min |

**Efecto especial:**

```
daño_edificio = catapultas_supervivientes × 0.35

Probabilidad de bajar 1 nivel al edificio objetivo:
  P = min(0.80, catapultas × 0.07)

Si exitoso → el edificio pierde 1 nivel (no puede bajar de 0).
El atacante elige el edificio objetivo ANTES del ataque.
```

**Diseño:** La catapulta es el arma de "guerra total". No sirve para raids rápidas (velocidad 2, carga 0). Su rol es destruir la infraestructura enemiga como castigo o estrategia de alianza. Requiere escolta de tropas ofensivas para sobrevivir al combate.

---

## 🏛️ Edificios Militares

### Cuartel (Barracks)

> Entrena infantería. Requisito: Gran Salón nivel 5.
> Cada nivel reduce el tiempo de entrenamiento de infantería en **5%**.

| Nivel | Madera | Arcilla | Hierro | Trigo | Total  | Tiempo | Reducción Entreno | Desbloquea | Pop |
| ----- | ------ | ------- | ------ | ----- | ------ | ------ | ----------------- | ---------- | --- |
| 1     | 210    | 140     | 260    | 120   | 730    | 10m    | -5%               | Bóndi      | 2   |
| 2     | 335    | 220     | 410    | 190   | 1,155  | 16m    | -10%              | —          | 2   |
| 3     | 530    | 350     | 650    | 300   | 1,830  | 24m    | -15%              | Berserker  | 3   |
| 4     | 840    | 555     | 1,035  | 475   | 2,905  | 38m    | -20%              | —          | 3   |
| 5     | 1,335  | 880     | 1,640  | 755   | 4,610  | 58m    | -25%              | Skjaldmær  | 4   |
| 6     | 2,115  | 1,395   | 2,600  | 1,195 | 7,305  | 1h 30m | -30%              | —          | 4   |
| 7     | 3,350  | 2,210   | 4,120  | 1,895 | 11,575 | 2h 20m | -35%              | Huskarl    | 5   |
| 8     | 5,310  | 3,505   | 6,530  | 3,000 | 18,345 | 3h 37m | -40%              | —          | 5   |
| 9     | 8,420  | 5,555   | 10,350 | 4,760 | 29,085 | 5h 37m | -45%              | —          | 6   |
| 10    | 13,345 | 8,805   | 16,400 | 7,545 | 46,095 | 8h 42m | -50%              | —          | 6   |

### Establo (Stable)

> Entrena caballería. Requisito: Gran Salón nivel 7 + Cuartel nivel 3.
> Cada nivel reduce el tiempo de entrenamiento de caballería en **5%**.

| Nivel | Madera | Arcilla | Hierro | Trigo  | Total  | Tiempo | Reducción Entreno | Desbloquea | Pop |
| ----- | ------ | ------- | ------ | ------ | ------ | ------ | ----------------- | ---------- | --- |
| 1     | 320    | 260     | 420    | 180    | 1,180  | 15m    | -5%               | Ulfhednar  | 3   |
| 2     | 510    | 410     | 665    | 285    | 1,870  | 23m    | -10%              | —          | 3   |
| 3     | 805    | 655     | 1,055  | 455    | 2,970  | 36m    | -15%              | —          | 4   |
| 4     | 1,275  | 1,035   | 1,675  | 720    | 4,705  | 56m    | -20%              | —          | 4   |
| 5     | 2,025  | 1,640   | 2,655  | 1,140  | 7,460  | 1h 27m | -25%              | Valkyria   | 5   |
| 6     | 3,210  | 2,600   | 4,210  | 1,810  | 11,830 | 2h 15m | -30%              | —          | 5   |
| 7     | 5,085  | 4,125   | 6,670  | 2,865  | 18,745 | 3h 29m | -35%              | —          | 6   |
| 8     | 8,060  | 6,535   | 10,575 | 4,545  | 29,715 | 5h 24m | -40%              | —          | 6   |
| 9     | 12,775 | 10,360  | 16,760 | 7,200  | 47,095 | 8h 23m | -45%              | —          | 7   |
| 10    | 20,250 | 16,420  | 26,565 | 11,415 | 74,650 | 13h 0m | -50%              | —          | 7   |

### Taller de Asedio (Workshop)

> Construye máquinas de asedio. Requisito: Gran Salón nivel 10 + Cuartel nivel 5.
> Cada nivel reduce el tiempo de entrenamiento de asedio en **5%**.

| Nivel | Madera | Arcilla | Hierro | Trigo  | Total   | Tiempo  | Reducción Entreno | Desbloquea | Pop |
| ----- | ------ | ------- | ------ | ------ | ------- | ------- | ----------------- | ---------- | --- |
| 1     | 460    | 510     | 600    | 230    | 1,800   | 20m     | -5%               | Ariete     | 3   |
| 2     | 730    | 810     | 950    | 365    | 2,855   | 31m     | -10%              | —          | 3   |
| 3     | 1,155  | 1,280   | 1,505  | 580    | 4,520   | 48m     | -15%              | —          | 4   |
| 4     | 1,835  | 2,030   | 2,390  | 920    | 7,175   | 1h 15m  | -20%              | —          | 4   |
| 5     | 2,905  | 3,220   | 3,790  | 1,455  | 11,370  | 1h 56m  | -25%              | Catapulta  | 5   |
| 6     | 4,605  | 5,100   | 6,005  | 2,310  | 18,020  | 3h 0m   | -30%              | —          | 5   |
| 7     | 7,300  | 8,085   | 9,520  | 3,660  | 28,565  | 4h 39m  | -35%              | —          | 6   |
| 8     | 11,570 | 12,815  | 15,090 | 5,800  | 45,275  | 7h 12m  | -40%              | —          | 6   |
| 9     | 18,340 | 20,315  | 23,920 | 9,195  | 71,770  | 11h 11m | -45%              | —          | 7   |
| 10    | 29,080 | 32,200  | 37,920 | 14,580 | 113,780 | 17h 21m | -50%              | —          | 7   |

---

## 🔓 Árbol de Desbloqueo

```
Gran Salón L5
  └── Cuartel L1 ──► Bóndi
        ├── Cuartel L3 ──► Berserker
        ├── Cuartel L5 ──► Skjaldmær
        └── Cuartel L7 ──► Huskarl

Gran Salón L7 + Cuartel L3
  └── Establo L1 ──► Ulfhednar
        └── Establo L5 ──► Valkyria

Gran Salón L10 + Cuartel L5
  └── Taller L1 ──► Ariete de Jörmungandr
        └── Taller L5 ──► Catapulta de Surtr
```

### Progresión Temporal de Desbloqueo

| Tropa     | Requisitos                      | Día Estimado (F2P activo) |
| --------- | ------------------------------- | ------------------------- |
| Bóndi     | GS L5 + Cuartel L1              | Day 3-5                   |
| Berserker | GS L5 + Cuartel L3              | Day 5-7                   |
| Ulfhednar | GS L7 + Cuartel L3 + Establo L1 | Day 7-10                  |
| Skjaldmær | GS L5 + Cuartel L5              | Day 7-10                  |
| Huskarl   | GS L5 + Cuartel L7              | Day 10-14                 |
| Valkyria  | GS L7 + Cuartel L3 + Establo L5 | Day 12-16                 |
| Ariete    | GS L10 + Cuartel L5 + Taller L1 | Day 18-25                 |
| Catapulta | GS L10 + Cuartel L5 + Taller L5 | Day 25-35                 |

---

## 📊 Comparativas de Eficiencia

### Ataque por Recurso Gastado

| Tropa       | ATK | Coste Total | ATK/Recurso | ATK/Trigo por hora |
| ----------- | --- | ----------- | ----------- | ------------------ |
| Bóndi       | 40  | 240         | 0.167       | 40.0               |
| Berserker   | 80  | 500         | 0.160       | 40.0               |
| Ulfhednar   | 100 | 900         | 0.111       | 33.3               |
| Catapulta\* | 40  | 1,700       | 0.024       | 10.0               |

> **Conclusión:** El Bóndi y el Berserker son los más eficientes en ATK/recurso. El Ulfhednar compensa con velocidad y carga. La Catapulta solo se justifica por su efecto de destrucción.

### Defensa por Recurso Gastado (DEF Inf)

| Tropa     | DEF Inf | Coste Total | DEF/Recurso | DEF/Trigo por hora |
| --------- | ------- | ----------- | ----------- | ------------------ |
| Skjaldmær | 65      | 420         | 0.155       | 65.0               |
| Huskarl   | 80      | 680         | 0.118       | 40.0               |
| Valkyria  | 50      | 870         | 0.057       | 16.7               |
| Bóndi     | 20      | 240         | 0.083       | 20.0               |

> **Conclusión:** La Skjaldmær es la defensora más eficiente (65 DEF por 1 trigo/h). El Huskarl ofrece más DEF absoluta pero cuesta el doble de trigo.

### Capacidad de Saqueo

| Tropa     | Carga | Velocidad | Carga×Vel | Coste | Saqueo/Recurso |
| --------- | ----- | --------- | --------- | ----- | -------------- |
| Ulfhednar | 80    | 14        | 1,120     | 900   | 0.089          |
| Bóndi     | 50    | 6         | 300       | 240   | 0.208          |
| Valkyria  | 60    | 12        | 720       | 870   | 0.069          |
| Berserker | 30    | 5         | 150       | 500   | 0.060          |

> **Conclusión:** Para saqueo puro, el **Bóndi** tiene la mejor eficiencia por recurso gastado. El **Ulfhednar** es superior en saqueo×velocidad (golpe rápido y huida).

---

## ⚖️ Balance de Trigo con Tropas

### Escenarios de Consumo

| Composición de Ejército               | Cantidad | Consumo Trigo/h | Granjas Necesarias (L7)      |
| ------------------------------------- | -------- | --------------- | ---------------------------- |
| 100 Bóndi                             | 100      | 100             | ~0.5 granja L7               |
| 200 Berserker + 50 Ulfhednar          | 250      | 550             | ~2.4 granjas L7              |
| 500 mix (300B + 100Sk + 50Ul + 50Val) | 500      | 700             | ~3.0 granjas L7              |
| Ejército Day 30 (tabla economy.md)    | 2,000    | 3,500           | ~15 granjas L7 (multi-aldea) |

### Consistencia con economy.md

| Entidad en economy.md      | Consumo/h | Tropas Correspondientes |
| -------------------------- | --------- | ----------------------- |
| Infantería básica = 1/h    | 1         | Bóndi, Skjaldmær        |
| Infantería pesada = 2/h    | 2         | Berserker, Huskarl      |
| Caballería = 3/h           | 3         | Ulfhednar, Valkyria     |
| Maquinaria de asedio = 4/h | 4         | Ariete, Catapulta       |

> ✅ Los consumos de trigo definidos aquí coinciden EXACTAMENTE con los ratios en [economy.md](economy.md).

---

## 🔍 Edge Cases & Exploit Check

| Escenario                        | Resultado                                                | Veredicto                               |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------- |
| Solo entrena Bóndi (spam masivo) | ATK/recurso eficiente PERO mueren fácil ante defensores  | ✅ Seguro — no hay estrategia dominante |
| Solo Ulfhednar (raid puro)       | Rápido y efectivo PERO 3 trigo/h × 100 = 300/h → caro    | ✅ Balanceado por trigo                 |
| Catapultas sin escolta           | Mueren al instante (10/10 DEF) → recursos desperdiciados | ✅ Requiere composición estratégica     |
| Defensor solo Skjaldmær          | Excelente DEF inf PERO débil contra mixto cab+asedio     | ✅ No hay defensa invulnerable          |
| Ignorar muralla                  | Posible pero atacante sufre +0% a +80% pérdidas extras   | ✅ Muralla recompensa inversión         |
| F2P sin hierro para tropas       | Bóndi requiere solo 40 hierro — siempre accesible        | ✅ Sin soft-lock                        |

---

## 📌 Next Step

> **@archivist** debe integrar estas tablas en la documentación oficial del GDD.
> **@qa** debe validar: balance entre tropas, ausencia de estrategia dominante, y consistencia de consumo de trigo con [economy.md](economy.md).

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
