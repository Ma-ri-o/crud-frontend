# Integraciones de datos abiertos

## Estado y propósito

La aplicación incluye integraciones opcionales de demostración para:

- **Jikan API**, API pública no oficial que expone datos de MyAnimeList.
- **PokéAPI**, API pública comunitaria de datos Pokémon.

Se usan como contenido extra, no como fuente de datos del evento, RSVP, analítica ni negocio. No requieren clave en las llamadas actuales; disponibilidad, términos, rate limits y CORS dependen del proveedor.

## Habilitar y deshabilitar

En `/studio`, habilita la sección **Contenido opcional Jikan y PokéAPI**. En JSON se requiere que `sections.openData` y `openData.enabled` sean `true`; activa además el proveedor deseado:

```json
"sections": {
  "countdown": false,
  "story": false,
  "details": true,
  "gallery": false,
  "map": false,
  "gifts": false,
  "rsvp": false,
  "timeline": false,
  "music": false,
  "openData": true
},
"openData": {
  "enabled": true,
  "jikan": true,
  "pokeApi": false
}
```

Incluye todas las claves de sección del contrato en la configuración real. Para apagarlas, pon `sections.openData` y `openData.enabled` en `false`; también puedes dejar ambos proveedores en `false`. La sección carga su componente con `@defer (on viewport)` y cada petición ocurre solo al pulsar el botón correspondiente.

## Llamadas actuales

| Proveedor | Endpoint implementado | Uso |
| --- | --- | --- |
| Jikan | `GET https://api.jikan.moe/v4/seasons/now?limit=1` | Presenta el primer anime de la temporada con título/sinopsis/imagen. |
| PokéAPI | `GET https://pokeapi.co/api/v2/pokemon/{id}` | Presenta un Pokémon aleatorio entre 1 y 151, tipos e ilustración si existe. |

Servicio: `src/app/core/open-data.service.ts`. Interfaz/estados: `src/app/features/integrations/open-data.component.ts`.

## Cache, límites y riesgos

- El Service Worker define un data group `open-source-apis` con estrategia freshness, máximo 40 respuestas, edad de un día y timeout de 5 segundos. La política real depende del Service Worker de Angular y solo aplica en build de producción.
- No hay reintentos, backend proxy, API key, garantía de disponibilidad ni control de rate limit en la aplicación.
- Proveedores externos pueden cambiar respuesta, políticas, CORS o cuota; no confíes en una disponibilidad SLA.
- La imagen de anime/Pokémon se descarga del proveedor externo. El invitado comparte su dirección IP con los hosts a los que navega.
- Si no hay respuesta o falla el JSON, la UI conserva la invitación y muestra un mensaje genérico para reintentar.
- No envíes RSVP, nombre, dirección, teléfono u otros datos personales en parámetros de estas APIs.

## Fallback y soporte

Deshabilita el proveedor para eliminar la sección sin cambiar el resto del renderer. Ante fallas:

1. Confirma ambos flags y que la sección esté habilitada.
2. Pulsa el botón desde el browser y revisa Network/Console.
3. Comprueba conectividad, bloqueo por extensión/red, CORS, status HTTP y throttling del proveedor.
4. Reintenta más tarde o deja la integración desactivada. El contenido principal no debe depender de ella.

Antes de reemplazar endpoints revisa documentación y términos actuales de los proveedores. Si se requiere disponibilidad controlada, privacidad, normalización o caché propia, diseña un backend/proxy con políticas, observabilidad, seguridad y límites; no pongas secretos en el frontend.
