import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SITE_CONFIG, type GalleryPhoto } from '../../core/site-config';
import { trapDialogTab } from '../../shared/dialog-accessibility';

@Component({
  selector: 'mm-gallery', standalone: true, imports: [NgOptimizedImage],
  template: `
    <div class="gallery-grid">
      @for (photo of photos; track photo.src; let i = $index) {
        <button class="gallery-tile" type="button" (click)="open(i, $event)" [attr.aria-label]="'Ampliar: ' + photo.alt">
          <img [ngSrc]="photo.src" width="800" height="600" sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw" [priority]="i === 0" [alt]="photo.alt">
          <span>{{ photo.caption }} <b aria-hidden="true">↗</b></span>
        </button>
      }
    </div>
    @if (selected(); as photo) {
      <div #lightboxDialog class="lightbox" role="dialog" aria-modal="true" aria-labelledby="gallery-dialog-title" aria-describedby="gallery-dialog-caption" (click)="onBackdropClick($event)" (keydown)="onDialogKeydown($event)" tabindex="-1">
        <button type="button" class="lightbox-close" aria-label="Cerrar imagen" (click)="close()">×</button>
        <h2 id="gallery-dialog-title" class="visually-hidden">{{ photo.alt }}</h2>
        <img [ngSrc]="photo.src" width="1200" height="900" sizes="90vw" [alt]="photo.alt" (click)="$event.stopPropagation()">
        <p id="gallery-dialog-caption">{{ photo.caption }}</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  readonly photos = SITE_CONFIG.galleryPhotos;
  readonly selected = signal<GalleryPhoto | null>(null);
  @ViewChild('lightboxDialog') private readonly dialog?: ElementRef<HTMLElement>;
  private trigger?: HTMLButtonElement;
  private previousBodyOverflow = '';

  open(index: number, event: MouseEvent): void {
    const photo = this.photos[index];
    if (!photo || !(event.currentTarget instanceof HTMLButtonElement)) return;
    this.trigger = event.currentTarget;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.selected.set(photo);
    requestAnimationFrame(() => this.dialog?.nativeElement.focus());
  }

  close(): void {
    if (!this.selected()) return;
    this.selected.set(null);
    document.body.style.overflow = this.previousBodyOverflow;
    requestAnimationFrame(() => this.trigger?.focus({ preventScroll: true }));
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    const dialog = this.dialog?.nativeElement;
    if (dialog) trapDialogTab(event, dialog);
  }
}
