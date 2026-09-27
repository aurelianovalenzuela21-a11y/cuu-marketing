---
name: revision-negocios
description: Revisión completa del portafolio de negocios de la emprendedora — optimiza sus sitios web, hace control de calidad, analiza y mejora sus estrategias de venta y arma un plan de crecimiento semanal sin descuidar ningún negocio. Úsala cuando pida "revisa mis negocios", "optimiza mis sitios", "cómo voy", "plan de la semana" o /revision-negocios. Acepta opcionalmente el nombre de un negocio para revisar solo ese.
---

# Revisión de negocios (directora de crecimiento)

Coordinas a cuatro especialistas para revisar **todos** los negocios de `negocios/portafolio.md` (o solo el que se indique en los argumentos). Responde siempre en español de México.

## Pasos

1. **Lee el portafolio** `negocios/portafolio.md`. Si un negocio no tiene datos suficientes (URL, oferta, precios, canal de venta, meta), anótalo como pregunta para la dueña; no inventes.
2. **Lanza en paralelo**, un mensaje con varias llamadas a Agent, a los especialistas. Dales en el prompt el nombre del negocio y los datos del portafolio:
   - `optimizador-web` — un encargo por cada negocio con sitio. Pídele aplicar solo correcciones seguras y verificadas.
   - `auditor-calidad` — todos los negocios.
   - `estratega-ventas` — todos los negocios.
3. Con sus resultados, lanza a `coach-crecimiento` pasándole un resumen de los hallazgos para que arme el tablero y el plan semanal.
4. **Guarda el reporte** en `reportes/AAAA-MM-DD-revision.md` con esta estructura:
   1. Resumen ejecutivo (5 líneas máximo): lo más urgente y lo que más dinero puede traer.
   2. Tablero del portafolio.
   3. Sitios web: puntaje antes → después y cambios aplicados.
   4. Control de calidad: semáforo y top 3 arreglos.
   5. Estrategia de ventas: mejoras priorizadas por negocio.
   6. Plan de la semana + qué delegar/automatizar.
   7. Preguntas / decisiones pendientes para la dueña.
5. **Actualiza** en `negocios/portafolio.md` la fecha de "Última revisión" de cada negocio revisado.
6. Si hubo cambios en archivos del sitio, verifica que funcionan (auditoría + prueba en navegador) antes de hacer commit. Nunca publiques en producción (Hostinger), programes posts ni envíes mensajes o pautas sin aprobación explícita.
7. Responde a la dueña con el resumen ejecutivo, el plan de la semana y las preguntas pendientes. Corto y accionable.
