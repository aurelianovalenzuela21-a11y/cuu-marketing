#!/usr/bin/env python3
"""Genera las páginas de servicio (una por búsqueda local) y el sitemap.

Uso:  python3 tools/generate_service_pages.py
Edita el contenido en SERVICES y vuelve a ejecutar; sobrescribe las páginas.
"""
import json
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://cuumarketing.com'
TODAY = date.today().isoformat()
WA = 'https://wa.me/526145148056?text=Hola%2C%20vi%20su%20p%C3%A1gina%20y%20quiero%20informes%20sobre%20CUU%20Marketing'

SERVICES = [
    {
        'slug': 'publicidad-en-facebook-e-instagram-chihuahua',
        'nav': 'Publicidad en Facebook e Instagram',
        'title': 'Publicidad en Facebook e Instagram en Chihuahua | CUU Marketing',
        'description': 'Campañas de Facebook Ads e Instagram Ads en Chihuahua para conseguir clientes por WhatsApp, llamadas y visitas. Configuración, anuncios, píxel y optimización. Diagnóstico gratis.',
        'service_type': 'Publicidad en redes sociales (Meta Ads)',
        'form_value': 'marketing',
        'tag': 'Meta Ads',
        'h1': 'Publicidad en Facebook e Instagram',
        'h1_accent': 'en Chihuahua',
        'lead': 'Anuncios que llegan a la gente de Chihuahua que sí puede comprarte y la llevan directo a tu WhatsApp. Nosotros armamos la estrategia, los anuncios y la medición; tú atiendes a los clientes.',
        'intro': [
            'Facebook e Instagram son las plataformas donde más tiempo pasa la gente en Chihuahua, y también donde más dinero se desperdicia en publicidad: botones de “promocionar” sin segmentación, anuncios sin medición y presupuestos que se van sin saber qué regresó.',
            'Como agencia de <strong>publicidad en Facebook en Chihuahua</strong> trabajamos al revés: primero definimos cuánto te cuesta conseguir un cliente y cuánto vale, y a partir de ahí diseñamos campañas de <strong>Meta Ads</strong> que se miden en mensajes, citas y ventas, no en “me gusta”.',
        ],
        'includes': [
            ('Estrategia y segmentación', 'Definimos a quién anunciar por zona (Chihuahua capital, colonias, municipios), edad, intereses y comportamiento de compra.'),
            ('Configuración técnica', 'Business Manager, cuenta publicitaria, píxel de Meta y eventos de conversión, todo a tu nombre para que siempre sea tuyo.'),
            ('Anuncios que detienen el scroll', 'Diseño de imágenes, carruseles y videos cortos para Reels e Historias, con textos pensados para vender.'),
            ('Campañas a WhatsApp y formularios', 'Anuncios de “Enviar mensaje” y formularios instantáneos para que el cliente te contacte en un clic.'),
            ('Retargeting', 'Volvemos a mostrar tu anuncio a quien ya visitó tu página o interactuó con tus redes y no compró.'),
            ('Optimización y reportes', 'Revisamos resultados cada semana, apagamos lo que no funciona y te explicamos en lenguaje claro cuánto costó cada cliente.'),
        ],
        'ideal': ['Restaurantes y negocios de comida', 'Clínicas, consultorios y estéticas', 'Tiendas y boutiques', 'Inmobiliarias y constructoras', 'Escuelas, gimnasios y servicios profesionales'],
        'price': 'Incluido desde el <strong>plan Starter ($7,500 MXN/mes)</strong>. La inversión en anuncios la pagas directo a Meta con tu tarjeta; en el diagnóstico te recomendamos cuánto invertir según tu meta.',
        'faqs': [
            ('¿Cuánto debo invertir en publicidad en Facebook?', 'Depende de tu meta y de cuánto vale un cliente para ti. Muchos negocios locales empiezan con una inversión modesta diaria para probar mensajes y audiencias, y la aumentan cuando ven qué funciona. En el diagnóstico gratuito te damos una recomendación concreta.'),
            ('¿Los anuncios salen en Facebook y en Instagram?', 'Sí. Con una sola campaña de Meta Ads tus anuncios pueden aparecer en Facebook, Instagram (feed, Historias y Reels), Messenger y WhatsApp. Elegimos las ubicaciones que mejor resultado den para tu negocio.'),
            ('¿Puedo anunciar solo en ciertas zonas de Chihuahua?', 'Sí. Podemos segmentar por radio alrededor de tu negocio, por colonias o códigos postales, o por municipios como Juárez, Delicias o Cuauhtémoc.'),
            ('¿Qué diferencia hay con el botón de “promocionar”?', 'El botón de promocionar tiene muy pocas opciones de segmentación y de objetivo. Desde el Administrador de anuncios podemos optimizar por mensajes o ventas, medir con el píxel, hacer retargeting y probar varias versiones del anuncio.'),
        ],
        'related': ['google-ads-chihuahua', 'publicidad-en-tiktok-chihuahua', 'manejo-de-redes-sociales-chihuahua'],
    },
    {
        'slug': 'google-ads-chihuahua',
        'nav': 'Publicidad en Google Ads',
        'title': 'Agencia de Google Ads en Chihuahua | Anuncios en Google | CUU Marketing',
        'description': 'Aparece en los primeros lugares de Google cuando buscan lo que vendes en Chihuahua. Campañas de búsqueda, Google Maps y YouTube con medición de llamadas y mensajes.',
        'service_type': 'Publicidad en buscadores (Google Ads)',
        'form_value': 'marketing',
        'tag': 'Google Ads',
        'h1': 'Anuncios en Google Ads',
        'h1_accent': 'para negocios en Chihuahua',
        'lead': 'Cuando alguien en Chihuahua busca “dentista cerca de mí” o “renta de maquinaria”, ya quiere comprar. Con Google Ads apareces arriba en ese momento exacto.',
        'intro': [
            'Google Ads es la forma más directa de captar clientes que ya están buscando lo que ofreces. A diferencia de las redes sociales, aquí no interrumpes a nadie: respondes a una búsqueda.',
            'Como <strong>agencia de Google Ads en Chihuahua</strong> elegimos las palabras clave que sí traen clientes, excluimos las que solo gastan dinero y medimos cada llamada, mensaje o formulario para saber exactamente qué te está funcionando.',
        ],
        'includes': [
            ('Investigación de palabras clave', 'Encontramos cómo busca la gente en Chihuahua lo que vendes y cuánto cuesta cada clic.'),
            ('Campañas de búsqueda', 'Anuncios de texto que aparecen en los primeros resultados de Google, con extensiones de llamada, ubicación y WhatsApp.'),
            ('Google Maps y búsquedas locales', 'Anuncios en Maps para que te encuentren quienes buscan un negocio como el tuyo cerca de ellos.'),
            ('YouTube y Display', 'Video y banners para darte a conocer y hacer retargeting a quien ya visitó tu sitio.'),
            ('Medición de conversiones', 'Configuramos Google Analytics 4 y conversiones de llamadas, formularios y clics a WhatsApp.'),
            ('Optimización continua', 'Ajustamos pujas, términos negativos y anuncios cada semana para bajar tu costo por cliente.'),
        ],
        'ideal': ['Servicios urgentes (plomería, cerrajería, grúas, mecánicos)', 'Clínicas, dentistas y especialistas', 'Despachos, abogados y contadores', 'Industria y proveedores B2B', 'Escuelas y cursos'],
        'price': 'Incluido desde el <strong>plan Starter ($7,500 MXN/mes)</strong> como una de tus campañas; el <strong>plan Dominator</strong> incluye SEO + SEM completo. La inversión en clics la pagas directo a Google.',
        'faqs': [
            ('¿Cuánto cuesta anunciarse en Google en Chihuahua?', 'Google cobra por clic y el precio depende de la competencia de cada palabra clave. En el diagnóstico revisamos cuánto cuestan las búsquedas de tu giro en Chihuahua y te proponemos un presupuesto realista.'),
            ('¿En cuánto tiempo aparezco en Google con anuncios?', 'Una vez aprobada la campaña, tus anuncios pueden empezar a mostrarse el mismo día. El posicionamiento orgánico (SEO), en cambio, toma meses.'),
            ('¿Google Ads o Facebook Ads?', 'Google capta a quien ya está buscando; Facebook e Instagram generan demanda en quien todavía no te busca. Muchos negocios obtienen el mejor resultado combinando ambos, y te decimos por cuál empezar según tu caso.'),
            ('¿Pueden administrar mi cuenta de Google Ads actual?', 'Sí. Revisamos tu cuenta, detectamos en qué se está desperdiciando dinero y la reestructuramos sin perder el historial.'),
        ],
        'related': ['publicidad-en-facebook-e-instagram-chihuahua', 'diseno-de-paginas-web-chihuahua', 'publicidad-en-tiktok-chihuahua'],
    },
    {
        'slug': 'publicidad-en-tiktok-chihuahua',
        'nav': 'Publicidad en TikTok',
        'title': 'Publicidad en TikTok en Chihuahua | TikTok Ads | CUU Marketing',
        'description': 'Campañas de TikTok Ads para negocios en Chihuahua: videos que se sienten nativos, segmentación local y medición con el píxel de TikTok. Diagnóstico gratis.',
        'service_type': 'Publicidad en TikTok (TikTok Ads)',
        'form_value': 'marketing',
        'tag': 'TikTok Ads',
        'h1': 'Publicidad en TikTok',
        'h1_accent': 'en Chihuahua',
        'lead': 'TikTok ya no es solo para bailes: es donde miles de personas en Chihuahua descubren restaurantes, tiendas y servicios. Te ayudamos a aparecer ahí con anuncios que no parecen anuncios.',
        'intro': [
            'En TikTok gana el contenido que se siente auténtico. Un anuncio que parece comercial de televisión se salta en un segundo; uno que parece un video más del feed se ve completo y genera acción.',
            'Hacemos <strong>publicidad en TikTok en Chihuahua</strong> combinando producción de videos cortos con campañas de <strong>TikTok Ads</strong> segmentadas por zona e intereses, y medimos resultados con el píxel de TikTok.',
        ],
        'includes': [
            ('Guiones y producción', 'Ideas y guiones de videos cortos con ganchos en los primeros 3 segundos; los grabamos en Chihuahua o te guiamos para grabarlos tú.'),
            ('Configuración de TikTok Ads', 'Cuenta publicitaria, píxel de TikTok y eventos de conversión a tu nombre.'),
            ('Spark Ads', 'Impulsamos tus mejores videos orgánicos o los de creadores locales como anuncios.'),
            ('Segmentación local', 'Anuncios dirigidos a Chihuahua y municipios cercanos, por edad e intereses.'),
            ('Pruebas creativas', 'Probamos varios ganchos y formatos para encontrar el que más vende.'),
            ('Reportes claros', 'Vistas, clics, mensajes y ventas, explicados sin tecnicismos.'),
        ],
        'ideal': ['Restaurantes, cafeterías y antros', 'Moda, belleza y estéticas', 'Tiendas en línea', 'Eventos y entretenimiento', 'Marcas que quieren llegar a público joven'],
        'price': 'Incluido desde el <strong>plan Starter ($7,500 MXN/mes)</strong> como campaña; el <strong>plan Growth</strong> incluye 2 videos para redes al mes. La inversión en anuncios la pagas directo a TikTok.',
        'faqs': [
            ('¿TikTok funciona para negocios locales?', 'Sí, sobre todo para negocios visuales o con público menor de 45 años: comida, moda, belleza, entretenimiento y servicios. En el diagnóstico te decimos con honestidad si TikTok tiene sentido para tu giro.'),
            ('¿Necesito tener cuenta de TikTok con seguidores?', 'No es indispensable. Los anuncios llegan a gente nueva aunque tu cuenta sea pequeña, aunque tener contenido orgánico activo ayuda a generar confianza.'),
            ('¿Quién aparece en los videos?', 'Puedes aparecer tú o tu equipo, podemos trabajar con creadores de contenido locales o hacer videos de producto sin rostro. Lo definimos juntos.'),
        ],
        'related': ['publicidad-en-facebook-e-instagram-chihuahua', 'produccion-de-video-chihuahua', 'marketing-con-influencers-chihuahua'],
    },
    {
        'slug': 'manejo-de-redes-sociales-chihuahua',
        'nav': 'Manejo de redes sociales',
        'title': 'Manejo de Redes Sociales en Chihuahua | Community Manager | CUU Marketing',
        'description': 'Manejo de redes sociales en Chihuahua: calendario de contenido, diseño, Reels, Historias y community management para Facebook, Instagram y TikTok. Precios publicados.',
        'service_type': 'Manejo de redes sociales (community management)',
        'form_value': 'redes',
        'tag': 'Redes sociales',
        'h1': 'Manejo de redes sociales',
        'h1_accent': 'en Chihuahua',
        'lead': 'Tus redes activas, con contenido que se ve profesional y habla como tus clientes. Tú te enfocas en tu negocio; nosotros en que tus redes trabajen para ti.',
        'intro': [
            'Unas redes abandonadas o con publicaciones improvisadas hacen que un cliente dude. Unas redes cuidadas generan confianza antes de que te escriban.',
            'Nuestro servicio de <strong>manejo de redes sociales en Chihuahua</strong> incluye estrategia, calendario, diseño y <strong>community management</strong>, con contenido pensado para vender y no solo para “estar presente”.',
        ],
        'includes': [
            ('Estrategia y calendario editorial', 'Planeamos el contenido del mes alineado a tus temporadas, promociones y objetivos.'),
            ('Diseño de publicaciones', 'Posts, carruseles e Historias con una identidad visual consistente.'),
            ('Reels y video corto', 'Ideas, guiones y edición de videos para Instagram, Facebook y TikTok.'),
            ('Copywriting', 'Textos que conectan con la gente de Chihuahua y llevan a la acción.'),
            ('Community management', 'Respuesta a comentarios y mensajes en los horarios acordados.'),
            ('Reporte mensual', 'Qué publicaciones funcionaron, cuánto creció tu comunidad y qué ajustamos.'),
        ],
        'ideal': ['Negocios que no tienen tiempo de publicar', 'Marcas que quieren verse más profesionales', 'Negocios que ya anuncian y necesitan contenido', 'Emprendimientos que están empezando'],
        'price': '<strong>Plan Starter ($7,500 MXN/mes)</strong>: 2 redes y 12 publicaciones. <strong>Plan Growth ($14,900 MXN/mes)</strong>: 4 redes, 20 publicaciones + Historias y 2 videos al mes.',
        'faqs': [
            ('¿Cuántas publicaciones al mes necesito?', 'Depende del giro, pero la constancia importa más que la cantidad. Nuestros planes van de 12 a 20 publicaciones al mes más Historias.'),
            ('¿Ustedes toman las fotos y videos?', 'Podemos producirlos nosotros en Chihuahua, usar el material que ya tengas o combinar ambos. La producción audiovisual mensual está incluida en el plan Dominator.'),
            ('¿Tengo que aprobar el contenido?', 'Sí. Te compartimos el calendario del mes para que lo revises y apruebes antes de publicar.'),
        ],
        'related': ['publicidad-en-facebook-e-instagram-chihuahua', 'produccion-de-video-chihuahua', 'branding-diseno-de-logo-chihuahua'],
    },
    {
        'slug': 'diseno-de-paginas-web-chihuahua',
        'nav': 'Diseño de páginas web',
        'title': 'Diseño de Páginas Web en Chihuahua | Sitios que venden | CUU Marketing',
        'description': 'Diseño de páginas web en Chihuahua: landing pages, sitios corporativos y tiendas en línea rápidas, optimizadas para Google y conectadas a WhatsApp. Cotización en 48 h.',
        'service_type': 'Diseño y desarrollo de páginas web',
        'form_value': 'web',
        'tag': 'Desarrollo web',
        'h1': 'Diseño de páginas web',
        'h1_accent': 'en Chihuahua que venden',
        'lead': 'Una página web no es un folleto: es tu vendedor 24/7. Diseñamos sitios rápidos, bonitos y hechos para convertir visitas en clientes.',
        'intro': [
            'La mayoría de tus clientes te va a buscar en Google antes de contactarte. Si tu sitio es lento, no se ve bien en celular o no deja claro qué haces, ese cliente se va con tu competencia.',
            'Como agencia de <strong>diseño de páginas web en Chihuahua</strong> creamos sitios pensados desde la venta: mensajes claros, botones a WhatsApp, formularios que sí llegan y todo listo para <strong>SEO local</strong> y campañas de publicidad.',
        ],
        'includes': [
            ('Landing pages', 'Páginas de una sola sección diseñadas para campañas de publicidad y captación de clientes.'),
            ('Sitios corporativos', 'Tu empresa, servicios, casos y contacto, con diseño profesional y administrable.'),
            ('Tiendas en línea', 'E-commerce con catálogo, pagos y envíos.'),
            ('SEO técnico y local', 'Velocidad, estructura, datos para Google y optimización para búsquedas en Chihuahua.'),
            ('Medición y conversiones', 'Google Analytics, píxel de Meta y eventos de contacto configurados desde el día uno.'),
            ('Dominio, hosting y SSL', 'Te ayudamos a configurarlo todo a tu nombre.'),
        ],
        'ideal': ['Negocios sin página web', 'Empresas con un sitio viejo o lento', 'Negocios que van a invertir en publicidad', 'Marcas que quieren vender en línea'],
        'price': 'Se cotiza según alcance (landing, sitio corporativo o tienda en línea). Te enviamos una propuesta con precio cerrado en menos de 48 horas.',
        'faqs': [
            ('¿Cuánto tarda en estar lista mi página web?', 'Una landing page puede estar lista en pocos días; un sitio corporativo o tienda en línea toma más según el número de secciones y productos. Te damos un calendario cerrado en la propuesta.'),
            ('¿La página queda a mi nombre?', 'Sí. El dominio, el hosting y los accesos quedan a tu nombre.'),
            ('¿Mi página va a salir en Google?', 'La dejamos optimizada para que Google la indexe y entienda de qué trata, y te ayudamos a darla de alta en Search Console y Google Business Profile. Salir en los primeros lugares de forma orgánica toma tiempo; para resultados inmediatos se combina con Google Ads.'),
        ],
        'related': ['google-ads-chihuahua', 'branding-diseno-de-logo-chihuahua', 'chatbot-whatsapp-ia-chihuahua'],
    },
    {
        'slug': 'branding-diseno-de-logo-chihuahua',
        'nav': 'Branding y diseño de logo',
        'title': 'Branding y Diseño de Logo en Chihuahua | Identidad de Marca | CUU Marketing',
        'description': 'Branding en Chihuahua: diseño de logotipo, paleta de colores, tipografía, manual de marca y papelería para que tu negocio se vea profesional y se recuerde.',
        'service_type': 'Branding e identidad corporativa',
        'form_value': 'branding',
        'tag': 'Branding',
        'h1': 'Branding y diseño de logo',
        'h1_accent': 'en Chihuahua',
        'lead': 'Una marca clara vende más caro y se recuerda más fácil. Creamos la identidad de tu negocio para que se vea profesional en todos lados: redes, local, uniformes y anuncios.',
        'intro': [
            'Tu marca es lo primero que ve un cliente y muchas veces decide si te toma en serio. Un logo improvisado o colores distintos en cada lugar transmiten desorden.',
            'Nuestro servicio de <strong>branding en Chihuahua</strong> va más allá del <strong>diseño de logo</strong>: definimos la personalidad, el tono de voz y un sistema visual que puedes usar de forma consistente en todo lo que haces.',
        ],
        'includes': [
            ('Diagnóstico de marca', 'Entendemos tu negocio, tu cliente ideal y a tu competencia.'),
            ('Diseño de logotipo', 'Propuestas de logo con variaciones horizontal, vertical, ícono y monocromático.'),
            ('Paleta y tipografía', 'Colores y fuentes que reflejan la personalidad de tu marca.'),
            ('Manual de marca', 'Guía de uso para que cualquier diseñador o imprenta aplique tu marca correctamente.'),
            ('Papelería y aplicaciones', 'Tarjetas, hojas membretadas, plantillas para redes y más.'),
            ('Tono de voz', 'Cómo habla tu marca en redes, anuncios y atención al cliente.'),
        ],
        'ideal': ['Negocios nuevos', 'Marcas que quieren renovarse', 'Empresas que van a abrir sucursal o franquiciar', 'Productos que van a salir a tiendas'],
        'price': 'Se cotiza por proyecto según los entregables. El <strong>plan Dominator</strong> incluye branding y diseño avanzado de forma continua.',
        'faqs': [
            ('¿Cuántas propuestas de logo recibo?', 'Presentamos propuestas basadas en el diagnóstico y afinamos la elegida con rondas de cambios. El número exacto queda definido en la cotización.'),
            ('¿Me entregan los archivos editables?', 'Sí. Recibes tu logo en formatos para impresión y digital (vectores, PNG, PDF) y el manual de marca.'),
            ('¿Pueden renovar mi logo sin perder lo que ya tengo?', 'Sí. Muchas veces conviene una evolución que conserve lo que tus clientes ya reconocen, en lugar de empezar de cero.'),
        ],
        'related': ['diseno-de-paginas-web-chihuahua', 'manejo-de-redes-sociales-chihuahua', 'produccion-de-video-chihuahua'],
    },
    {
        'slug': 'produccion-de-video-chihuahua',
        'nav': 'Producción de video y foto',
        'title': 'Producción de Video y Fotografía en Chihuahua | CUU Marketing',
        'description': 'Producción audiovisual en Chihuahua: videos publicitarios, Reels, fotografía de producto y anuncios de radio para tu negocio. Grabamos en tu local o en estudio.',
        'service_type': 'Producción audiovisual y fotografía',
        'form_value': 'video',
        'tag': 'Producción audiovisual',
        'h1': 'Producción de video y fotografía',
        'h1_accent': 'en Chihuahua',
        'lead': 'El contenido que mejor vende en redes y anuncios es el video. Producimos videos, fotos y spots de radio para tu negocio sin salir de Chihuahua.',
        'intro': [
            'Los anuncios con video y fotos propias generan más confianza que las imágenes de banco. Tus clientes quieren ver tu local, tu producto y a tu equipo.',
            'Hacemos <strong>producción de video en Chihuahua</strong> pensada para marketing: cada toma se planea para funcionar en Reels, TikTok, anuncios o tu página web, con edición lista para publicar.',
        ],
        'includes': [
            ('Videos publicitarios', 'Spots para anuncios en redes y YouTube, con guion y dirección.'),
            ('Reels y TikToks', 'Videos verticales cortos con ganchos, subtítulos y música.'),
            ('Fotografía de producto', 'Fotos para catálogo, tienda en línea y redes sociales.'),
            ('Fotografía de negocio', 'Tu local, tu equipo y tus servicios, para web y redes.'),
            ('Anuncios de radio', 'Guion, locución y producción de spots de audio.'),
            ('Edición y postproducción', 'Color, sonido, subtítulos y versiones para cada formato.'),
        ],
        'ideal': ['Restaurantes y comida', 'Tiendas y marcas de producto', 'Inmobiliarias y constructoras', 'Clínicas y servicios profesionales', 'Eventos y lanzamientos'],
        'price': 'El <strong>plan Growth ($14,900 MXN/mes)</strong> incluye 2 videos para redes al mes y el <strong>plan Dominator</strong> producción audiovisual mensual. Producciones especiales se cotizan por proyecto.',
        'faqs': [
            ('¿Dónde graban?', 'En tu negocio, en exteriores de Chihuahua o en estudio, según lo que necesite el video.'),
            ('¿Cuánto tardan en entregar?', 'Los Reels y videos cortos suelen entregarse en pocos días después de la grabación; producciones más grandes se calendarizan en la propuesta.'),
            ('¿Puedo usar los videos en mis anuncios?', 'Sí. Todo lo que producimos para ti es para que lo uses en tus redes, anuncios y página web.'),
        ],
        'related': ['publicidad-en-tiktok-chihuahua', 'manejo-de-redes-sociales-chihuahua', 'publicidad-en-facebook-e-instagram-chihuahua'],
    },
    {
        'slug': 'chatbot-whatsapp-ia-chihuahua',
        'nav': 'Chatbot de WhatsApp con IA',
        'title': 'Chatbot de WhatsApp con IA para Negocios en Chihuahua | CUU Marketing',
        'description': 'Chatbots con inteligencia artificial para WhatsApp, Instagram y Messenger: responden 24/7, califican clientes y agendan citas. Automatizaciones para negocios en Chihuahua.',
        'service_type': 'Chatbots y automatización con inteligencia artificial',
        'form_value': 'ia',
        'tag': 'Inteligencia artificial',
        'h1': 'Chatbot de WhatsApp con IA',
        'h1_accent': 'para negocios en Chihuahua',
        'lead': 'Cada mensaje que tardas en contestar es un cliente que se enfría. Un asistente con inteligencia artificial responde al instante, a cualquier hora, y te pasa solo a los clientes listos para comprar.',
        'intro': [
            'Si inviertes en publicidad, los mensajes llegan a todas horas. Contestar tarde o no contestar es la forma más común de desperdiciar el presupuesto.',
            'Implementamos <strong>chatbots con IA para WhatsApp</strong>, Instagram y Messenger que responden preguntas frecuentes, dan precios, <strong>agendan citas</strong> y registran a cada cliente, con la opción de pasar la conversación a una persona cuando hace falta.',
        ],
        'includes': [
            ('Asistente con IA entrenado con tu negocio', 'Responde con tu información: servicios, precios, horarios, ubicación y políticas.'),
            ('WhatsApp, Instagram y Messenger', 'Un mismo asistente atendiendo tus canales principales.'),
            ('Calificación de clientes', 'Hace las preguntas clave y te avisa cuando un cliente está listo.'),
            ('Agenda de citas', 'Conexión con tu calendario para agendar sin ida y vuelta de mensajes.'),
            ('Registro de clientes', 'Cada contacto queda guardado en una hoja o CRM para darle seguimiento.'),
            ('Automatizaciones', 'Recordatorios, seguimiento y reportes automáticos.'),
        ],
        'ideal': ['Negocios que reciben muchos mensajes', 'Clínicas y consultorios con citas', 'Negocios que anuncian en Meta y reciben mensajes', 'Inmobiliarias y ventas con seguimiento'],
        'price': 'Incluido en el <strong>plan Dominator ($28,000 MXN/mes)</strong> o como proyecto independiente con cotización según los canales y funciones.',
        'faqs': [
            ('¿El chatbot suena como robot?', 'No debería. Lo configuramos con el tono de tu marca y con respuestas basadas en tu información real, y siempre puede pasar la conversación a una persona.'),
            ('¿Necesito WhatsApp Business API?', 'Para automatizar WhatsApp a escala sí se usa la API oficial de WhatsApp Business; te ayudamos a configurarla. Para casos más simples hay otras opciones que evaluamos contigo.'),
            ('¿Qué pasa si el cliente pregunta algo que el bot no sabe?', 'El asistente reconoce cuando no tiene la respuesta y te transfiere la conversación o toma los datos para que lo contactes.'),
        ],
        'related': ['publicidad-en-facebook-e-instagram-chihuahua', 'diseno-de-paginas-web-chihuahua', 'manejo-de-redes-sociales-chihuahua'],
    },
    {
        'slug': 'marketing-con-influencers-chihuahua',
        'nav': 'Marketing con influencers',
        'title': 'Marketing con Influencers en Chihuahua | Creadores Locales | CUU Marketing',
        'description': 'Campañas con influencers y creadores de contenido de Chihuahua: selección de perfiles, negociación, guion, publicación y medición de resultados.',
        'service_type': 'Marketing de influencers',
        'form_value': 'influencers',
        'tag': 'Influencers',
        'h1': 'Marketing con influencers',
        'h1_accent': 'en Chihuahua',
        'lead': 'La recomendación de alguien en quien confían vale más que cualquier anuncio. Conectamos tu marca con creadores de contenido de Chihuahua que hablan con tus clientes.',
        'intro': [
            'Los creadores locales tienen algo que ninguna marca puede comprar con anuncios: la confianza de su comunidad. Bien elegidos, pueden llenar tu negocio en un fin de semana.',
            'Nuestro servicio de <strong>marketing con influencers en Chihuahua</strong> se encarga de todo: encontrar perfiles con audiencia real en la ciudad, negociar, definir el mensaje y medir cuántos clientes llegaron.',
        ],
        'includes': [
            ('Mapeo de perfiles locales', 'Buscamos creadores con audiencia real en Chihuahua y revisamos su interacción.'),
            ('Negociación y contratos', 'Acordamos entregables, fechas y derechos de uso del contenido.'),
            ('Brief y guion', 'Definimos el mensaje para que sea natural y a la vez venda.'),
            ('Coordinación de visitas y publicaciones', 'Organizamos la experiencia y el calendario de publicación.'),
            ('Códigos y enlaces de seguimiento', 'Para saber cuántos clientes llegan por cada creador.'),
            ('Reporte de resultados', 'Alcance, interacción, visitas y ventas atribuidas.'),
        ],
        'ideal': ['Restaurantes y aperturas', 'Moda, belleza y estéticas', 'Eventos y lanzamientos de producto', 'Marcas que quieren llegar a público nuevo'],
        'price': 'Se cotiza por campaña según el número y alcance de los creadores. El pago a los creadores va aparte y te lo presentamos antes de confirmar.',
        'faqs': [
            ('¿Cómo saben si un influencer tiene seguidores reales?', 'Revisamos la interacción de sus publicaciones, el tipo de comentarios y, cuando es posible, las estadísticas de su audiencia (ubicación y edad) antes de proponerlo.'),
            ('¿Cuánto cobran los influencers en Chihuahua?', 'Varía mucho según el tamaño de su comunidad y el tipo de contenido. Trabajamos con presupuestos para negocios locales, incluyendo micro creadores que suelen tener muy buena interacción.'),
            ('¿Puedo usar el contenido en mis anuncios?', 'Si se negocia desde el inicio, sí. Incluimos los derechos de uso en el acuerdo cuando lo necesitas.'),
        ],
        'related': ['publicidad-en-tiktok-chihuahua', 'manejo-de-redes-sociales-chihuahua', 'produccion-de-video-chihuahua'],
    },
]

