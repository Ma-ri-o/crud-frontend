import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GalleryComponent } from './gallery.component';

@Component({ selector: 'mm-gallery-page', standalone: true, imports: [GalleryComponent, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="simple-page"><a routerLink="/" class="back-link">← Inicio</a><p class="eyebrow">MARIACHI MEXICANÍSIMO</p><h1>Galería</h1><p>Toca una foto para verla en grande.</p><mm-gallery /></main>` })
export class GalleryPageComponent {}
