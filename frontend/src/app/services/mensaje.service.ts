import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { registerForm  } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Mensaje } from '../models/mensaje.model';
import { Schema, model } from 'mongoose';

@Injectable({
  providedIn: 'root'
})

export class MensajeService {

  private mensaje: Mensaje;

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

  get id(): Schema.Types.ObjectId {
    return this.mensaje.id;
  } 

  get mensajes(): String { //corregir
    return this.mensaje.mensajes;
  } 

  get fecha(): Date {
    return this.mensaje.fecha;
  } 

  get hora(): String {
    return this.mensaje.hora;
  } 

  // GET //
  obtenerMensajes () {
    return this.http.get(`${environment.base_url}/`);
  }

  // POST //
  crearMensajes ( uid: string, data: Mensaje) {
    return this.http.post(`${environment.base_url}/`, data, this.cabeceras);
  }

  // DELETE //
  borrarMensajes ( uid: string, data: Mensaje) {
    return this.http.delete(`${environment.base_url}/`, this.cabeceras);
  }
}
