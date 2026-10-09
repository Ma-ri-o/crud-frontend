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

Los mensajes de WhatsApp, enlaces de contacto y QR se definen en `src/app/page.tsx`; el número de WhatsApp usa formato internacional de `wa.me` (código de país y número, sin signos), separado del teléfono que se muestra al público.

## Experiencia y arquitectura

- `src/app/page.tsx`: página principal server-rendered y compacta, con presentación, contacto directo, accesos para reservar/cotizar, Facebook y QR.
- `src/app/layout.tsx`: metadata SEO, Open Graph, Twitter Card, robots y viewport.
- `src/app/globals.css`: estilos responsive mobile-first de esta landing, tokens de marca, estados de foco y respeto a movimiento reducido.
- `src/components/Reveal.tsx`: componente de revelado al entrar al viewport, implementado con Framer Motion y compatible con preferencia de movimiento reducido.
- `src/components/BookingForm.tsx`: formulario accesible reutilizable; no se muestra en la landing compacta.
- `src/components/WhatsappButton.tsx`: helper reutilizable para enlaces `wa.me` y botón flotante animado.
- `data/mariachi.json`: configuración de contacto y marca.

La solución conserva Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hook Form y Zod presentes en el repositorio. La ruta `/studio` y la plantilla anterior de invitaciones siguen en el proyecto, aunque la ruta `/` ahora presenta esta landing comercial.

## Flujo de cotización y privacidad

Los botones abren WhatsApp con un mensaje inicial para iniciar una conversación de cotización o reserva. La página no recibe ni guarda datos de clientes; el equipo debe confirmar disponibilidad y precio por conversación.

Para almacenar solicitudes, habilita un endpoint seguro con validación de servidor, controles anti-spam, aviso de privacidad, política de retención y consentimiento antes de recibir datos personales. No conectes credenciales o secretos al cliente.

## Contenido pendiente de proporcionar

No se recibieron enlaces al perfil oficial de Facebook, domicilio comercial, precios, horarios ni dominio público. El enlace de Facebook abre una búsqueda por el nombre del mariachi hasta que se proporcione el perfil correcto. El QR se genera mediante QRServer. Sin dominio ni imagen social aprobados, metadata no inventa URLs canónicas ni Open Graph.

## SEO y publicación

Incluye el título y descripción solicitados, keywords locales, Open Graph, Twitter Summary Card, indexación y JSON-LD `LocalBusiness`. El Schema.org incluye teléfono, descripción, municipios de servicio y repertorio, sin inventar dirección, horarios, precios, calificaciones o reseñas.

Antes de publicar:

1. Confirma el formato WhatsApp y que el equipo atiende el número configurado.
2. Añade dominio real con `metadataBase` y URL canónica cuando esté disponible.
3. Proporciona una imagen social optimizada y el enlace oficial de Facebook.
4. Verifica el teléfono, la cobertura y el contenido comercial.
5. Revisa el aviso de privacidad que corresponda al sitio.

Consulta la [guía para publicar gratis en Netlify](./docs/DEPLOYMENT_FREE_HOSTING.md) para conectar el repositorio, configurar la compilación de Next.js y verificar el sitio. Los cambios de metadata y contenido se publican con una nueva compilación.
