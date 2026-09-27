# Diagnóstico inicial del portafolio — 27 de septiembre de 2026

## 1. Resumen ejecutivo

1. **Se estaban perdiendo prospectos.** El formulario "Quiero mi diagnóstico gratuito" de cuumarketing.mx solo *simulaba* el envío: mostraba "¡Mensaje enviado!" y los datos no llegaban a ningún lado. Además, el botón de WhatsApp que aparecía después apuntaba a un número de ejemplo (614 123 4567). **Ya corregido.**
2. Los 7 enlaces "Saber más" de los servicios llevaban a páginas que no existen, y además una capa decorativa impedía hacerles clic. **Ya corregido**: ahora dicen "Cotizar este servicio →" y llevan al formulario con el servicio ya elegido.
3. El sitio no mide nada (sin GA4 ni Meta Pixel), así que hoy no se sabe cuántas visitas llegan ni cuántas escriben. Es lo siguiente por arreglar.
4. Hay riesgos de confianza/legales: testimonios y logos de marcas (Alsuper, etc.) que hay que confirmar como reales, afirmaciones "#1" y "la única agencia", y falta el Aviso de Privacidad.
5. La mayor oportunidad de ventas: una **oferta de entrada** de bajo riesgo y aclarar que la **inversión en anuncios no está incluida** en los planes.

## 2. Tablero del portafolio

| Negocio | Estado | Meta del mes | Siguiente acción |
|---|---|---|---|
| CUU Marketing | 🟡 Sitio ya capta prospectos; falta medición y prueba social | _por definir_ | Instalar GA4 + Pixel y publicar Aviso de Privacidad |
| CUU Studio | ⚠️ Sin datos en el portafolio | _por definir_ | Llenar su ficha en `negocios/portafolio.md` para incluirlo en la próxima revisión |

## 3. Sitio web — cuumarketing.mx

**Puntaje de salud: 12 → 75 / 100** (`node herramientas/auditar-sitio.mjs .`)

### Cambios aplicados y probados en navegador

| Antes | Ahora |
|---|---|
| El formulario simulaba el envío y se perdían los datos | Abre WhatsApp (614 514 8056) con nombre, negocio, email, teléfono, servicio y mensaje ya escritos. Hay un espacio (`LEADS_WEBHOOK` en `main.js`) para guardar además cada prospecto en una hoja o CRM con n8n/Make |
| Botón de éxito con WhatsApp falso 526141234567 | Usa el número real |
| 7 enlaces "Saber más" a páginas inexistentes (404) | "Cotizar este servicio →" lleva al formulario y preselecciona el servicio |
| Una capa CSS bloqueaba los clics en las tarjetas de servicio | Corregido (`pointer-events: none`) |
| "Influencers locales" no existía en el formulario | Agregado como opción |
| Meta description de 172 caracteres (Google la cortaba) | 154 caracteres, con "Diagnóstico gratis" |
| Sin robots.txt ni sitemap.xml | Creados |
| Schema.org sin teléfono | Teléfono agregado (ayuda en Google Maps) |
| Sin tarjeta para X/Twitter | Agregada |

### Pendientes que necesitan tus datos o tu decisión

| Prioridad | Qué | Qué necesito de ti |
|---|---|---|
| 🟠 Alta | Instalar GA4 + Meta Pixel y medir clics a WhatsApp y envíos del formulario | Tus IDs de GA4 y Pixel (o te guío para crearlos) |
| 🟠 Alta | Aviso de Privacidad (obligatorio por LFPDPPP al pedir email y teléfono) | Razón social / nombre del responsable y domicilio para redactarlo |
| 🟠 Alta | Imagen para compartir (og:image 1200×630): hoy el enlace sale sin imagen en WhatsApp y Facebook | Aprobar diseño (puedo generarla con la plantilla de marca) |
| 🟡 Media | Enlaces de redes sociales en el pie de página apuntan a "#" | Tus URLs de Facebook, Instagram, TikTok y LinkedIn |
| 🟡 Media | Favicon | Logo en PNG o SVG |
| ⚪ Baja | `influencers.css` no se usa; página 404 personalizada | ¿Quieres una página dedicada a Influencers? |

