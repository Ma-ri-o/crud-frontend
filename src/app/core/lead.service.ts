import { Injectable } from '@angular/core';
import { SITE_CONFIG, whatsappLink } from './site-config';

export interface LeadRequest {
  name: string;
  phone: string;
  eventType: string;
  date: string;
  municipality: string;
  address: string;
  references: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  buildWhatsAppUrl(request: LeadRequest): string {
    const [year, month, day] = request.date.split('-');
    const formattedDate = year && month && day ? `${day}/${month}/${year}` : request.date;
    const message = [
      'Hola, deseo solicitar una cotización para Mariachi Mexicanísimo.',
      '',
      `Nombre: ${request.name}`,
      `Teléfono: ${request.phone}`,
      `Evento: ${request.eventType}`,
      `Fecha: ${formattedDate}`,
      `Municipio: ${request.municipality}`,
      `Dirección: ${request.address}`,
      `Comentarios: ${request.references || 'Sin comentarios adicionales.'}`,
    ].filter(Boolean).join('\n');
    return whatsappLink(message);
  }

  openWhatsApp(message = 'Hola, me gustaría solicitar una cotización para un evento.'): void {
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  callHref(): string { return `tel:+52${SITE_CONFIG.phone}`; }
}
