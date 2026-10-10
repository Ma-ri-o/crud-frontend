import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/invitation/event-page.component').then((m) => m.EventPageComponent) },
  { path: 'i/:slug', loadComponent: () => import('./features/invitation/event-page.component').then((m) => m.EventPageComponent) },
  { path: '**', redirectTo: '' },
];
