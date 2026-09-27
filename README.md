# CUU Marketing + Agente de crecimiento

Este repositorio tiene el sitio de **cuumarketing.mx** y un agente que te ayuda a hacer crecer todos tus negocios.

## Qué hace el agente

| Especialista | Qué hace |
|---|---|
| `optimizador-web` | Revisa y mejora tus sitios: SEO local, velocidad, móvil, formularios, medición |
| `auditor-calidad` | Control de calidad: promesas vs. realidad, recorrido del cliente, riesgos legales (PROFECO, Aviso de Privacidad) |
| `estratega-ventas` | Analiza oferta, precios, embudo y seguimiento; propone mejoras con guiones listos |
| `coach-crecimiento` | Arma tu tablero y plan semanal para que ningún negocio se quede atrás |

## Cómo usarlo (en Claude Code)

- **Revisión completa de todos tus negocios:** escribe `/revision-negocios`
- **Solo un negocio:** `/revision-negocios CUU Studio`
- **Auditoría rápida de un sitio:** `node herramientas/auditar-sitio.mjs .`
- **Hablar con un especialista:** "Pídele al estratega-ventas que revise mis precios"

## Mantén al día tu portafolio

El agente solo es tan bueno como la información que tiene. Llena `negocios/portafolio.md` con cada negocio (sitio, oferta, precios, meta del mes). Los reportes se guardan en `reportes/`.

Si conectas Metricool, Porter Metrics, Hostinger, n8n o Make, el agente usa esos datos (solo lectura) para sus análisis.
