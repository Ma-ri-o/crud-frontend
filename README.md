# Invitación de cumpleaños de Emiliano Ulises

Invitación digital interactiva para celebrar los 4 años de Emiliano Ulises. Está construida con Next.js 15, React 19, TypeScript, Tailwind CSS y Framer Motion. La ilustración del personaje es original y está hecha con CSS; no utiliza personajes ni imágenes oficiales.

## Requisitos y desarrollo

- Node.js 20.19+ y npm 10+.

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. Ejecuta `npm run build` para comprobar la compilación de producción y `npm run start` para servirla localmente.

## Cambiar el contenido

El contenido publicado se centraliza en `src/config/event.ts`. Edita el objeto `eventConfig` y vuelve a desplegar:

- **Nombre:** `title`.
- **Edad:** `age`; también se muestra en el hero.
- **Fecha y hora:** `date` en formato `AAAA-MM-DD` y `time` en formato de 24 horas. Al definir la fecha se activa el contador real. Mientras falte, la invitación indica que está por confirmarse.
- **Ubicación:** cambia `location`, `address` y `mapUrl`. El mapa actual apunta a Cocotitlán; la dirección exacta y fecha/hora están pendientes de confirmación.
- **WhatsApp:** `rsvp.phone` debe llevar código de país y solo dígitos. `rsvp.message` define el texto precargado. El número configurado es `525515333499`.
- **Colores:** modifica `customColors` (`primary`, `accent`, `background`, `text`) o selecciona otro tema.
- **Secciones:** activa o desactiva countdown, historia, detalles, galería, mapa, RSVP, música y otras secciones mediante `sections`.

### Cambiar fotografías

Reemplaza los elementos del arreglo `gallery` con `{ src, alt, caption }`. Puedes usar URLs HTTPS o archivos propios dentro de `public/`, por ejemplo `src: "/images/foto-1.webp"`. Escribe siempre un texto `alt` que describa la imagen. `heroImage` reemplaza la ilustración del hero; si no se define, se muestra el personaje CSS original. Las fotografías actuales son imágenes de muestra de Unsplash, no fotografías de Emiliano.

### Música

Para habilitar el control, define `music.src` con una ruta de audio (por ejemplo `/music/celebracion.mp3`) y activa `sections.music`. El archivo debe estar dentro de `public/music/` o tener una URL accesible. La reproducción solo comienza después de que el invitado pulse el control.

## Editor local

`/studio` ofrece una vista previa editable de nombre, edad, fecha, hora, ubicación, vestimenta, colores, mapa, música y confirmación. Los cambios se guardan en el `localStorage` del navegador y no se publican. Para publicar, cambia `src/config/event.ts` y despliega de nuevo.

## Accesibilidad, rendimiento y SEO

- Render del evento en servidor, imágenes con `next/image` y carga diferida de secciones interactivas.
- Navegación por teclado, foco visible, textos alternativos y controles etiquetados.
- Se respeta `prefers-reduced-motion` en animaciones y partículas.
- Metadata, Open Graph, Twitter Card y viewport se generan desde la configuración del evento.
- Los enlaces de Google Maps y WhatsApp abren servicios externos; confirmar por WhatsApp no almacena respuestas en esta aplicación.

## Desplegar en Vercel

1. Sube el repositorio a GitHub e impórtalo desde el panel de Vercel.
2. Conserva el preset **Next.js** y los comandos por defecto (`npm install` y `npm run build`). No hacen falta variables de entorno para la configuración actual.
3. Antes de publicar, confirma fecha, hora, dirección completa, número de WhatsApp y autorización de las fotografías.
4. Publica. Cada cambio posterior en `src/config/event.ts` requiere un nuevo despliegue.
