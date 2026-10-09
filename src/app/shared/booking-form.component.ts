import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../core/lead.service';

@Component({
  selector: 'mm-booking-form', standalone: true, imports: [ReactiveFormsModule],
  template: `
    <form class="booking-form" [formGroup]="form" (ngSubmit)="submit()" aria-labelledby="booking-title">
      <header class="form-header"><div><p class="eyebrow">COTIZACIÓN SIN COMPROMISO</p><h2 id="booking-title">Cuéntanos de tu evento</h2></div><button class="close" type="button" aria-label="Cerrar formulario" (click)="close.emit()">×</button></header>
      <label>Nombre<input formControlName="name" autocomplete="name" placeholder="Tu nombre" required></label>
      <label>Teléfono<input formControlName="phone" autocomplete="tel" inputmode="tel" placeholder="10 dígitos" required></label>
      <label>Tipo de evento<select formControlName="eventType" required><option value="">Selecciona una opción</option><option>Boda</option><option>XV años</option><option>Cumpleaños</option><option>Serenata</option><option>Bautizo</option><option>Evento empresarial</option><option>Otro evento</option></select></label>
      <label>Fecha<input type="date" formControlName="date" required></label>
      <label class="wide">Comentarios<textarea formControlName="comments" rows="3" placeholder="Horario, ubicación o canciones especiales"></textarea></label>
      <button class="button button-primary submit" type="submit" [disabled]="form.invalid">Solicitar cotización por WhatsApp <span aria-hidden="true">↗</span></button>
      <p class="form-note">Se abrirá WhatsApp con los datos que ingresaste para que confirmes el envío.</p>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  private readonly leads = inject(LeadService);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^[\d+()\s-]{10,18}$/)]],
    eventType: ['', Validators.required],
    date: ['', Validators.required],
    comments: ['', Validators.maxLength(500)],
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    window.open(this.leads.buildWhatsAppUrl(this.form.getRawValue()), '_blank', 'noopener,noreferrer');
    this.submitted.emit();
    this.close.emit();
  }
}
