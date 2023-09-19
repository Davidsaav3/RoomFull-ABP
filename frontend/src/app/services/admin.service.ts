import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { text } from 'express';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private usuario: Usuario;
  private data: Usuario;

  constructor( private http: HttpClient,
               private router: Router  ) { }

  cargarModelos ( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/escenas/nameAdmin?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTipoSusAdmin ( desde: number, textoBusqueda?: string ): Observable<object> {
    return this.http.get(`${environment.base_url}/tipoSuscripciones/nameAdmin?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTipoSus ( ): Observable<object> {
    return this.http.get(`${environment.base_url}/tipoSuscripciones/All` , this.cabeceras);
  }

  cargarSus ( uid: string | undefined ): Observable<object> {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/suscripciones/?id=${uid}` , this.cabeceras);
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  cargarSub( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/suscripciones/?id=${uid}` , this.cabeceras);
  }

  actualizarUsuMetodo( uid: string, data: any) {
    return this.http.put(`${environment.base_url}/usuarios/actualizarMetodo/${uid}` , data, this.cabeceras);
  }

  restablecerFoto( uid: string ) {
    return this.http.delete(`${environment.base_url}/usuarios/restablecerFoto/${uid}` , this.cabeceras);
  }

  cargarUsuarioNombre( name: string) {
    if (!name) { name = '';}
    return this.http.get(`${environment.base_url}/usuarios/name/?nombre=${name}` , this.cabeceras);
  }

  cargarUsuarios( desde?: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 1;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/nameAdmin?desde=${desde}&nombreUsuario=${textoBusqueda}` , this.cabeceras);
  }

  cargarListaUsuarios ( uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/lista` , data, this.cabeceras);
  }

  cargarUsuariosRol ( rol: string, uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/usuarios/rol/${rol}`, data, this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  recuperarUidToken() {
      var token = localStorage.getItem('token');
      var base64Url = this.token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      var objPayload = JSON.parse(jsonPayload);
      var uid = objPayload.uid;
      return uid;
  }

  actualizarFotoUsuario (uid: string, data: any){
    return this.http.patch(`${environment.base_url}/usuarios/actualizarFoto/${uid}`, data, this.cabeceras);
  }

  subirImagenUsuario(id : string, imag: string, file : any ){
    const form = new FormData()
    form.append('archivo', file);
    form.append('nombre',imag);
    return this.http.post(`${environment.base_url}/upload/imagenUsuario/${id}`,form, this.cabeceras);
  }

  actualizarUsuario ( uid: string, data: any) {
    return this.http.patch(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  actualizarUsuDescription ( uid: string, desc: any) {
    const datos: FormData = new FormData();
    datos.append('description', desc);
    return this.http.put(`${environment.base_url}/usuarios/actualizarDesc/${uid}`, datos, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    const id = this.recuperarUidToken();
    this.usuario.uid = id;
    return this.usuario.uid;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get nombre(): string{
    return this.usuario.nombre!;
  }

  get apellidos(): string{
    return this.usuario.apellidos!;
  }

  get email(): string{
    return this.usuario.email!;
  }

  get imagen(): string{
    return this.usuario.imagen!;
  }

  get telefono(): Number{
    return this.usuario.telefono!;
  }

  get empresa(): string{
    return this.usuario.empresa;
  }

  get nombreUsuario(): string{
    return this.usuario.nombreUsuario!;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }

  get subscription(): string{
    return this.usuario.subscription!;
  }
}
