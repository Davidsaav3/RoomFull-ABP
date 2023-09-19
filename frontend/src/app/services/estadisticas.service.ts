import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private http: HttpClient,
    private router: Router) { }
    get cabeceras() {
      return {
        headers: {
          'x-token': this.token
        }};
    }
    get token(): string {
      return localStorage.getItem('token') || '';
    }
    obtenerTiempoMedio () {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio`, this.cabeceras);
    }
    obtenerTiempoMedioM1 (interval: string) {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio/?intervalo=${interval}`, this.cabeceras);
    }
    obtenerTiempoMedioM2 (interval: string) {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio/?intervalo=${interval}`, this.cabeceras);
    }
    obtenerTiempoMedioM3 (interval: string) {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio/?intervalo=${interval}`, this.cabeceras);
    }
    obtenerTiempoMedioM4 (interval: string) {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio/?intervalo=${interval}`, this.cabeceras);
    }
    obtenerTiempoMedioM5 (interval: string) {
      return this.http.get(`${environment.base_url}/estadisticas/tiempomedio/?intervalo=${interval}`, this.cabeceras);
    }

    obtenerPaisesPorSuscripcion () {
      return this.http.get(`${environment.base_url}/estadisticas/suspais`, this.cabeceras);
    }
    obtenerUsuariosPremium () {
      return this.http.get(`${environment.base_url}/estadisticas/usuariosuperiores`, this.cabeceras);
    }
    obtenerUsuariosMasConversaciones () {
      return this.http.get(`${environment.base_url}/estadisticas/usuariosmasconversaciones`, this.cabeceras);
    }
    obtenerModelosMasRepercusion () {
      return this.http.get(`${environment.base_url}/estadisticas/modelosmasrepercusion`, this.cabeceras);
    }
}
