import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = new URL('../public/config/events/', import.meta.url);
const index = JSON.parse(await readFile(new URL('index.json', root), 'utf8'));
const slugs = new Set();
for (const entry of index.templates ?? []) {
  if (!/^[a-z0-9-]{1,64}$/.test(entry.slug)) throw new Error(`Slug inválido: ${entry.slug}`);
  if (slugs.has(entry.slug)) throw new Error(`Slug repetido: ${entry.slug}`);
  slugs.add(entry.slug);
  const event = JSON.parse(await readFile(new URL(`${entry.slug}.json`, root), 'utf8'));
  for (const key of ['schemaVersion','slug','eventType','title','subtitle','theme','sections','story','gallery','timeline','rsvp','music','seo']) {
    if (!(key in event)) throw new Error(`${entry.slug}: falta ${key}`);
  }
  if (event.slug !== entry.slug) throw new Error(`${entry.slug}: el slug del JSON no coincide`);
  if (!Array.isArray(event.gallery) || !Array.isArray(event.story) || !Array.isArray(event.timeline)) throw new Error(`${entry.slug}: story, gallery y timeline deben ser arreglos`);
}
const files = (await readdir(root)).filter((file) => file.endsWith('.json') && file !== 'index.json');
for (const file of files) if (!slugs.has(file.slice(0,-5))) throw new Error(`Configuración fuera del catálogo: ${file}`);
console.log(`Configuraciones válidas: ${[...slugs].join(', ')}`);
