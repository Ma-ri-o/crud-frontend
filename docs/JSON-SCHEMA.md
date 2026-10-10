# Contrato JSON de invitación

## Ubicación y ciclo de vida

- Catálogo: [`public/config/events/index.json`](../public/config/events/index.json).
- Documentos: `public/config/events/<slug>.json`.
- Modelo TypeScript: `src/app/core/invitation.models.ts` (`EventConfig`).
- Carga y validación: `src/app/core/event-config.service.ts`.
- Validador de catálogo/archivos: `npm run check:config`.

El formato vigente es `schemaVersion: 1`. El tipo TypeScript aporta seguridad durante compilación y `EventConfigService` hace comprobaciones de runtime. El validador CLI verifica sincronía básica catálogo/archivos; ninguno equivale a JSON Schema formal. Revisa también el checklist manual al final antes de publicar.

## Propiedades del contrato

| Campo | Forma | Obligatorio / reglas |
| --- | --- | --- |
| `schemaVersion` | entero literal | Obligatorio; debe ser `1`. |
| `slug` | string | Obligatorio; `^[a-z0-9-]{1,64}$`; coincide con catálogo y archivo. |
| `eventType` | enum | `birthday`, `wedding`, `anniversary`, `graduation`, `custom`. |
| `title`, `subtitle`, `description` | string | Presentación y texto de descripción. |
| `date` | string | `YYYY-MM-DD` o vacío. |
| `time` | string | `HH:mm` 24 horas o vacío. |
| `timezone` | string | Nombre IANA, por ejemplo `America/Mexico_City`. |
| `location`, `address`, `mapUrl` | string | Ubicación; confirmar datos antes de publicar. |
| `theme` | `ThemeId` | `elegant`, `luxury`, `floral`, `kids`, `minions`, `superheroes`, `princess`, `space`, `safari`, `mexican`. |
| `colors` | objeto opcional | `primary`, `accent`, `background`, `text`, `surface`; valores hexadecimales. |
| `heroImage` | string opcional | URL pública de portada. |
| `hostName` | string | Nombre del anfitrión/negocio. |
| `sections` | `Record<SectionId, boolean>` | Flags: `countdown`, `story`, `details`, `gallery`, `map`, `gifts`, `rsvp`, `timeline`, `music`, `openData`. |
| `story` | `{title, body, date?, image?}[]` | `title` y `body` requeridos por runtime. |
| `gallery` | `{src, alt, caption?}[]` | `src` y `alt` requeridos por runtime. |
| `timeline` | `{time, title, description?}[]` | `time` y `title` requeridos por runtime. |
| `music` | `{enabled, src, title}` | Los tres campos son requeridos. |
| `gifts` | `{enabled, message, links}` | `links` es una lista de `{label, url}`. |
| `rsvp` | `{enabled, deadline?, whatsappNumber?, fields, successMessage}` | `fields` debe ser arreglo. La persistencia no está implementada. |
| `openData` | `{enabled, jikan, pokeApi}` | Flags booleanos de integración. |
| `seo` | `{title, description, image?}` | `title` y `description` se validan como requeridos. |

Las propiedades indicadas como obligatorias por el modelo deben incluirse en el documento. `date`, `time`, `address` y campos opcionales pueden tener una cadena vacía cuando el dato no esté disponible.

## Ejemplo: Emiliano Ulises

La configuración íntegra, que evita duplicar aquí todos los campos, está en [`emiliano-ulises.json`](../public/config/events/emiliano-ulises.json). Sus rasgos:

- `eventType: "birthday"` y `theme: "kids"`.
- Localidad confirmada: Cocotitlán, Estado de México.
- Fecha, hora y dirección exacta vacías: no se inventan.
- Countdown deshabilitado hasta completar la fecha.
- RSVP habilitado, con nombre/asistencia y campos opcionales de acompañantes/comentarios.
- El mensaje RSVP deja claro que el usuario debe enviar la respuesta por WhatsApp; no hay persistencia en servidor.

## Flags, secciones y campos dinámicos

Una sección normalmente requiere el flag y contenido. Ejemplo: cuenta regresiva requiere `sections.countdown: true` y `date` no vacía. Música requiere `sections.music`, `music.enabled` y `music.src`. RSVP requiere `sections.rsvp` y `rsvp.enabled`.

`rsvp.fields` no configura campos arbitrarios ni cambia las validaciones: hoy `name` y `attending` siempre se muestran y son requeridos; `guests` y `comments` controlan campos opcionales. Agregar nuevos campos implica extender el formulario y el generador de mensaje.

## Catálogo

Cada registro de `index.json.templates` tiene `slug`, `title`, `description`, `eventType`, `theme` y `preview`. Debe existir exactamente un archivo `<slug>.json` con el mismo slug. El validador falla si un JSON de evento no está listado o un registro apunta a un archivo ausente.

## Versionado y migraciones

No cambies silenciosamente la semántica de `schemaVersion`. Para una versión incompatible:

1. Diseña campos y reglas con PO/QA.
2. Añade una migración o un parser explícito para la versión previa.
3. Migra ambos ejemplos y documentos publicados.
4. Actualiza TypeScript, runtime validator, CLI validator y estas guías.
5. Prueba JSON válido, inválido, slug incorrecto y flags inconsistentes.

Actualmente el servicio solo acepta `schemaVersion: 1`; no hay migrador automático.
