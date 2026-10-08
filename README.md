# Mariachi Mexicanísimo

Landing page responsive para promocionar y recibir solicitudes de cotización de Mariachi Mexicanísimo en la Zona Oriente del Estado de México. La experiencia prioriza WhatsApp, llamadas y un formulario de evento; está construida sobre el App Router y los patrones de componentes del repositorio existente.

## Requisitos

- Node.js 20.19+, 22.13+ o 24+ (según dependencias actuales).
- npm 10+.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para compilar para producción: `npm run build`; para iniciar esa compilación: `npm run start`.

## Identidad y datos

La configuración pública de marca y contacto vive en `data/mariachi.json`:

- Nombre y slogan.
- Teléfono de contacto, número internacional para WhatsApp y mensaje inicial.
- Cobertura principal.

Los servicios, repertorio y municipios están definidos como datos en `src/app/page.tsx`; los tipos de evento y validaciones del formulario están en `src/components/BookingForm.tsx`. Sustituye esos arreglos para editar el contenido conforme se agreguen datos reales. El número de WhatsApp usa formato internacional de `wa.me` (código de país y número, sin signos), separado del teléfono que se muestra al público.

## Experiencia y arquitectura

- `src/app/page.tsx`: página principal server-rendered, navegación por anclas, hero, servicios, narrativa de marca, repertorio, cobertura, testimonios preparados y datos estructurados LocalBusiness.
- `src/app/layout.tsx`: metadata SEO, Open Graph, Twitter Card, robots y viewport.
- `src/app/globals.css`: estilos responsive mobile-first de esta landing, tokens de marca, estados de foco y respeto a movimiento reducido.
- `src/components/Reveal.tsx`: componente de revelado al entrar al viewport, implementado con Framer Motion y compatible con preferencia de movimiento reducido.
- `src/components/BookingForm.tsx`: formulario accesible con React Hook Form y Zod. Valida los campos y prepara un mensaje detallado en WhatsApp.
- `src/components/WhatsappButton.tsx`: helper reutilizable para enlaces `wa.me` y botón flotante animado.
- `data/mariachi.json`: configuración de contacto y marca.

La solución conserva Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hook Form y Zod presentes en el repositorio. La ruta `/studio` y la plantilla anterior de invitaciones siguen en el proyecto, aunque la ruta `/` ahora presenta esta landing comercial.

## Flujo de cotización y privacidad

El formulario no envía información a un servidor ni guarda datos en el navegador. Tras validar, abre WhatsApp con los detalles capturados para que la persona los revise y envíe. La solicitud no equivale a una reserva confirmada; el equipo debe confirmar disponibilidad y cotización por conversación. Si WhatsApp está bloqueado, el botón flotante permite iniciar un chat con el mensaje predeterminado.

Para almacenar solicitudes, habilita un endpoint seguro con validación de servidor, controles anti-spam, aviso de privacidad, política de retención y consentimiento antes de recibir datos personales. No conectes credenciales o secretos al cliente.

## Contenido pendiente de proporcionar

No se recibieron fotografías propias, testimonios autorizados, redes sociales, domicilio comercial, precios, horarios ni dominio público. La composición usa ilustraciones CSS originales y no las presenta como fotografías ni como evidencia de clientes. El bloque de experiencias invita a compartir historias y debe reemplazarse por reseñas reales con autorización. Sin dominio ni imagen social aprobados, metadata no inventa URLs canónicas ni Open Graph.

## SEO y publicación

Incluye el título y descripción solicitados, keywords locales, Open Graph, Twitter Summary Card, indexación y JSON-LD `LocalBusiness`. El Schema.org incluye teléfono, descripción, municipios de servicio y repertorio, sin inventar dirección, horarios, precios, calificaciones o reseñas.

Antes de publicar:

1. Confirma el formato WhatsApp y que el equipo atiende el número configurado.
2. Añade dominio real con `metadataBase` y URL canónica cuando esté disponible.
3. Proporciona una imagen social optimizada y fotografías autorizadas.
4. Verifica municipios, cobertura, tiempos de atención y contenido comercial.
5. Revisa aviso de privacidad para el flujo de contacto con datos personales.

Importa el repositorio en Vercel con la configuración predeterminada de Next.js. Los cambios de metadata y contenido estático se publican con una nueva compilación.
