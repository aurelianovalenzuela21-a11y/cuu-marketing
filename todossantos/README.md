# Cantina Todos Santos — sitio web

Sitio estático para **todossantos.cuumarketing.mx**. Vive dentro del repo de CUU Marketing en `todossantos/`.

```
todossantos/
├── index.html          # página
├── styles.css          # branding en las variables de :root
├── app.js              # cartelera, programa semanal, menú
├── CNAME               # dominio del subdominio (GitHub Pages)
├── assets/
│   ├── logo.svg        # PLACEHOLDER → reemplazar por el logotipo oficial
│   ├── logo-mark.svg   # PLACEHOLDER → isotipo / favicon
│   └── og-cover.svg    # imagen para compartir en redes
├── data/
│   ├── events.json     # cartelera: lo escribe n8n (no editar a mano)
│   ├── site.json       # dirección, WhatsApp, redes, programa semanal, agrupaciones
│   └── menu.json       # menú digital (propuesta)
└── n8n/
    ├── cartelera-todossantos.json   # flujo importable en n8n
    └── build-events.js               # código del nodo "Construir events.json"
```

## Pendientes antes de publicar

1. **Logotipos**: sustituir `assets/logo.svg` y `assets/logo-mark.svg` por los oficiales (mismo nombre; si son PNG, cambiar la extensión en `index.html`).
2. **Branding**: pegar los colores y tipografías del manual de marca en las variables `--brand-*`, `--font-*` de `styles.css`.
3. **Datos del local** en `data/site.json`: dirección, WhatsApp (formato `5216141234567`), links de redes.
4. **Menú**: `data/menu.json` es una *propuesta*; validar platillos y precios con la cantina.
5. **Cartelera**: `data/events.json` trae datos de ejemplo hasta que n8n escriba los reales.

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
