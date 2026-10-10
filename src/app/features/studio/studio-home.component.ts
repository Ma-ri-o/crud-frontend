import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventConfigService } from '../../core/event-config.service';
import { TemplateSummary } from '../../core/invitation.models';
@Component({ selector:'is-studio-home', standalone:true, imports:[RouterLink], changeDetection:ChangeDetectionStrategy.OnPush,
 template:`<main class="studio-home"><header class="studio-topbar"><a class="studio-logo" routerLink="/">IS<span>✦</span></a><span>INVITATION STUDIO</span><a routerLink="/studio">Abrir editor ↗</a></header><section class="studio-hero"><p class="studio-kicker">DISEÑA · PERSONALIZA · COMPARTE</p><h1>Un momento especial.<br><em>Tu invitación, a tu manera.</em></h1><p>Crea experiencias digitales para tus celebraciones, con plantillas configurables, confirmación de asistencia y diseños que puedes adaptar a cada historia.</p><a class="studio-primary" routerLink="/studio">Crear una invitación <span>→</span></a><div class="studio-orbit orbit-one"></div><div class="studio-orbit orbit-two"></div></section><section class="template-gallery"><div class="template-head"><div><p class="studio-kicker">PUNTO DE PARTIDA</p><h2>Elige una plantilla</h2></div><a routerLink="/studio">Abrir editor visual ↗</a></div>@if(error()){<p role="alert" class="template-load-error">{{error()}}</p>}<div class="template-cards">@for(item of templates();track item.slug){<article class="template-card" [class]="'theme-preview-'+item.preview"><div class="template-card-art"><span>{{item.preview==='birthday'?'✹':'✺'}}</span><small>{{item.preview==='birthday'?'FIESTA · FAMILIA · ALEGRÍA':'CELEBRACIÓN · RECUERDOS · ALEGRÍA'}}</small></div><div class="template-card-copy"><span class="template-tag">PLANTILLA DE EVENTO</span><h3>{{item.title}}</h3><p>{{item.description}}</p><a [routerLink]="'/studio'" [queryParams]="{event:item.slug}">Personalizar plantilla <span>→</span></a><a class="template-preview-link" [routerLink]="'/i/'+item.slug">Ver invitación ↗</a></div></article>}@empty{<p>{{error() ? 'No fue posible cargar las plantillas.' : 'Las plantillas se cargan desde la configuración JSON del servidor.'}}</p>}</div></section><section class="studio-capabilities"><div><span>01</span><h3>Una identidad para cada evento</h3><p>Temas visuales, paletas y tipografías se configuran desde el editor o el archivo JSON.</p></div><div><span>02</span><h3>Momentos que se comparten</h3><p>RSVP, cuenta regresiva, galería, música, mapa y código QR según lo necesites.</p></div><div><span>03</span><h3>Configuración portable</h3><p>Edita una plantilla, guarda una vista previa local y exporta el JSON para publicar una versión.</p></div></section><footer class="studio-footer">INVITATION STUDIO <span>·</span> Hecho para celebrar historias reales</footer></main>` })
export class StudioHomeComponent {
  readonly templates = signal<TemplateSummary[]>([]);
  readonly error = signal('');
  private readonly configs = inject(EventConfigService);

  constructor() {
    void this.configs
      .listTemplates()
      .then((items) => this.templates.set(items))
      .catch((error: unknown) =>
        this.error.set(error instanceof Error ? error.message : 'No se pudieron cargar las plantillas.'),
      );
  }
}
