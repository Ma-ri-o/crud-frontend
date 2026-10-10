# Invitation Studio

Invitation Studio es un motor web de invitaciones digitales basado en Angular. Permite publicar experiencias para eventos usando configuraciones JSON, un editor visual, temas compartidos y componentes reutilizables. El objetivo es que el contenido y la composición de una invitación se puedan adaptar sin duplicar una página Angular por evento.

La aplicación también conserva una landing comercial para Mariachi Mexicanísimo y sirve como plantilla de negocio dentro del mismo proyecto.

## Casos de uso

- Cumpleaños, bautizos, XV años, bodas, aniversarios y graduaciones.
- Invitaciones para eventos corporativos y celebraciones familiares.
- Landing pages comerciales, incluida la plantilla de Mariachi Mexicanísimo.
- Invitaciones temáticas con paletas y tipografías configurables.
- Contenido opcional relacionado con anime (Jikan) y Pokémon (PokéAPI).

Anime y Pokémon se ofrecen como integraciones de datos opcionales, no como plantillas gráficas incluidas. El proyecto no contiene imágenes o música oficiales de franquicias; antes de publicar contenido de terceros, verifica licencias y permisos.

## Tecnologías

- Angular 22.2, Angular Router y Angular Service Worker.
- TypeScript 6 y SCSS.
- Standalone Components, Signals y change detection `OnPush`.
- RxJS para peticiones HTTP y composición de flujos.
- Reactive Forms para el formulario RSVP.
- JSON estático como contrato de configuración.

## Requisitos

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`.
- npm `>=10`.

Las versiones de Angular y Node deben seguir la [tabla de compatibilidad de Angular](https://angular.dev/reference/versions). El proyecto fija Angular 22.2.2 y TypeScript 6 en sus manifiestos.

## Instalación y ejecución local

Desde la raíz del repositorio:

```bash
npm ci
npm start
```

Abre `http://localhost:4200`. El servidor de desarrollo usa la configuración `development`; el Service Worker no se habilita durante desarrollo.

## Build y producción

```bash
npm run build                 # build según la configuración predeterminada
npm run build:production      # build de producción con hashing y Service Worker
npm run check:config          # verifica catálogo y archivos JSON
npm run analyze               # genera build con stats JSON
```

El resultado de producción se genera en `dist/mariachi-mexicanisimo/browser`. Publica el contenido de esa carpeta en un hosting estático y configura un fallback de rutas SPA a `index.html`, sin interceptar los archivos estáticos existentes. Ejemplos de configuración del repositorio: [`vercel.json`](./vercel.json), [`public/_redirects`](./public/_redirects) y [`public/staticwebapp.config.json`](./public/staticwebapp.config.json).

La aplicación no incluye SSR. Las etiquetas SEO de cada invitación se actualizan en cliente; valida el comportamiento del crawler y configura SSR/prerender si la plataforma necesita HTML y metadata por slug antes de ejecutar JavaScript. En producción se requiere HTTPS para PWA, QR y enlaces externos confiables.

## Rutas de aplicación

| Ruta | Uso |
| --- | --- |
| `/` | Catálogo y página inicial de Invitation Studio. |
| `/studio` | Editor de plantillas, configuración JSON e importación/exportación. |
| `/i/:slug` | Invitación que carga `public/config/events/:slug.json`. |
| `/mariachi` | Landing comercial de Mariachi Mexicanísimo. |
| `/galeria`, `/contacto`, `/reservar` | Páginas comerciales existentes. |

Las rutas cargan componentes con `loadComponent` para mantener las páginas feature en chunks lazy.

## Estructura del proyecto

```text
src/app/
├── core/                 modelos, carga/validación de configuración, SEO y APIs
├── features/
│   ├── studio/           catálogo y editor visual/JSON
│   ├── invitation/       carga por slug, renderer, countdown
│   ├── themes/           registro de temas y tokens CSS
│   ├── integrations/     interfaz opcional para APIs abiertas
│   ├── home/             landing comercial de Mariachi
│   ├── gallery/
│   ├── contact/
│   └── booking/
├── app.routes.ts         rutas lazy
└── main.ts               bootstrap, HTTP, router y Service Worker
public/
├── config/events/        catálogo y JSON publicables
├── images/               fotografías de plantillas
├── music/                ubicación para audio autorizado
├── icons/
└── manifest.webmanifest
docs/                     arquitectura, configuración, soporte y operación
scripts/                  validación local de configuraciones
```

## Plantillas incluidas

