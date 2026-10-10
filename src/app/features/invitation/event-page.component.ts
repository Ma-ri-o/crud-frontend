import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventConfigService } from '../../core/event-config.service';
import { EventConfig } from '../../core/invitation.models';
import { SeoService } from '../../core/seo.service';
import { InvitationViewComponent } from './invitation-view.component';
@Component({ selector:'is-event-page', standalone:true, imports:[InvitationViewComponent], changeDetection:ChangeDetectionStrategy.OnPush, template:`@if(event();as config){<is-invitation-view [config]="config"/>}@else if(error()){<main class="event-load-error"><div><span>✦</span><h1>No encontramos esta invitación</h1><p>{{error()}}</p><a href="/">Volver a Invitation Studio</a></div></main>}@else{<main class="event-loading" aria-live="polite">Preparando una celebración…</main>}` })
export class EventPageComponent {
 readonly event=signal<EventConfig|null>(null);readonly error=signal('');private readonly route=inject(ActivatedRoute);private readonly service=inject(EventConfigService);private readonly seo=inject(SeoService);
 constructor(){const slug=this.route.snapshot.paramMap.get('slug')||'';void this.service.load(slug).then(config=>{this.event.set(config);this.seo.updateFromInvitation(config);}).catch(e=>this.error.set(e instanceof Error?e.message:'No se pudo cargar la invitación.'));}
}
