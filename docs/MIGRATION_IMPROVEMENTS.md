# Mejoras de la landing de Mariachi Mexicanísimo

## Resumen

Esta actualización mejora la captación de solicitudes y la accesibilidad sobre la aplicación Angular existente. No rehace la aplicación ni incorpora dependencias externas nuevas.

## Decisiones implementadas

### Formulario y WhatsApp

- El formulario solicita nombre, teléfono, tipo de evento, fecha, municipio y dirección; las referencias adicionales son opcionales.
- El nombre requiere al menos dos caracteres y el teléfono exactamente diez dígitos numéricos.
- La fecha es obligatoria y no admite días anteriores al actual. La fecha mínima se obtiene en hora local.
- Se muestran mensajes de validación junto al campo correspondiente, y al intentar enviar un formulario inválido el foco pasa al primer campo con error.
- El mensaje precargado de WhatsApp incluye todos los datos, la fecha en formato `DD/MM/AAAA` y una indicación cuando no hay comentarios.
- No se envían ni almacenan datos en un servidor: la persona revisa y envía el mensaje desde WhatsApp.

### Diálogos y teclado

- Los diálogos de cotización y galería indican su semántica con `role="dialog"`, `aria-modal`, título y descripción asociados.
- Al abrirse reciben el foco; el foco queda contenido con Tab y Shift+Tab; Escape cierra el diálogo; al cerrar, se restaura el foco en el elemento que lo abrió.
- Se bloquea el desplazamiento de la página mientras el diálogo está abierto y se restaura al cerrarlo.

### Servicios y prueba social

- La sección de servicios presenta ocho tarjetas compactas con icono, nombre y descripción.
- Los videos se configuran por ID de YouTube en `src/app/core/site-config.ts`; se carga una miniatura ligera y el enlace abre YouTube, sin insertar reproductores de terceros en la página.
- Los testimonios se configuran desde el mismo archivo. La lista permanece vacía mientras no haya opiniones reales y autorizadas.

### Datos centralizados

`src/app/core/site-config.ts` concentra datos comerciales y de presentación: teléfono, WhatsApp, Facebook, YouTube, áreas atendidas, beneficios, tipos de evento, servicios, galería, videos y testimonios. Los enlaces de redes existentes son búsquedas públicas provisionales; reemplazarlos por los perfiles oficiales cuando se confirmen.

### Imágenes y rendimiento

- La galería usa rutas locales, carga diferida mediante `@defer` y `NgOptimizedImage`, con tamaños declarados para reservar espacio.
- Se conserva la selección de seis imágenes locales en vez de añadir las 18 indiscriminadamente: se priorizan fotos representativas y se evitan duplicados o carteles con teléfonos contradictorios.
- Las miniaturas de videos solo se solicitan cuando hay IDs configurados.
- No se agregaron bibliotecas al bundle.

### SEO

- Se actualizaron descripción, keywords, Open Graph, Twitter Cards y el marcado JSON-LD `LocalBusiness`.
- La descripción, las áreas atendidas y los servicios del marcado dinámico provienen de la configuración central.
- Las áreas incluidas son Chalco, Cocotitlán, Valle de Chalco, Ixtapaluca, Los Reyes y la Zona Oriente del Estado de México.

## Archivos modificados

- `src/app/core/site-config.ts`
- `src/app/core/lead.service.ts`
- `src/app/core/seo.service.ts`
- `src/app/shared/booking-form.component.ts`
- `src/app/shared/dialog-accessibility.ts`
- `src/app/features/home/home.component.ts`
- `src/app/features/gallery/gallery.component.ts`
- `src/index.html`
- `src/styles.scss`
- Imágenes optimizadas bajo `public/images/mariachi/`

## Verificación y límites

- Ejecutar `npm run build` para validar la compilación de producción.
- No se afirma una puntuación concreta de Lighthouse: debe medirse en el hosting final, con URLs y activos reales.
- No se recibieron URLs oficiales de Facebook o YouTube, ni videos o testimonios autorizados. Los enlaces provisionales y colecciones vacías evitan inventar datos.
- El sitio abre WhatsApp con el borrador; la persona usuaria debe confirmar el envío.
- El proyecto usa Angular 21 según sus dependencias actuales; esta tarea conserva esa versión y no realiza una actualización mayor a Angular 22.
