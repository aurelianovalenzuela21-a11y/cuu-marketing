# El Destape de las Estrellas: kit de marca

Identidad dorada (oro sobre negro noche) con piezas listas para **Instagram, TikTok y Facebook**.

- **Guía de marca:** `guia-de-marca.pdf` (también `guia-de-marca.html`)
- **Textos, bios, hashtags y calendario:** `textos-redes.md`

## Contenido

```
logo/        Logo vertical, horizontal e isotipo en oro, negro y marfil (SVG vectorial + PNG 2000px transparente)
instagram/   Perfil, teaser, anuncio, estrella revelada (+ marco transparente), historias y 6 portadas de destacadas
tiktok/      Perfil, portada de video, overlay transparente para videos y guía de zonas seguras
facebook/    Perfil, portada de página, portada de evento, post con enlace y post cuadrado
fuentes/     Cinzel, Cormorant Garamond y Montserrat (Google Fonts, licencia OFL)
plantillas/  Código que genera todas las piezas (para cambiar fecha, lugar y nombres)
```

## Paleta

| Color | HEX | Uso |
|---|---|---|
| Oro 24K | `#D4AF37` | Principal: logo, titulares, marcos |
| Oro brillo | `#F2D27A` | Subtítulos y luces |
| Champagne | `#FFF0B3` | Destellos |
| Oro viejo | `#A57A1E` | Sombra del metal |
| Bronce profundo | `#5C4310` | Resplandor de fondo |
| Negro noche | `#0B0A08` | Fondo principal |
| Marfil | `#FFF8E7` | Texto corrido |

Impresión: tinta metálica Pantone 871 C o hot-stamping dorado.

## Cambiar fecha, lugar o nombres

Las piezas usan textos de ejemplo (`SÁBADO 00 · NOVIEMBRE`, `NOMBRE DEL LUGAR`, `NOMBRE DE LA ESTRELLA`). Para regenerarlas:

1. Edita el objeto `CONFIG` al inicio de `plantillas/build.mjs`.
2. Ejecuta:
   ```bash
   cd plantillas
   npm install
   npx playwright install chromium   # solo la primera vez
   npm run build
   ```

Otra opción: sube los PNG de `logo/` y el marco transparente a Canva o CapCut y edita encima.

**Estrella revelada:** coloca la foto en una capa debajo de `ig-marco-estrella-transparente-1080x1350.png`; la foto se verá dentro del arco.
**Videos:** pon `tt-overlay-video-transparente-1080x1920.png` como capa superior en CapCut o Reels.
