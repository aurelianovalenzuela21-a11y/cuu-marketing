# Texto 3D cromado en arco (estilo flyer grupero) — fondo verde

Título 3D real (three.js): letras con volumen, bisel pulido y material de cromo con reflejos,
en arco y con contorno oscuro. Animación en bucle de 6 s (giro suave y reflejos que se deslizan).
Fondo verde puro `#00FF00` para quitarlo con chroma key en cada flyer.

- `videos/doble-firma-cromo-3d-fondo-verde.mp4` — "DOBLE FIRMA", 1920×1080, 6 s en bucle.

## Hacer otro nombre (carpeta `cromo-3d/`)
1. `npm install` dentro de `cromo-3d/` y levanta un servidor: `python3 -m http.server 8765`.
2. `node render.js <ruta-de-playwright> "texto=Nombre%20Artista&metal=plata" frames full`
   (`metal=oro` para dorado; usa `|` en el texto para elegir dónde partir los renglones).
3. `ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -crf 14 -pix_fmt yuv420p salida.mp4`

`index.html` (la versión anterior en SVG) se conserva como alternativa ligera.
