import { readFile, writeFile } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const event = JSON.parse(await readFile(new URL('public/data/event.json', projectRoot), 'utf8'));
const indexUrl = new URL('dist/emiliano-invitation/browser/index.html', projectRoot);
const originValue = process.env.INVITATION_SITE_ORIGIN
  || process.env.VERCEL_PROJECT_PRODUCTION_URL
  || process.env.VERCEL_URL
  || process.env.URL;
const origin = originValue
  ? new URL(originValue.includes('://') ? originValue : `https://${originValue}`).origin
  : undefined;

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function updateMeta(html, attribute, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}="${escapedKey}")[^>]*>`, 'i');
  const tag = html.match(tagPattern)?.[0];
  const content = escapeAttribute(value);
  if (tag) {
    return html.replace(tagPattern, tag.replace(/\bcontent="[^"]*"/i, `content="${content}"`));
  }
  return html.replace('</head>', `  <meta ${attribute}="${escapeAttribute(key)}" content="${content}">\n</head>`);
}

const title = event.seo?.title || event.title;
const description = event.seo?.description || event.description;
const imagePath = event.seo?.image;
const image = imagePath && origin ? new URL(imagePath, origin).toString() : imagePath;
const eventUrl = origin ? new URL('/', origin).toString() : '/';
let html = await readFile(indexUrl, 'utf8');
html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)}</title>`);

for (const [attribute, key, value] of [
  ['name', 'description', description],
  ['name', 'theme-color', event.colors?.primary || '#1565C0'],
  ['property', 'og:title', title],
  ['property', 'og:description', description],
  ['property', 'og:site_name', event.hostName || title],
  ['property', 'og:url', eventUrl],
  ['property', 'og:image', image],
  ['property', 'og:image:alt', title],
  ['property', 'og:image:type', imagePath?.split('?')[0].endsWith('.png') ? 'image/png' : 'image/jpeg'],
  ['name', 'twitter:title', title],
  ['name', 'twitter:description', description],
  ['name', 'twitter:image', image],
  ['name', 'twitter:card', image ? 'summary_large_image' : 'summary'],
]) {
  if (value) html = updateMeta(html, attribute, key, value);
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.title,
  description,
  startDate: `${event.date}T${event.time}:00`,
  location: {
    '@type': 'Place',
    name: event.location,
    address: event.address,
  },
  organizer: {
    '@type': 'Organization',
    name: event.hostName,
  },
};
const schemaTag = `<script id="invitation-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
html = html.replace(/<script id="invitation-schema" type="application\/ld\+json">[\s\S]*?<\/script>/i, schemaTag);

await writeFile(indexUrl, html, 'utf8');

const manifestUrl = new URL('dist/emiliano-invitation/browser/manifest.webmanifest', projectRoot);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
manifest.name = title;
manifest.short_name = title;
manifest.description = description;
manifest.background_color = event.colors?.background || '#FFFFFF';
manifest.theme_color = event.colors?.primary || '#1565C0';
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Metadatos sociales y SEO generados para ${event.slug}`);
