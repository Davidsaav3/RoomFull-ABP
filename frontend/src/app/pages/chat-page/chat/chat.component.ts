  import { Component, OnInit, OnChanges, OnDestroy, Input} from '@angular/core';
  import { UsuarioService } from '../../../services/usuario.service';
  import { ChatService } from '../../../services/chat.service';
  import { ActivatedRoute, Router } from '@angular/router';
  import Swal from 'sweetalert2';
  //import { DragulaService } from 'ng2-dragula';
import { chatForm } from 'src/app/interfaces/enviar-chat-form.interface';
import { FormBuilder } from '@angular/forms';
import { ChatAuxService } from './chat-aux.service';
import { EscenaService } from '../../../services/escena.service';


  @Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
  })
  export class ChatComponent implements OnInit {


    private token: any = '';
    private message:any = 'none';

    public mensajesList:any;
    public hayMensajes: boolean;

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
    public metodo: string = '';
    public asunto: string = '';
    public usuarioMensaje: string = '';

    public nombreEmisor: string = '';
    public nombreReceptor: string = '';

    public contenido: string = 'Escribe...'
    public mensaje = '';
    public modelos_list: any;
    public validador_mencion: boolean = false;
    public numero_modelos: number = 0;
    public ultima_posicion: number = -1;
    public desde_mensajes: number = 10;
    public mensajes_paginados: any;
    public control_scroll: number = -100;
    public chatForm = this.fb.group({
      asunto: [''],
      mensajes: [''],
    });


    constructor( private activatedRoute: ActivatedRoute,
                private router: Router,
                private usuarioService: UsuarioService,
                private chatService: ChatService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private chatAux: ChatAuxService,
                private escenaService: EscenaService,
                ) {

        try {
          this.chatAux.currentMessage2.subscribe(message=> {
          this.message = message;
          this.ngOnInit();
          })
          document.addEventListener("keydown", (event) => {
            const modelos_sel = document.getElementsByClassName('div_modelos')[0] as HTMLElement;
            if(event.key === "Enter" && this.mensaje.length > 0 && this.mensaje != "\n"){
              this.enviarMensaje();
              this.mensaje = '';
              modelos_sel.style.display = 'none';
            }
          });

        } catch (error) {
          console.log(error)
        }

    }

    onElementScroll(event){

      let chat = document.getElementById('chatC')

      if (chat != null){

        console.log(chat.scrollTop);
        console.log(chat.offsetHeight) //673
        console.log(chat.scrollHeight)
        if (chat.scrollTop < chat.offsetHeight - chat.scrollHeight){
          // Hacer la petición anterior
          console.log('pido chats anteriores')
            // this.cargarConversacionUsuario();
              this.desde_mensajes += 10;
              this.mensajes_paginados = this.mensajesList.slice(0,this.desde_mensajes);
              this.cargaTardia(50);
        }
      }
    }

    ngOnInit(): void {



      if (this.message=='none'){
        this.idChat = this.route.snapshot.params['chat'];
      }
      else {
        this.idChat = this.message;
      }

      this.uid = this.devolverId();
      this.cargarDatosUsuario();
      this.obtenerNombres();
      this.cargaTardia(1000);
    }

    cargaTardia(tiempo:any){
      setTimeout(this.cursorModelos,tiempo);
    }
    cursorModelos(){
      const mensajes_men = Array.from(document.getElementsByClassName('receptor')) as Array<HTMLElement>;
      const id = document.getElementById('a') as HTMLElement;
      // console.log(id)
      // console.log(mensajes_men)
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

    // Obtener los nombres sabiendo que si soy el emisor el id del mensaje coincidirá con el mío y el id del receptor será el otro
    obtenerNombres(){
      this.chatService.cargarConversacionUsuario(this.idChat).subscribe({
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

      this.chatService.cargarConversacionUsuario(this.idChat).subscribe({
        next: (res:any) => {

          // console.log(res);
          this.idUsuarioRec = res.chats.idUsuarioRec;
          this.idUsuarioEmi = res.chats.idUsuarioEmi;
          this.idPropio = this.devolverId ();
          let idEnviar = '';

          if (this.idPropio == this.idUsuarioEmi){
            idEnviar = this.idUsuarioRec;
          }
          else {
            idEnviar = this.idUsuarioEmi;
          }

          // Cargar la conversación y el usuario
          this.usuarioService.cargarUsuario(idEnviar).subscribe({
            next: (res:any)=> {
              this.nombreUsuario = res.usuario.nombreUsuario;
              this.imagen = res.usuario.imagen;
              this.profesion = res.usuario.empresa;
              this.metodo = res.usuario.metodo;

              // console.log(res);

              this.cargarConversacionUsuario();

            },
            error: (err)=> {
              console.log(err);
            }
          })

          this.cargarEscenasReceptor();
          },
          error: (err)=> {
            console.log(err);
          }
      })
    }

    //Cargar los modelos del usuario receptor
    cargarEscenasReceptor(){
      this.escenaService.obtenerEscenasUsuario(this.idUsuarioRec).subscribe({
        next: (res:any) => {
          console.log("Modelos del usuario receptor")
          console.log(res)
          this.modelos_list = res['escenas'];
        },
        error: (error) =>{
          console.log(error)
        }
      })
    }
    // Se cargan los mensajes
    cargarConversacionUsuario(){

      this.idChat = this.route.snapshot.params['chat'];

      this.chatService.cargarConversacionUsuario(this.idChat).subscribe(
        {
        next: (res:any) => {

          // console.log(res.chats.mensajes);

          this.asunto = res.chats.asunto.toString();
          this.mensajesList = res.chats.mensajes;
          this.mensajes_paginados = this.mensajesList.slice(0,this.desde_mensajes);


          // Comentado NO BORRAR por si suceden chats locos
          // this.mensajesList.reverse();
          // console.log(this.mensajesList);

          if (this.mensajes_paginados.length > 0) {
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
    // Enviar el mensaje
    enviarMensaje(){


      let idYo = this.devolverId ();
      let idEmisor, idReceptor;

      if (this.idUsuarioEmi == idYo){
        idEmisor = idYo;
        idReceptor = this.idUsuarioRec;
      }
      else {
        idEmisor = this.idUsuarioRec;
        idReceptor = idYo;
      }


      const obj : chatForm = {
        idUsuarioEmi:  idEmisor || '',
        idUsuarioRec: idReceptor || '',
        asunto :  this.asunto || '',
        mensajes : this.mensaje || ''
        // this.chatForm.value.mensajes
      }

      console.log(obj)
      if(this.mensaje.length > 0){

      this.chatService.actualizarChat(obj ,this.route.snapshot.params['chat'])
      .subscribe({
        next: (res:any) => {

              this.idPropio = this.devolverId ();
              let idEnviar = '';

              if (this.idPropio == this.idUsuarioEmi){
                idEnviar = this.idUsuarioRec;
              }
              else {
                idEnviar = this.idUsuarioEmi;
              }

              // Cargar la conversación y el usuario
              this.usuarioService.cargarUsuario(idEnviar).subscribe({
                next: (res:any)=> {
                  this.nombreUsuario = res.usuario.nombreUsuario;
                  this.imagen = res.usuario.imagen;
                  this.profesion = res.usuario.empresa;
                  this.metodo = res.usuario.metodo;

                  this.cargarConversacionUsuario();
                },
                error: (err)=> {
                  console.log(err);
                }
              })


          this.chatForm.reset();
          this.mensaje = '';
        },
        error: (err) => {
          console.log(err);
        }
        });
      }
    }

    // Redirigir al chat inicio
    redirectChat(){
      this.router.navigateByUrl('/chat');
    }

      // Eliminar el chat
      eliminarChat(){
        let rutaEliminar = this.route.snapshot.params['chat'];
        this.router.navigateByUrl('/chat');
        this.chatService.borrarChats(rutaEliminar).subscribe({
          next:((res:any)=>{
            this.chatAux.changeMessage("eliminar");
            this.EsconderModalEliminar();
          })
        })
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


    EsconderModalEliminar(){
      const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      containerModal[0].style.display='none';
    }

    MostrarModalEliminar(){
      // const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      // containerModal[0].style.display='flex';
      // var body = document.body,
      // html = document.documentElement;

      // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

      // containerModal[0].style.height= body.scrollHeight.toString()+'px';
      Swal.fire({
        title: 'Eliminar conversación',
        text: `Se eliminará la conversación y mensajes todos los mensajes con  ${this.nombreReceptor}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#0073ca',
        cancelButtonColor: '#d40d06',
        cancelButtonText: 'Cancelar',
        focusConfirm: true,
        allowOutsideClick: true
      }).then((result) =>{
        if(result.isConfirmed){
          this.eliminarChat();
        }
      });

    }

    irUsuario(nombreUsuario:string){
      this.router.navigateByUrl(`user/modelo/`+nombreUsuario);
    }

    mencionModelo(){
      const mensaje = document.getElementsByClassName('mencion')[0] as HTMLInputElement;
      const modelos_sel = document.getElementsByClassName('div_modelos')[0] as HTMLElement;
      this.mensaje = mensaje.value;
      if(this.mensaje.length === 0){
        this.numero_modelos = 0;
      }
      if(this.numero_modelos !== 1 && this.mensaje.includes('#')){
        modelos_sel.style.display = 'block';

        //cargar los modelos del usuario receptor this.idUsuarioRec
        let posicion = this.mensaje.indexOf('#');
        let aux = this.mensaje.replace('#','');
        this.modelos_list.forEach(element => {
          if(element.nombre.startsWith(aux)){
          }
        });
      }else{
        modelos_sel.style.display = 'none';
      }
    }

    seleccionarModelo(uid:any){
      let mensaje = document.getElementsByClassName('mencion')[0] as HTMLInputElement;
      const modelos_sel = document.getElementsByClassName('div_modelos')[0] as HTMLElement;
      this.modelos_list.forEach(element => {
        if(element.uid === uid){
          mensaje.value += element.nombre;
          this.mensaje += element.nombre;
        }
      });
      modelos_sel.style.display = 'none';
      this.numero_modelos = 1;
    }
}


