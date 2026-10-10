# Guía de desarrollo

## Principios

1. **KISS**: preferir componentes y flujos simples.
2. **JSON antes que hardcode** para copy/datos por evento, no para comportamiento arbitrario.
3. Componentes standalone y responsabilidades cohesionadas.
4. Temas desacoplados mediante tokens, no copias completas de templates.
5. Fallas observables: informar errores de carga/validación; no devolver éxito vacío.
6. Accesibilidad, mobile-first y performance como parte de terminado.
7. Mantener instalación reproducible y lockfile.

## Estructura Angular

- `core/`: tipos compartidos, carga/validación de invitación, SEO y servicios de API.
- `features/<feature>/`: páginas/componentes autónomos por capacidad.
- `app.routes.ts`: entradas y carga lazy con `loadComponent`.
- `main.ts`: providers globales (HttpClient, router, Service Worker).
- `public/config/events/`: contenido de eventos y catálogo.
- `public/`: recursos estáticos servidos con path desde raíz.

No colocar acceso a APIs en componentes de presentación si existe un servicio de dominio apropiado. Evitar estado global mutable para una invitación cuando una input configurada es suficiente.

## Naming y formato

- Archivos Angular en kebab-case y sufijo descriptivo (`*.component.ts`, `*.service.ts`).
- Componentes prefijados `is-` para Invitation Studio; conservar prefijo existente en la landing Mariachi.
- Identificadores de evento en minúsculas y guiones.
- Tipos de contrato compartidos en `core/invitation.models.ts`.
- Mantener idioma/copy del producto en español y documentar decisiones técnicas en español, como esta guía.
- Sigue formato local existente; no reformatees módulos no relacionados.

## Standalone Components

Usa `standalone: true`, declara explícitamente `imports`, marca `OnPush` y carga page features lazy desde el router. Crea componente dedicado cuando una pieza tenga comportamiento o reutilización; no fragmentes markup estático sin beneficio.

## Signals y RxJS

- Usa Signals para estado de UI sincrónico y derivaciones (`computed`).
- Mantén efectos de red en servicios (`HttpClient` retorna Observable).
- Convierte/compone Observables con RxJS en los límites necesarios; cancela flujos de rutas anteriores al cambiar parámetros.
- Evita duplicar estado derivado que se puede calcular.
- Protege accesos a `window`/`localStorage` si se introduce SSR en el futuro.

## Contratos y JSON

Al cambiar `EventConfig`:

1. Ajusta interfaces y validación runtime; no confíes solo en cast TypeScript de JSON.
2. Actualiza validador `scripts/validate-events.mjs`, ejemplos, catálogo y documentación.
3. Define tratamiento de versiones (`schemaVersion`) y compatibilidad.
4. Prueba documentos válidos/invalidos, arrays, campos opcionales y slug mismatch.
5. Mantén runtime validator y CLI validator con reglas coherentes.

No codifiques datos personales reales ni metas referencias inexistentes a recursos. No presentes el MVP como persistencia backend.

## Formularios, errores y seguridad

- Usa Reactive Forms y validadores Angular para campos interactivos.
- No construyas HTML confiando en strings de JSON; Angular interpolation evita introducir `innerHTML` por facilidad.
- Valida URL externas y añade `rel="noopener"` para ventanas externas.
- No guardes RSVP/PII en logs, query strings o APIs de contenido.
- No ocultes errores de red/configuración. Ofrece mensaje y diagnóstico accionable.
- Media y fuentes deben contar con autorización y ser adecuadas para distribución.

## Patrones prohibidos o a evitar

- Copiar la invitación completa por cada tipo de evento.
- `any` para evadir modelado, casts de JSON sin validación runtime.
- Subscripciones no limpiadas ni request de ruta stale.
- Accesos a APIs con lógica acoplada al template.
- Autoplay de audio/animaciones intrusivas.
- Valores ficticios presentados como datos de negocio confirmados.
- Fallback que convierte error de carga en una invitación equivocada.
- Elevar budgets o silenciar errores para hacer pasar un build.

## Validación local y revisión

```bash
npm ci
npm run check:config
npm run build:production
git diff --check
```

Antes de cerrar una tarea revisa el diff, cambios de recursos/catálogo, consola y experiencia móvil. Añade pruebas automatizadas cuando se incorpora lógica nueva; actualmente el repositorio ofrece checker JSON y build, no una suite específica de tests.
