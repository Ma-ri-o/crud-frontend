# Invitation Studio

Invitation Studio es una aplicación Angular para crear, previsualizar y publicar invitaciones digitales configurables. La información del evento vive en archivos JSON; el estudio permite editar una plantilla sin modificar el código de la aplicación.

## Casos de uso

- Cumpleaños y celebraciones familiares
- Bodas, bautizos, graduaciones y aniversarios
- Invitaciones temáticas y páginas de evento

La configuración actual de ejemplo es el cumpleaños de Emiliano Ulises en Cocotitlán, Estado de México.

## Tecnologías

- Angular 22 y TypeScript
- Standalone Components, Signals y Router con carga lazy
- SCSS, formularios reactivos y RxJS
- Service Worker para capacidades PWA

## Requisitos

- Node.js compatible con el campo `engines` de [package.json](./package.json)
- npm 10 o superior

## Instalación y ejecución

```bash
npm ci
npm start
```

Abre `http://localhost:4200`. La ruta raíz abre el estudio y `/i/emiliano-ulises` muestra la invitación.

## Validación y build

```bash
npm run check:config
npm run build:production
```

El build de producción genera `dist/invitation-studio/browser`. Publica su contenido en un hosting estático con fallback SPA a `index.html`, asegurando que JSON e imágenes se sigan sirviendo como archivos. La generación de páginas estáticas de compartición crea metadatos sociales por plantilla.

## Estructura del proyecto

```text
public/
  config/events/       Configuración JSON y catálogo
  images/              Imágenes locales
src/app/
  core/                Contratos, carga de datos y servicios
  features/studio/     Catálogo y editor
  features/invitation/ Renderizadores genéricos y específicos
  features/themes/     Registro de temas y tokens
scripts/               Validación y generación de páginas compartibles
docs/                  Guías de arquitectura, operación y soporte
```

## Temas y personalización

Los temas disponibles se definen en `src/app/features/themes/theme-registry.service.ts`. Para agregar un evento:

1. Copia `public/config/events/emiliano-ulises.json` con un nuevo `slug`.
2. Ajusta textos, fecha, ubicación, secciones, RSVP, SEO, imágenes y tema.
3. Añade una entrada correspondiente en `public/config/events/index.json`.
4. Ejecuta `npm run check:config` y `npm run build:production`.

Los cambios temporales del editor se guardan en el almacenamiento local del navegador. Para publicar, incorpora el JSON y recursos al repositorio y despliega el build; el guardado local no publica cambios.

Consulta [docs/CONFIGURATION.md](./docs/CONFIGURATION.md), [docs/JSON-SCHEMA.md](./docs/JSON-SCHEMA.md), [docs/THEMES.md](./docs/THEMES.md) y [docs/OPERATIONS.md](./docs/OPERATIONS.md).

## Solución de problemas

- **La invitación no carga:** comprueba que el `slug` exista en catálogo y JSON y revisa Network/Console.
- **La validación falla:** ejecuta `npm run check:config` para localizar errores de esquema o recursos.
- **No se ven cambios publicados:** elimina el borrador de vista previa local o usa la acción de restaurar publicada.
- **El build falla:** confirma la versión de Node.js, ejecuta `npm ci` y revisa el primer error de Angular/TypeScript.
- **No aparecen metadatos al compartir:** vuelve a generar el build y confirma que el hosting sirve el HTML generado.

## FAQ

**¿Se guardan las respuestas RSVP en el servidor?** No. La invitación prepara un mensaje para enviar por WhatsApp; no hay backend ni almacenamiento central.

**¿El editor publica automáticamente?** No. El editor guarda una vista previa local o permite descargar JSON. La publicación requiere actualizar el catálogo/configuración y desplegar.

**¿Puedo usar fotos o música de terceros?** Solo si cuentas con autorización o una licencia compatible con su distribución.

**¿Hay SSR?** No está configurado actualmente; el producto usa una SPA y genera HTML estático con metadatos de compartición.

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Configuración](./docs/CONFIGURATION.md)
- [Esquema JSON](./docs/JSON-SCHEMA.md)
- [Temas](./docs/THEMES.md)
- [Integraciones de datos abiertos](./docs/OPEN-DATA.md)
- [Soporte](./docs/SUPPORT.md)
- [Operaciones](./docs/OPERATIONS.md)
- [Desarrollo](./docs/DEVELOPMENT.md)
- [Runbook](./docs/RUNBOOK.md)
