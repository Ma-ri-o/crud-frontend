# Runbook de soporte

## Protocolo general

1. Confirma ruta, slug, fecha/hora del incidente, entorno, navegador, dispositivo y versión desplegada.
2. Reproduce en ventana privada para separar borradores locales y estado del Service Worker.
3. Inspecciona DevTools → Network (document, JSON, imágenes, audio y proveedores) y Console.
4. No solicites RSVP, teléfonos, direcciones privadas ni archivos de configuración con información personal.
5. Si afecta a todos los usuarios, confirma deployment/CDN/hosting antes de modificar JSON.
6. Tras corregir, valida desde URL directa, dispositivo móvil y al menos otro navegador.

## Escenario: “No abre la invitación”

**Impacto:** invitado recibe error o página vacía en `/i/<slug>`.

1. Abre `/config/events/<slug>.json` en la misma base URL.
2. Si devuelve 404: confirma que el slug satisface `^[a-z0-9-]{1,64}$`, archivo está publicado y el build contiene `public/config/events`.
3. Si devuelve `index.html`: corregir orden/regla SPA del hosting para preservar archivos existentes.
4. Si JSON devuelve 200: contrasta `slug`, `schemaVersion: 1`, campos requeridos y abre Console para el mensaje del validador.
5. Prueba ventana privada/restablece la vista previa: un draft inválido se limpia, pero uno válido prevalece sobre servidor.
6. Ejecuta `npm run check:config` y re-publica si catálogo o JSON cambiaron.

**Escalamiento:** si el documento es válido y la app falla solo en un despliegue, registra deployment ID, response body/status y stack sanitizado.

## Escenario: “No carga la música”

1. Revisa `sections.music`, `music.enabled` y `music.src`.
2. Abre directamente el URL del audio: debe responder 200, con contenido y MIME/codec admitido.
3. Verifica que el usuario haya pulsado controles; no existe autoplay.
4. Prueba en navegador/dispositivo distinto y revisa error de decodificación, 404 o mixed content.
5. Confirma asset dentro de `public/music/`, ruta `/music/...`, case exacto y tamaño razonable.
6. Confirma permiso/licencia; no reemplaces por una descarga de origen no autorizado.

**Resolución temporal:** deshabilita ambas opciones de música o comunica que el audio requiere conexión; el resto de la invitación puede seguir disponible.

## Escenario: “No aparece la galería”

1. Comprueba `sections.gallery: true` y que `gallery` tenga elementos.
2. Valida cada `src` y `alt`; visita el recurso directo y comprueba status HTTP.
3. Revisa ruta con slash inicial y case/extensión exactos bajo `public/images/`.
4. Verifica que el build/deploy incluyó la imagen y que no hay bloqueo CORS para host remoto.
5. Prueba Network cache/service worker y ventana privada.

Si las imágenes cargan pero son difíciles de ver, inspecciona dimensiones/contraste y ancho responsive; evita resolverlo con una ruta de placeholder silenciosa.

## Escenario: “WhatsApp genera mensaje incorrecto”

1. Comprueba `rsvp.enabled`, `sections.rsvp`, `rsvp.fields` y el número `whatsappNumber`.
2. El número debe incluir país, solo dígitos (sin `+`, espacios o guiones).
3. Confirma que `guests` se incluye solo cuando asistencia es “Sí” y el campo está habilitado; `comments` solo si está en fields.
4. Prueba respuesta Sí/No y caracteres acentuados; el texto se codifica para `wa.me`.
5. El enlace requiere interacción del usuario: abre WhatsApp con el texto pero no lo envía. Verifica el destinatario antes de confirmar.
6. Nunca pruebes enviando un mensaje real sin consentimiento; usa un número controlado por el equipo.

**Límite de servicio:** no hay persistencia, entrega ni confirmación de recepción RSVP. Si se requiere auditoría/listado central, se necesita backend con privacidad/retención y diseño separado.

## Escenario: “El QR no funciona”

1. Comprueba que la URL pública es accesible desde el teléfono que escanea.
2. Inspecciona petición de imagen QRServer; el QR depende de internet/proveedor.
3. Escanea con más de una app/dispositivo y verifica dominio/slug resultante.
4. Revisa si URL abierta tiene query/hash no deseados; QR usa `window.location.href`.
5. Si QRServer está bloqueado o el proyecto no puede enviar URL al tercero, desactiva temporalmente compartir QR y planifica generador local como cambio de código.

## Escenario: “Actualización no aparece”

1. Prueba ventana privada y compara respuesta del JSON y hash de bundles.
2. Usa **Restaurar publicada** en el editor para eliminar el preview local del slug.
3. Comprueba cache CDN y actualización del Service Worker.
4. Confirma que el despliegue contiene el commit/build esperado y que los assets no devuelven HTML.
5. Invalida cache según procedimiento aprobado; no borres indiscriminadamente datos del usuario.
