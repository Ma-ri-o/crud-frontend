import { Injectable } from '@angular/core';
import { SITE_CONFIG, whatsappLink } from './site-config';

export interface LeadRequest {
  name: string;
  phone: string;
  eventType: string;
  date: string;
  comments: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  buildWhatsAppUrl(request: LeadRequest): string {
    const message = [
      `Hola, soy ${request.name}. Me gustaría solicitar una cotización para Mariachi Mexicanísimo.`,
      `Teléfono: ${request.phone}`,
      `Tipo de evento: ${request.eventType}`,
      `Fecha: ${request.date}`,
      request.comments ? `Comentarios: ${request.comments}` : '',
    ].filter(Boolean).join('\n');
    return whatsappLink(message);
  }

  openWhatsApp(message = 'Hola, me gustaría solicitar una cotización para un evento.'): void {
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  callHref(): string { return `tel:+52${SITE_CONFIG.phone}`; }
}
