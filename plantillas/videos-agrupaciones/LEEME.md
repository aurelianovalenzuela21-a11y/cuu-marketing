# Plantilla — Videos de agrupaciones (horizontal 1920×1080)

Pantalla para proyectar los videos de las agrupaciones mientras se instala el sonido.

- **Arriba:** Cantina Todos Santos (logo principal).
- **Centro:** video de la agrupación (16:9) con su nombre arriba a la derecha.
- **Abajo, como patrocinadores:** El Destape de las Estrellas · CUU Studio · Dayvasos.

## Cómo usarla en el evento
1. Pon los logos en `logos/` (ver `logos/LEEME.md`).
2. Abre `index.html` en Chrome.
3. Arrastra los videos (puedes soltar varios). Se reproducen en orden y en bucle.
   El nombre del archivo se usa como nombre de la agrupación (ej. `Los Tucanes de Chihuahua.mp4`),
   o escríbelo a mano en el panel.
4. `F` pantalla completa · `M` sonido · `→` / `←` siguiente / anterior.
   Los controles y el cursor se ocultan solos a los 3 segundos.

Parámetros de URL opcionales: `?agrupacion=Nombre&evento=Texto`.

## Para editar en CapCut / Premiere
`overlay-1920x1080.png` es la misma plantilla con el hueco del video transparente:
ponla en una capa encima del video. Para regenerarla después de cambiar logos o colores,
abre `index.html?overlay=1` y haz captura a 1920×1080.

## Colores
Están al inicio del `<style>` en `index.html` (`--cts-primario`, `--cts-secundario`, etc.).
Reemplázalos por los colores oficiales de Cantina Todos Santos.
