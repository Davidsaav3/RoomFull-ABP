import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Escena } from '../models/escena.model';

@Injectable({
  providedIn: 'root'
})

export class EscenaService {

  private escena: Escena;

  constructor( private http: HttpClient,
               private router: Router) { }

  // OPERACIONES GET //

  cargarEscena( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/escenas/?id=${uid}&contavisita=false` , this.cabeceras);
  }

  cargarEscenaNoToken( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/escenas/cargarNoToken/?id=${uid}&contavisita=false` , this.cabeceras);
  }

  cargarContenidoEscena(nombre : string){
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/upload/escena/content/${nombre}`, this.cabeceras );
  }

  cargarContenidoEscenaNoToken(nombre : string){
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/upload/escena/content/noToken/${nombre}`, this.cabeceras );
  }

  cargarContenidoShader(nombre : string){
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/upload/shader/content/${nombre}`, this.cabeceras );
  }

  cargarContenidoShaderNoToken(nombre : string){
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/upload/shader/content/noToken/${nombre}`, this.cabeceras );
  }

  cargarSkybox(){
    return this.http.get(`${environment.base_url}/upload/skybox`, this.cabeceras );
  }

  cargarEscenaNoUsu( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/escenas/noUsu/?id=${uid}` , this.cabeceras);
  }

  cargarEscenasNombre( nombre: string) {
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/escenas/name/?nombreEscena=${nombre}` , this.cabeceras);
  }


  cargarEscenasNombreNoUsu( nombre: string) {
    if (!nombre) { nombre = '';}
    return this.http.get(`${environment.base_url}/escenas/nameNoUsu/?nombreEscena=${nombre}` , this.cabeceras);
  }

  cargarEscenaVisita( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/escenas/?id=${uid}&contavisita=true` , this.cabeceras);
  }

  cargarEscenaVisitaNoToken( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/escenas/noToken/?id=${uid}&contavisita=true` , this.cabeceras);
  }

  cargarEscenasDestacadas() {
    //console.log('service method')
    return this.http.get(`${environment.base_url}/escenas/filtros/?NVisitas=desc`, this.cabeceras);
  }

  cargarEscenasDestacadasNoUsu() {
    //console.log('service method')
    return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?NVisitas=desc`, this.cabeceras);
  }

  cargarEscenasRecientes(nombre:any, valor:any, desde:any) {
    if (!nombre){nombre = ''}
    if (!valor){valor = 1}

    switch (valor) {
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      case 2:
      return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&fecha=asc`, this.cabeceras);
      break;

      case 3:
      return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&NVisitas=desc`, this.cabeceras);
      break;

      case 4:
      return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&NValoraciones=desc`, this.cabeceras);
      break;

      case 5:
      return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      default:
        return this.http.get(`${environment.base_url}/escenas/filtros/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
        break;
    }
    //console.log('service method')
  }

  cargarEscenasRecientesNoPrivados(nombre:any, valor:any, desde:any) {
    if (!nombre){nombre = ''}
    if (!valor){valor = 1}

    switch (valor) {
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      case 2:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&fecha=asc`, this.cabeceras);
      break;

      case 3:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&NVisitas=desc`, this.cabeceras);
      break;

      case 4:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&NValoraciones=desc`, this.cabeceras);
      break;

      case 5:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      default:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
        break;
    }
    //console.log('service method')
  }

  cargarEscenasRecientesNoPrivadosNoUsu(nombre:any, valor:any, desde:any) {
    if (!nombre){nombre = ''}
    if (!valor){valor = 1}

    switch (valor) {
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      case 2:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&fecha=asc`, this.cabeceras);
      break;

      case 3:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&NVisitas=desc`, this.cabeceras);
      break;

      case 4:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&NValoraciones=desc`, this.cabeceras);
      break;

      case 5:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      default:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPrivNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
        break;
    }
    //console.log('service method')
  }

  cargarEscenasRecientesNoUsu(nombre:any, valor:any, desde:any) {
    if (!nombre){nombre = ''}
    if (!valor){valor = 1}

    switch (valor) {
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      case 2:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&fecha=asc`, this.cabeceras);
      break;

      case 3:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&NVisitas=desc`, this.cabeceras);
      break;

      case 4:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&NValoraciones=desc`, this.cabeceras);
      break;

      case 5:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      break;

      default:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
        break;
    }
    //console.log('service method')
  }


  obtenerEscenasPropias(nombre:string){

    return this.http.get(`${environment.base_url}/escenas/obtenerEscenasUsuario/?criterio=propios&nombre=${nombre}`, this.cabeceras);
  }

  obtenerEscenasLikes(nombre:string){
    if (!nombre){nombre = ""}
    return this.http.get(`${environment.base_url}/escenas/obtenerEscenasUsuario/?criterio=likes&nombre=${nombre}`, this.cabeceras);
  }

  obtenerEscenasGuardados(nombre:string){
    if (!nombre){nombre = ""}
    return this.http.get(`${environment.base_url}/escenas/obtenerEscenasUsuario/?criterio=guardados&nombre=${nombre}`, this.cabeceras);
  }

  // Implementar la búsqueda por nombre de usuario
  obtenerEscenasDeUnUsuario(nameUsu:any, nombre:any, desde:any, valor:any){

    switch(valor){
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
      case 2:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&fecha=asc`, this.cabeceras);
      case 3:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&NVisitas=desc`, this.cabeceras);
      case 4:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&NVisitas=asc`, this.cabeceras);
      case 5:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&NValoraciones=desc`, this.cabeceras);
      default:
      return this.http.get(`${environment.base_url}/escenas/filtrosNoPriv/?autor=${nameUsu}&nombre=${nombre}&desde=${desde}&fecha=desc`, this.cabeceras);
    }

  }

  obtenerEscenasFiltros(valor:any){
    switch(valor){
      case 1:
        return this.http.get(`${environment.base_url}/escenas/filtros/?fecha=desc`, this.cabeceras);
        break;
      case 2:
        return this.http.get(`${environment.base_url}/escenas/filtros/?fecha=asc`, this.cabeceras);
        break;
      case 3:
        return this.http.get(`${environment.base_url}/escenas/filtros/?NVisitas=desc`, this.cabeceras);
        break;
      case 4:
        return this.http.get(`${environment.base_url}/escenas/filtros/?NVisitas=asc`, this.cabeceras);
        break;
      case 5:
        return this.http.get(`${environment.base_url}/escenas/filtros/?NValoraciones=desc`, this.cabeceras);
        break;
      default:
        return this.http.get(`${environment.base_url}/escenas/filtros/?fecha=desc`, this.cabeceras);
        break;
    }
  }

  obtenerEscenasFiltrosPerfil(valor:any, nombre:any, desde:any, criterio:any){

    if (criterio == "propios"){
      switch(valor){
        case 1:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=propios`, this.cabeceras);
          break;
        case 2:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=asc&criterio=propios`, this.cabeceras);
          break;
        case 3:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=desc&criterio=propios`, this.cabeceras);
          break;
        case 4:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=asc&criterio=propios`, this.cabeceras);
          break;
        case 5:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NValoraciones=desc&criterio=propios`, this.cabeceras);
          break;
        default:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=propios`, this.cabeceras);
          break;
      }
    }
    else if (criterio == "likes"){
      switch(valor){
        case 1:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=likes`, this.cabeceras);
          break;
        case 2:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=asc&criterio=likes`, this.cabeceras);
          break;
        case 3:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=desc&criterio=likes`, this.cabeceras);
          break;
        case 4:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=asc&criterio=likes`, this.cabeceras);
          break;
        case 5:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NValoraciones=desc&criterio=likes`, this.cabeceras);
          break;
        default:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=likes`, this.cabeceras);
          break;
      }
    }
    else if (criterio == "guardados"){
      switch(valor){
        case 1:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=guardados`, this.cabeceras);
          break;
        case 2:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=asc&criterio=guardados`, this.cabeceras);
          break;
        case 3:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=desc&criterio=guardados`, this.cabeceras);
          break;
        case 4:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=asc&criterio=guardados`, this.cabeceras);
          break;
        case 5:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NValoraciones=desc&criterio=guardados`, this.cabeceras);
          break;
        default:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=guardados`, this.cabeceras);
          break;
      }
    }
    else {
      switch(valor){
        case 1:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=propios`, this.cabeceras);
          break;
        case 2:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=asc&criterio=propios`, this.cabeceras);
          break;
        case 3:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=desc&criterio=propios`, this.cabeceras);
          break;
        case 4:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NVisitas=asc&criterio=propios`, this.cabeceras);
          break;
        case 5:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&NValoraciones=desc&criterio=propios`, this.cabeceras);
          break;
        default:
          return this.http.get(`${environment.base_url}/escenas/filtrosPerfil/?nombre=${nombre}&desde=${desde}&fecha=desc&criterio=propios`, this.cabeceras);
          break;
      }
    }


  }


  obtenerEscenasFiltrosNoUsu(valor:any){
    switch(valor){
      case 2:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?fecha=asc`, this.cabeceras);
        break;
      case 3:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?NVisitas=desc`, this.cabeceras);
        break;
      case 4:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?NVisitas=asc`, this.cabeceras);
        break;
      case 5:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?NValoraciones=desc`, this.cabeceras);
        break;
      default:
        return this.http.get(`${environment.base_url}/escenas/filtrosNoUsu/?fecha=desc`, this.cabeceras);
        break;
    }
  }

  obtenerEscenasUsuario(uid:any){
    return this.http.get(`${environment.base_url}/escenas/escenasdeusuario/?id=${uid}`, this.cabeceras);
  }

  // OPERACIONES POST //


  subirDatosModelo( data : Escena) {
    //console.log(data);

    return this.http.post(`${environment.base_url}/escenas`, data, this.cabeceras);
  }

  subirImagenModelo(id : string, imag: string, file : any ){
    //console.log ('Inicia metodo de escena service, subir imagen');
    const form = new FormData()
    form.append('archivo', file);
    console.log(id);
    form.append('nombre',imag);
    return this.http.post(`${environment.base_url}/upload/imagenEscena/${id}`,form, this.cabeceras);

  }

  subirModeloModelo( id : string, model: string, file : any ){
    //console.log ('Inicia metodo de escena service, subir imagen');
    const form = new FormData()
    form.append('archivo', file);
    console.log(id);
    form.append('nombre',model);
    return this.http.post(`${environment.base_url}/upload/escena/${id}`,form, this.cabeceras2);

  }

  // PUT //
  darLikeGuardar(accion : any , idEscena : any){

    return this.http.put(`${environment.base_url}/escenas/darLikeGuardar/${idEscena}?accion=${accion}&contavisita=false`,'',this.cabeceras);
  }

  cambiarNombre( data : any, id:any, pos:any) {
    console.log(data);
    return this.http.put(`${environment.base_url}/escenas/cambiarNombre/${id}?pos=${pos}`, data, this.cabeceras);
  }

  editarDatosModelo(data:any, id:any){
    console.log(data);
    return this.http.put(`${environment.base_url}/escenas/${id}`, data, this.cabeceras);

  }

  editarImagenModelo(id : string, imag: string, file : any ){
    //console.log ('Inicia metodo de escena service, subir imagen');
    const form = new FormData()
    form.append('archivo', file);
    console.log(id);
    form.append('nombre',imag);
    return this.http.post(`${environment.base_url}/upload/imagenEscena/${id}`,form, this.cabeceras);

  }

  editarModeloModelo( id : string, model: string, file : any ){
    //console.log ('Inicia metodo de escena service, subir imagen');
    const form = new FormData()
    form.append('archivo', file);
    console.log(id);
    form.append('nombre',model);
    return this.http.post(`${environment.base_url}/upload/escena/${id}`,form, this.cabeceras);

  }


  // DELETE //
  borrarEscena ( uid: string) {
    return this.http.delete(`${environment.base_url}/escenas/${uid}`, this.cabeceras);
  }

  retirarArchivoAntiguo(nombreArchivo: string, tipoArchivo: string){
    //metodo usao en el update escena para eliminar los archivos antiguos de la escena;

    return this.http.delete(`${environment.base_url}/upload/${tipoArchivo}/${nombreArchivo}`, this.cabeceras);

  }


  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get cabeceras2() {
    return {
      headers: {
        'x-token': this.token,

      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.escena.uid;
  }


}
