# Contrato y publicación de invitaciones

## Estructura de archivos

- `public/config/events/index.json`: catálogo público (`templates[]`).
- `public/config/events/<slug>.json`: configuración declarativa fuente.
- `src/app/core/invitation.models.ts`: tipos TS de ejecución.
- `src/app/core/event-config.service.ts`: carga HTTP, validación esencial, vista previa, importación/exportación.

El `slug` debe ser único, minúsculo, con dígitos/guiones y máximo 64 caracteres. El nombre del archivo, slug del JSON y clave del catálogo deben coincidir.

## Publicación

1. Abre `/studio` y selecciona una plantilla o crea un borrador.
2. Actualiza copy, fecha, ubicación, tema, colores y secciones.
3. Añade rutas locales de imágenes/audio a recursos bajo `public/`.
4. Pulsa **Guardar vista previa** y revisa `/i/<slug>` en este navegador.
5. Exporta el JSON. Agrégalo a `public/config/events/<slug>.json` y una entrada a `index.json`.
6. Ejecuta `npm run check:config` y `npm run build`; publica el artifact de producción.

Guardar solo almacena una clave `invitation-studio.preview.<slug>` en localStorage. No altera los archivos de servidor y solo el navegador actual lee ese borrador. Los borradores no se envían a terceros.

## Secciones, medios, RSVP

`sections` usa claves booleanas. `story`, `gallery` y `timeline` son arreglos independientes. `music.enabled` y `rsvp.enabled` deben coincidir con el flag de sección correspondiente. En el editor visual las historias y fotos se pegan como arreglos JSON, o se usa el editor de JSON completo. Valida textos alt, HTTPS externo, rutas locales y autorización de los archivos.

`rsvp.whatsappNumber` es un destino en dígitos con código de país, sin `+`, espacios ni guiones. El prototipo no persiste respuestas ni reserva automáticamente.
