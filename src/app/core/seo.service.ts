import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { EventConfig } from './invitation.models';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateFromInvitation(config: EventConfig): void {
    const title = config.seo.title || config.title;
    const description = config.seo.description || config.description;
    const image = config.seo.image
      ? new URL(config.seo.image, this.document.baseURI).toString()
      : undefined;
    this.title.setTitle(title);
    this.meta.removeTag('name="keywords"');
    this.meta.updateTag({ name:'description', content:description });
    this.meta.updateTag({ property:'og:type', content:'website' });
    this.meta.updateTag({ property:'og:locale', content:'es_MX' });
    this.meta.updateTag({ property:'og:site_name', content:config.hostName });
    this.meta.updateTag({ property:'og:title', content:title });
    this.meta.updateTag({ property:'og:description', content:description });
    this.meta.updateTag({ property:'og:url', content:this.document.location.href });
    this.meta.updateTag({ name:'twitter:card', content:image?'summary_large_image':'summary' });
    this.meta.updateTag({ name:'twitter:title', content:title });
    this.meta.updateTag({ name:'twitter:description', content:description });
    if(image){
      this.meta.updateTag({property:'og:image',content:image});
      this.meta.updateTag({property:'og:image:alt',content:title});
      this.meta.updateTag({
        property: 'og:image:type',
        content: image.endsWith('.svg') ? 'image/svg+xml' : image.endsWith('.png') ? 'image/png' : 'image/jpeg',
      });
      this.meta.updateTag({name:'twitter:image',content:image});
    } else {
      this.meta.removeTag('property="og:image"');
      this.meta.removeTag('property="og:image:alt"');
      this.meta.removeTag('property="og:image:type"');
      this.meta.removeTag('name="twitter:image"');
    }
    this.writeSchema({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: config.title,
      description,
      startDate: config.date ? `${config.date}${config.time ? `T${config.time}` : ''}` : undefined,
      location: config.location
        ? { '@type': 'Place', name: config.location, address: config.address || undefined }
        : undefined,
      organizer: { '@type': 'Person', name: config.hostName },
    });
  }

  private writeSchema(schema: object): void {
    const node=this.document.getElementById('invitation-schema');
    if(node)node.textContent=JSON.stringify(schema).replace(/</g,'\\u003c');
  }
}
