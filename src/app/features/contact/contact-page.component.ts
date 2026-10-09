import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG, whatsappLink } from '../../core/site-config';
import { LeadService } from '../../core/lead.service';

@Component({ selector: 'mm-contact-page', standalone: true, imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="simple-page"><a routerLink="/" class="back-link">← Inicio</a><p class="eyebrow">HABLEMOS DE TU EVENTO</p><h1>Contacto</h1><p>Atención personal con {{ SITE_CONFIG.attendant }} en {{ SITE_CONFIG.serviceArea }}.</p><div class="actions"><a class="button button-primary" [href]="whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a><a class="button button-outline" [href]="phone">Llamar · {{ SITE_CONFIG.phone }}</a></div></main>` })
export class ContactPageComponent {
  readonly SITE_CONFIG = SITE_CONFIG;
  readonly whatsapp = whatsappLink('Hola, me interesa contratar al Mariachi Mexicanísimo.');
  readonly phone = inject(LeadService).callHref();
}
