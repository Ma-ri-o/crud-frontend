# Plantilla SaaS de invitaciones digitales — documentación técnica

> **Estado:** análisis del código en la rama <code>feat/invitation-template-v2</code>, commit <code>ae3ed43</code> y base <code>506ad5c</code>.  
> **Audiencia:** Desarrollo, QA, Arquitectura, Operación y CAB.  
> **Alcance:** frontend Next.js para invitaciones digitales.

---

## 1. Resumen ejecutivo

### Objetivo

Representar una invitación mediante <code>data/event.json</code>, con temas, secciones opcionales, un editor local y componentes interactivos reutilizables.

### Problema que resuelve

Desacopla el contenido de la página del JSX de una sola celebración. Título, fecha, lugar, tema, medios y activación de secciones se administran mediante configuración; los elementos visuales se reutilizan mediante componentes tipados.

### Alcance funcional implementado

- Renderizado de hero, detalles, historia, galería, mapa, regalos, itinerario, cuenta regresiva, RSVP, pie, música, confetti y acciones de compartir.
- Nueve temas: <code>elegant</code>, <code>luxury</code>, <code>floral</code>, <code>kids</code>, <code>minions</code>, <code>superheroes</code>, <code>princess</code>, <code>space</code> y <code>safari</code>.
- Editor en <code>/studio</code> para contenido, colores, medios y destino RSVP. Guarda un borrador en <code>localStorage</code> o descarga <code>event.json</code>.
- Metadata SEO/Open Graph derivada de la configuración predeterminada durante el build.
- Render de servidor por defecto y carga dinámica de componentes interactivos.

### Impacto en negocio

Reduce el tiempo para cambiar contenido y presentación de una invitación, y establece una base para evolucionar a multi-evento. Aún no implementa cuentas, tenants, publicación remota, backend, persistencia de RSVP ni dashboard multiusuario. La configuración publicada se cambia en <code>data/event.json</code> y requiere nuevo despliegue.

---

## 2. Análisis técnico

### Componentes involucrados

