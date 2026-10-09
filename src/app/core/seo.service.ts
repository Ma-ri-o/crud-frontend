import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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

    const schema = this.document.getElementById('local-business-schema');
    schema?.replaceChildren(this.document.createTextNode(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.name,
      description: config.description,
      telephone: `+52${config.phone}`,
      areaServed: config.serviceAreas,
      serviceType: config.services.map(service => service.title),
    })));
  }
}
