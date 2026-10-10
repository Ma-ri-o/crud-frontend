import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingFormComponent } from '../../shared/booking-form.component';

@Component({ selector: 'mm-booking-page', standalone: true, imports: [RouterLink, BookingFormComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="simple-page"><a routerLink="/" class="back-link">← Inicio</a><mm-booking-form (submitted)="submitted.set(true)" />@if(submitted()){<p role="status">WhatsApp se abrió para continuar tu solicitud.</p>}</main>` })
export class BookingPageComponent { readonly submitted = signal(false); }
