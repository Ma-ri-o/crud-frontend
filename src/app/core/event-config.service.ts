import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { EventConfig, ThemeId } from './invitation.models';
const themes:ThemeId[]=['elegant','luxury','floral','kids','minions','superheroes','princess','space','safari'];
@Injectable({providedIn:'root'})
export class EventConfigService {
 private readonly http=inject(HttpClient);
 async load(slug?:string):Promise<EventConfig>{
  if(slug&&!/^[a-z0-9-]{1,64}$/.test(slug))throw new Error('Identificador de invitación inválido.');
  const config=this.parse(await firstValueFrom(this.http.get<unknown>('/data/event.json')),slug);
  return config;
 }
 parse(value:unknown,slug?:string):EventConfig{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('El JSON debe contener un objeto de configuración.');const config=value as EventConfig;if(slug&&config.slug!==slug)throw new Error('El identificador del archivo no coincide con el evento.');this.assertValid(config);return config;}
 private assertValid(c:EventConfig):void{
  if(!c||c.schemaVersion!==1)throw new Error('schemaVersion debe ser 1.');
  for(const key of ['slug','title','subtitle','eventType','theme','sections','seo'] as const)if(!c[key])throw new Error(`Falta el campo requerido "${key}".`);
  if(!c.heroImage||!c.heroImageAlt||!c.heroImageWidth||!c.heroImageHeight)throw new Error('La imagen principal y sus dimensiones deben estar configuradas.');
  if(c.heroSecondaryImage&&(!c.heroSecondaryImageAlt||!c.heroSecondaryImageWidth||!c.heroSecondaryImageHeight))throw new Error('La imagen secundaria requiere texto alternativo y dimensiones.');
  if(!/^[a-z0-9-]{1,64}$/.test(c.slug))throw new Error('El slug solo puede contener minúsculas, números y guiones.');
  if(!['birthday','wedding','anniversary','graduation','custom'].includes(c.eventType))throw new Error('Tipo de evento no reconocido.');
  if(!themes.includes(c.theme))throw new Error('El tema seleccionado no está registrado.');
  if(!c.sections||typeof c.sections!=='object'||Object.values(c.sections).some(v=>typeof v!=='boolean'))throw new Error('Las secciones deben usar valores true/false.');
  if(!Array.isArray(c.gallery)||!Array.isArray(c.story)||!Array.isArray(c.timeline))throw new Error('Galería, historia y agenda deben ser listas.');
  if(c.gallery.length<5||c.gallery.length>10)throw new Error('La galería debe contener entre 5 y 10 imágenes.');
  if(c.gallery.some(p=>!p.src||!p.alt)||c.story.some(s=>!s.title||!s.body)||c.timeline.some(t=>!t.time||!t.title))throw new Error('Cada foto, historia y actividad requiere sus campos principales.');
  if(!c.rsvp||!Array.isArray(c.rsvp.fields)||!c.music||!c.gifts||!Array.isArray(c.gifts.links)||!c.openData||!c.seo?.title||!c.seo?.description)throw new Error('RSVP, música, regalos, integraciones o SEO no tienen la estructura requerida.');
  if(c.date&&!/^\d{4}-\d{2}-\d{2}$/.test(c.date))throw new Error('La fecha debe usar formato YYYY-MM-DD.');
  if(c.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.time))throw new Error('La hora debe usar formato de 24 horas HH:mm.');
  for(const color of Object.values(c.colors||{}))if(color&&!/^#[\da-f]{3,8}$/i.test(color))throw new Error('Los colores deben usar formato hexadecimal.');
 }
}