BY_SLUG = {s['slug']: s for s in SERVICES}

FORM_OPTIONS = [
    ('marketing', 'Campañas de publicidad (Meta, Google, TikTok)'),
    ('redes', 'Manejo de redes sociales'),
    ('branding', 'Branding e identidad'),
    ('web', 'Página web / tienda en línea'),
    ('video', 'Producción de video y foto'),
    ('ia', 'Chatbot y automatizaciones con IA'),
    ('influencers', 'Campaña con influencers locales'),
]

LOGO = '''<div class="logo-mark">
          <span class="logo-c">C</span><span class="logo-uu">UU</span>
        </div>
        <span class="logo-text">MARKETING</span>'''

CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'


def header():
    return f'''  <header class="nav" id="nav">
    <div class="nav__container">
      <a href="/" class="nav__logo" id="logo-link" aria-label="CUU Marketing — inicio">
        {LOGO}
      </a>
      <nav class="nav__links" id="nav-links" aria-label="Navegación principal">
        <a href="/#servicios">Servicios</a>
        <a href="/#proceso">Proceso</a>
        <a href="/#precios">Precios</a>
        <a href="/#faq">Preguntas</a>
        <a href="#contacto" class="nav__cta" data-track="cta_nav">Diagnóstico gratis</a>
      </nav>
      <button class="nav__burger" id="burger-btn" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>'''


