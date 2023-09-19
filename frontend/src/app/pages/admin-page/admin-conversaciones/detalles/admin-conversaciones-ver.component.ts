import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { chatForm } from 'src/app/interfaces/enviar-chat-form.interface';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EscenaService } from '../../../../services/escena.service';

@Component({
  selector: 'app-admin-conversaciones-ver',
  templateUrl: './admin-conversaciones-ver.component.html',
  styleUrls: ['./admin-conversaciones-ver.component.css']
})
export class AdminConversacionesVerComponent implements OnInit {

  private token: any = '';
  public mensajesList: any;
  public hayMensajes: boolean;

  public fecha: Date;
  public nMensajes: any;
  public descripcion: string = '';
  public id: string = '';
  public uid: string = '';
  public element = "display: none;";

  private idUsuarioRec: string = "";
  private idUsuarioEmi: string = "";
  private idPropio: string = "";
  private idChat: string = "";

  public imagen: string = "";
  public nombreUsuario: string = '';
  public profesion: string = '';
  public profesionEmisor: string = '';
  public metodo: string = '';
  public asunto: string = '';
  public usuarioMensaje: string = '';

  public nombreRec: string = '';
  public profesionRec: string = '';
  public imagenRec: string = '';
  public metodoRec: string = '';

  public nombreEmi: string = '';
  public profesionEmi: string = '';
  public imagenEmi: string = '';
  public metodoEmi: string = '';

  public nombreEmisor: string = '';
  public nombreReceptor: string = '';

  public contenido: string = 'Escribe...'

