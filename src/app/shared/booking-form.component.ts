import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SITE_CONFIG } from '../core/site-config';
import { LeadService } from '../core/lead.service';

@Component({
  selector: 'mm-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form #bookingForm class="booking-form" [formGroup]="form" (ngSubmit)="submit()" aria-labelledby="booking-title" novalidate>
      <header class="form-header">
        <div>
          <p class="eyebrow">COTIZACIÓN SIN COMPROMISO</p>
          <h2 id="booking-title">Cuéntanos de tu evento</h2>
          <p id="booking-description">Completa los datos para preparar tu mensaje de WhatsApp.</p>
        </div>
        <button class="close" type="button" aria-label="Cerrar formulario" (click)="close.emit()">×</button>
      </header>

      <div class="form-field">
        <label for="booking-name">Nombre</label>
        <input id="booking-name" formControlName="name" autocomplete="name" placeholder="Tu nombre" maxlength="80" required [attr.aria-invalid]="form.controls.name.touched && form.controls.name.invalid" [attr.aria-describedby]="form.controls.name.touched && form.controls.name.invalid ? 'booking-name-error' : null">
        @if (form.controls.name.touched && form.controls.name.hasError('required')) { <small class="field-error" id="booking-name-error" role="alert">Escribe tu nombre para poder contactarte.</small> }
        @else if (form.controls.name.touched && form.controls.name.hasError('minlength')) { <small class="field-error" id="booking-name-error" role="alert">Escribe al menos 2 caracteres.</small> }
        @else if (form.controls.name.touched && form.controls.name.hasError('pattern')) { <small class="field-error" id="booking-name-error" role="alert">El nombre no puede contener solo espacios.</small> }
      </div>

      <div class="form-field">
        <label for="booking-phone">Teléfono de contacto</label>
        <input id="booking-phone" type="tel" formControlName="phone" autocomplete="tel-national" inputmode="numeric" placeholder="5512345678" maxlength="10" pattern="[0-9]{10}" required [attr.aria-invalid]="form.controls.phone.touched && form.controls.phone.invalid" [attr.aria-describedby]="form.controls.phone.touched && form.controls.phone.invalid ? 'booking-phone-error' : null">
        @if (form.controls.phone.touched && form.controls.phone.invalid) { <small class="field-error" id="booking-phone-error" role="alert">Ingresa los 10 dígitos de tu teléfono, solo números.</small> }
      </div>

      <div class="form-field">
        <label for="booking-event">Tipo de evento</label>
        <select id="booking-event" formControlName="eventType" required [attr.aria-invalid]="form.controls.eventType.touched && form.controls.eventType.invalid" [attr.aria-describedby]="form.controls.eventType.touched && form.controls.eventType.invalid ? 'booking-event-error' : null">
          <option value="">Selecciona una opción</option>
          @for (eventType of SITE_CONFIG.eventTypes; track eventType) { <option [value]="eventType">{{ eventType }}</option> }
        </select>
        @if (form.controls.eventType.touched && form.controls.eventType.invalid) { <small class="field-error" id="booking-event-error" role="alert">Selecciona el tipo de evento.</small> }
      </div>

      <div class="form-field">
        <label for="booking-date">Fecha del evento</label>
        <input id="booking-date" type="date" formControlName="date" [min]="today" required [attr.aria-invalid]="form.controls.date.touched && form.controls.date.invalid" [attr.aria-describedby]="form.controls.date.touched && form.controls.date.invalid ? 'booking-date-error' : null">
        @if (form.controls.date.touched && form.controls.date.hasError('required')) { <small class="field-error" id="booking-date-error" role="alert">Selecciona la fecha del evento.</small> }
        @else if (form.controls.date.touched && form.controls.date.hasError('pastDate')) { <small class="field-error" id="booking-date-error" role="alert">La fecha debe ser hoy o posterior.</small> }
      </div>

      <div class="form-field">
        <label for="booking-municipality">Municipio</label>
        <select id="booking-municipality" formControlName="municipality" required [attr.aria-invalid]="form.controls.municipality.touched && form.controls.municipality.invalid" [attr.aria-describedby]="form.controls.municipality.touched && form.controls.municipality.invalid ? 'booking-municipality-error' : null">
          <option value="">Selecciona tu municipio</option>
          @for (municipality of SITE_CONFIG.municipalities; track municipality) { <option [value]="municipality">{{ municipality }}</option> }
        </select>
        @if (form.controls.municipality.touched && form.controls.municipality.invalid) { <small class="field-error" id="booking-municipality-error" role="alert">Selecciona el municipio del evento.</small> }
      </div>

      <div class="form-field">
        <label for="booking-address">Dirección del evento</label>
        <input id="booking-address" formControlName="address" autocomplete="street-address" placeholder="Calle, colonia y número" maxlength="180" required [attr.aria-invalid]="form.controls.address.touched && form.controls.address.invalid" [attr.aria-describedby]="form.controls.address.touched && form.controls.address.invalid ? 'booking-address-error' : null">
        @if (form.controls.address.touched && form.controls.address.invalid) { <small class="field-error" id="booking-address-error" role="alert">Comparte una dirección (mínimo 5 caracteres).</small> }
      </div>

      <div class="form-field wide">
        <label for="booking-references">Referencias adicionales <span>(opcional)</span></label>
        <textarea id="booking-references" formControlName="references" rows="2" maxlength="500" placeholder="Horario, canción especial o cómo llegar"></textarea>
      </div>

      <button class="button button-primary submit" type="submit">Solicitar cotización por WhatsApp <span aria-hidden="true">↗</span></button>
      <p class="form-note">WhatsApp se abrirá con tu solicitud para que la revises y la envíes. La fecha queda pendiente de confirmación.</p>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent {
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly submitted = new EventEmitter<void>();
  @ViewChild('bookingForm') private readonly formElement?: ElementRef<HTMLFormElement>;

  readonly SITE_CONFIG = SITE_CONFIG;
  readonly today = this.getLocalDate();
  private readonly fb = inject(FormBuilder);
  private readonly leads = inject(LeadService);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern(/\S/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    eventType: ['', Validators.required],
    date: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/), (control: AbstractControl) => control.value && control.value < this.today ? { pastDate: true } : null]],
    municipality: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(180), Validators.pattern(/\S/)]],
    references: ['', Validators.maxLength(500)],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      requestAnimationFrame(() => this.formElement?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    window.open(this.leads.buildWhatsAppUrl(this.form.getRawValue()), '_blank', 'noopener,noreferrer');
    this.submitted.emit();
    this.close.emit();
  }

  private getLocalDate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }
}
