# Arquitectura de Invitation Studio

## Alcance y decisiones

Invitation Studio es una SPA Angular que renderiza distintos eventos con un único renderer configurable. La estrategia principal es **configuración antes que código** para contenido y secciones; la estructura del renderer y el registro de temas siguen siendo código tipado.

- Los archivos JSON de `public/config/events/` son la fuente de contenido publicado.
- `EventConfigService` carga y valida el documento antes de entregarlo a la vista.
- `InvitationViewComponent` representa secciones reutilizables a partir de configuración.
- `ThemeRegistryService` traduce un tema y overrides a custom properties CSS.
- Angular Router usa componentes standalone bajo demanda.
- El editor guarda borradores localmente; publicar sigue siendo una operación de repositorio/build/deploy.
- La aplicación no tiene backend, autenticación, base de datos RSVP, SSR ni carga de medios.

## Mapa de componentes

```mermaid
flowchart TD
  Browser[Browser] --> Router[Angular Router]
  Router --> StudioHome[StudioHomeComponent]
  Router --> Editor[StudioEditorComponent]
  Router --> EventPage[EventPageComponent /i/:slug]
  StudioHome --> Catalog[/config/events/index.json]
  Editor --> ConfigService[EventConfigService]
  Editor --> LocalStorage[(Borrador local)]
  Editor --> Export[Descarga JSON]
  EventPage --> ConfigService
  ConfigService --> EventJson[/config/events/:slug.json]
  ConfigService --> Validate[Validación de contrato]
  Validate --> Invitation[InvitationViewComponent]
  Invitation --> Theme[ThemeRegistryService]
  Invitation --> Sections[Secciones por flags]
  Sections --> RSVP[RSVP local / enlace WhatsApp]
  Sections --> QR[QRServer remoto]
  Sections --> OpenData[Jikan / PokéAPI, opt-in]
```

## Flujo de datos

### Catálogo y edición

1. La portada solicita `/config/events/index.json`.
2. El editor carga el catálogo y abre un `slug`; selecciona el archivo publicado o, en navegador, un borrador válido de `localStorage`.
3. Signals mantienen la selección y el estado editable. El editor visual actualiza partes del objeto; el editor avanzado admite JSON completo.
4. La validación del cliente impide guardar o exportar documentos inválidos según las reglas actuales.
5. **Guardar vista previa** escribe `invitation-studio.preview.<slug>` en el mismo navegador. **Descargar JSON** produce un archivo, no lo publica.
6. La publicación real añade/reemplaza el JSON y la entrada del catálogo, valida, compila y despliega.

### Carga pública de invitación

```mermaid
sequenceDiagram
  participant Guest as Invitado
  participant Router as Router
  participant Page as EventPageComponent
  participant Service as EventConfigService
  participant Store as localStorage / JSON estático
  participant View as InvitationViewComponent
  Guest->>Router: abre /i/:slug
  Router->>Page: activa ruta lazy
  Page->>Service: load(slug)
  Service->>Store: busca borrador local válido; luego GET JSON
  Store-->>Service: documento desconocido
  Service->>Service: valida schemaVersion, slug y campos
  Service-->>Page: EventConfig validado
  Page->>View: entrega configuración como input
  View-->>Guest: renderiza secciones habilitadas
```

En una misma instancia de ruta, `EventPageComponent` reacciona a cambios del parámetro usando `paramMap`; se cancela la suscripción anterior y el estado se reinicia al cambiar slug. Un fallo se muestra en la interfaz, no se sustituye silenciosamente por otra plantilla.

## Motor de plantillas

El motor separa:

- **Datos**: textos, fecha, dirección, imágenes, música, SEO, RSVP y flags en `EventConfig`.
- **Presentación compartida**: `InvitationViewComponent` y estilos de invitación.
- **Composición**: `sections` controla visibilidad; contenido vacío también puede impedir render de algunas secciones.
- **Navegación**: `/i/:slug` es una ruta genérica que carga el JSON del slug.
- **Plantillas de inicio**: catálogo `index.json`; cada invitación se define como una entrada de configuración validada.

No existe un sistema runtime de plugins ni una carpeta de componentes de tema. Una nueva sección con markup/comportamiento nuevo sí requiere código; evitar duplicar vistas completas es el criterio KISS.

## Sistema de temas

`ThemeRegistryService` declara `ThemeDefinition` para cada `ThemeId`. Incluye colores, fuentes seguras, ambiente y símbolo decorativo. `variables(config)` combina el registro con `colors` opcional y define `--invite-*` en la raíz de la invitación.

Para agregar un identificador nuevo hay que sincronizar:

1. `ThemeId` en `src/app/core/invitation.models.ts`.
2. Lista permitida en `src/app/core/event-config.service.ts`.
3. Entrada de `THEME_REGISTRY` en `src/app/features/themes/theme-registry.service.ts`.
4. Pruebas/documentación y al menos una plantilla o vista de verificación.

Los overrides de color por invitación sí son configuración JSON; cambiar tipografía, decoración o comportamiento visual implica cambiar el registro o SCSS.

## SEO

`SeoService.updateFromInvitation()` cambia el title, description, Open Graph, Twitter cards y el script JSON-LD existente en el documento. Los eventos usan Schema.org `Event`. La imagen SEO es opcional y proviene de `seo.image`.

La actualización ocurre en el cliente una vez cargado el JSON. No hay SSR/prerender en este workspace: crawlers o previews que no ejecutan JavaScript pueden no ver metadata específica. No se genera canonical URL por slug ni se inventa dominio; para indexación social consistente hace falta SSR/prerender o una estrategia de hosting compatible.

## QR

`InvitationViewComponent` construye el valor con `window.location.href` en navegador y solicita una imagen a QRServer. El código puede incluir query/hash presentes en la URL. El navegador envía el valor URL al proveedor de imágenes; no hay generación local. La alternativa privacy-first es generar SVG/Canvas localmente y probar el QR en producción.

## Formularios RSVP

El renderer usa Reactive Forms. Nombre y asistencia son obligatorios; `rsvp.fields` controla la visualización de campos opcionales `guests` y `comments`. Al enviar se valida y actualiza estado de éxito local. Si se configura `whatsappNumber`, se ofrece un enlace `wa.me` cuyo texto se genera con los campos habilitados.

No hay POST, almacenamiento central, envío automático ni confirmación transaccional. El invitado debe pulsar el enlace de WhatsApp y enviar el mensaje; el anfitrión debe confirmar por su cuenta. No introduzcas datos personales en APIs de terceros.

## APIs, PWA y límites de ejecución

- Jikan/PokéAPI se muestran en una sección deferida, solo si están habilitadas y el usuario pulsa un botón.
- En producción `provideServiceWorker` registra el Service Worker de Angular.
- `ngsw-config.json` precarga shell/configuraciones, descarga imágenes/audio lazy y declara un data group freshness para endpoints de las dos APIs.
- Los medios deben existir en `public/`; el deploy debe conservar rutas estáticas y hacer fallback SPA para rutas de Angular.
- SSR es una opción futura, no una capacidad activa.
