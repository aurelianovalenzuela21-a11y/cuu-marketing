# Plantilla — Videos de agrupaciones (horizontal 1920×1080, animada en bucle de 6 s)

- **Arriba, centrados (anfitriones):** El Destape de las Estrellas (logo original) · Cantina Todos Santos (logotipo oficial en dorado 3D).
- **Fondo:** café sólido con el anillo del sello oficial de Todos Santos girando en grande, más chispas doradas.
- **Centro:** recuadro del video con marco dorado animado.
- **Abajo, patrocinadores (con movimiento suave):** Dayvasos JN · CUU Studio (al centro, solo el texto, colores morado/azul en movimiento) · Botas El Jefee.

## Videos (carpeta `video/`)
| Archivo | Para qué |
|---|---|
| `plantilla-loop-sin-recuadro.mp4` | **Sin recuadro**: centro libre para escribir los nombres de los artistas que se presentan. |
| `plantilla-loop-fondo-verde.mp4` | **Recuadro en verde puro (#00FF00)** para quitarlo con chroma key. |
| `plantilla-loop-transparente-con-placa.mov` | Recuadro transparente (sin pantalla verde) + **placa vacía "Ahora en el escenario"** para escribir a mano el nombre del grupo. |
| `plantilla-loop-transparente.mov` | ProRes 4444 con el recuadro ya transparente (sin chroma key), sin placa. |
| `plantilla-loop-transparente.webm` | Igual que el .mov, archivo ligero. |
| `ejemplo-con-video-de-prueba.mp4` | Muestra con un video de prueba debajo. |

Los videos duran 6 s y se repiten sin salto: cópialos las veces que dure el video de la agrupación.

**Recuadro del video:** 1184 × 662 px, esquina superior izquierda en x = 368, y = 232
(en el editor: escala el video al **61.7 %** y bájalo **23 px**; centro en 960, 563).

**Placa del nombre del grupo** (versión con placa): escribe el texto en el editor sobre la placa,
alineado a la izquierda en x ≈ 430, con la línea base en y ≈ 840; tipografía sugerida DM Serif Display, 46 px, color crema `#EFE7DA`.

**Sin recuadro:** el área libre para los nombres va de y ≈ 240 a y ≈ 890 (entre los anfitriones y la línea de patrocinadores),
centrada en x = 960.

## En vivo desde la computadora
Abre `index.html` en Chrome y arrastra los videos (varios a la vez): se reproducen en orden y en bucle.
`F` pantalla completa · `M` sonido · `→`/`←` siguiente/anterior.
Para mostrar la placa con nombre: abre `index.html?nombre=Nombre del grupo`.

## Logos
Ver `logos/LEEME.md`.

## Versión para videos verticales (pantalla horizontal) — carpeta `video/vertical/`
Lienzo 1920×1080 con el recuadro del video en formato vertical 9:16 al centro;
anfitriones a la izquierda y patrocinadores a la derecha.
- `plantilla-vertical-fondo-verde.mp4` — recuadro verde puro para chroma key.
- `plantilla-vertical-transparente.mov` — recuadro ya transparente (ProRes 4444).
- `plantilla-vertical-fondo-cafe.mp4` — recuadro con marco dorado y fondo café por dentro (sin verde).

**Recuadro:** 558 × 1000 px, esquina superior izquierda en x = 681, y = 40.
Para un video vertical de 1080×1920: escálalo al **52.1 %** y déjalo centrado (960, 540).
En vivo: `index.html?vertical=1`.