def form(selected):
    opts = '\n'.join(
        f'                <option value="{v}"{" selected" if v == selected else ""}>{escape(t)}</option>'
        for v, t in FORM_OPTIONS)
    return f'''        <form class="contact-form" id="contact-form" novalidate>
          <p class="contact-form__title">Pide tu diagnóstico gratuito</p>
          <div class="form-group">
            <label for="form-name">Tu nombre *</label>
            <input type="text" id="form-name" name="nombre" placeholder="Ej: Juan Pérez" required autocomplete="name">
          </div>
          <div class="form-group">
            <label for="form-phone">WhatsApp *</label>
            <input type="tel" id="form-phone" name="telefono" placeholder="614 123 4567" required autocomplete="tel" inputmode="tel">
          </div>
          <div class="form-group">
            <label for="form-biz">Nombre de tu negocio *</label>
            <input type="text" id="form-biz" name="negocio" placeholder="Ej: Restaurante El Norte" required autocomplete="organization">
          </div>
          <div class="form-group">
            <label for="form-email">Email <span class="form-optional">(opcional)</span></label>
            <input type="email" id="form-email" name="email" placeholder="tu@email.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="form-service">¿Qué necesitas?</label>
            <select id="form-service" name="servicio">
              <option value="">Aún no sé, quiero asesoría</option>
{opts}
            </select>
          </div>
          <div class="form-group">
            <label for="form-msg">Cuéntanos sobre tu negocio <span class="form-optional">(opcional)</span></label>
            <textarea id="form-msg" name="mensaje" placeholder="¿A qué te dedicas? ¿Cuál es tu mayor reto para vender más?" rows="3"></textarea>
          </div>
          <div class="form-hp" aria-hidden="true">
            <label for="form-website">No llenar</label>
            <input type="text" id="form-website" name="website" tabindex="-1" autocomplete="off">
          </div>
          <p class="form__error hidden" id="form-error" role="alert"></p>
          <button type="submit" class="btn btn--primary btn--full" id="form-submit">
            <span id="form-submit-text">Quiero mi diagnóstico gratuito</span>
            <span id="form-submit-loading" class="hidden">Enviando...</span>
          </button>
          <p class="form__legal">Al enviar aceptas nuestro <a href="/aviso-de-privacidad.html">Aviso de privacidad</a>. Nunca compartimos tus datos.</p>
          <p class="form__whatsapp">
            ¿Prefieres hablar ya? Escríbenos por
            <a href="{WA}" target="_blank" rel="noopener" class="js-whatsapp" data-track="whatsapp_form">WhatsApp →</a>
          </p>
        </form>'''


