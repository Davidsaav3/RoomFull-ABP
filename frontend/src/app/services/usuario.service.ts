import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { registerForm  } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { compilePipeFromMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private usuario: Usuario;
  private data: Usuario;

  constructor( private http: HttpClient,
               private router: Router  ) { }

  actualizarUsuario ( uid: string, data: any) {
    return this.http.patch(`${environment.base_url}/usuarios/${uid}`, data, this.cabeceras);
  }

  actualizarUsuDescription ( uid: string, desc: any) {
    const datos: FormData = new FormData();
    datos.append('description', desc);
    return this.http.put(`${environment.base_url}/usuarios/actualizarDesc/${uid}`, datos, this.cabeceras);
  }

  actualizarFotoUsuario (uid: string, data: any){
    return this.http.patch(`${environment.base_url}/usuarios/actualizarFoto/${uid}`, data, this.cabeceras);
  }

  actualizarPassUsuario (uid: string, data: any){
    return this.http.patch(`${environment.base_url}/usuarios/cambiarContrasena/${uid}`, data, this.cabeceras);
  }

  subirImagenUsuario(id : string, imag: string, file : any ){
    const form = new FormData()
    form.append('archivo', file);
    form.append('nombre',imag);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${id}`,form, this.cabeceras);

  }

  subirImagenUsuarioRegistro(id : string, imag: string, file : any ){
    const form = new FormData()
    form.append('archivo', file);
    form.append('nombre',imag);
    return this.http.post(`${environment.base_url}/upload/registro/fotoperfil/${id}`,form, this.cabeceras);

  }

  cambiarOpciones ( uid: string, data: any) {
    return this.http.patch(`${environment.base_url}/usuarios/cambiarOpciones/${uid}`, data, this.cabeceras);
  }

  cambiarPassword( uid: string, data: any) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  actualizarUsuMetodo( uid: string, data: any) {
    return this.http.put(`${environment.base_url}/usuarios/actualizarMetodo/${uid}` , data, this.cabeceras);
  }

  cargarUsuarioNombre( name: string) {
    if (!name) { name = '';}
    //console.log(this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras));
    return this.http.get(`${environment.base_url}/usuarios/name/?nombre=${name}` , this.cabeceras);
  }


  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
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

  login( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login`, formData)
     .pipe(
      tap( (res : any) => {
        localStorage.setItem('token', res['token']);
      })
    );
  }

  // Hacemos el post con el token generado por google que hemos pasado por el body de la petición
  // Esperamos al resultado de la petición, y si sale bien guardamos el token del usuario generado en el backend en localstorage
  loginGoogle(tokenGoogle:any) {
    return this.http.post(`${environment.base_url}/login/google`, {token:tokenGoogle})
     .pipe(
      tap( (res : any) => {
        localStorage.setItem('token', res['token']);
      })
    );
  }



  registroGoogle(tokenGoogle:any){
    return this.http.post(`${environment.base_url}/login/authgoogle`, {token:tokenGoogle}) .pipe(
      tap( (res:any)=> {
        this.data = {
          uid: '',
          apellidos: res.payload.family_name || 'Sin apellidos',
          email : res.payload.email || '',
          empresa : '',
          nombre : res.payload.given_name || '',
          nombreUsuario : res.payload.email || '', // cambiar a lo que hay antes del arroba en el email
          password : '',
          telefono :  NaN,
          imagen : res.payload.picture || '',
          imagenUrl :  '',
          rol : 'Usuario',
        }
      }));
  }

  registrarUsuario(){
        return this.http.post(`${environment.base_url}/usuarios/google`, this.data, this.cabeceras).pipe(
          tap((res:any)=> {
            console.log("Probando registrar usuario " + this.data.email);
          })
        );
  }

  register ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  logout(): void {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/');
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {

          const { token} = res;
          localStorage.setItem('token', token);

        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if (token === '') {
      return of(false);
    }

    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token':token
      }
      }).pipe(
        tap( (res:any) => {
          const { uid, apellidos, email, empresa, nombre, nombreUsuario, password, telefono, imagen, rol, subscription } = res;
          this.usuario = new Usuario(uid, rol, email, nombre, apellidos, nombreUsuario, password, empresa, telefono, imagen);
          this.usuario.subscription = subscription;
        }),
        map ( resp => {
          return true;
        }),
        catchError ( err => {
          localStorage.removeItem('token');
          return of(false);
        })
      )
  }

  validarNoToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    if (token === '') {
      return of(true);
    }

    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token':token
      }
      }).pipe(
        tap( (res:any) => {
          console.log('token renovado desde validar No Token');
          const { uid, apellidos, email, empresa, nombre, nombreUsuario, password, telefono, imagen, imagenUrl, rol, subscription } = res;
          this.usuario = new Usuario(uid, rol, email, nombre, apellidos, nombreUsuario, password, empresa, telefono, imagen, subscription);
        }),
        map ( resp => {
          return false;
        }),
        catchError ( err => {
          localStorage.removeItem('token');
          return of(true);
        })
      )
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

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  crearImagenUrl( imagen: string) {

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/upload/fotoperfil/no-imagen?token=${token}`;
    }
    return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
  }

  //RECOVERY

  generarCodigoVerificacion(email : any){
    const form = new FormData;
    form.append('email',email);

    return this.http.post(`${environment.base_url}/usuarios/codigoVerificacion`,form);
  }


  comprobarCodigoGenerado(code : any, email : any){
    const form = new FormData;
    form.append('email',email);
    form.append('codigo',code);

    return this.http.post(`${environment.base_url}/usuarios/verificarCodigo`,form);
  }

    nuevaContrasena(newPass : any , newPassRep : any, email : any){
      const form = new FormData;
      form.append('email',email);
      form.append('contrasenaNueva',newPass);
      form.append('contrasenaNuevaRepite',newPassRep);

      return this.http.post(`${environment.base_url}/usuarios/nuevaContrasena`,form);
    }
  //FIN RECOVERY

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
