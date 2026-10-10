import { Routes } from '@angular/router';

// El landing vive en /; las vistas secundarias se cargan bajo demanda.
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent), title: 'Mariachi Mexicanísimo | La voz de tus mejores momentos' },
  { path: 'galeria', loadComponent: () => import('./features/gallery/gallery-page.component').then((m) => m.GalleryPageComponent), title: 'Galería | Mariachi Mexicanísimo' },
  { path: 'contacto', loadComponent: () => import('./features/contact/contact-page.component').then((m) => m.ContactPageComponent), title: 'Contacto | Mariachi Mexicanísimo' },
  { path: 'reservar', loadComponent: () => import('./features/booking/booking-page.component').then((m) => m.BookingPageComponent), title: 'Solicita tu cotización | Mariachi Mexicanísimo' },
  { path: '**', redirectTo: '' },
];