| Capa | Elementos | Responsabilidad |
|---|---|---|
| Configuración | <code>data/event.json</code> | Datos del evento, contenido y flags de secciones. |
| Dominio tipado | <code>src/types/event.ts</code> | Tipos de evento, secciones, temas, galería, historia, regalos, RSVP y cronograma. |
| Temas | <code>src/lib/themes.ts</code>, <code>ThemeProvider.tsx</code> | Tokens visuales y variables CSS. |
| Ruta pública | <code>src/app/page.tsx</code>, <code>InvitationServerRenderer.tsx</code> | Composición server-side según configuración. |
| Override local | <code>EventConfigProvider.tsx</code>, <code>InvitationPage.tsx</code> | Lee borrador del mismo navegador y representa el evento alternativo. |
| Secciones | <code>src/components/invitation/*</code> | Hero, detalles, historia, galería, RSVP, mapa, compartir y controles. |
| Personalización | <code>src/app/studio/page.tsx</code> | Formulario React Hook Form, guardado local y exportación JSON. |
| Presentación | <code>src/app/globals.css</code>, <code>tailwind.config.ts</code> | Sistema responsive, tokens visuales y estilos. |
| SEO/hosting | <code>src/app/layout.tsx</code>, <code>next.config.ts</code> | Metadata y allowlist de imágenes remotas declaradas. |

### Arquitectura actual

Aplicación frontend monolítica con Next.js 15 App Router. La configuración JSON se importa y entrega como props tipadas. La ruta compone la página en servidor; componentes con estado, navegador o eventos DOM son Client Components. El Studio guarda localmente y exporta JSON; no escribe a un servidor.

~~~mermaid
flowchart TD
  JSON[data/event.json] --> Route[src/app/page.tsx]
  Route --> Provider[EventConfigProvider]
  Provider -->|Sin override| SSR[InvitationServerRenderer]
  Provider -->|Override local válido| Client[InvitationPage]
  SSR --> Theme[ThemeProvider / CSS variables]
  Client --> Theme
  Theme --> Sections[Secciones según flags]
  Sections --> Static[Hero, detalles, mapa, historia, cronograma, regalos, footer]
  Sections --> Interactive[Countdown, galería, RSVP, música, compartir, confetti]
  Studio[/studio] --> RHF[React Hook Form]
  RHF --> Local[(localStorage del navegador)]
  RHF --> Export[Descarga event.json]
  Local --> Provider
  RSVP[Formulario RSVP] -->|POST JSON si se configura| Endpoint[Servicio externo]
  RSVP -->|Sin endpoint y con email| Mailto[Correo del invitado]
  Map[Mapa] --> Google[Google Maps]
  QR[QR] --> QRServer[api.qrserver.com]
~~~

### Arquitectura propuesta para evolución SaaS

Mantener <code>EventConfig</code> como contrato de dominio; sustituir el JSON importado estáticamente por un repositorio de eventos resuelto por slug; separar autenticación/autorización de Studio; publicar versiones inmutables de configuración; y agregar API de RSVP con validación, antiabuso, idempotencia, consentimiento/retención y persistencia. Requiere decisiones de negocio y proveedor aún no proporcionadas.

~~~mermaid
flowchart LR
  Guest[Invitado] --> CDN[CDN / Next.js]
  CDN --> Resolver[Resolver /event-slug]
  Resolver --> ConfigAPI[Event Config API]
  ConfigAPI --> Store[(Event Store)]
  Guest --> RSVPAPI[RSVP API]
  RSVPAPI --> Store
  Owner[Organizador] --> Auth[Autenticación y autorización]
  Auth --> Studio[Dashboard multi-evento]
  Studio --> ConfigAPI
~~~

### Flujo de información paso a paso

1. <code>src/app/page.tsx</code> importa <code>data/event.json</code> y lo tipa como <code>EventConfig</code>.
2. La ruta construye el fallback server-rendered y lo entrega a <code>EventConfigProvider</code>.
3. El fallback se muestra en servidor y en el primer render del cliente. Tras hidratar, el provider revisa <code>localStorage</code>.
4. <code>parseEventConfig</code> verifica campos requeridos/flags; si el borrador pasa, <code>InvitationPage</code> lo muestra en cliente.
5. El renderer lee <code>sections</code> y monta componentes habilitados. Historia, galería y cronograma también exigen datos.
6. <code>ThemeProvider</code> transforma el tema y <code>customColors</code> en variables CSS.
7. Studio usa React Hook Form. Guardar persiste JSON en el navegador; descargar genera <code>event.json</code>. Publicarlo requiere reemplazar el archivo y desplegar.
8. RSVP hace <code>fetch</code> a <code>rsvp.endpoint</code>; sin endpoint, construye un <code>mailto:</code> si hay correo. Sin destino no persiste y muestra aviso.
9. Mapas, QR y botones sociales enlazan a proveedores externos desde el navegador.

### Dependencias

| Dependencia | Uso observado |
|---|---|
| Next.js <code>15.5.9</code> / React <code>19.1.0</code> | App Router, render de servidor, metadata y build. |
| TypeScript <code>5.7.2</code> | Tipado de configuración/componentes. |
| Tailwind CSS <code>3.4.17</code> + CSS | Utilidades y sistema visual. |
| Framer Motion <code>12.23.24</code> | Reveal, parallax, galería y decoraciones. |
| Lucide React <code>0.468.0</code> | Iconografía. |
| React Hook Form <code>7.65.0</code> | RSVP y formulario de Studio. |
| <code>@hookform/resolvers</code>, Zod | Declarados como dependencias, no se observó su uso en el flujo actual. |
| Google Maps, QRServer, WhatsApp, Facebook | Integraciones por URL/iframe; operación y privacidad dependen de terceros. |

---

## 3. Análisis de código

### Desglose línea por línea del punto de entrada

**<code>src/app/page.tsx</code> (7 líneas):**

| Línea | Comportamiento |
|---:|---|
| 1 | Importa JSON de evento como dato de build. |
| 2 | Importa <code>EventConfig</code>; el cast no valida el JSON en runtime. |
| 3 | Importa el cliente que puede revisar un override local. |
| 4 | Importa la composición server-side. |
| 6 | Declara la ruta pública <code>/</code>. |
| 7 | Entrega el JSON y el fallback server-rendered al provider. |

**<code>EventConfigProvider.tsx</code> (20 líneas):** línea 1 declara Client Component; líneas 3–5 importan dynamic, hooks y parser; línea 7 define import dinámico con <code>ssr:false</code> de <code>InvitationPage</code>; línea 9 inicia estado sin override; líneas 10–17 consultan y parsean <code>localStorage</code> en <code>useEffect</code> y borran JSON corrupto; línea 19 elige <code>InvitationPage</code> o fallback. El primer render estable conserva SSR; el override aparece después de hidratar.

**<code>InvitationServerRenderer.tsx</code> (32 líneas):** líneas 1–4 importan dynamic, tipo, provider y componentes server; líneas 6–11 declaran imports diferidos de decoración, countdown, galería, música, RSVP y compartir; líneas 13–14 reciben el evento y extraen flags; línea 15 aplica tema; líneas 16–18 montan decoraciones, audio y compartir; líneas 19–30 componen <code>main</code>; Hero y Footer son permanentes, los demás dependen de flags, y story/gallery/timeline también requieren entradas.

### Desglose de métodos y reglas

- **<code>parseEventConfig</code> (<code>src/lib/event-config.ts</code>):** descarta valores no objeto; exige título, fecha, ubicación y tema reconocido; valida que todos los flags sean booleanos; exige arrays de gallery/story/timeline y objetos RSVP/gifts; devuelve configuración o <code>null</code>. No valida ISO, URLs, elementos internos, límites ni eventType.
- **<code>ThemeProvider</code>:** busca el tema en catálogo, mezcla <code>customColors</code> y publica CSS custom properties. El tipado no valida el JSON importado porque se usa un cast.
- **<code>useReveal</code>/<code>ScrollReveal</code>:** define offset fade/slide/zoom, entrada al viewport una sola vez y duración reducida según <code>prefers-reduced-motion</code>. <code>Parallax</code> conecta scroll y transformación a un ref.
- **<code>CountdownSection</code>:** calcula destino local desde <code>date</code>/<code>time</code>; actualiza cada segundo; descompone días/horas/minutos/segundos; limpia el intervalo al desmontar.
- **<code>RSVPSection.submit</code>:** marca sending; con endpoint envía JSON y trata 2xx/error; en ausencia de endpoint con email crea mailto; sin ambos no registra y comunica configuración faltante. RHF valida nombre, correo opcional y 1–12 invitados.
- **<code>GallerySection</code>:** <code>active</code> indica imagen actual; <code>move</code> navega circularmente; el efecto registra Escape/flechas y bloquea scroll; AnimatePresence controla transiciones. No implementa trampa/restauración de foco.
- **<code>ShareTools</code>:** forma URL de WhatsApp/Facebook; intenta Clipboard API y usa <code>prompt</code> como fallback; consulta QRServer al abrir QR.
- **<code>StudioPage</code>:** configura valores iniciales; RHF enlaza campos; <code>saveConfig</code> escribe localStorage; <code>downloadConfig</code> serializa un Blob; cambio/restauración del tema cambia tokens.
- **<code>canOptimizeEventImage</code> y <code>next.config.ts</code>:** extraen hosts HTTPS de imágenes de hero/galería/historia; Next solo optimiza hosts declarados; un host nuevo exige actualizar JSON y reconstruir.

### Variables relevantes

| Variable | Uso |
|---|---|
| <code>event</code> / <code>initialEvent</code> | Configuración activa. |
| <code>sections</code> | Flags de composición. |
| <code>theme</code>, <code>customColors</code> | Tokens visuales. |
| <code>EVENT_CONFIG_STORAGE_KEY</code> | Clave del borrador local. |
| <code>remaining</code>, <code>target</code> | Estado/instante del countdown. |
| <code>active</code>, <code>move</code> | Estado y navegación del lightbox. |
| <code>status</code>, <code>notice</code> | Estado RSVP; no prueban persistencia si se usa mailto. |
| <code>remoteHosts</code>, <code>optimizedHosts</code> | Allowlist de optimización de imágenes. |

### Riesgos de código y operación

1. **Persistencia:** RSVP no tiene servicio propio; éxito real solo se conoce si el endpoint responde 2xx. Mailto solo abre el cliente de correo.
2. **Studio:** sin login, backend ni multiusuario. LocalStorage es editable por el visitante, local al origen/dispositivo y no confiable como CMS.
3. **Contrato:** configuración estática se castea a EventConfig; no hay validación Zod en build. Formatos o campos incorrectos pueden producir salida inválida.
4. **Privacidad:** el endpoint RSVP recibe datos personales; política, CORS, cifrado, consentimiento y retención son externos.
5. **Terceros:** Maps, QRServer y redes reciben solicitudes del navegador. QRServer recibe URL de la invitación.
6. **Accesibilidad:** lightbox soporta Escape/flechas, pero no gestión de foco. La reducción de movimiento es parcial.
7. **Imágenes:** optimización externa solo para host HTTPS declarado en config; preview con host no listado no pasa por optimizador Next.
8. **Código heredado:** componentes de la antigua invitación permanecen en <code>src/components/</code>; no aparecen en la nueva composición pero añaden deuda.
9. **SaaS:** no hay slugs, aislamiento de clientes ni publicación; una configuración global representa un evento.

---

## 4. Diagrama de despliegue y datos

~~~mermaid
sequenceDiagram
  participant B as Browser invitado
  participant N as Next.js / Vercel
  participant J as data/event.json
  participant R as RSVP externo opcional
  participant G as Google Maps / QRServer
  B->>N: GET /
  N->>J: Import de configuración
  N-->>B: HTML SSR + chunks interactivos
  B->>B: Revisa override localStorage después de hidratar
  B->>G: Carga iframe/QR cuando corresponde
  B->>R: POST JSON si se configura endpoint
  R-->>B: 2xx/error; contrato definido por tercero
~~~

---

## 5. Casos de uso

### Flujo exitoso: publicar configuración

1. Organizador actualiza contenido e imágenes en <code>data/event.json</code>.
2. Build incorpora metadata y hosts HTTPS de imágenes.
3. Vercel genera páginas y sirve HTML con flags activos.
4. Invitado consulta detalles, abre ubicación/compartir y envía RSVP al destino configurado.

**Esperado:** solo se muestran secciones habilitadas y con el contenido requerido; metadata refleja configuración del build.

### Flujo alterno: preview local

1. Usuario abre <code>/studio</code>, edita campos y guarda.
2. Configuración se almacena en el <code>localStorage</code> de ese navegador.
3. Al volver a <code>/</code>, provider lee y valida el JSON tras hidratar.
4. Si es válido, se muestra renderer cliente; descarga permite exportar para publicación.

**Esperado:** afecta solo ese navegador. Metadata SSR sigue siendo la del evento estático desplegado.

### Casos de error

| Situación | Comportamiento actual | Límite |
|---|---|---|
| JSON local corrupto | Captura excepción, elimina override y mantiene fallback. | La invitación base sigue disponible. |
| JSON sintáctico válido pero incompleto | Parser rechaza campos/flags requeridos. | No valida profundamente entradas ni URLs. |
| Endpoint RSVP no responde/estado no 2xx | Muestra error. | Sin reintentos ni cola. |
| Endpoint y correo ausentes | Muestra aviso; no guarda. | No habilitar para invitados reales sin destino. |
| Host de imagen no permitido | Render sin optimizador. | Requiere agregar el host en configuración y build. |
| QRServer/Google no disponible | QR/mapa puede fallar independientemente. | No hay fallback de proveedor. |

---

## 6. Tabla de cambios

| Archivo/grupo | Tipo | Motivo | Impacto |
|---|---|---|---|
| <code>data/event.json</code> | Configuración | Separar contenido del JSX. | Datos consumidos por sitio. |
| <code>src/types/event.ts</code> | Contratos | Tipar evento y secciones. | Compilación; no valida JSON por sí solo. |
| <code>src/lib/themes.ts</code>, <code>ThemeProvider.tsx</code> | Temas | Reutilizar nueve identidades visuales. | Presentación frontend. |
| <code>Sections.tsx</code> | Componentes server | Hero, historia, detalles, mapa, regalos, timeline, footer. | HTML SSR y anclas. |
| <code>Animations.tsx</code> | Motion/hooks | Presets y reveal. | Interactividad cliente. |
| <code>CountdownSection.tsx</code>, <code>GallerySection.tsx</code>, <code>MusicPlayer.tsx</code>, <code>FloatingDecorations.tsx</code> | Islas cliente | Timer, lightbox, audio y decoración. | JS del navegador. |
| <code>RSVPSection.tsx</code> | Formulario cliente | Capturar y entregar respuesta configurable. | Endpoint/email; sin persistencia propia. |
| <code>ShareTools.tsx</code> | Compartir y QR | WA/Facebook, clipboard, QR. | Solicitudes externas. |
| <code>InvitationServerRenderer.tsx</code>, <code>EventConfigProvider.tsx</code>, <code>InvitationPage.tsx</code> | Orquestación | SSR por defecto y preview local. | Override dinámico del browser. |
| <code>src/app/studio/page.tsx</code> | Editor local | Edición y export JSON. | Persistencia local, no publicación remota. |
| <code>src/app/page.tsx</code>, <code>layout.tsx</code> | Rutas/metadata | Configurar render y SEO. | HTML/OG/Twitter. |
| <code>globals.css</code>, <code>tailwind.config.ts</code> | Estilos | Responsive y sistema visual. | Solo frontend. |
| <code>next.config.ts</code>, <code>src/lib/event-images.ts</code> | Optimización | Allowlist exacta de imágenes HTTPS. | Build/deployment. |
| <code>README.md</code>, este documento | Documentación | Operación y arquitectura. | Mantenimiento. |
| Componentes legacy en <code>src/components/</code> | Deuda | Resto de invitación anterior. | No usados por nueva ruta, posible confusión. |

---

## 7. Impacto técnico por plataforma

| Área | Impacto confirmado |
|---|---|
| Frontend | Next.js 15/React, mobile-first, Server/Client Components, CSS tokens, Framer Motion, RHF y metadata. |
| Backend | No hay backend de negocio. RSVP opcional delega a endpoint externo. |
| Base de datos | No existe conexión ni esquema. LocalStorage solo opera en navegador. |
| Host/infraestructura | Compatible con Vercel/Next.js; no se especifican variables, CDN ni deployment objetivo. |
| APIs externas | Google Maps, QRServer, WhatsApp, Facebook, Clipboard API y RSVP opcional. |

---

## 8. Estrategia de pruebas

> Esta sección propone pruebas y no afirma que hayan sido ejecutadas. La evidencia observada fue <code>npm run build</code> exitoso; no se encontró script <code>test</code> y no se midió Lighthouse.

### Casos positivos

| ID | Caso/datos | Resultado esperado |
|---|---|---|
| P01 | Config default válida | <code>/</code> renderiza hero, countdown, detalles, RSVP y footer. |
| P02 | Activar map/gallery/story/timeline con datos | Secciones visibles y links/anclas correctos. |
| P03 | Probar los nueve temas | Tokens, fondo y decoración cambian sin error. |
| P04 | Guardar override válido desde Studio | Al volver a ruta, se muestra contenido local. |
| P05 | Exportar y reemplazar JSON | JSON parsea y build refleja página y metadata. |
| P06 | Mock endpoint RSVP 2xx | Estado de éxito. |
| P07 | RSVP por mailto | Correo prellenado; el mensaje no debe afirmar que fue entregado. |
| P08 | Host HTTPS declarado | Build permite host y Next optimiza imágenes. |
| P09 | Teclado y reducción de movimiento | Controles alcanzables y animación reducida donde implementada. |

### Casos negativos

| ID | Caso | Resultado esperado |
|---|---|---|
| N01 | JSON local corrupto | Se limpia override y se sirve fallback. |
| N02 | Tema/campo requerido inválido | Publicación bloqueada por validador; hoy falta validación build-time, por lo que la prueba expone una brecha. |
| N03 | Endpoint RSVP 4xx/5xx, CORS o timeout | Error visible; no reportar registro exitoso. |
| N04 | Formulario vacío, correo inválido, invitados 0/13 | RHF bloquea envío y muestra validaciones. |
| N05 | Fecha pasada o mal formada | Definir regla de negocio; rechazar o countdown en cero. |
| N06 | Falla QRServer/Maps | Resto del sitio utilizable; implementar fallback. |
| N07 | URL HTTP/host no listado | Build no falla; desoptimiza o validador rechaza según regla futura. |
| N08 | Storage bloqueado/cuota llena | Informar claramente que no se guardó; UI actual solo restablece indicador. |

### Datos, resultados y gates sugeridos

Usar fixture neutral sin PII; cubrir varias categorías/temas, fecha futura/pasada/inválida, campos opcionales, endpoint simulado 2xx/4xx/5xx/timeout, y URLs locales/HTTPS permitidas/no listadas/HTTP. Ejecutar build, typecheck/lint, pruebas unitarias del parser/temas/countdown, integración RSVP y E2E responsive/teclado. Medir Lighthouse móvil en preview con evento real. El umbral >95 no debe aprobarse sin reporte reproducible y definición de categoría/página.

---

## 9. Plan de retorno

### Procedimiento

1. Si solo cambia configuración, restaurar la versión anterior de <code>data/event.json</code>, reconstruir y desplegar.
2. Si ya se publica en Vercel, promover la última deployment estable desde Vercel.
3. Si está integrado, revertir en orden inverso <code>ae3ed43</code> y luego <code>506ad5c</code>, sujeto a reglas GitOps/branch protection.
4. Revalidar <code>/</code>, <code>/studio</code>, enlaces y entrega RSVP.
5. No eliminar respuestas del endpoint externo; el repositorio no controla retención.

### Riesgos y estimados

- CDN/metadata pueden permanecer cacheados; invalidar o revalidar deployment.
- Configuración/endpoint externo no se revierte por Git.
- Estimado orientativo: 10–20 min para promover deployment estable; 20–45 min para revertir commits, compilar y validar manualmente.
- No se proporcionaron política release, dueño Vercel, ventana CAB ni responsables de RSVP.

---

## 10. Resumen para CAB

**Cambio:** plantilla digital configurable con temas y secciones reutilizables, SSR, personalización local y RSVP hacia destino configurado.  
**Beneficio:** reducir cambios de frontend por evento y sentar base para multi-evento.  
**Impacto:** frontend Next.js/Vercel; no hay cambios a base de datos ni backend propio. Maps, QR y RSVP dependen de integraciones externas.  
**Riesgo principal:** Studio carece de autenticación/persistencia remota; RSVP necesita endpoint/email probado; QR/Maps implican terceros.  
**Prueba observada:** build Next.js exitoso en la rama; no hay Lighthouse ni pruebas funcionales automatizadas documentadas.  
**Retorno:** restaurar configuración o deployment estable; revertir commits en orden inverso si ya se integraron.  
**Decisión CAB:** aprobar publicación tras confirmar propietario/controles RSVP, privacidad de proveedores y pruebas del evento real. No se proporcionaron fecha, ambiente objetivo, criticidad ni aprobadores.

---

## 11. Uso en Confluence

Este documento está en Markdown listo para pegar. Tablas/listas son estándar. Los diagramas requieren macro Mermaid habilitada; de lo contrario, conservar los bloques como fuente o exportar las imágenes.

---

## 12. Buenas prácticas, deuda técnica e información faltante

### Mejoras prioritarias

1. Validar JSON con Zod (ya declarado) y script <code>validate:event</code>; fijar formatos, timezone, campos por eventType, límites y política HTTPS.
2. Corregir mensaje RSVP mailto: hoy se marca sent al abrir aplicación de correo; indicar “correo preparado” o usar endpoint confirmado.
3. Asegurar Studio antes de compartirlo: autenticación/autorización por tenant, API, historial, aprobación de publicación, CSRF/rate limits.
4. Eliminar o archivar componentes legacy para evitar confusión.
5. Mejorar accesibilidad: focus trap/restauración, contraste WCAG por tema, teclado y anuncios no intrusivos para countdown.
6. Evaluar self-host de QR, alternativas de mapa/consentimiento y documentación de datos enviados a terceros.
7. Medir Lighthouse/Core Web Vitals con imágenes reales; revisar LCP, CLS, fuentes, mobile JS y costo de Framer Motion. El >95 no está verificado.
8. Añadir observabilidad RSVP sin registrar PII innecesaria.
9. Versionar contrato (<code>schemaVersion</code>), migrar configs e implementar preview/rollback; no guardar secretos en JSON.
10. Agregar pruebas unitarias, integración, E2E, axe y Lighthouse CI con umbrales acordados.

### Información no proporcionada

- Proveedor/contrato/credenciales del endpoint RSVP y almacenamiento de respuestas.
- Dominio público, CDN, variables de entorno, caché y ambientes Vercel.
- Política de privacidad, consentimiento, retención de PII e idiomas finales.
- Reglas tenant, roles y autorización/publicación.
- Zona horaria y reglas por tipo de evento, límites de aforo.
- Aprobación de QR/Maps y mediciones Lighthouse.
