# Configuración de invitaciones

## Fuentes y precedencia

1. En `/i/:slug`, `EventConfigService` busca primero un borrador válido `invitation-studio.preview.<slug>` en `localStorage` del navegador.
2. Si no existe, carga `/config/events/<slug>.json`.
3. El catálogo público se obtiene de `/config/events/index.json`.
4. El editor mantiene cambios en memoria hasta guardar la vista previa o exportar.

Un borrador local puede ocultar temporalmente el JSON recién publicado en ese navegador. Usa **Restaurar publicada** o limpia el almacenamiento del sitio para diagnosticarlo.

## Propiedades de nivel superior

“Requerido” describe el contrato TypeScript y/o la validación de runtime actual. Aunque algunas cadenas puedan estar vacías, se deben incluir para respetar `EventConfig`.

| Propiedad | Descripción | Tipo | Requerido | Valor por defecto/ejemplo |
| --- | --- | --- | --- | --- |
| `schemaVersion` | Versión del contrato. Actualmente solo se acepta `1`. | `1` | Sí | `1` |
| `slug` | Identificador y nombre de archivo, minúsculas/números/guiones, hasta 64 caracteres. | string | Sí | `"emiliano-ulises"` |
| `eventType` | Tipo semántico del evento. | enum | Sí | `"birthday"` |
| `title` | Título visible y encabezado. | string | Sí | `"Cumpleaños de Emiliano Ulises"` |
| `subtitle` | Frase secundaria. | string | Sí | `"¡Estás invitado a celebrar!"` |
| `description` | Descripción para UI/SEO fallback. | string | Sí por modelo | Texto del evento |
| `date` | Fecha ISO `YYYY-MM-DD`; vacía significa por definir. | string | Sí por modelo | `""` |
| `time` | Hora `HH:mm` de 24 horas; vacía significa no especificada. | string | Sí por modelo | `""` |
| `timezone` | Zona IANA usada por cuenta regresiva. | string | Sí por modelo | `"America/Mexico_City"` |
| `location` | Nombre de lugar o localidad. | string | Sí por modelo | `"Cocotitlán, Estado de México"` |
| `address` | Dirección detallada; no inventarla. | string | Sí por modelo | `""` |
| `mapUrl` | URL que abre ubicación externa. | string | Sí por modelo | URL de búsqueda de Maps |
| `theme` | Identificador existente en el registro de temas. | `ThemeId` | Sí | `"kids"` |
| `colors` | Overrides de tokens de color. | objeto opcional | No | `{"primary":"#174d3a"}` |
| `heroImage` | Ruta pública/URL de la imagen principal. | string opcional | No | `"/images/mariachi/mariachi-presentacion.jpeg"` |
| `hostName` | Anfitrión o entidad comercial. | string | Sí por modelo | `"Familia de Emiliano"` |
| `sections` | Flags para mostrar secciones. Ver tabla de secciones. | objeto booleano | Sí | Detalles y RSVP según evento |
| `story` | Lista de bloques de historia. | `EventStory[]` | Sí, arreglo | `[]` |
| `gallery` | Fotografías, texto alternativo y caption. | `EventPhoto[]` | Sí, arreglo | `[]` |
| `timeline` | Agenda del evento. | `EventTimelineItem[]` | Sí, arreglo | `[]` |
| `music` | Estado y ubicación del reproductor. | objeto | Sí | Deshabilitada |
| `gifts` | Mensaje y enlaces de regalos. | objeto | Sí | Deshabilitados |
| `rsvp` | Formulario, campos y destino WhatsApp. | objeto | Sí | Depende de plantilla |
| `openData` | Flags para Jikan y PokéAPI. | objeto | Sí | Todo deshabilitado |
| `seo` | Title, descripción e imagen social opcional. | objeto | Sí | Debe contener `title` y `description` |

El “default” de esta tabla es una convención de los ejemplos/editor, no un mecanismo de normalización general. El loader valida, no completa de forma universal campos omitidos.

## Secciones

Todas las claves booleanas del contrato se incluyen en cada JSON:

