/* ================================================
   CUU MARKETING — Configuración de reseñas Google
   Edita SOLO este archivo para conectar tu perfil.
   ================================================ */

window.CUU_REVIEWS = {
  // Place ID de tu Perfil de Negocio en Google.
  // Búscalo en: https://developers.google.com/maps/documentation/places/web-service/place-id
  placeId: 'REEMPLAZA_CON_TU_PLACE_ID',

  // Opcional: el enlace corto que da Google Business ("Pedir reseñas"),
  // p. ej. 'https://g.page/r/XXXXXXXXXXXX/review'. Si lo llenas, tiene prioridad.
  googleShortLink: '',

  // Smart link público que compartes con tus clientes.
  smartLink: 'https://cuumarketing.mx/resena/',
};

window.CUU_REVIEWS.reviewUrl = (function () {
  const cfg = window.CUU_REVIEWS;
  if (cfg.googleShortLink) return cfg.googleShortLink;
  return 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(cfg.placeId);
})();