## 4. Control de calidad

**Semáforo CUU Marketing: 🟡** — el recorrido del cliente ya funciona, pero hay promesas y pruebas sociales que hay que respaldar.

| Severidad | Área | Evidencia | Riesgo | Acción |
|---|---|---|---|---|
| 🟠 Alto | Prueba social | `index.html` sección "Marcas que confían en nosotros" (Alsuper y otras) | Si no son clientes reales, puede ser publicidad engañosa (PROFECO) y reclamo de la marca | Confirmar cada logo; dejar solo clientes reales con permiso |
| 🟠 Alto | Prueba social | Testimonios de María Rodríguez, Jorge López, Ana Pacheco, Roberto Castro | Sin foto ni enlace, se ven genéricos; si no son reales, mismo riesgo | Sustituir por 2–3 casos reales con foto, negocio y número (idealmente video corto grabado en CUU Studio) |
| 🟡 Medio | Promesas | "Agencia #1 en Chihuahua", "la única agencia", "150+ negocios", "98% satisfechos", "3x retorno" | Cifras sin fuente | Mantener solo las que puedas comprobar; cambiar "#1" por algo verificable ("+X clientes en Chihuahua desde 20XX") |
| 🟡 Medio | Promesas | "Respuesta en menos de 2 horas" y "Resultados en 30 días" | Si no se cumple, genera malas reseñas | Configurar respuestas rápidas y mensaje de ausencia en WhatsApp Business; definir qué "resultado" se entrega a los 30 días |
| 🟡 Medio | Precios | Planes sin aclarar IVA ni si incluyen la inversión en anuncios | Malentendidos al cerrar la venta | Añadir "+IVA" (o "IVA incluido") y "Inversión en anuncios no incluida, recomendada desde $X" |

**Checklist de calidad sugerido (revisar cada mes, por negocio):**
1. Formulario probado de punta a punta (llega el mensaje).
2. WhatsApp, teléfono y horario iguales en sitio, redes y Google.
3. Respuesta a prospectos en menos del tiempo prometido.
4. Cada testimonio/logo es real y con permiso.
5. Precios del sitio = precios de la cotización.
6. Aviso de Privacidad visible.
7. Todas las entregas del mes a tiempo (lista de clientes activos).
8. Una reseña nueva en Google pedida a cada cliente satisfecho.
9. Reporte mensual enviado a cada cliente.
10. Analítica funcionando (hay datos de la semana).

## 5. Estrategia de ventas — CUU Marketing

**Diagnóstico:** Lo que funciona: precios públicos (diferenciador real frente a otras agencias), diagnóstico gratuito, WhatsApp como canal y tres planes con anclaje (el Growth "Más recomendado" en medio). Lo que frena: no hay escalón de entrada entre "gratis" y "$7,500 al mes", no se sabe si la pauta va incluida, los servicios de proyecto (web, branding) no tienen precio y la prueba social no es verificable.

| # | Mejora | Impacto / esfuerzo | Cómo medirlo |
|---|---|---|---|
| 1 | **Oferta de entrada "Sprint de 30 días"** (ej. $2,900–3,900): auditoría + 8 publicaciones + 1 campaña de prueba. Se abona al primer mes si contrata un plan | Alto / bajo | % de sprints que pasan a plan mensual |
| 2 | **Precios de proyectos únicos** en el sitio: "Sitio web desde $X", "Identidad de marca desde $X". Hoy esos servicios no tienen precio y se van con otros | Alto / bajo | Cotizaciones de web/branding por mes |
| 3 | **Guion de seguimiento por WhatsApp** (abajo). La mayoría de las ventas de agencia se cierran en el 2.º–4.º contacto | Alto / bajo | % de diagnósticos que terminan en propuesta |
| 4 | **Descuento por permanencia**: 3 meses precio normal, 6 meses −5%, 12 meses −10%. Mantiene "sin contratos largos" y mejora flujo de caja | Medio / bajo | Meses promedio por cliente |
| 5 | **Programa de referidos**: 50% de descuento en un mes por cada cliente referido que contrate | Medio / bajo | Clientes nuevos por referido |

