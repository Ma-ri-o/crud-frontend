# Temas y recursos visuales

## Temas existentes

El registro actual de `ThemeRegistryService` contiene diez temas:

| ID JSON | Nombre mostrado |
| --- | --- |
| `elegant` | Elegante |
| `luxury` | Luxury |
| `floral` | Floral |
| `kids` | Kids |
| `minions` | Minions |
| `superheroes` | Superhéroes |
| `princess` | Princess |
| `space` | Space |
| `safari` | Safari |
| `mexican` | Mexicano contemporáneo |

Los ID son el valor de `theme`; usa el ID estable, no el nombre localizado. El editor permite cambiar el tema y hacer overrides de los colores principal, acento y fondo. Los demás colores/tipografías/decoración vienen del registro.

## Cambiar tema de una invitación

1. En `/studio`, abre una plantilla y selecciona el tema en **Elige una atmósfera**; o edita `"theme"` en el JSON.
2. Opcionalmente personaliza `colors`.
3. Guarda la vista previa local, abre `/i/<slug>` y comprueba contraste y legibilidad móvil.
4. Exporta y publica el JSON con el proceso de [Operations](./OPERATIONS.md).

## Añadir un tema nuevo

Añadir solo una entrada JSON con un nombre nuevo no basta: el runtime valida el identificador contra TypeScript. Para registrar un tema:

1. Añade el ID al union `ThemeId` en `src/app/core/invitation.models.ts`.
2. Añade el ID al allowlist `themes` en `src/app/core/event-config.service.ts`.
3. Añade un `ThemeDefinition` completo a `THEME_REGISTRY` en `src/app/features/themes/theme-registry.service.ts`.
4. Verifica contraste, responsive y que todos los tokens consumidos estén cubiertos.
5. Actualiza muestras/documentación y prueba `npm run check:config` y `npm run build:production`.

Campos actuales de `ThemeDefinition`: `id`, `name`, `mood`, `background`, `surface`, `text`, `primary`, `accent`, `muted`, `displayFont`, `bodyFont` y `decoration`. Los colores deben ser hex válidos; las fuentes deben ser stack CSS local/seguro o contar con la estrategia de carga aprobada.

### Adaptación visual a categorías temáticas solicitadas

Las categorías Minions y Superhéroes ya existen como paletas genéricas. Pokémon, Naruto y Dragon Ball no son temas registrados. Se puede implementar una atmósfera original basada en color/composición, pero logos, personajes, capturas, tipografías distintivas y música requieren derechos/licencias adecuados. El repositorio no incluye assets oficiales de esas franquicias. Para publicación comercial usa recursos propios, de dominio/licencia compatible o con autorización expresa.

Mariachi se representa con el tema existente `mexican` y la plantilla comercial. No es necesario crear un tema nuevo para cambiar el contenido de la plantilla.

## Assets e imágenes

`assets/themes/` **no existe actualmente**. El proyecto sirve estáticos desde `public/`; conserva el patrón actual o acuerda una migración antes de moverlo. Una organización posible para una futura ampliación:

```text
public/
├── images/
│   ├── themes/
│   │   └── <tema>/
│   │       ├── hero.webp
│   │       └── detail-01.webp
│   ├── events/
│   └── mariachi/
└── music/
```

Las rutas en navegador comienzan con `/`, por ejemplo `/images/events/portada.webp`; **no** incluyas el prefijo `public` en la URL. Comprueba extensión/case exactos, optimiza dimensiones y formato, usa `heroImage` o elementos `gallery`, y redacta `alt` descriptivo. No guardes material privado o sin permiso en assets versionados.

## Música

Guarda audio autorizado y optimizado bajo `public/music/`; referencia, por ejemplo, `"/music/tema.mp3"` en `music.src`. Ambos flags `sections.music` y `music.enabled` deben estar activos. El reproductor nativo usa interacción del invitado y `preload="none"`; no hay autoplay. Informa al equipo si cambias formato y verifica códec/navegadores objetivo.

## Animaciones

No existe un sistema de animación configurable por JSON ni animaciones por tema. Si se añade:

- Prefiere CSS liviano y respetuoso con `prefers-reduced-motion`.
- No bloquees lectura, RSVP ni navegación.
- Evita dependencias y JS por invitación si una transición CSS resuelve el caso.
- Documenta el presupuesto/performance y prueba en móvil de gama baja.
