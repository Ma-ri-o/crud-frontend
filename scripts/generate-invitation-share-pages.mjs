import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = new URL('../', import.meta.url);
const eventsRoot = new URL('public/config/events/', projectRoot);
const outputRoot = new URL('dist/invitation-studio/browser/', projectRoot);
const catalog = JSON.parse(await readFile(new URL('index.json', eventsRoot), 'utf8'));
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

const builtIndex = await readFile(new URL('index.html', outputRoot), 'utf8');

for (const template of catalog.templates ?? []) {
  if (!/^[a-z0-9-]{1,64}$/.test(template.slug)) {
    throw new Error(`Slug inválido en catálogo al generar metadata: ${template.slug}`);
  }

  const event = JSON.parse(await readFile(new URL(`${template.slug}.json`, eventsRoot), 'utf8'));
  const title = event.seo?.title || event.title;
  const description = event.seo?.description || event.description;
  const image = event.seo?.image
    ? origin ? new URL(event.seo.image, origin).toString() : event.seo.image
    : undefined;
  const eventUrl = origin ? new URL(`/i/${template.slug}`, origin).toString() : `/i/${template.slug}`;
  let html = builtIndex.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)}</title>`);

  for (const [key, value] of [
    ['name|description', description],
    ['property|og:title', title],
    ['property|og:description', description],
    ['property|og:site_name', event.hostName || title],
    ['property|og:url', eventUrl],
    ['name|twitter:title', title],
    ['name|twitter:description', description],
  ]) {
    const [attribute, metaKey] = key.split('|');
    html = updateMeta(html, attribute, metaKey, value);
  }

  if (image) {
    html = updateMeta(html, 'property', 'og:image', image);
    html = updateMeta(html, 'property', 'og:image:alt', title);
    html = updateMeta(html, 'property', 'og:image:type', image.split('?')[0].endsWith('.png') ? 'image/png' : 'image/jpeg');
    html = updateMeta(html, 'name', 'twitter:image', image);
    html = updateMeta(html, 'name', 'twitter:card', 'summary_large_image');
  }

  const shareDirectory = new URL(`i/${template.slug}/`, outputRoot);
  await mkdir(shareDirectory, { recursive: true });
  await writeFile(new URL('index.html', shareDirectory), html, 'utf8');
}

console.log(`Páginas estáticas con metadata social: ${(catalog.templates ?? []).length}`);
