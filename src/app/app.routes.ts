import { Routes } from '@angular/router';

// Cada experiencia se carga bajo demanda; la landing de Mariachi se conserva como plantilla comercial.
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/studio/studio-home.component').then((m) => m.StudioHomeComponent), title: 'Invitation Studio | Invitaciones digitales' },
  { path: 'studio', loadComponent: () => import('./features/studio/studio-editor.component').then((m) => m.StudioEditorComponent), title: 'Editor | Invitation Studio' },
  { path: 'i/:slug', loadComponent: () => import('./features/invitation/event-page.component').then((m) => m.EventPageComponent) },
  { path: 'mariachi', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent), title: 'Mariachi Mexicanísimo | La voz de tus mejores momentos' },
  { path: 'galeria', loadComponent: () => import('./features/gallery/gallery-page.component').then((m) => m.GalleryPageComponent), title: 'Galería | Mariachi Mexicanísimo' },
  { path: 'contacto', loadComponent: () => import('./features/contact/contact-page.component').then((m) => m.ContactPageComponent), title: 'Contacto | Mariachi Mexicanísimo' },
  { path: 'reservar', loadComponent: () => import('./features/booking/booking-page.component').then((m) => m.BookingPageComponent), title: 'Solicita tu cotización | Mariachi Mexicanísimo' },
  { path: '**', redirectTo: '' },
];
