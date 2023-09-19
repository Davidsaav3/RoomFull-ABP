import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { registerForm  } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Suscripcion } from '../models/suscripcion.model';
import { Schema, model } from 'mongoose';

@Injectable({
  providedIn: 'root'
})

export class SuscripcionService {

  private suscripcion: Suscripcion;

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

  get fechaFin(): String {
    return this.suscripcion.fechaFin;
  }

  get idUsuario(): Schema.Types.ObjectId {
    return this.suscripcion.idUsuario;
  }

  get idTipoSus(): Schema.Types.ObjectId {
    return this.suscripcion.idTipoSus;
  }

  get metodoPago(): Number {
    return this.suscripcion.metodoPago;
  }

  get renovacion(): Boolean {
    return this.suscripcion.renovacion;
  }

  // GET //
  getSus () {
    return this.http.get(`${environment.base_url}/suscripciones`, this.cabeceras);
  }
  getSusUsuario (uid:string) {
    console.log(uid)
    return this.http.get(`${environment.base_url}/suscripciones?idusu=${uid}`, this.cabeceras);
  }
  // POST //
  crearSus ( data: any) {
    return this.http.post(`${environment.base_url}/suscripciones/`, data, this.cabeceras);
  }

  // PUT //
  actualizarSus ( uid: string, data: Suscripcion) {
    return this.http.put(`${environment.base_url}/suscripciones/${uid}`, data, this.cabeceras);
  }

  // DELETE //
  borrarSus ( uid: string) {
    return this.http.delete(`${environment.base_url}/suscripciones/${uid}`, this.cabeceras);
  }
}
