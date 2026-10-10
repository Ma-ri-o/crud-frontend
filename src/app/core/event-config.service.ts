import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { EventConfig, TemplateSummary, ThemeId } from './invitation.models';
const PREVIEW_KEY='invitation-studio.preview.';
const themes:ThemeId[]=['elegant','luxury','floral','kids','minions','superheroes','princess','space','safari'];
@Injectable({providedIn:'root'})
export class EventConfigService {
 private readonly http=inject(HttpClient);private readonly platformId=inject(PLATFORM_ID);private readonly document=inject(DOCUMENT);
 async load(slug:string):Promise<EventConfig>{if(!/^[a-z0-9-]{1,64}$/.test(slug))throw new Error('Identificador de invitación inválido.');if(isPlatformBrowser(this.platformId)){const draft=localStorage.getItem(PREVIEW_KEY+slug);if(draft){try{return this.parse(JSON.parse(draft) as unknown,slug);}catch{localStorage.removeItem(PREVIEW_KEY+slug);}}}return this.parse(await firstValueFrom(this.http.get<unknown>(`/config/events/${encodeURIComponent(slug)}.json`)),slug);}
 async listTemplates():Promise<TemplateSummary[]>{const response=await firstValueFrom(this.http.get<{templates:TemplateSummary[]}>('/config/events/index.json'));if(!Array.isArray(response.templates))throw new Error('El catálogo no contiene una lista de plantillas.');return response.templates;}
 savePreview(config:EventConfig):void{this.assertValid(config);localStorage.setItem(PREVIEW_KEY+config.slug,JSON.stringify(config,null,2));}
 clearPreview(slug:string):void{localStorage.removeItem(PREVIEW_KEY+slug);}
 export(config:EventConfig):void{this.assertValid(config);const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=this.document.createElement('a');anchor.href=url;anchor.download=`${config.slug}.json`;anchor.click();URL.revokeObjectURL(url);}
 parse(value:unknown,slug?:string):EventConfig{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('El JSON debe contener un objeto de configuración.');const config=value as EventConfig;if(slug&&config.slug!==slug)throw new Error('El identificador del archivo no coincide con el evento.');this.assertValid(config);return config;}
 private assertValid(c:EventConfig):void{
  if(!c||c.schemaVersion!==1)throw new Error('schemaVersion debe ser 1.');
  for(const key of ['slug','title','subtitle','eventType','theme','sections','seo'] as const)if(!c[key])throw new Error(`Falta el campo requerido "${key}".`);
  if(!/^[a-z0-9-]{1,64}$/.test(c.slug))throw new Error('El slug solo puede contener minúsculas, números y guiones.');
  if(!['birthday','wedding','anniversary','graduation','custom'].includes(c.eventType))throw new Error('Tipo de evento no reconocido.');
  if(!themes.includes(c.theme))throw new Error('El tema seleccionado no está registrado.');
  if(!c.sections||typeof c.sections!=='object'||Object.values(c.sections).some(v=>typeof v!=='boolean'))throw new Error('Las secciones deben usar valores true/false.');
  if(!Array.isArray(c.gallery)||!Array.isArray(c.story)||!Array.isArray(c.timeline))throw new Error('Galería, historia y agenda deben ser listas.');
  if(c.gallery.some(p=>!p.src||!p.alt)||c.story.some(s=>!s.title||!s.body)||c.timeline.some(t=>!t.time||!t.title))throw new Error('Cada foto, historia y actividad requiere sus campos principales.');
  if(!c.rsvp||!Array.isArray(c.rsvp.fields)||!c.music||!c.gifts||!Array.isArray(c.gifts.links)||!c.openData||!c.seo?.title||!c.seo?.description)throw new Error('RSVP, música, regalos, integraciones o SEO no tienen la estructura requerida.');
  if(c.date&&!/^\d{4}-\d{2}-\d{2}$/.test(c.date))throw new Error('La fecha debe usar formato YYYY-MM-DD.');
  if(c.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.time))throw new Error('La hora debe usar formato de 24 horas HH:mm.');
  for(const color of Object.values(c.colors||{}))if(color&&!/^#[\da-f]{3,8}$/i.test(color))throw new Error('Los colores deben usar formato hexadecimal.');
 }
}
