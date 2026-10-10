import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
export interface JikanAnime { title: string; synopsis: string | null; images: { jpg?: { image_url?: string } }; }
export interface JikanResponse { data: JikanAnime[]; }
export interface PokemonResponse { id:number; name:string; types:{type:{name:string}}[]; sprites:{other?:{'official-artwork'?:{front_default:string|null}}}; }
@Injectable({providedIn:'root'})
export class OpenDataService {
  private readonly http=inject(HttpClient);
  currentAnime():Observable<JikanResponse>{return this.http.get<JikanResponse>('https://api.jikan.moe/v4/seasons/now?limit=1');}
  pokemon(id=1+Math.floor(Math.random()*151)):Observable<PokemonResponse>{return this.http.get<PokemonResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`);}
}
