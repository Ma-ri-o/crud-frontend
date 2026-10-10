# Recovery report: dependencias de Angular

## Alcance revisado

Inventario recursivo de `angular.json`, `tsconfig*.json`, archivos TypeScript, HTML y SCSS del proyecto. La aplicación tiene una entrada standalone (`src/main.ts`), rutas lazy, plantillas Angular inline en los componentes y estilos globales en `src/styles.scss`. No hay archivos de plantilla Angular externos (`*.html`) ni estilos SCSS de componente separados.

## Dependencias detectadas en el código y configuración

| Paquete | Uso | Grupo |
| --- | --- | --- |
| `@angular/core` | Componentes standalone, DI, signals y change detection | runtime |
| `@angular/common` | `NgOptimizedImage` | runtime |
| `@angular/compiler` | Compilación de templates Angular | runtime |
| `@angular/forms` | Formularios reactivos y validación | runtime |
| `@angular/platform-browser` | `bootstrapApplication`, `Title`, `Meta` | runtime |
| `@angular/router` | Rutas, enlaces y navegación lazy | runtime |
| `rxjs` | Compatibilidad requerida por Angular | runtime/peer |
| `tslib` | Helpers TypeScript emitidos por `importHelpers` | runtime |
| `zone.js` | Polyfill declarado en `angular.json` | runtime |
| `@angular/cli` | Comandos `ng serve` y `ng build` | desarrollo |
| `@angular/build` | Builders `application` y `dev-server` de `angular.json` | desarrollo |
| `@angular/compiler-cli` | Compilación AOT y chequeo estricto de templates | desarrollo |
| `typescript` | Compilación TS; `tsconfig` usa `module: preserve` y `target: ES2022` | desarrollo |
| `sass` | Preprocesador que requiere el stylesheet `src/styles.scss` | desarrollo |

No se detectaron imports de bibliotecas externas de iconos, animación, validación, CSS framework o pruebas.

## Reconstrucción y compatibilidad

`package.json` fue reconstruido con Angular 21.2 para todos los paquetes del framework, TypeScript 5.9, RxJS 7.8 y Zone.js 0.16. Los rangos de peers coinciden: Angular 21 admite TypeScript `>=5.9 <6`, RxJS `^6.5.3 || ^7.4.0` y Zone.js `~0.15.0 || ~0.16.0`. Angular 21 admite Node `^20.19.0 || ^22.12.0 || ^24.0.0`; el entorno detectado usa Node 24.21.0 y npm 11.19.0.

Los builders nombrados por `angular.json` también quedan cubiertos por sus paquetes: `@angular/build:application` y `@angular/build:dev-server`. Se añadieron scripts de `start`, `serve`, `build`, `build:production` y `analyze`. La compatibilidad usada corresponde a la [tabla oficial de versiones de Angular](https://angular.dev/reference/versions) y los rangos de Zone.js a los [peers declarados por Angular](https://github.com/angular/angular/blob/main/packages/core/package.json).

## Errores encontrados

1. El `package.json` encontrado era un manifiesto genérico de `npm init` (`name: invitacion`, sin Angular ni scripts de build/serve).
2. `package-lock.json` era inválido/incompleto para la app: solo contenía metadatos del lockfile y `packages: {}`.
3. Al inicio del análisis Angular CLI, Angular Build, `@angular/forms`, RxJS y Zone.js no estaban instalados de forma utilizable. Después se completó `npm install` y las dependencias quedaron instaladas.
4. El código importa `ReactiveFormsModule` de `@angular/forms`, pero el manifiesto anterior no declaraba ninguna dependencia de Angular.
5. Antes de completar la instalación, npm no podía resolver temporalmente `registry.npmjs.org` (`ENOTFOUND`) y `npm run serve` falló por ausencia del builder. Ambos problemas quedaron resueltos al instalar las dependencias.

## Acciones correctivas y ejecución

1. La instalación actual generó un `package-lock.json` completo. Usa `npm ci` en nuevas instalaciones reproducibles.
2. Inicia el servidor con `npx ng serve` o `npm start`/`npm run serve` (equivalentes a `ng serve`), y abre `http://localhost:4200`.
3. Comprueba la compilación de producción con `npm run build`.
4. Si se vuelve a instalar desde una red corporativa, configura el proxy o el registro npm permitido.

## Estado de verificación

`npm ls --depth=0` finalizó sin dependencias ausentes o inválidas. Versiones instaladas: Angular CLI/Build 21.2.26; Angular Core/Common/Compiler/Forms/Platform Browser/Router/Compiler CLI 21.2.25; TypeScript 5.9.3; RxJS 7.8.2; Zone.js 0.16.3; Sass 1.105.1.

`npm run build` completó correctamente. El bundle inicial de producción fue 292.01 kB bruto y 83.56 kB de transferencia estimada; se generaron bundles lazy para las rutas. `npm run serve -- --host 127.0.0.1` compiló en modo desarrollo y quedó escuchando en `http://127.0.0.1:4200/`. Los archivos JSON de configuración pasaron validación sintáctica y `git diff --check` no reportó problemas.
