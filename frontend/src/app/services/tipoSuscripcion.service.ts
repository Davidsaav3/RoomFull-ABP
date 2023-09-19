import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TipoSuscripcion } from '../models/tipoSuscripcion.model';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TipoSuscripcionService {

  public tipoSus: TipoSuscripcion[];

  constructor( private http: HttpClient,
               private router: Router  ) { }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // GET //

  getTipoSus () {
    return this.http.get<TipoSuscripcion[]>(`${environment.base_url}/tipoSuscripciones/`);
  }

  getTipoSusNombre (nombre: string) {
    if (!nombre) { nombre = "";}
    return this.http.get<TipoSuscripcion[]>(`${environment.base_url}/tipoSuscripciones/nombre?nombre=${nombre}`);
  }


  cargarTipoSus ( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/tipoSuscripciones/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTipoSusId ( id: string ): Observable<object> {
      return this.http.get(`${environment.base_url}/tipoSuscripciones/?id=${id}` , this.cabeceras);
  }

  cargarTipoSusAll (): Observable<object> {
    return this.http.get(`${environment.base_url}/tipoSuscripciones/All` , this.cabeceras);
  }

  // POST //
  crearTipoSus ( data: TipoSuscripcion) {
    return this.http.post(`${environment.base_url}/tipoSuscripciones/`, data, this.cabeceras);
  }

  // PUT //
  actualizarTipoSus ( uid: string, data: TipoSuscripcion) {
    return this.http.put(`${environment.base_url}/tipoSuscripciones/${uid}`, data, this.cabeceras);
  }

  // DELETE //
  borrarTipoSus ( uid: string, data: TipoSuscripcion) {
    return this.http.delete(`${environment.base_url}/tipoSuscripciones/${uid}`, this.cabeceras);
  }
}
