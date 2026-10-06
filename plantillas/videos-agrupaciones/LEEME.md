# Plantilla — Videos de agrupaciones (horizontal 1920×1080, animada en bucle)

- **Arriba, centrados (anfitriones):** El Destape de las Estrellas · Cantina Todos Santos, ambos en textura dorada.
- **Fondo:** café sólido con la silueta "Todos Santos · Cantina Tradicional" girando en grande, más chispas doradas.
- **Centro:** espacio del video (transparente en el overlay) con marco dorado animado.
- **Abajo, patrocinadores:** CUU Studio (al centro) · Dayvasos.

## Opción A — Video para editar (CapCut / Premiere / Final Cut / DaVinci)
Carpeta `video/`:
- `plantilla-loop-transparente.mov` — ProRes 4444 **con transparencia**, bucle perfecto de 6 s.
  Ponlo en la capa de **arriba** y repítelo (copiar/pegar) lo que dure tu video.
- `plantilla-loop-transparente.webm` — misma animación, archivo ligero (VP9 con transparencia).
- `ejemplo-con-video-de-prueba.mp4` — muestra con un video de prueba debajo.

**Dónde va el video de la agrupación (capa de abajo):**
- Hueco: 1200 × 672 px, esquina superior izquierda en x = 360, y = 235.
- En el editor: escala el video al **62.5 %** y bájalo **31 px** (posición del centro: 960, 571).

## Opción B — En vivo desde la computadora
Abre `index.html` en Chrome y arrastra los videos (varios a la vez): se reproducen en orden y en bucle
con las mismas animaciones. `F` pantalla completa · `M` sonido · `→`/`←` siguiente/anterior.

## Logos
Están dibujados en vector dentro de `index.html`. Si pones el archivo original en `logos/`
con el nombre de `logos/LEEME.md`, la plantilla lo usa automáticamente (en la Opción B).
