import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { EventConfigService } from '../../core/event-config.service';
import { EventConfig } from '../../core/invitation.models';
import { SeoService } from '../../core/seo.service';
import { InvitationViewComponent } from './invitation-view.component';
@Component({
  selector: 'is-event-page',
  standalone: true,
  imports: [InvitationViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if(event();as config){<is-invitation-view [config]="config"/>}@else if(error()){<main class="event-load-error"><div><span>✦</span><h1>No encontramos esta invitación</h1><p>{{error()}}</p><a href="/">Volver a Invitation Studio</a></div></main>}@else{<main class="event-loading" aria-live="polite">Preparando una celebración…</main>}`,
})
export class EventPageComponent {
  readonly event = signal<EventConfig | null>(null);
  readonly error = signal('');
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EventConfigService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.event.set(null);
          this.error.set('');
          return from(this.service.load(params.get('slug') || '')).pipe(
            map((config) => ({ config })),
            catchError((error: unknown) =>
              of({
                error: error instanceof Error ? error.message : 'No se pudo cargar la invitación.',
              }),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if ('config' in result) {
          this.event.set(result.config);
          this.seo.updateFromInvitation(result.config);
        } else {
          this.error.set(result.error);
        }
      });
  }
}
