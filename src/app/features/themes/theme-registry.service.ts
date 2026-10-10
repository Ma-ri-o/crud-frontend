import { Injectable } from '@angular/core';
import type { EventConfig, ThemeId } from '../../core/invitation.models';

export interface ThemeDefinition {
  id: ThemeId; name: string; mood: string; background: string; surface: string; text: string;
  primary: string; accent: string; muted: string; displayFont: string; bodyFont: string; decoration: string;
}

export const THEME_REGISTRY: Record<ThemeId, ThemeDefinition> = {
  elegant: { id:'elegant', name:'Elegante', mood:'Clásico y delicado', background:'#faf7f2', surface:'#fffefa', text:'#29251f', primary:'#78644f', accent:'#c7a56a', muted:'#786f64', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'✦' },
  luxury: { id:'luxury', name:'Luxury', mood:'Nocturno y sofisticado', background:'#151411', surface:'#211f1a', text:'#f6f0df', primary:'#b58b46', accent:'#ecd18e', muted:'#c1b8a4', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'◆' },
  floral: { id:'floral', name:'Floral', mood:'Romántico y botánico', background:'#f7f5ef', surface:'#fffdf8', text:'#38382f', primary:'#61775b', accent:'#bf8b8a', muted:'#77786d', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'❀' },
  kids: { id:'kids', name:'Kids', mood:'Colorido y alegre', background:'#fff9e9', surface:'#fffefa', text:'#293047', primary:'#ef8b37', accent:'#55aab1', muted:'#697080', displayFont:'Trebuchet MS,sans-serif', bodyFont:'Arial,sans-serif', decoration:'✦' },
  minions: { id:'minions', name:'Minions', mood:'Amarillo y juguetón', background:'#fff9d8', surface:'#fffef1', text:'#272e41', primary:'#e8b91c', accent:'#2675ac', muted:'#646877', displayFont:'Trebuchet MS,sans-serif', bodyFont:'Arial,sans-serif', decoration:'★' },
  superheroes: { id:'superheroes', name:'Superhéroes', mood:'Energético y audaz', background:'#151d35', surface:'#222e4a', text:'#f6f7fc', primary:'#e4443c', accent:'#edc249', muted:'#bcc4d3', displayFont:'Arial,sans-serif', bodyFont:'Arial,sans-serif', decoration:'✦' },
  princess: { id:'princess', name:'Princess', mood:'Dulce y encantador', background:'#fff3f8', surface:'#fffaff', text:'#433044', primary:'#bd78ac', accent:'#ddbd73', muted:'#7c7180', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'♡' },
  space: { id:'space', name:'Space', mood:'Galáctico y moderno', background:'#0d152b', surface:'#172341', text:'#f5f4ff', primary:'#8475e8', accent:'#59d5d2', muted:'#b3b7d1', displayFont:'Arial,sans-serif', bodyFont:'Arial,sans-serif', decoration:'✧' },
  safari: { id:'safari', name:'Safari', mood:'Natural y aventurero', background:'#f2f0df', surface:'#fffdf0', text:'#333126', primary:'#738149', accent:'#bd8952', muted:'#777463', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'❋' },
  mexican: { id:'mexican', name:'Mexicano contemporáneo', mood:'Verde profundo y dorado', background:'#f5f0e6', surface:'#fffdf8', text:'#1d211d', primary:'#174d3a', accent:'#bd8b45', muted:'#6c695f', displayFont:'Georgia,serif', bodyFont:'Arial,sans-serif', decoration:'✺' },
};

@Injectable({ providedIn: 'root' })
export class ThemeRegistryService {
  readonly themes = Object.values(THEME_REGISTRY);
  get(id: ThemeId): ThemeDefinition { return THEME_REGISTRY[id] ?? THEME_REGISTRY.elegant; }
  variables(config: EventConfig): Record<string, string> {
    const theme = this.get(config.theme);
    return {
      '--invite-bg': config.colors?.background || theme.background,
      '--invite-surface': config.colors?.surface || theme.surface,
      '--invite-text': config.colors?.text || theme.text,
      '--invite-primary': config.colors?.primary || theme.primary,
      '--invite-accent': config.colors?.accent || theme.accent,
      '--invite-muted': theme.muted,
      '--invite-display-font': theme.displayFont,
      '--invite-body-font': theme.bodyFont,
    };
  }
}
