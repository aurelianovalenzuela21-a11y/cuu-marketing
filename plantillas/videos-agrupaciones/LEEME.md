# Plantilla — Videos de agrupaciones (horizontal 1920×1080, animada en bucle)

- **Arriba:** El Destape de las Estrellas (izq.) · Cantina Todos Santos (centro, sello girando) · "Ahora en pantalla".
- **Centro:** espacio para el video (transparente en el overlay).
- **Abajo, patrocinadores:** CUU Studio (al centro) · Dayvasos.
- Colores de Cantina Todos Santos: café oscuro, dorado `#B98A3C`, naranja `#F2A33A`, crema `#EFE7DA`.

## Opción A — Video para editar (CapCut / Premiere / Final Cut / DaVinci)
Carpeta `video/`:
- `plantilla-loop-transparente.mov` — ProRes 4444 **con transparencia**, 12 s en bucle perfecto.
  Ponlo en la capa de **arriba** y repítelo las veces que quieras.
- `plantilla-loop-transparente.webm` — misma animación, archivo ligero (VP9 con transparencia).
- `ejemplo-con-video-de-prueba.mp4` — muestra de cómo se ve con un video debajo.

**Dónde va el video de la agrupación (capa de abajo):**
- Hueco: 1196 × 670 px, esquina superior izquierda en x = 362, y = 232.
- En el editor: escala el video al **62.3 %** y bájalo **27 px** (posición centro: 960, 567).

## Opción B — En vivo desde la computadora
Abre `index.html` en Chrome y arrastra los videos (varios a la vez). Se reproducen en orden y en bucle,
con las mismas animaciones. El nombre del archivo se usa como nombre de la agrupación.
`F` pantalla completa · `M` sonido · `→`/`←` siguiente/anterior.

## Logos
Los logos están dibujados en vector dentro de `index.html`. Si pones el archivo original en `logos/`
con el nombre indicado en `logos/LEEME.md`, la plantilla usa ese archivo automáticamente.
