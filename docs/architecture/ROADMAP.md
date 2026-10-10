# Evolución recomendada

1. Añadir almacenamiento backend multiusuario para plantillas y respuestas RSVP, con autenticación y permisos por tenant.
2. Implementar subida/transformación de assets, moderación de formatos, cuotas y almacenamiento CDN.
3. Añadir esquema JSON versionado, migraciones automáticas y validación de runtime estricta (p. ej. Zod/JSON Schema) antes de publicar.
4. Agregar preview responsive sincronizado con el editor y edición de story/gallery/timeline con formularios tipados.
5. Integrar servicio de mail/WhatsApp oficial con consentimientos explícitos y tracking privacy-safe.
6. Activar SSR o prerender por slug para metadata crawler, canonical URL, sitemap y share cards verificables.
7. Sustituir generador remoto de QR por opción local si el uso exige privacidad/independencia del proveedor.
8. Medir Lighthouse en hosting real; registrar CWV, caché PWA y límite de bundle antes de fijar SLO de rendimiento.
9. Agregar suite de pruebas de contrato para JSON, validación de formularios, rutas y disponibilidad offline.
