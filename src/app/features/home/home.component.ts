import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../core/seo.service';
import { SITE_CONFIG, whatsappLink } from '../../core/site-config';
import { LeadService } from '../../core/lead.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { BookingFormComponent } from '../../shared/booking-form.component';
import { trapDialogTab } from '../../shared/dialog-accessibility';

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
            <button class="button button-outline" type="button" (click)="openBooking($event)"><span aria-hidden="true">▣</span> Reservar</button>
            <button class="button button-gold" type="button" (click)="openBooking($event)"><span aria-hidden="true">✦</span> Cotizar</button>
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
          @for (benefit of SITE_CONFIG.benefits; track benefit) { <li><span aria-hidden="true">✓</span>{{ benefit }}</li> }
        </ul>
      </section>

      <section class="services section" id="servicios" aria-labelledby="services-title">
        <div class="section-heading"><p class="eyebrow">MÚSICA PARA TU OCASIÓN</p><h2 id="services-title">¿Qué celebramos?</h2></div>
        <ul class="service-grid">
          @for (service of SITE_CONFIG.services; track service.title) {
            <li class="service-card"><span class="service-icon" aria-hidden="true">{{ service.icon }}</span><div><h3>{{ service.title }}</h3><p>{{ service.description }}</p></div></li>
          }
        </ul>
      </section>

      <section class="gallery section" id="galeria" aria-labelledby="gallery-title">
        <div class="section-heading"><p class="eyebrow">UN POCO DE NUESTRO TRABAJO</p><h2 id="gallery-title">Momentos Mexicanísimos</h2><p>Selecciona una foto para verla en grande.</p></div>
        @defer (on viewport; prefetch on idle) { <mm-gallery /> } @placeholder { <div class="gallery-placeholder" aria-hidden="true">La galería aparecerá aquí</div> }
      </section>

      <section class="social-proof section" aria-labelledby="social-proof-title">
        <div class="section-heading"><p class="eyebrow">MÚSICA PARA DISFRUTAR</p><h2 id="social-proof-title">Videos y experiencias</h2></div>
        <div class="social-proof-grid">
          <div class="proof-card">
            <h3>Videos del mariachi</h3>
            @if (SITE_CONFIG.videos.length) {
              <div class="video-grid">
                @for (video of SITE_CONFIG.videos; track video.youtubeId) {
                  <div class="video-card">
                    <a class="video-facade" [href]="videoUrl(video.youtubeId)" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Ver video: ' + video.title + ' en YouTube'">
                      <img [src]="videoThumbnail(video.youtubeId)" [alt]="'Miniatura del video: ' + video.title" width="480" height="270" loading="lazy">
                      <span aria-hidden="true">▶</span>
                    </a>
                    <p>{{ video.title }}</p>
                  </div>
                }
              </div>
            } @else {
              <p>Aún no hay videos configurados. Mira las publicaciones y presentaciones que compartimos.</p>
              <a class="text-link" [href]="SITE_CONFIG.youtubeUrl" target="_blank" rel="noopener noreferrer">Buscar videos en YouTube <span aria-hidden="true">↗</span></a>
            }
          </div>
          <div class="proof-card">
            <h3>Lo que cuentan nuestras familias</h3>
            @if (SITE_CONFIG.testimonials.length) {
              @for (testimonial of SITE_CONFIG.testimonials; track testimonial.name + testimonial.event) {
                <figure class="testimonial-card"><blockquote>“{{ testimonial.comment }}”</blockquote><figcaption><strong>{{ testimonial.name }}</strong><span>{{ testimonial.event }}</span></figcaption></figure>
              }
            } @else {
              <p>Queremos compartir opiniones reales, con permiso de quienes nos invitan a sus celebraciones.</p>
              <a class="text-link" [href]="shareExperienceHref" target="_blank" rel="noopener noreferrer">Cuéntanos tu experiencia <span aria-hidden="true">↗</span></a>
            }
          </div>
        </div>
      </section>

      <section class="qr-section" aria-label="Cotiza por WhatsApp">
        <div class="qr-card"><div><p class="eyebrow">A UN ESCANEO DE CELEBRAR</p><h2>Escanea para cotizar por WhatsApp</h2><p>Cuéntanos la fecha y el tipo de evento. Te atendemos personalmente.</p><a class="text-link" [href]="whatsappHref" target="_blank" rel="noopener noreferrer">Abrir WhatsApp <span aria-hidden="true">↗</span></a></div><a class="qr-image" [href]="SITE_CONFIG.qrTarget" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp"><img [ngSrc]="SITE_CONFIG.qrImage" width="160" height="160" alt="Código QR para cotizar por WhatsApp"></a></div>
      </section>
    </main>

    <footer class="footer"><a class="brand" href="#inicio"><span class="brand-mark">M<span>✦</span></span><span>MARIACHI <b>MEXICANÍSIMO</b></span></a><p>La voz de tus mejores momentos · {{ SITE_CONFIG.serviceArea }}</p><div class="footer-social"><a [href]="SITE_CONFIG.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a><a [href]="SITE_CONFIG.youtubeUrl" target="_blank" rel="noopener noreferrer">YouTube</a><a [href]="whatsappHref" target="_blank" rel="noopener noreferrer">WhatsApp</a></div><small>© {{ year }} Mariachi Mexicanísimo</small></footer>

    @if (bookingOpen()) {
      <div class="dialog-backdrop" (click)="onBookingBackdropClick($event)" (keydown)="onBookingKeydown($event)">
        <section #bookingDialog class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-description" tabindex="-1">
          <mm-booking-form (close)="closeBooking()" />
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly SITE_CONFIG = SITE_CONFIG;
  readonly bookingOpen = signal(false);
  readonly year = new Date().getFullYear();
  private readonly seo = inject(SeoService);
  private readonly leads = inject(LeadService);
  private bookingTrigger?: HTMLElement;
  private previousBodyOverflow = '';
  @ViewChild('bookingDialog') private readonly bookingDialog?: ElementRef<HTMLElement>;
  readonly callHref = this.leads.callHref();
  readonly whatsappHref = whatsappLink('Hola, me interesa contratar al Mariachi Mexicanísimo. ¿Podrían brindarme información y cotización?');
  readonly shareExperienceHref = whatsappLink('Hola, ya disfruté de una presentación de Mariachi Mexicanísimo y quiero compartir mi experiencia.');

  constructor() {
    this.seo.updateFromSiteConfig(SITE_CONFIG);
  }

  openBooking(event: Event): void {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    this.bookingTrigger = event.currentTarget;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.bookingOpen.set(true);
    requestAnimationFrame(() => this.bookingDialog?.nativeElement.focus());
  }

  closeBooking(): void {
    this.bookingOpen.set(false);
    document.body.style.overflow = this.previousBodyOverflow;
    requestAnimationFrame(() => this.bookingTrigger?.focus({ preventScroll: true }));
  }

  onBookingBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeBooking();
  }

  onBookingKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeBooking();
      return;
    }
    const dialog = this.bookingDialog?.nativeElement;
    if (dialog) trapDialogTab(event, dialog);
  }

  videoUrl(youtubeId: string): string {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
  }

  videoThumbnail(youtubeId: string): string {
    return `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
  }
}
