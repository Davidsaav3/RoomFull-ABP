import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { FormBuilder, Validators } from '@angular/forms';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  public uidusuario = '';
  imagenUrl: string = './../../assets/profile/profile-pic.webp';
  nombre: string = 'Usuario';
  nom: string = 'Usuario';
  empresa: string = 'Arquitecto';
  private uid: string = '';
  private token: any = '';
  public descripcion: string = '';

  idUsuarioRec: string = "";
  idUsuarioEmi: string = "";
  mensajes: string = "";
  asunto: string = "";
  fecha: string = "";

  constructor( private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.uid = this.devolverId();

  }


  cargarUsuarios() {
    this.usuarioService.cargarUsuario(this.uid).subscribe(
      {
        next: (res:any) => {
          this.imagenUrl = res.usuario.imagenUrl;
          this.nom = res.usuario.nombre;
          this.empresa = res.usuario.empresa;
        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
  }



  // Decodificar el jwt del localstorage para sacar el id
  devolverId (){
    this.token = localStorage.getItem('token');
    var base64Url = this.token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    // console.log(jsonPayload);
    var objPayload = JSON.parse(jsonPayload);
    var uid = objPayload.uid;
    return uid;
  }

  logout() {
    this.usuarioService.logout();
  }

}