def footer():
    links = '\n'.join(f'            <li><a href="/{s["slug"]}/">{escape(s["nav"])}</a></li>' for s in SERVICES)
    return f'''  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">
            <div class="logo-mark logo-mark--sm">
              <span class="logo-c">C</span><span class="logo-uu">UU</span>
            </div>
            <span class="logo-text">MARKETING</span>
          </div>
          <p>Agencia de marketing digital en Chihuahua. Campañas que venden, precios transparentes y tecnología de punta.</p>
        </div>
        <div class="footer__col">
          <h4>Servicios</h4>
          <ul>
{links}
          </ul>
        </div>
        <div class="footer__col">
          <h4>Empresa</h4>
          <ul>
            <li><a href="/#diferencia">¿Por qué nosotros?</a></li>
            <li><a href="/#proceso">Nuestro proceso</a></li>
            <li><a href="/#precios">Precios</a></li>
            <li><a href="/#faq">Preguntas frecuentes</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Contacto</h4>
          <ul class="footer__contact-list">
            <li>Chihuahua, Chih. México</li>
            <li><a href="tel:+526145148056">614 514 8056</a></li>
            <li><a href="mailto:hola@cuumarketing.com">hola@cuumarketing.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© <span id="year">2026</span> CUU Marketing. Todos los derechos reservados. Hecho con ❤️ en Chihuahua.</p>
        <div class="footer__bottom-links">
          <a href="/aviso-de-privacidad.html">Aviso de privacidad</a>
        </div>
      </div>
    </div>
  </footer>

  <a href="{WA}" class="whatsapp-float js-whatsapp" data-track="whatsapp_float" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0 0 12.05 0zm0 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.88 9.88 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
    <span class="whatsapp-float__tooltip">¡Escríbenos!</span>
  </a>'''


