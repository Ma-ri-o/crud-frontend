import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

export interface GalleryPhoto { src: string; alt: string; caption: string; }

@Component({
  selector: 'mm-gallery', standalone: true, imports: [NgOptimizedImage],
  template: `
    <div class="gallery-grid">
      @for (photo of photos; track photo.src; let i = $index) {
        <button class="gallery-tile" type="button" (click)="open(i)" [attr.aria-label]="'Ampliar: ' + photo.alt">
          <img [ngSrc]="photo.src" width="800" height="600" sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw" [priority]="i === 0" [alt]="photo.alt">
          <span>{{ photo.caption }} <b aria-hidden="true">↗</b></span>
        </button>
      }
    </div>
    @if (selected(); as photo) {
      <div class="lightbox" role="dialog" aria-modal="true" [attr.aria-label]="photo.alt" (click)="close()" (keydown.escape)="close()" tabindex="0">
        <button type="button" class="lightbox-close" aria-label="Cerrar imagen" (click)="close()">×</button>
        <img [ngSrc]="photo.src" width="1200" height="900" sizes="90vw" [alt]="photo.alt" (click)="$event.stopPropagation()">
        <p>{{ photo.caption }}</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  // Copias optimizadas de la carpeta img-mariachi; amplía a 6 si agregas más.
  readonly photos: GalleryPhoto[] = [
    { src: '/images/mariachi/serenata-escenario.jpeg', alt: 'Cantante de mariachi durante una serenata en un escenario decorado.', caption: 'Serenatas que emocionan' },
    { src: '/images/mariachi/mariachi-formacion.jpeg', alt: 'Mariachi Mexicanísimo en formación con sus instrumentos.', caption: 'Tradición en cada evento' },
    { src: '/images/mariachi/evento-salon.jpeg', alt: 'El mariachi ameniza una celebración en un salón lleno de invitados.', caption: 'Música para celebrar' },
    { src: '/images/mariachi/evento-exterior.jpeg', alt: 'Mariachi tocando en un evento al aire libre bajo una carpa.', caption: 'Momentos para recordar' },
    { src: '/images/mariachi/grupo-mariachi.jpeg', alt: 'Integrantes del mariachi reunidos después de una presentación.', caption: 'Conoce a los músicos' },
  ];
  readonly selected = signal<GalleryPhoto | null>(null);
  open(index: number): void { this.selected.set(this.photos[index] ?? null); }
  close(): void { this.selected.set(null); }
}
