import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../core/seo.service';
import { SITE_CONFIG, whatsappLink } from '../../core/site-config';
import { LeadService } from '../../core/lead.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { BookingFormComponent } from '../../shared/booking-form.component';

@Component({
  selector: 'mm-home', standalone: true,
  imports: [NgOptimizedImage, GalleryComponent, BookingFormComponent],
  template: `
    <header class="site-header">
      <a class="brand" href="#inicio" aria-label="Mariachi Mexicanísimo, inicio"><span class="brand-mark">M<span>✦</span></span><span>MARIACHI <b>MEXICANÍSIMO</b></span></a>
      <a class="header-phone" [href]="callHref"><span aria-hidden="true">☎</span> {{ SITE_CONFIG.phone }}</a>
    </header>

    <main>
      <section class="hero" id="inicio" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-line"></span> MÚSICA MEXICANA PARA CELEBRAR</p>
          <h1 id="hero-title">Mariachi<br><em>Mexicanísimo</em></h1>
          <p class="tagline">“La voz de tus mejores momentos”</p>
          <p class="description">Serenatas, Bodas, XV Años, Cumpleaños, Bautizos y Eventos Especiales.</p>
          <p class="attendant">Atención: <strong>{{ SITE_CONFIG.attendant }}</strong></p>
          <div class="actions" aria-label="Contacta o reserva tu mariachi">
            <a class="button button-primary" [href]="whatsappHref" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◉</span> WhatsApp</a>
            <a class="button button-outline" [href]="callHref"><span aria-hidden="true">☎</span> Llamar</a>
            <button class="button button-outline" type="button" (click)="bookingOpen.set(true)"><span aria-hidden="true">▣</span> Reservar</button>
            <button class="button button-gold" type="button" (click)="bookingOpen.set(true)"><span aria-hidden="true">✦</span> Cotizar</button>
          </div>
          <p class="location"><span aria-hidden="true">⌖</span> {{ SITE_CONFIG.serviceArea }}</p>
        </div>
        <div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="arch"></div><div class="guitar"><span></span></div><p>TRADICIÓN · ALEGRÍA · FAMILIA</p></div>
        <div class="social-strip" aria-label="Redes sociales">
          <a [href]="SITE_CONFIG.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
          <a [href]="SITE_CONFIG.youtubeUrl" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
          <a [href]="whatsappHref" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">◉</a>
        </div>
      </section>

      <section class="benefits section" aria-labelledby="benefits-title">
        <div class="section-heading"><p class="eyebrow">TU CELEBRACIÓN, EN BUENAS MANOS</p><h2 id="benefits-title">Música que reúne</h2></div>
        <ul class="benefit-list">
          @for (benefit of benefits; track benefit) { <li><span aria-hidden="true">✓</span>{{ benefit }}</li> }
        </ul>
      </section>

      <section class="gallery section" id="galeria" aria-labelledby="gallery-title">
        <div class="section-heading"><p class="eyebrow">UN POCO DE NUESTRO TRABAJO</p><h2 id="gallery-title">Momentos Mexicanísimos</h2><p>Toca una foto para verla en grande.</p></div>
        @defer (on viewport; prefetch on idle) { <mm-gallery /> } @placeholder { <div class="gallery-placeholder" aria-hidden="true">La galería aparecerá aquí</div> }
        <p class="gallery-edit-note">Galería de muestra: reemplaza las imágenes por fotografías del mariachi.</p>
      </section>

      <section class="qr-section" aria-label="Cotiza por WhatsApp">
        <div class="qr-card"><div><p class="eyebrow">A UN ESCANEO DE CELEBRAR</p><h2>Escanea para cotizar por WhatsApp</h2><p>Cuéntanos la fecha y el tipo de evento. Te atendemos personalmente.</p><a class="text-link" [href]="whatsappHref" target="_blank" rel="noopener noreferrer">Abrir WhatsApp <span aria-hidden="true">↗</span></a></div><a class="qr-image" [href]="SITE_CONFIG.qrTarget" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp"><img [ngSrc]="SITE_CONFIG.qrImage" width="160" height="160" alt="Código QR para cotizar por WhatsApp"></a></div>
      </section>
    </main>

    <footer class="footer"><a class="brand" href="#inicio"><span class="brand-mark">M<span>✦</span></span><span>MARIACHI <b>MEXICANÍSIMO</b></span></a><p>La voz de tus mejores momentos · {{ SITE_CONFIG.serviceArea }}</p><div class="footer-social"><a [href]="SITE_CONFIG.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a><a [href]="SITE_CONFIG.youtubeUrl" target="_blank" rel="noopener noreferrer">YouTube</a><a [href]="whatsappHref" target="_blank" rel="noopener noreferrer">WhatsApp</a></div><small>© {{ year }} Mariachi Mexicanísimo</small></footer>

    @if (bookingOpen()) { <div class="dialog-backdrop" role="presentation" (click)="bookingOpen.set(false)"><div class="dialog-panel" role="presentation" (click)="$event.stopPropagation()"><mm-booking-form (close)="bookingOpen.set(false)" /></div></div> }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly SITE_CONFIG = SITE_CONFIG;
  readonly bookingOpen = signal(false);
  readonly year = new Date().getFullYear();
  readonly benefits = ['Atención inmediata', 'Cotización sin compromiso', 'Eventos sociales y empresariales', 'Repertorio amplio', 'Disponibilidad para reservas'];
  private readonly seo = inject(SeoService);
  private readonly leads = inject(LeadService);
  readonly callHref = this.leads.callHref();
  readonly whatsappHref = whatsappLink('Hola, me interesa contratar al Mariachi Mexicanísimo. ¿Podrían brindarme información y cotización?');

  constructor() {
    this.seo.update('Mariachi Mexicanísimo | Serenatas y eventos en Estado de México', 'La voz de tus mejores momentos. Serenatas, bodas, XV años y eventos en la Zona Oriente del Estado de México. Cotiza por WhatsApp.');
  }
}