def schema(s, url):
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                'name': s['h1'] + ' ' + s['h1_accent'],
                'serviceType': s['service_type'],
                'description': s['description'],
                'url': url,
                'areaServed': [{'@type': 'City', 'name': c} for c in
                               ['Chihuahua', 'Ciudad Juárez', 'Delicias', 'Cuauhtémoc', 'Hidalgo del Parral']],
                'provider': {'@id': f'{SITE}/#negocio'},
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': f'{SITE}/'},
                    {'@type': 'ListItem', 'position': 2, 'name': s['nav'], 'item': url},
                ],
            },
            {
                '@type': 'FAQPage',
                'mainEntity': [
                    {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}}
                    for q, a in s['faqs']
                ],
            },
            {
                '@type': ['AdvertisingAgency', 'LocalBusiness'],
                '@id': f'{SITE}/#negocio',
                'name': 'CUU Marketing',
                'url': f'{SITE}/',
                'telephone': '+52 614 514 8056',
                'image': f'{SITE}/og-image.png',
                'address': {'@type': 'PostalAddress', 'addressLocality': 'Chihuahua',
                            'addressRegion': 'Chih.', 'addressCountry': 'MX'},
            },
        ],
    }


def page(s):
    url = f'{SITE}/{s["slug"]}/'
    intro = '\n'.join(f'          <p>{p}</p>' for p in s['intro'])
    includes = '\n'.join(f'''        <div class="svc-feature">
          <h3>{escape(t)}</h3>
          <p>{escape(d)}</p>
        </div>''' for t, d in s['includes'])
    ideal = '\n'.join(f'            <li>{CHECK}{escape(i)}</li>' for i in s['ideal'])
    faqs = '\n'.join(f'''        <details class="faq__item">
          <summary>{escape(q)}</summary>
          <p>{escape(a)}</p>
        </details>''' for q, a in s['faqs'])
    related = '\n'.join(f'''        <a href="/{r}/" class="svc-related__card">
          <span>{escape(BY_SLUG[r]["nav"])}</span>
          <span class="svc-related__arrow" aria-hidden="true">→</span>
        </a>''' for r in s['related'])
    ld = json.dumps(schema(s, url), ensure_ascii=False, indent=2)

    return f'''<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{escape(s["title"])}</title>
  <meta name="description" content="{escape(s["description"])}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0A0A0A">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="CUU Marketing">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{escape(s["title"])}">
  <meta property="og:description" content="{escape(s["description"])}">
  <meta property="og:image" content="{SITE}/og-image.png">
  <meta property="og:locale" content="es_MX">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
{ld}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <script src="/config.js"></script>
  <script src="/main.js" defer></script>
</head>
<body>
  <!-- Página generada con tools/generate_service_pages.py: edita el contenido allí. -->
{header()}

  <main>
    <section class="svc-hero">
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__orb hero__orb--1"></div>
        <div class="hero__grid"></div>
      </div>
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta">
          <a href="/">Inicio</a> <span aria-hidden="true">/</span> <span>{escape(s["nav"])}</span>
        </nav>
        <span class="section-tag">{escape(s["tag"])}</span>
        <h1 class="svc-hero__title">{escape(s["h1"])}<br><span class="gradient-text">{escape(s["h1_accent"])}</span></h1>
        <p class="svc-hero__lead">{escape(s["lead"])}</p>
        <div class="hero__actions">
          <a href="#contacto" class="btn btn--primary" data-track="cta_hero">
            <span>Quiero mi diagnóstico gratis</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="{WA}" class="btn btn--ghost js-whatsapp" target="_blank" rel="noopener" data-track="whatsapp_hero">Escríbenos por WhatsApp</a>
        </div>
        <div class="hero__trust">
          <span class="trust__item">{CHECK}Sin contratos largos</span>
          <span class="trust__item">{CHECK}Diagnóstico sin costo</span>
          <span class="trust__item">{CHECK}Respuesta en menos de 2 horas</span>
        </div>
      </div>
    </section>

    <section class="svc-section">
      <div class="container svc-intro">
        <div class="local__text">
{intro}
        </div>
      </div>
    </section>

    <section class="svc-section svc-section--alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Qué incluye</span>
          <h2 class="section-title">Todo lo necesario para<br><span class="gradient-text">que funcione</span></h2>
        </div>
        <div class="svc-features">
{includes}
        </div>
      </div>
    </section>

    <section class="svc-section">
      <div class="container svc-split">
        <div>
          <span class="section-tag">¿Es para ti?</span>
          <h2 class="section-title">Ideal para</h2>
          <ul class="svc-ideal">
{ideal}
          </ul>
        </div>
        <div class="svc-price">
          <span class="section-tag">Inversión</span>
          <h2 class="section-title">Precio claro</h2>
          <p>{s["price"]}</p>
          <a href="/#precios" class="service-card__link">Ver todos los planes →</a>
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Preguntas frecuentes</span>
          <h2 class="section-title">Dudas sobre<br><span class="gradient-text">{escape(s["nav"][0].lower() + s["nav"][1:])}</span></h2>
        </div>
        <div class="faq__list">
{faqs}
        </div>
      </div>
    </section>

    <section class="cta-final" id="contacto">
      <div class="container">
        <div class="cta-final__inner">
          <div class="cta-final__content">
            <span class="section-tag">¿Listo para crecer?</span>
            <h2 class="cta-final__title">Hablemos de tu negocio<br><span class="gradient-text">hoy mismo</span></h2>
            <p>Diagnóstico gratuito. Sin compromisos. Te decimos con honestidad si podemos ayudarte.</p>
            <div class="svc-related">
              <p class="svc-related__label">También te puede interesar</p>
{related}
            </div>
          </div>
{form(s["form_value"])}
        </div>
      </div>
    </section>
  </main>

{footer()}
</body>
</html>
'''


def sitemap():
    urls = [(f'{SITE}/', 'weekly', '1.0')]
    urls += [(f'{SITE}/{s["slug"]}/', 'monthly', '0.8') for s in SERVICES]
    urls += [(f'{SITE}/aviso-de-privacidad.html', 'yearly', '0.2')]
    body = '\n'.join(f'''  <url>
    <loc>{u}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{f}</changefreq>
    <priority>{p}</priority>
  </url>''' for u, f, p in urls)
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
'''


if __name__ == '__main__':
    for s in SERVICES:
        out = ROOT / s['slug'] / 'index.html'
        out.parent.mkdir(exist_ok=True)
        out.write_text(page(s), encoding='utf-8')
        print('✓', out.relative_to(ROOT))
    (ROOT / 'sitemap.xml').write_text(sitemap(), encoding='utf-8')
    print('✓ sitemap.xml')
