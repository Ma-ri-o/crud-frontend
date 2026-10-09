# Mariachi Mexicanísimo

Landing premium mobile-first para generar contactos para **Mariachi Mexicanísimo**. Construida con Angular standalone, TypeScript estricto, rutas lazy, señales, formularios reactivos y `NgOptimizedImage`.

## Requisitos y comandos

- Node.js 24 LTS (Angular 21 también admite Node.js 20.19+ y 22.12+).
- npm 10+.

```bash
npm install
npm start                 # http://localhost:4200
npm run build             # compilación optimizada de producción
npm run analyze           # produce stats.json para analizar bundles
```

El build de producción aplica optimización, hashing, tree shaking, minificación y presupuestos para el bundle inicial y SCSS. No hay bibliotecas de iconos, animación ni formularios de terceros.

## Organización

```text
src/
├── app/
│   ├── core/              # configuración, SEO y servicio de leads
│   ├── shared/            # formulario reutilizable
│   ├── features/
│   │   ├── home/           # landing y acciones principales
│   │   ├── contact/        # contacto directo (lazy route)
│   │   ├── gallery/        # galería y lightbox (lazy route)
│   │   └── booking/        # reserva (lazy route)
│   └── app.routes.ts
├── index.html              # SEO inicial y JSON-LD LocalBusiness
├── main.ts
└── styles.scss
public/
└── images/mariachi/        # fotografías WebP/AVIF de galería
```

Todas las vistas son standalone y usan `ChangeDetectionStrategy.OnPush`. `SeoService` actualiza título y descripción al cargar el landing. La ruta `/` muestra de inmediato botones de WhatsApp, llamada, reserva, cotización y Facebook; incluye los cinco beneficios, cinco fotografías y QR. El formulario solo abre WhatsApp con el texto preparado; el visitante revisa y envía el mensaje desde WhatsApp, no se almacenan datos.

## Configuración del negocio

En `src/app/core/site-config.ts` edita:

- `phone`: teléfono visible y destino `tel:`.
- `whatsappNumber`: número internacional sin `+`, espacios ni guiones para `wa.me`.
- `attendant` y `serviceArea`: atención y cobertura.
- `facebookUrl` y `youtubeUrl`: enlaces oficiales. El proyecto trae búsquedas provisionales porque no se proporcionaron perfiles oficiales.
- `qrImage` y `qrTarget`: imagen y destino del QR. Por defecto `qrImage` solicita un PNG de QR a QRServer usando `qrTarget`; puedes apuntarlo a un QR propio dentro de `public/images/`.

La descripción SEO y keywords están en `src/index.html`; `LocalBusiness` contiene teléfono y zona de servicio, sin inventar domicilio, horarios ni calificaciones. Actualiza título/descripción del `<head>` allí y en `SeoService` si cambia la marca.

## Cambiar fotografías

Las cinco fotografías de `img-mariachi/` ya están copiadas a `public/images/mariachi/` y conectadas desde `src/app/features/gallery/gallery.component.ts`. Para reemplazarlas o sumar una sexta, agrega la imagen optimizada (idealmente AVIF o WebP, ancho cercano a 1200 px y menor de 250 KB) y actualiza el arreglo `photos` con ruta, texto alternativo y caption:

```ts
{ src: '/images/mariachi/serenata-1.webp', alt: 'Mariachi durante una serenata', caption: 'Serenatas que emocionan' }
```

La galería establece `sizes`, dimensiones reservadas y carga diferida nativa; la primera imagen usa prioridad para mejorar carga inicial. Cada tarjeta se puede pulsar para abrir la foto en un visor accesible. `NgOptimizedImage` organiza carga responsive; Angular sirve los assets estáticos sin un servidor de transformación de imágenes, así que exporta los formatos y tamaños optimizados antes de subirlos.

## Despliegue

El directorio estático de salida es `dist/mariachi-mexicanisimo/browser`. En todos los proveedores instala dependencias con `npm install` y ejecuta `npm run build`.

### Vercel

Importa el repositorio, elige **Other** si no detecta Angular, configura build `npm run build` y output `dist/mariachi-mexicanisimo/browser`. `vercel.json` incluye fallback para las rutas Angular.

### Netlify

Importa el repositorio. Build command: `npm run build`; publish directory: `dist/mariachi-mexicanisimo/browser`. `public/_redirects` conserva rutas SPA y se copia al output.

### Azure Static Web Apps

Conecta el repositorio en Azure Static Web Apps. App location `/`, API location vacío y output location `dist/mariachi-mexicanisimo/browser`. `staticwebapp.config.json` reescribe rutas SPA hacia `index.html`.

## Calidad y SEO

El HTML inicial incluye title, descripción, keywords locales, Open Graph, Twitter Cards, viewport móvil, icono y JSON-LD `LocalBusiness`. Usa Lighthouse local en móvil y desktop para revisar Core Web Vitals y metas de rendimiento, accesibilidad, SEO y buenas prácticas. El resultado >90 depende también del hosting, caché, conexión, imágenes finales, contenido social y auditoría del navegador; no se promete una puntuación antes de medir la versión desplegada.

Reemplaza antes de publicar las URLs provisionales de búsqueda de redes y el QR si tienes uno de marca. Añade una URL canónica e imagen Open Graph cuando se confirme el dominio y el material oficial.
