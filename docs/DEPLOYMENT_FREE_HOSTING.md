# Publicar gratis en Netlify

Esta aplicación usa Next.js 15 con App Router. Netlify detecta el framework y configura el adaptador de Next.js para servir las páginas y las funciones necesarias. Su plan gratuito puede servir para comenzar; revisa los límites, condiciones de uso y precios vigentes antes de publicar una web comercial, porque pueden cambiar.

## Antes de publicar

- Crea una cuenta en [Netlify](https://app.netlify.com/) y sube este repositorio a GitHub, GitLab o Bitbucket.
- Confirma que el repositorio incluya `package-lock.json` para instalar dependencias con `npm ci`.
- Ejecuta localmente `npm run build` y resuelve cualquier error antes de conectar el sitio.
- Revisa `data/mariachi.json`: el teléfono y el número internacional de WhatsApp son datos públicos que deben estar confirmados.
- No se requieren variables de entorno ni claves secretas para esta landing.

## Crear el sitio

1. En Netlify, selecciona **Add new site** y después **Import an existing project**.
2. Autoriza el proveedor Git y elige el repositorio de la landing.
3. Confirma la configuración detectada:
   - **Base directory:** vacío (raíz del repositorio).
   - **Build command:** `npm run build`.
   - **Publish directory:** deja el valor detectado por Netlify para Next.js; no fuerces `out` ni `.next` como sitio estático.
   - **Node.js:** usa una versión compatible con el proyecto (Node.js 20.19+, 22.13+ o 24+).
4. Selecciona **Deploy site**. Netlify instala las dependencias y ejecuta la compilación.
5. Cuando termine, abre la URL `*.netlify.app` asignada y realiza la verificación de publicación.

Si la detección del framework no aparece, consulta la [documentación oficial de Next.js en Netlify](https://docs.netlify.com/frameworks/next-js/overview/) y aplica su configuración actual. No añadas manualmente un plugin antiguo ni cambies el directorio de publicación sin seguir esas instrucciones.

## Verificación posterior

Comprueba la versión publicada desde un teléfono y un navegador de escritorio:

- **Enviar mensaje** abre WhatsApp con un saludo. **Reservar y cotizar** abre un formulario; complétalo y selecciona **Continuar a WhatsApp** para revisar y enviar los datos del evento.
- **Llamar Ahora** abre `tel:+525515333499`.
- **Ir a Facebook** abre una búsqueda por el nombre del mariachi; reemplázala con el perfil oficial cuando esté disponible.
- El QR se obtiene desde QRServer, un servicio externo que se puede sustituir por una imagen propia.
- Revisa título, descripción, navegación, contraste, foco de teclado y el aviso de privacidad que corresponda antes de promocionar el sitio.

Netlify crea una vista previa por cada pull request y publica los cambios de la rama configurada después de una nueva compilación. Para regresar a una publicación anterior, selecciona el deploy estable en el historial de **Deploys** y publícalo de nuevo. Consulta el [plan y sus límites vigentes](https://www.netlify.com/pricing/); suspensiones, límites de uso y condiciones pueden cambiar.

## Actualizar el contenido

- Teléfono, WhatsApp y mensaje inicial: `data/mariachi.json`.
- Mensajes de contacto, enlaces de redes y QR: `src/app/page.tsx`.
- Colores, layout y vista móvil: `src/app/globals.css`.
- El QR se puede cambiar sustituyendo `qrHref` en `src/app/page.tsx` por la ruta pública de una imagen QR aprobada.

Para usar un dominio propio, configura el dominio en el panel de Netlify y sigue las instrucciones DNS del proveedor. El sitio también necesita un aviso de privacidad apropiado si se promociona y procesa información personal.