  public chatForm = this.fb.group({
    asunto: [''],
    mensajes: [''],
  });


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private escenaService: EscenaService) { }

  ngOnInit(): void {
    this.uid = this.devolverId();
    this.cargarDatosUsuario();
    this.obtenerNombres();
    this.cargaTardia();
  }

  cargaTardia(){
    setTimeout(this.cursorModelos,1000);
  }
  cursorModelos(){
    const mensajes_men = Array.from(document.getElementsByClassName('receptor')) as Array<HTMLElement>;
    const id = document.getElementById('a') as HTMLElement;
    console.log(id)
    console.log(mensajes_men)
    mensajes_men.forEach(mensaje =>{
      if(mensaje.innerHTML.includes('#')){
        mensaje.style.fontStyle = 'italic';
        mensaje.addEventListener("mouseover", ()=>{
          mensaje.style.cursor = 'pointer';
        });
      }
    });

    const mensajes_men2 = Array.from(document.getElementsByClassName('emisor')) as Array<HTMLElement>;
    const id2 = document.getElementById('a') as HTMLElement;
    console.log(id2)
    console.log(mensajes_men2)
    mensajes_men2.forEach(mensaje =>{
      if(mensaje.innerHTML.includes('#')){
        mensaje.style.fontStyle = 'italic';
        mensaje.addEventListener("mouseover", ()=>{
          mensaje.style.cursor = 'pointer';
        });
      }
    });
  }

  irUsuario(nombre:string){
    this.router.navigateByUrl(`user/modelo/`+nombre);
  }

  volver (){
    this.router.navigateByUrl("/admin/administracion/discusiones");
  }

     // Obtener los nombres sabiendo que si soy el emisor el id del mensaje coincidirá con el mío y el id del receptor será el otro
     obtenerNombres(){

      this.chatService.cargarConversacionUsuario(this.route.snapshot.params['chat']).subscribe({
        next: (res:any) => {

          // console.log(res.chats);

          let idYo = res.chats.idUsuarioEmi;
          let idOtro = res.chats.idUsuarioRec;
          let idEmisor, idReceptor;

          if (this.uid == idYo){
            idEmisor = idYo;
            idReceptor = idOtro;
          }
          else {
            idEmisor = idOtro;
            idReceptor = idYo;
          }

          // Obtenemos el nombre del emisor
          this.usuarioService.cargarUsuario(idEmisor).subscribe({
            next: (res:any)=> {
              this.nombreEmisor = res.usuario.nombreUsuario;
            },
            error: (err)=> {
              console.log(err);
            }
          })

          // Obtenemos el nombre del receptor
          this.usuarioService.cargarUsuario(idReceptor).subscribe({
            next: (res:any)=> {
              this.nombreReceptor = res.usuario.nombreUsuario;
            },
            error: (err)=> {
              console.log(err);
            }
          })

          },
          error: (err)=> {
            console.log(err);
          }
      })


    }

    // Cargar datos usuario receptor
    cargarDatosUsuario(){
      this.chatService.cargarConversacionUsuario(this.route.snapshot.params['chat']).subscribe({
        next: (res:any) => {

          // console.log(res);
          this.idUsuarioRec = res.chats.idUsuarioRec;
          this.idUsuarioEmi = res.chats.idUsuarioEmi;
          this.idPropio = this.devolverId ();

          let idEnviar = '';
          let idOtro = '';

          if (this.idPropio == this.idUsuarioEmi){
            idEnviar = this.idUsuarioRec;
            idOtro = this.idUsuarioEmi;
          }
          else {
            idEnviar = this.idUsuarioEmi;
            idOtro = this.idUsuarioRec;
          }

          // Cargar la conversación y el usuario
          this.usuarioService.cargarUsuario(this.idUsuarioEmi).subscribe({
            next: (res:any)=> {
              this.nombreEmi = res.usuario.nombreUsuario;
              this.imagenEmi = res.usuario.imagen;
              this.profesionEmi = res.usuario.empresa;
              this.metodoEmi = res.usuario.metodo;

              // Obtener datos cabecera receptor
              this.usuarioService.cargarUsuario(this.idUsuarioRec).subscribe({
                next: (res:any)=> {
                  this.nombreRec = res.usuario.nombreUsuario;
                  this.imagenRec = res.usuario.imagen;
                  this.profesionRec = res.usuario.empresa;
                  this.metodoRec = res.usuario.metodo;


                  this.cargarConversacionUsuario();
                },
                error: (err)=> {
                  console.log(err);
                }
              })


              this.cargarConversacionUsuario();
            },
            error: (err)=> {
              console.log(err);
            }
          })


          },
          error: (err)=> {
            console.log(err);
          }
      })
    }

        //Enlace a mi modelo #chat
        accesoMencionado(mensaje:any){
          if(mensaje.includes('#')){
            let mensaje_form = mensaje.split(' ');
            let escena:any;
            let id:any;
          mensaje_form.forEach(element => {
            if(element.includes('#')){
              escena = element.split('#')[1];
            }
          });
          this.escenaService.cargarEscenasNombre(escena).subscribe({
            next: (res) =>{
              id = res['escenas'][0]['uid'];
              this.router.navigateByUrl(`modelo/`+id);
            },
            error: (error) =>{
              console.log(error);
            }
          });
          }
        }

    onElementScroll(event){

      let chat = document.getElementById('chatC')

      if (chat != null){

        console.log(chat.scrollTop);

        if (chat.scrollTop < -1200){
          // Hacer la petición anterior
          console.log('pido chats anteriores')
        }

      }
    }

    // Se cargan los mensajes
    cargarConversacionUsuario(){

      this.idChat = this.route.snapshot.params['chat'];

      this.chatService.cargarConversacionUsuario(this.idChat).subscribe(
        {
        next: (res:any) => {

          this.asunto = res.chats.asunto.toString();
          this.fecha = res.chats.fecha.toString();

          this.mensajesList = res.chats.mensajes;

          // No borrar por si chats locos
          // this.mensajesList.reverse();

          this.nMensajes = this.mensajesList.length;

          if (this.mensajesList.length > 0) {
            this.hayMensajes = true;
          }
          else{
            this.hayMensajes = false;
          }

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


    hideData(){
      this.element = "display: none;";
    }

    showData(){
      this.element = "display: block;";
    }


    hideData2(){
      this.element = "display: none;";
      const chatForm1 = document.getElementById('p1');

      if(chatForm1){
        chatForm1.style.display="flex";
      }
    }

    showData2(){
      this.element = "display: flex;";
      const chatForm2 = document.getElementById('p2');

      if(chatForm2){
        console.log(chatForm2.style);
        chatForm2.style.display="none";
      }
    }


}



