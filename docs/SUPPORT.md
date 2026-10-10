# Soporte técnico

## Recolección inicial

Solicita versión/entorno, URL de la ruta afectada, navegador/dispositivo, pasos reproducibles, hora/zona horaria, cambio/despliegue reciente y captura de Console/Network. No pidas ni publiques RSVP, teléfonos, direcciones privadas, tokens ni datos de invitados. Confirma primero si el incidente es local, de un navegador con borrador, de CDN/hosting o general.

## Matriz de diagnóstico

| Síntoma | Causa posible | Diagnóstico | Solución |
| --- | --- | --- | --- |
| No instala dependencias | Node/npm fuera de engines, red/proxy, caché corrupta o lockfile inconsistente | `node -v`, `npm -v`, salida completa de `npm ci`, configuración de proxy corporativo | Usa versión compatible, verifica acceso al registry y ejecuta `npm ci`; no borres lockfile como primer paso. |
| Proyecto no compila | Error TS/template, versión incompatible o configuración incompleta | `npm run check:config`; `npm run build:production`; copia el primer error del compilador | Corrige error raíz; al agregar campo/tema actualiza tipos, allowlists, JSON y docs. |
| `ng serve` no inicia | Dependencias ausentes, puerto 4200 ocupado o instalación parcial | `npm ci`, revisa mensaje `EADDRINUSE`, prueba puerto alternativo de Angular CLI | Libera/cambia el puerto de forma segura, reinstala solo si el diagnóstico apunta a instalación. |
| Build falla por budgets | Bundles/SCSS crecieron o recurso excede límite | Revisa módulo/estilo reportado y tamaño inicial/lazy del build | Optimiza y lazy-load antes de aumentar budgets; justificar cualquier cambio de umbral. |
| Catálogo vacío/no carga | `index.json` ausente, URL/base path incorrectos, JSON inválido o HTTP no exitoso | DevTools Network: `/config/events/index.json`; `npm run check:config` | Corrige ruta/nombre y república el JSON; verifica que hosting copie `public`. |
| Invitación no abre | fallback SPA incorrecto, slug inválido, archivo JSON ausente o slug discordante | Network: document y `/config/events/<slug>.json`; compara URL, catálogo y archivo | Configura fallback `index.html` sin interceptar JSON; corrige slug/archivo y despliega. |
| La versión publicada no refleja cambios | caché del navegador/SW o borrador local anterior | Prueba ventana privada; compara contenido de Network; mira `localStorage` con key del slug | En editor usa **Restaurar publicada**; limpia datos del sitio/SW con consentimiento y valida deploy/CDN. |
| Falla `npm run check:config` | Slug duplicado/incorrecto, archivo faltante, documento no listado o arrays inválidos | Lee el slug del error y revisa `index.json`/JSON homónimo | Corrige sincronía catálogo-archivo; vuelve a validar. |
| Imagen no aparece | Ruta incorrecta, case/extensión diferente, asset no desplegado o URL externa caída | Abre `/images/...` directamente y revisa status/content type/Console | Usa ruta desde raíz `/images/...`, respeta mayúsculas/minúsculas, añade el asset a `public` y república. |
| Música no suena | Flags apagados, `src` vacío, códec no soportado, HTTP 404 o autoplay esperado | Revisa `sections.music`, `music.enabled`, `src`, Network y controles del navegador | Habilita ambos flags, añade archivo/licencia correcta y prueba interacción manual en navegador objetivo. |
| QR no carga/no se escanea | QRServer bloqueado, falta internet, URL incorrecta o imagen cacheada | Inspecciona `img` en Network y prueba la URL enlazada; escanea desde otro dispositivo | Verifica dominio/ruta HTTPS y servicio externo. Si QR externo no es aceptable, requiere implementar generador local. |
| WhatsApp genera mensaje incorrecto | Número con formato incorrecto, campo no incluido o expectativa de envío automático | Inspecciona valor `rsvp.fields`, `whatsappNumber`, asistencia y `responseUrl()` localmente | Usa código de país y dígitos; habilita los campos deseados. Invitado debe pulsar **Enviar respuesta por WhatsApp** y luego enviar dentro de WhatsApp. |
| No aparece campo RSVP | `sections.rsvp` o `rsvp.enabled` en falso; flag en `fields` ausente | Inspecciona JSON efectivo, incluyendo borrador local | Habilita ambos; `name`/asistencia siempre aparecen, `guests` y `comments` dependen de `fields`. |
| Countdown ausente/terminado | Flag apagado, fecha vacía/formato incorrecto, fecha vencida o timezone inválido | Revisa `date`, `time`, `timezone` y fecha real | Configura fecha ISO futura y zona IANA; valida dispositivos y transición de horario. |
| SEO/social preview incorrecto | SSR ausente, metadata solo cliente o cache del crawler | Revisa `<title>`, meta tags después de cargar; prueba crawler y respuesta HTML original | SSR/prerender no está habilitado. Requiere decisión de arquitectura y regenerar cache del proveedor. |

## Capturar errores útiles

- Build: conserva primer error con nombre de archivo/línea y versión de Node/npm.
- Browser: status HTTP, URL sin query privada, error de consola, navegador y modo (PWA/normal).
- Hosting: deployment ID, timestamp y status de archivos estáticos.
- Nunca adjuntes `.env`, datos privados o export JSON con teléfonos/direcciones reales a canales públicos.
