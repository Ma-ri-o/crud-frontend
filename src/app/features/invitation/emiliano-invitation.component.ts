import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventConfig, EventPhoto } from '../../core/invitation.models';
import { CountdownSectionComponent } from './countdown.component';

@Component({
  selector: 'is-emiliano-invitation',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, CountdownSectionComponent],
  templateUrl: './emiliano-invitation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmilianoInvitationComponent {
  readonly config = input.required<EventConfig>();
  readonly selectedPhoto = signal<EventPhoto | null>(null);
  readonly attempted = signal(false);
  readonly complete = signal(false);
  readonly gallerySlots = computed(() => {
    const photos = this.config().gallery.filter((photo) => photo.src).slice(0, 2);
    return Array.from({ length: 2 }, (_, index) => ({
      index,
      photo: photos[index] ?? null,
    }));
  });
  readonly confetti = Array.from({ length: 24 }, (_, index) => ({
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 8) * 0.12}s`,
    duration: `${2.8 + (index % 4) * 0.3}s`,
    color: ['#C62828', '#FFD54F', '#1565C0', '#FFFFFF'][index % 4],
    rotation: `${(index * 29) % 160}deg`,
  }));

  private readonly formBuilder = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    attending: ['', Validators.required],
    kids: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    comments: ['', Validators.maxLength(300)],
  });

  readonly mapEmbedUrl = computed<SafeResourceUrl>(() => {
    const config = this.config();
    const query = [config.location, config.address].filter(Boolean).join(', ');
    const url = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  formatDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day, 12)));
  }

  showPhoto(photo: EventPhoto): void {
    this.selectedPhoto.set(photo);
  }

  closePhoto(): void {
    this.selectedPhoto.set(null);
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closePhoto();
  }

  responseUrl(): string {
    const config = this.config();
    const value = this.form.getRawValue();
    const phone = config.rsvp.whatsappNumber?.replace(/\D/g, '') ?? '';
    const message = [
      'Hola.',
      value.attending === 'yes'
        ? 'Confirmo asistencia al cumpleaños de Emiliano Ulises.'
        : 'No podré asistir al cumpleaños de Emiliano Ulises.',
      `Nombre: ${value.name.trim()}`,
      ...(value.attending === 'yes' ? [`Niños: ${value.kids}`] : []),
      `Comentarios: ${value.comments.trim() || 'Sin comentarios'}`,
    ].join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  submit(): void {
    this.attempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.complete.set(true);
    window.open(this.responseUrl(), '_blank', 'noopener,noreferrer');
  }
}
