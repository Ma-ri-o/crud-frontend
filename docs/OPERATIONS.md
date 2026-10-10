# Operación y publicación

## Crear una invitación

1. Ejecuta la app y abre `/studio`.
2. Selecciona **Crear evento** o una plantilla existente.
3. Rellena títulos, datos confirmados, zona horaria, tema, colores y secciones.
4. Añade historias/galería como arreglos JSON; habilita audio/APIs solo si son necesarios.
5. Configura RSVP y teléfono internacional únicamente con autorización del anfitrión.
6. Pulsa **Guardar vista previa** y revisa `/i/<slug>` en el mismo navegador.
7. Pulsa **Descargar JSON** y valida el documento antes de publicación.

Los borradores de vista previa se guardan en el almacenamiento local del navegador, no en el repositorio ni en el servidor. No compartir información sensible en URL o capturas.

## Duplicar una invitación

1. Abre el JSON de origen en `/studio` y descárgalo; también se puede copiar el archivo directamente.
2. Cambia `slug` a uno único válido y actualiza título, textos, detalles, SEO y recursos.
3. Crea `public/config/events/<nuevo-slug>.json`.
4. Agrega un objeto a `public/config/events/index.json` con `slug`, `title`, `description`, `eventType`, `theme`, `preview`.
5. Comprueba que ninguna dirección/fecha/teléfono del evento anterior quedó accidentalmente en el duplicado.
6. Ejecuta `npm run check:config` y build.

## Cambiar tema

Selecciona tema existente en el editor o cambia `theme` en JSON. Para registrar un ID nuevo sigue [THEMES](./THEMES.md); los temas nuevos no se crean por configuración solamente.

## Agregar imágenes y música

1. Obtén permiso del titular y confirma derechos de uso, especialmente para franquicias.
2. Optimiza tamaño/formato y deposita el archivo bajo `public/images/...` o `public/music/...`.
3. Referencia su URL pública desde raíz: `/images/events/hero.webp`, no `public/images/...`.
4. Usa `heroImage` para portada y `gallery[].src`/`alt` para galería; configura `music.src`.
5. Abre las URLs directamente en el servidor local y confirma que cargan también desde el build.
6. Revisa tamaño de build y estrategia de caché lazy del Service Worker.

## Configurar QR

En la versión actual no se requiere propiedad JSON: el renderer toma `window.location.href` y usa QRServer para la imagen. Prueba en URL final HTTPS y un segundo dispositivo. El proveedor recibe la URL por petición; no es adecuado si la URL contiene datos confidenciales. Una sustitución por QR local requiere desarrollo, dependencia aprobada y pruebas de escaneo.

## Configurar WhatsApp

Pon `rsvp.whatsappNumber` con código de país y solo dígitos, por ejemplo formato `52...`, sin espacios ni `+`. Mantén `sections.rsvp` y `rsvp.enabled` activos. Verifica el texto de asistencia/campos opcionales. El sitio abre un enlace; el invitado confirma el envío en WhatsApp. No es una API de envío automatizado ni una persistencia RSVP.

## SEO

Configura `seo.title`, `seo.description` y opcionalmente `seo.image` con URL accesible. Comprueba title/meta/OG/Twitter/JSON-LD en navegador. La metadata por evento se aplica después del bootstrap; sin SSR/prerender, algunos crawlers no la verán. No uses dirección estructurada o claims no confirmados. Canonical y dominio no se generan automáticamente.

## Validar y publicar

Antes de merge/deploy:

```bash
npm ci
npm run check:config
npm run build:production
```

Checklist operacional:

- [ ] Slug, archivo y catálogo coinciden.
- [ ] Datos, consentimientos, permisos de assets y contenido fueron revisados por responsable.
- [ ] Se probó ruta directa `/i/<slug>` en el hosting.
- [ ] Se probaron viewport móvil/desktop, enlaces externos, galerías y formularios.
- [ ] Se probó actualización PWA, caché y ruta offline esperada.
- [ ] Se comunicó que RSVP no se guarda y que QR/APIs requieren servicios externos.

Despliega `dist/mariachi-mexicanisimo/browser` con fallback SPA. Asegura que JSON/media responden como archivos y no con HTML fallback. Después verifica logs/Network y conserva el identificador del despliegue. Para rollback restaura deployment/commit anterior; evita reemplazar assets de un build activo manualmente sin invalidar cache.
