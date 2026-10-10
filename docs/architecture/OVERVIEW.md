# Arquitectura de Invitation Studio

## Decisiones

- El workspace Angular standalone sirve el estudio y las invitaciones configuradas.
- El runtime lee contratos `EventConfig` desde `public/config/events/<slug>.json`; ningún dato principal del evento se acopla al renderer.
- El catálogo `index.json` se mantiene junto a las configuraciones y la validación reproducible revisa que ambos estén sincronizados.
- Angular Signals administran selección, estado de carga, formularios de editor y tokens; Router carga vistas por ruta bajo demanda.
- `ThemeRegistryService` mantiene la paleta por tema y overrides declarativos. Se usan custom properties en una raíz por invitación.
- El editor persiste vista previa en localStorage, y exporta un JSON para el proceso estático de publicación.
- Jikan y PokéAPI están aisladas en una sección y servicio opcionales; no afectan contenido RSVP ni el render inicial.
- Service Worker precarga el app shell y plantillas; medios se cachean bajo demanda.

## Diagrama de runtime

```mermaid
sequenceDiagram
  participant G as Invitado/Editor
  participant R as Angular Router
  participant C as EventConfigService
  participant J as public/config/events
  participant T as ThemeRegistry
  participant V as InvitationView
  G->>R: /i/:slug
  R->>C: load(slug)
  C->>J: GET <slug>.json
  J-->>C: EventConfig
  C-->>V: configuración validada
  V->>T: get(theme) + overrides
  T-->>V: CSS tokens
  V-->>G: secciones visibles y contenido
  G->>V: submit RSVP
  V-->>G: borrador de respuesta para WhatsApp
```

## Limitaciones de primera versión

No hay servidor de dashboard, autenticación, base de datos, subida de medios, entrega directa de invitaciones ni persistencia central de RSVP. El editor es local y de un navegador; publicar cambia recursos estáticos y requiere build/deploy. SSR es opcional y queda descrito en la guía operativa.