- [`emiliano-ulises.json`](./public/config/events/emiliano-ulises.json): cumpleaños en Cocotitlán, Estado de México. Fecha, hora y dirección exacta permanecen vacías hasta recibir datos confirmados.
- [`mariachi-mexicanisimo.json`](./public/config/events/mariachi-mexicanisimo.json): plantilla comercial con fotografías locales. Confirma con el negocio que la información de contacto, servicios y recursos siga vigente antes de publicar.

El catálogo está en [`public/config/events/index.json`](./public/config/events/index.json). La guía para cada propiedad, validación y defaults está en [Configuración](./docs/CONFIGURATION.md) y [Contrato JSON](./docs/JSON-SCHEMA.md).

## Temas disponibles

El registro actual ofrece `elegant`, `luxury`, `floral`, `kids`, `minions`, `superheroes`, `princess`, `space`, `safari` y `mexican`. Los temas comparten un renderer y aportan una paleta, tipografías seguras y decoración; `colors` permite overrides por invitación.

Cambiar de tema existente se hace desde el editor o desde `theme` en el JSON. Añadir un nuevo identificador aún requiere actualizar TypeScript y el registro. Consulta [Temas](./docs/THEMES.md) antes de extenderlo.

## Personalización básica

1. Abre `/studio` y elige una plantilla o crea un evento.
2. Edita el contenido, los colores, las secciones, el RSVP y las rutas de recursos.
3. Guarda una vista previa en el navegador y prueba `/i/:slug`.
4. Descarga el JSON, colócalo en `public/config/events/<slug>.json` y agrega el resumen a `index.json`.
5. Copia imágenes y audio con permiso a `public/`, valida referencias y ejecuta:

   ```bash
   npm run check:config
   npm run build:production
   ```

6. Revisa rutas directas, enlaces, dispositivos móviles, accesibilidad y comportamiento offline; después publica el build.

Guardar vista previa solo utiliza `localStorage` de ese navegador. Exportar no publica archivos por sí solo. RSVP tampoco persiste en un servidor: se muestra una respuesta y, si hay teléfono, una persona puede abrir WhatsApp y enviarla.

## Solución rápida de problemas

| Síntoma | Primer diagnóstico |
| --- | --- |
| El catálogo o la invitación no abre | Comprueba el fallback SPA, el `slug`, la ruta JSON y la pestaña Network del navegador. |
| La plantilla falla al publicar | Ejecuta `npm run check:config`; compara el nombre de archivo, `slug` y entrada del catálogo. |
| Una imagen o audio no aparece | Confirma el archivo bajo `public/`, la URL pública absoluta `/...` y mayúsculas/minúsculas. |
| No aparece el countdown | `sections.countdown` debe ser `true` y `date` no puede estar vacía. |
| WhatsApp no se abre | Configura un número con código de país y dígitos solamente; el envío requiere una acción del invitado. |
| El QR no carga | La imagen depende del servicio externo QRServer y de conectividad; prueba la URL pública en una pestaña privada. |

La guía completa de soporte y diagnóstico está en [Support](./docs/SUPPORT.md) y [Runbook](./docs/RUNBOOK.md).

## FAQ

**¿Puedo crear una invitación nueva sin programar?**

Sí: edita o crea un borrador en `/studio`, valida y exporta el JSON. Publicarlo requiere agregarlo al catálogo, ponerlo en el repositorio y desplegar.

**¿Las respuestas RSVP se guardan?**

No. El formulario se valida en el navegador. El usuario puede abrir WhatsApp con un mensaje preparado; se requiere backend para persistencia central.

**¿Puedo agregar temas sin cambios de código?**

Se pueden elegir los temas existentes y personalizar sus colores desde JSON. Registrar un tema nuevo requiere cambiar el tipo `ThemeId`, el allowlist de validación y `THEME_REGISTRY`.

**¿El QR y las APIs funcionan offline?**

El QR remoto y las llamadas a APIs requieren internet. El Service Worker puede cachear respuestas y recursos según su configuración, pero no se debe asumir que todo recurso externo estará disponible offline.

**¿SSR está habilitado?**

No en la configuración actual. SEO se actualiza en cliente. Consulta [Arquitectura](./docs/ARCHITECTURE.md) para la implicación y posibles siguientes pasos.

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Configuración de invitaciones](./docs/CONFIGURATION.md)
- [Contrato y ejemplos JSON](./docs/JSON-SCHEMA.md)
- [Temas y recursos visuales](./docs/THEMES.md)
- [APIs open source](./docs/OPEN-DATA.md)
- [Soporte técnico](./docs/SUPPORT.md)
- [Operación y publicación](./docs/OPERATIONS.md)
- [Guía de desarrollo](./docs/DEVELOPMENT.md)
- [Runbook de soporte](./docs/RUNBOOK.md)
- [Documentación de arquitectura previa](./docs/architecture/)
