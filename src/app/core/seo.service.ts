import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { EventConfig } from './invitation.models';
import { SITE_CONFIG } from './site-config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateFromSiteConfig(config: typeof SITE_CONFIG): void {
    const title = `${config.name} | Serenatas y eventos en Estado de México`;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });
    this.meta.updateTag({ property: 'og:site_name', content: config.name });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.writeSchema({ '@context':'https://schema.org', '@type':'LocalBusiness', name:config.name, description:config.description, telephone:`+52${config.phone}`, areaServed:config.serviceAreas, serviceType:config.services.map(service=>service.title) });
  }

  updateFromInvitation(config: EventConfig): void {
    const title = config.seo.title || config.title;
    const description = config.seo.description || config.description;
    this.title.setTitle(title);
    this.meta.updateTag({ name:'description', content:description });
    this.meta.updateTag({ property:'og:type', content:'website' });
    this.meta.updateTag({ property:'og:locale', content:'es_MX' });
    this.meta.updateTag({ property:'og:site_name', content:config.hostName });
    this.meta.updateTag({ property:'og:title', content:title });
    this.meta.updateTag({ property:'og:description', content:description });
    this.meta.updateTag({ name:'twitter:card', content:config.seo.image?'summary_large_image':'summary' });
    this.meta.updateTag({ name:'twitter:title', content:title });
    this.meta.updateTag({ name:'twitter:description', content:description });
    if(config.seo.image){this.meta.updateTag({property:'og:image',content:config.seo.image});this.meta.updateTag({name:'twitter:image',content:config.seo.image});}
    const schema = config.eventType === 'commercial'
      ? { '@context':'https://schema.org', '@type':'LocalBusiness', name:config.hostName, description, areaServed:config.location }
      : { '@context':'https://schema.org', '@type':'Event', name:config.title, description, startDate:config.date?`${config.date}${config.time?`T${config.time}`:''}`:undefined, location:config.location?{'@type':'Place',name:config.location,address:config.address||undefined}:undefined, organizer:{'@type':'Person',name:config.hostName} };
    this.writeSchema(schema);
  }

  private writeSchema(schema: object): void {
    const node=this.document.getElementById('invitation-schema');
    if(node)node.textContent=JSON.stringify(schema).replace(/</g,'\\u003c');
  }
}
