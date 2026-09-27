/* ================================================
   CUU MARKETING — config.js
   Único archivo que necesitas editar para conectar
   WhatsApp, recepción de leads y píxeles de publicidad.
   ================================================ */

window.CUU_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  whatsapp: '526145148056',

  // URL que recibe los leads del formulario como JSON (POST).
  // Sirve un webhook de n8n, Make, Zapier, Formspree, Google Apps Script, etc.
  // Si se deja vacío, el formulario abre WhatsApp con los datos del cliente ya escritos.
  leadEndpoint: '',

  // ID del Píxel de Meta (Facebook / Instagram Ads). Ej: '123456789012345'
  metaPixelId: '',

  // ID de medición de Google Analytics 4 / Google Ads. Ej: 'G-XXXXXXXXXX' o 'AW-XXXXXXXXX'
  googleTagId: '',

  // ID y etiqueta de conversión de Google Ads para el lead. Ej: 'AW-XXXXXXXXX/AbCdEfGhIj'
  googleAdsLeadConversion: '',

  // ID del Píxel de TikTok. Ej: 'CXXXXXXXXXXXXXXXXXXX'
  tiktokPixelId: '',

  // Perfiles de redes sociales. Los que queden vacíos no se muestran en el pie de página.
  social: {
    facebook:  '', // Ej: 'https://facebook.com/cuumarketing'
    instagram: '', // Ej: 'https://instagram.com/cuumarketing'
    tiktok:    '', // Ej: 'https://tiktok.com/@cuumarketing'
    linkedin:  '', // Ej: 'https://linkedin.com/company/cuumarketing'
  },
};