**Guion de seguimiento (WhatsApp Business → respuestas rápidas):**
- **Día 0 (menos de 2 h):** "¡Hola {nombre}! Soy {tu nombre} de CUU Marketing 👋 Gracias por pedir tu diagnóstico. Para prepararlo, ¿me compartes el Instagram o sitio de {negocio}? ¿Te queda una llamada de 20 min mañana a las 10 o a las 4?"
- **Día 1:** enviar el diagnóstico con 3 mejoras rápidas que pueda aplicar sola (demuestra valor antes de vender).
- **Día 3:** propuesta con el plan recomendado y el Sprint de 30 días como alternativa.
- **Día 7:** "¿Pudiste revisar la propuesta? Si el presupuesto es el freno, el Sprint te permite probar un mes sin compromiso."
- **Día 30:** reactivar con un caso de éxito o una idea para su temporada (Buen Fin, Navidad).

**Venta cruzada entre negocios:** los planes Growth (2 videos/mes) y Dominator (producción mensual) se pueden producir en **CUU Studio** en lugar de subcontratar: sube el margen y le da a CUU Studio clientes recurrentes. A la inversa, los artistas y marcas que graban en CUU Studio son candidatos naturales a los planes de redes de CUU Marketing (ej. "paquete lanzamiento": grabación + campaña de difusión).

**Temporada:** faltan ~8 semanas para El Buen Fin (noviembre). Una campaña "Prepara tu negocio para El Buen Fin" es un buen gancho para vender Sprints en octubre.

## 6. Plan de la semana (28 sep – 2 oct)

| Día | Prioridades | Negocio | Tiempo |
|---|---|---|---|
| Lun | Probar el formulario desde tu celular y configurar respuestas rápidas en WhatsApp Business con el guion | CUU Marketing | 1 h |
| Lun | Llenar la ficha de CUU Studio (y de cualquier otro negocio) en `negocios/portafolio.md` | Todos | 30 min |
| Mar | Confirmar qué logos y testimonios son reales; conseguir 2 testimonios con permiso | CUU Marketing | 1 h |
| Mié | Crear GA4 y Meta Pixel y compartirme los IDs | CUU Marketing | 45 min |
| Jue | Definir precio del Sprint de 30 días y precios "desde" de web y branding | CUU Marketing | 1 h |
| Vie | Revisión rápida de CUU Studio con el agente (`/revision-negocios CUU Studio`) | CUU Studio | 1 h |

**Qué delegar o automatizar:**
- Guardar cada prospecto del formulario en Google Sheets y mandarte aviso: un flujo de n8n o Make pegado en `LEADS_WEBHOOK` (lo puedo armar).
- Publicaciones de redes: programarlas en bloque con Metricool una vez por semana.
- Mensaje de ausencia y respuestas rápidas en WhatsApp Business.

**Número a vigilar:** CUU Marketing → diagnósticos agendados por semana. CUU Studio → por definir.

**Aprendizaje de la semana:** calcular el margen por plan (horas del equipo × costo por hora vs. precio). Así sabrás qué plan conviene empujar.

> Enfoque: esta semana el objetivo no es hacer más cosas, sino **no perder ni un prospecto más**. Lo demás se construye encima de eso.

## 7. Preguntas pendientes para ti

1. ¿Qué otros negocios tienes además de CUU Marketing y CUU Studio? ¿Tienen sitio web y en dónde está alojado (Hostinger, otro)?
2. ¿Los logos y testimonios del sitio son de clientes reales?
3. ¿Los precios incluyen IVA? ¿Incluyen la inversión en anuncios?
4. ¿Cuántas horas a la semana puedes dedicar entre todos los negocios y cuál es tu meta de ingresos del trimestre?
5. ¿Quieres que conecte el formulario a una hoja de Google o a tu CRM con n8n/Make?
