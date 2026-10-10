import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventConfig } from '../../core/invitation.models';
import { CountdownSectionComponent } from './countdown.component';

@Component({
  selector: 'is-event-invitation',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, CountdownSectionComponent],
  templateUrl: './event-invitation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInvitationComponent {
  readonly config = input.required<EventConfig>();
  readonly attempted = signal(false);
  readonly complete = signal(false);
  readonly shortDate = computed(() => this.formatShortDate(this.config().date));
  readonly confetti = computed(() => {
    const colors = [
      this.config().colors?.accent ?? '#FFD54F',
      this.config().colors?.primary ?? '#1565C0',
      '#FFFFFF',
    ];
    return Array.from({ length: 24 }, (_, index) => ({
      left: `${(index * 37) % 100}%`,
      delay: `${(index % 8) * 0.12}s`,
      duration: `${2.8 + (index % 4) * 0.3}s`,
      color: colors[index % colors.length],
      rotation: `${(index * 29) % 160}deg`,
    }));
  });

  private readonly formBuilder = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    attending: ['', Validators.required],
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

  formatShortDate(value: string): { day: string; month: string } {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    return {
      day: new Intl.DateTimeFormat('es-MX', { day: '2-digit', timeZone: 'UTC' }).format(date),
      month: new Intl.DateTimeFormat('es-MX', { month: 'short', timeZone: 'UTC' })
        .format(date)
        .replace('.', '')
        .toLocaleUpperCase('es-MX'),
    };
  }

  responseUrl(): string {
    const config = this.config();
    const value = this.form.getRawValue();
    const phone = config.rsvp.whatsappNumber?.replace(/\D/g, '') ?? '';
    const eventName = config.rsvp.eventName || `la celebración de ${config.title}`;
    const message = [
      'Hola.',
      '',
      value.attending === 'yes' ? `Confirmo asistencia al ${eventName}.` : `No podré asistir al ${eventName}.`,
      '',
      `Nombre: ${value.name.trim()}`,
      '',
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
