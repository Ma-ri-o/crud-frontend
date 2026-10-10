# PWA, SEO y servicios externos

## PWA

En producción, `provideServiceWorker` registra `ngsw-worker.js`. `ngsw-config.json` usa:

- Prefetch: documento, bundles, icono, manifest y configs de invitación.
- Lazy media cache: `/images/**`, `/music/**`.
- `dataGroup` freshness con retención temporal y tamaño acotado para APIs Jikan y PokéAPI.

Cambios en assets se resuelven con hashing del build. El hosting debe permitir SPA fallback para URLs `/i/<slug>`.

## Integraciones

Jikan y PokéAPI no requieren claves y solo se consultan por interacción tras habilitar la sección. Sus términos, disponibilidad, CORS y rate limit son externos a este repositorio. No se transfiere información del RSVP a estas APIs. Si falla una petición, la invitación sigue visible.

QRServer genera PNG remoto con el URL de invitación como valor. Para despliegues sin dependencia externa, se puede reemplazar por generación SVG/Canvas local y añadir su biblioteca en un chunk lazy.

## SEO / SSR

El SEO de cliente incluye metadata por evento y Schema.org. Los crawlers que ejecuten JavaScript pueden leerlo; para HTML metadata por slug antes de bootstrap, SSR/prerender es recomendado. Añade un dominio real y canonical/OG absolute URLs tras su confirmación. No agregues reviews o dirección de negocio estructurada si no son datos verificados.
