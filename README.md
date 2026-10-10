# Invitación de Emiliano Ulises

Invitación digital mobile-first para el cumpleaños de Emiliano Ulises. La aplicación Angular carga los datos del evento desde `public/data/event.json`, muestra cuenta regresiva, detalles, galería con lightbox, RSVP por WhatsApp, regalo y mapa.

## Requisitos

- Node.js 22 o superior compatible con `package.json`
- npm 10 o superior

## Desarrollo local

```bash
npm ci
npm start
```

Abre `http://localhost:4200`. La raíz muestra directamente la invitación.

## Personalizar el evento

Actualiza `public/data/event.json` para modificar textos, edad, fecha, hora, tema, colores, teléfono de WhatsApp, mapa y rutas de imágenes. Conserva de 5 a 10 elementos en `gallery`; coloca los recursos locales bajo `public/images/` y referencia cada ruta desde la raíz del sitio. El número de WhatsApp debe incluir el prefijo del país y solo dígitos. No hay backend: el formulario construye un mensaje y abre WhatsApp para que el invitado lo envíe.

### Cambiar la portada y el fondo del hero

La imagen de portada se configura desde `heroImage` en `public/data/event.json`. Esa misma imagen se muestra como fondo de la sección principal y se usa para las vistas previas al compartir la invitación.

1. Guarda la nueva imagen dentro de `public/images/emiliano-ulises/` (por ejemplo, `portada-emiliano.jpg`). Prefiere JPG o WebP optimizados y una imagen de buena resolución; una imagen vertical funciona mejor en móvil.
2. Actualiza en `public/data/event.json` los valores `heroImage`, `heroImageAlt`, `heroImageWidth` y `heroImageHeight`. La ruta debe empezar con `/images/`, el texto alternativo debe describir la imagen y las dimensiones deben coincidir con el archivo original.
3. Actualiza también `seo.image` con la misma ruta para que WhatsApp y Facebook utilicen la nueva portada al compartir el enlace.
4. Ejecuta `npm run check:config` y `npm run build:production`, revisa el recorte en móvil y escritorio y vuelve a desplegar.

El hero adapta la imagen para cubrir toda la portada (`object-fit: cover`), así que puede recortar parte de los bordes dependiendo de la pantalla. Para cambiar el punto visible sin editar la configuración del evento, ajusta `object-position` en `.hero-cover-image` de `src/app/features/invitation/event-invitation.component.scss`; por ejemplo, `center 35%` desplaza el encuadre hacia la parte superior y `center 60%` hacia la inferior. Conserva el degradado de `::before` para mantener el contraste del título sobre fondos claros o cargados.

La galería usa carga diferida y abre las imágenes en un lightbox. Solo se incluyen las imágenes disponibles en el proyecto; agrega fotos autorizadas al directorio de recursos para reemplazar las repeticiones actuales.

## Validar y compilar

```bash
npm run check:config
npm run build:production
```

El resultado publicable queda en `dist/emiliano-invitation/browser`. El build genera también metadatos estáticos para Open Graph, vista previa de WhatsApp/Facebook y datos estructurados.

## Desplegar hoy en Vercel

1. Importa el repositorio en Vercel o instala el CLI con `npm i -g vercel`.
2. Usa el comando de build `npm run build:production`.
3. Usa el directorio de salida `dist/emiliano-invitation/browser`.
4. Despliega:

```bash
npx vercel --prod
```

El archivo `vercel.json` configura el build y la reescritura de la ruta antigua `/i/:slug`. Vercel proporciona su URL de despliegue al proceso de build para generar las URL sociales absolutas. Si compilas fuera de Vercel, define `INVITATION_SITE_ORIGIN` con el dominio público antes de compilar para que las vistas previas usen una URL absoluta.

## Accesibilidad y rendimiento

- Componentes standalone y Angular 22, sin dependencias visuales adicionales.
- `NgOptimizedImage`, dimensiones explícitas y carga diferida para imágenes de galería.
- Animación de confeti y transiciones ligeras; se respeta `prefers-reduced-motion`.
- Navegación por teclado, indicadores de foco y etiquetas accesibles.
