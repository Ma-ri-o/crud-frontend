import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/studio/studio-home.component').then((m) => m.StudioHomeComponent), title: 'Invitation Studio | Invitaciones digitales' },
  { path: 'studio', loadComponent: () => import('./features/studio/studio-editor.component').then((m) => m.StudioEditorComponent), title: 'Editor | Invitation Studio' },
  { path: 'i/:slug', loadComponent: () => import('./features/invitation/event-page.component').then((m) => m.EventPageComponent) },
  { path: '**', redirectTo: '' },
];