| Flag | Renderizado cuando está activo |
| --- | --- |
| `countdown` | Cuenta regresiva; además requiere `date`. |
| `story` | Historia; además requiere al menos un elemento en `story`. |
| `details` | Fecha, hora, ubicación y anfitrión. |
| `gallery` | Galería; además requiere fotos en `gallery`. |
| `map` | Enlace a Maps dentro de detalles; requiere `details` y `mapUrl`. |
| `gifts` | Regalos; además `gifts.enabled`. |
| `rsvp` | RSVP; además `rsvp.enabled`. |
| `timeline` | Agenda; además requiere elementos. |
| `music` | Reproductor; además `music.enabled` y `music.src`. |
| `openData` | Integración; además `openData.enabled` y al menos un proveedor. |

Los flags de sección no sustituyen las propiedades `enabled` de música, regalos, RSVP y APIs. Mantén ambos consistentes.

## Propiedades compuestas

### `colors`

| Campo | Tipo | Requerido | Default |
| --- | --- | --- | --- |
| `primary` | color hexadecimal | No | Color del tema |
| `accent` | color hexadecimal | No | Color del tema |
| `background` | color hexadecimal | No | Color del tema |
| `text` | color hexadecimal | No | Color del tema |
| `surface` | color hexadecimal | No | Color del tema |

### `story[]`, `gallery[]`, `timeline[]`

| Lista | Campos | Requeridos por elemento | Default |
| --- | --- | --- | --- |
| `story` | `title`, `body`, `date?`, `image?` | `title`, `body` | `[]` |
| `gallery` | `src`, `alt`, `caption?` | `src`, `alt` | `[]` |
| `timeline` | `time`, `title`, `description?` | `time`, `title` | `[]` |

Usa rutas absolutas desde `public`, por ejemplo `/images/events/foto.webp`; cada imagen debe tener `alt` útil.

### `music`

| Campo | Tipo | Requerido | Default |
| --- | --- | --- | --- |
| `enabled` | boolean | Sí | `false` en plantillas |
| `src` | ruta/URL | Sí | `""` |
| `title` | string | Sí | Título configurable |

No hay autoplay. Se recomienda audio local con licencia, `preload="none"` y controles nativos.

### `gifts`

| Campo | Tipo | Requerido | Default |
| --- | --- | --- | --- |
| `enabled` | boolean | Sí | `false` |
| `message` | string | Sí | Mensaje editable |
| `links` | `{label, url}[]` | Sí | `[]` |

### `rsvp`

| Campo | Tipo | Requerido | Default |
| --- | --- | --- | --- |
| `enabled` | boolean | Sí | Según plantilla |
| `deadline` | fecha opcional | No | Sin fecha límite aplicada |
| `whatsappNumber` | string opcional, internacional, solo dígitos recomendado | No | Sin enlace de envío |
| `fields` | `string[]` | Sí | `["name","attending","guests","comments"]` |
| `successMessage` | string | Sí | Mensaje editable |

Actualmente el renderer siempre solicita nombre y asistencia. `fields` controla específicamente si aparecen acompañantes (`guests`) y comentario (`comments`). `deadline` se conserva en el documento, pero no bloquea respuestas en la UI.

### `openData` y `seo`

`openData` contiene `enabled`, `jikan` y `pokeApi`, todos booleanos. Para que se muestre un proveedor también debe estar habilitada la sección `sections.openData`.

`seo.title` y `seo.description` son requeridos por runtime; `seo.image` es opcional y debe apuntar a un recurso publicable. SEO se aplica en el cliente y no reemplaza SSR.

## Checklist antes de guardar/publicar

- [ ] `slug` único y coincide con nombre de archivo.
- [ ] `theme` es uno de los identificadores registrados.
- [ ] Fecha/hora tienen formato válido o quedan vacías.
- [ ] Flags de sección y propiedades `enabled` son coherentes.
- [ ] Los elementos tienen sus campos requeridos.
- [ ] Las rutas de medios existen y los assets tienen permisos.
- [ ] Datos personales, teléfono y dirección fueron confirmados por el responsable.
- [ ] `npm run check:config` y build pasan.
