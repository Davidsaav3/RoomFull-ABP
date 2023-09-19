import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { registerForm  } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Chat } from '../models/chat.model';
import { Schema, model } from 'mongoose';
import { chatForm } from '../interfaces/enviar-chat-form.interface';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private chat: Chat;

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

  get idUsuarioEmi(): Schema.Types.ObjectId {
    return this.chat.idUsuarioEmi;
  }

  get idUsuarioRec(): Schema.Types.ObjectId {
    return this.chat.idUsuarioRec;
  }

  get mensajes(): Array<string> {
    return this.chat.mensajes;
  }

  get asunto(): Array<string> {
    return this.chat.asunto;
  }

  get fecha(): Date {
    return this.chat.fecha;
  }

  // GET //
  obtenerChats (uid: String) {
    return this.http.get(`${environment.base_url}/chats/?id=${uid}`, this.cabeceras);
  }

  obtenerChatsPorFecha (uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/chats/porFecha/${uid}`, this.cabeceras)
  }


  // GET CONVERSACIONES Y DATOS USUARIO PARA ADMIN
  obtenerChatsAdminReceptor(desde?: number, textoBusqueda?: string ){

    return this.http.get(`${environment.base_url}/chats/nameAdmin?desde=${desde}&nombreChat=${textoBusqueda}`, this.cabeceras)
    .pipe(
      switchMap((chats:any) => {
        if (chats.chats.length > 0){
          return forkJoin(
            chats.chats.map((chat: any) => {
                return this.http.get(`${environment.base_url}/usuarios/?id=${chat.idUsuarioRec}` , this.cabeceras).pipe(
                  map((usuarioRec: any) => {
                    chat.usuarioRec = usuarioRec.usuario;
                    return chat
                  })
                )
            })
          )
        }
        return of([]);
      })
    )

  }

  obtenerPagesChats(desde?: number, textoBusqueda?: string){
    return this.http.get(`${environment.base_url}/chats/nameAdmin?desde=${desde}&nombreChat=${textoBusqueda}`, this.cabeceras);
  }

  obtenerChatsAdminEmisor(){

    return this.http.get(`${environment.base_url}/chats/nameAdmin`, this.cabeceras)
    .pipe(
      switchMap((chats:any) => {
        if (chats.chats.length > 0){
          return forkJoin(
            chats.chats.map((chat: any) => {
                return this.http.get(`${environment.base_url}/usuarios/?id=${chat.idUsuarioEmi}` , this.cabeceras).pipe(
                  map((usuarioEmi: any) => {
                    chat.usuarioEmi = usuarioEmi.usuario;
                    return chat
                  })
                )
            })
          )
        }
        return of([]);
      })
    )

  }


  // DELETE //
  borrarChats ( uid: string) {
    return this.http.delete(`${environment.base_url}/chats/${uid}`, this.cabeceras);
  }

  // Actualizar chat
  actualizarChat(formData: chatForm, uid:string){
    return this.http.put(`${environment.base_url}/chats/${uid}`, formData,  this.cabeceras)
  }

  // Enviar formulario
  enviar( formData: chatForm) {

    return this.http.post(`${environment.base_url}/chats/`, formData,  this.cabeceras)
     .pipe(
      tap( (res : any) => {
      })
    );
  }

  // GET CONVERSACIONES Y DATOS USUARIO
  cargarConversacionesUsuario(uid:string, nombre:string){
    if (!nombre) { nombre = '';}

    console.log(nombre)

    return this.http.get(`${environment.base_url}/chats/porFecha/${uid}?nombre=${nombre}`, this.cabeceras).pipe(
      switchMap((chats:any) => {

        let totalReal = chats.totalReal;

        if (chats.chats.length > 0){
          return forkJoin(
            chats.chats.map((chat: any) => {

              if (chat.idUsuarioEmi == uid){
                return this.http.get(`${environment.base_url}/usuarios/?id=${chat.idUsuarioRec}` , this.cabeceras).pipe(
                  map((usuario: any) => {
                    chat.usuario = usuario.usuario;
                    chat.totalReal = totalReal;
                    return chat;
                  })
                )
              }
              else {
                return this.http.get(`${environment.base_url}/usuarios/?id=${chat.idUsuarioEmi}` , this.cabeceras).pipe(
                  map((usuario: any) => {
                    chat.usuario = usuario.usuario;
                    chat.totalReal = totalReal;
                    return chat;
                  })
                )
              }
            })
          );
        }
        return of([]);
      })
    )
  }
y
  cargarConversacionUsuario(uid:string, desde?:number){
    if(desde !== undefined){
      return this.http.get(`${environment.base_url}/chats/?id=${uid}&mensajes=${desde}`, this.cabeceras)
    }else{
      return this.http.get(`${environment.base_url}/chats/?id=${uid}`, this.cabeceras)
    }
  }



}
