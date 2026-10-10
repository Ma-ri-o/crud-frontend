import { readFile } from 'node:fs/promises';

const dataRoot = new URL('../public/', import.meta.url);
const event = JSON.parse(await readFile(new URL('data/event.json', dataRoot), 'utf8'));

for (const key of ['schemaVersion', 'slug', 'eventType', 'title', 'subtitle', 'theme', 'sections', 'gallery', 'rsvp', 'gifts', 'seo']) {
  if (!(key in event)) throw new Error(`Falta el campo requerido "${key}" en data/event.json`);
}

if (event.schemaVersion !== 1) throw new Error('schemaVersion debe ser 1.');
if (!/^[a-z0-9-]{1,64}$/.test(event.slug)) throw new Error('El slug solo puede contener minúsculas, números y guiones.');
if (!event.heroImage || !event.heroImageAlt || !Number.isInteger(event.heroImageWidth) || !Number.isInteger(event.heroImageHeight)) {
  throw new Error('La imagen principal requiere ruta, texto alternativo y dimensiones enteras.');
}
if (!Array.isArray(event.gallery) || event.gallery.length < 5 || event.gallery.length > 10) {
  throw new Error('La galería debe contener entre 5 y 10 imágenes.');
}
if (event.gallery.some((photo) => !photo.src || !photo.alt || !Number.isInteger(photo.width) || !Number.isInteger(photo.height))) {
  throw new Error('Cada imagen de galería requiere ruta, texto alternativo y dimensiones enteras.');
}

for (const image of [event.heroImage, event.heroSecondaryImage, ...event.gallery.map((photo) => photo.src)]) {
  if (image?.startsWith('/') && !image.startsWith('//')) {
    try {
      await readFile(new URL(image.slice(1), dataRoot));
    } catch {
      throw new Error(`No se encuentra la imagen ${image}`);
    }
  }
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) throw new Error('La fecha debe usar formato YYYY-MM-DD.');
if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) throw new Error('La hora debe usar formato de 24 horas HH:mm.');
if (!/^\d{10,15}$/.test(event.rsvp.whatsappNumber)) throw new Error('whatsappNumber debe incluir prefijo internacional y solo dígitos.');
if (event.rsvp.enabled && !event.rsvp.eventName) throw new Error('rsvp.eventName es obligatorio cuando RSVP está habilitado.');
for (const color of Object.values(event.colors ?? {})) {
  if (color && !/^#[\da-f]{3,8}$/i.test(color)) throw new Error('Los colores deben usar formato hexadecimal.');
}

console.log(`Configuración válida: ${event.slug}; ${event.gallery.length} imágenes en galería`);
