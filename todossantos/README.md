# Cantina Todos Santos — sitio web

Sitio estático para **todossantos.cuumarketing.mx**. Vive dentro del repo de CUU Marketing en `todossantos/`.

```
todossantos/
├── index.html          # página
├── styles.css          # branding (variables de :root)
├── app.js              # cartelera, programa semanal, carta, trofeos
├── motion.js           # animaciones (GSAP + ScrollTrigger desde cdnjs)
├── CNAME               # dominio del subdominio (GitHub Pages)
├── assets/
│   ├── sprite.svg      # logotipo, sello (monograma + anillo) y fauna, vectorizados
│   ├── favicon.svg     # monograma TS
│   ├── og-cover.png    # imagen al compartir en redes (1200×630)
│   └── logos/          # archivos originales entregados por el cliente
├── data/
│   ├── events.json     # cartelera: lo escribe n8n (no editar a mano)
│   ├── site.json       # dirección, horario, WhatsApp, redes, programa semanal, agrupaciones
│   └── menu.json       # carta (propuesta) + Colección Trofeo
└── n8n/
    ├── cartelera-todossantos.json   # flujo importable en n8n
    └── build-events.js               # código del nodo "Construir events.json"
```

## Branding: salón de caza de lujo

| Rol | Color | Uso |
|---|---|---|
| Negro bosque | `#0B0D0B` | fondo |
| Verde monte | `#18221C` | degradados, tarjetas |
| Piel | `#3A2417` | sección de trofeos, Destape |
| Oro latón | `#C9A45C` | acentos, monograma, precios |
| Marfil | `#EFE6D4` | texto y logotipo |

- **Tipografía**: Playfair Display (títulos, eco del logotipo) + Jost (texto y etiquetas espaciadas).
- **Logotipos**: los PNG/WebP del cliente se vectorizaron (`assets/sprite.svg`) para que se vean nítidos a cualquier tamaño y se puedan colorear; el sello está separado en monograma y anillo para que el anillo gire.
- **Fauna de caza**: venado, ciervo, oso, jabalí, borrego cimarrón, bisonte, lobo y águila, de [game-icons.net](https://game-icons.net) (CC BY 3.0, crédito en el pie de página). Cada coctel de la **Colección Trofeo** lleva su animal.
- **Lema**: “Para unos santos… para otros diablos.”

### Motion

Preloader con el sello girando · revelado del logotipo · luz dorada que sigue al cursor · cursor y botones magnéticos · títulos palabra por palabra · parallax del venado y el oso · cartelera con scroll horizontal fijado (escritorio) · trofeos que “se cuelgan” al entrar · marquesina infinita · grano de película.
Si GSAP no carga o el visitante tiene activado *reducir movimiento*, todo el contenido se muestra estático.

## Pendientes antes de publicar

1. **Datos del local** en `data/site.json`: dirección, WhatsApp (formato `5216141234567`), links de redes.
2. **Carta**: `data/menu.json` es una *propuesta*; validar platillos y precios con la cocina.
3. **Cartelera**: `data/events.json` trae datos de ejemplo hasta que n8n escriba los reales.
4. **Fotos** (opcional): fotografías del salón, la barra y de Lenin Ramírez elevarían mucho el sitio.

## Subdominio todossantos.cuumarketing.mx

Opción recomendada: Netlify / Vercel / Cloudflare Pages (gratis).

1. Nuevo sitio conectado a este repo, **base directory = `todossantos`**, sin comando de build.
2. Agregar el dominio personalizado `todossantos.cuumarketing.mx`.
3. En el DNS de `cuumarketing.mx` crear un registro:
   `CNAME  todossantos  →  <tu-sitio>.netlify.app` (o el destino que indique la plataforma).
4. Cada commit a `main` (incluido el que hace n8n) redespliega solo.

Con GitHub Pages hay que publicar desde una rama o repo cuyo raíz sea `todossantos/` (por eso se incluye `CNAME`); Pages solo admite un dominio por repo, así que si `cuumarketing.mx` ya usa Pages en este repo, usar la opción anterior.

## Cartelera automática con n8n + Google Calendar

```
Cada 30 min → Google Calendar (próximos 60 días) → Construir events.json
            → Leer events.json en GitHub → ¿Cambió? → Commit a GitHub → redeploy
```

### Cómo carga eventos el equipo

Crear un calendario de Google llamado **“Cartelera Todos Santos”** y por cada evento:

- **Título**: nombre del evento — p. ej. `El Destape de las Estrellas`, `Música en Vivo`.
- **Fecha y hora** de inicio.
- **Descripción** (una línea por campo, todo lo demás se muestra como texto):
  ```
  artista: Grupo La Suerte
  tipo: musica          (musica | concurso | especial)
  cover: $100
  Sábado de música en vivo, llega temprano.
  ```
- **Flyer**: adjuntar la imagen desde Google Drive al evento (o poner `flyer: https://...`).
  El archivo de Drive debe estar compartido como *Cualquier persona con el enlace*; si no carga, la web genera un flyer tipográfico automáticamente.

Los días del programa fijo (`weekly` en `site.json`: jueves Destape, sábado música en vivo, etc.) aparecen solos; si el calendario tiene un evento ese día, el del calendario lo reemplaza con su artista y flyer. El evento más próximo se muestra al inicio de la página.

### Importar el flujo

1. n8n → *Import from file* → `n8n/cartelera-todossantos.json`.
2. Nodo **Eventos del calendario**: credencial de Google Calendar y elegir el calendario (reemplaza `REEMPLAZAR_ID_CALENDARIO`).
3. Nodos de **GitHub**: credencial con token con permiso *Contents: Read & write* sobre `cuu-marketing`. Ajustar la rama si no se publica desde `main`.
4. Ejecutar una vez manualmente, revisar el commit y activar el flujo.
