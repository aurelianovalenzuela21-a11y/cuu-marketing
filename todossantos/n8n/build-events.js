// Convierte los eventos de Google Calendar al formato de data/events.json.
// Convención para el equipo (en la descripción del evento, una línea por campo):
//   artista: Grupo La Suerte
//   tipo: musica | concurso | especial
//   cover: $100
//   flyer: https://...   (opcional; si no, se usa el archivo adjunto de Drive)
// Todo lo demás de la descripción se muestra como texto del evento.

const FIELD = /^\s*(artista|tipo|cover|flyer)\s*:\s*(.+)$/i;
const TYPES = ['musica', 'concurso', 'especial'];

function stripHtml(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function driveImage(url) {
  const m = String(url || '').match(/(?:\/d\/|id=)([\w-]{20,})/);
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200` : (url || '');
}

function guessType(title) {
  const t = title.toLowerCase();
  if (t.includes('destape') || t.includes('concurso')) return 'concurso';
  if (t.includes('vivo') || t.includes('música') || t.includes('musica')) return 'musica';
  return 'especial';
}

const events = [];
for (const { json: ev } of $input.all()) {
  if (!ev.id || ev.status === 'cancelled') continue;

  const fields = {};
  const rest = [];
  for (const line of stripHtml(ev.description).split('\n')) {
    const m = line.match(FIELD);
    if (m) fields[m[1].toLowerCase()] = m[2].trim();
    else if (line.trim()) rest.push(line.trim());
  }

  const startRaw = ev.start?.dateTime || ev.start?.date || '';
  const image = (ev.attachments || []).find((a) => (a.mimeType || '').startsWith('image/'));
  const type = (fields.tipo || '').toLowerCase().replace('ú', 'u');
  const title = ev.summary || 'Evento';

  events.push({
    id: ev.id,
    date: startRaw.slice(0, 10),
    start: ev.start?.dateTime ? startRaw.slice(11, 16) : '',
    title,
    type: TYPES.includes(type) ? type : guessType(title),
    artist: fields.artista || '',
    cover: fields.cover || '',
    description: rest.join(' '),
    flyer: driveImage(fields.flyer || image?.fileUrl || ''),
  });
}

events.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

return [{ json: { events } }];
