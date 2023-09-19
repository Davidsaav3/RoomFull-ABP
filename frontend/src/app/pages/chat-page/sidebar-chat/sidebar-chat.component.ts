  import { Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
  import { ChatService } from '../../../services/chat.service';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import Swal from 'sweetalert2';
  import { Usuario } from '../../../models/usuario.model';
  //import { DragulaService } from 'ng2-dragula';
import { ChatAuxService } from '../chat/chat-aux.service';
import { NavBarAuxComponent } from '../../../commons/navbar/navbar-aux.service';
import { EscenaService } from '../../../services/escena.service';


  @Component({
    selector: 'app-sidebar-chat',
    templateUrl: './sidebar-chat.component.html',
    styleUrls: ['./sidebar-chat.component.css']
  })
  export class SidebarChatComponent implements OnInit {

    timeout: any = null;
    public uid: string = '';
    private token: any = '';
    public chatList: any;
    public nombreUsuario: any = '';
    private message:any = '';
    public chatCambiar:any = 'none';
    public totalReal: any;


    constructor(
          private chatService: ChatService,
          private chatAuxService: ChatAuxService,
          private chatAux:NavBarAuxComponent,
          private router: Router,
          private escenaService:EscenaService) {

          try {
            this.chatAuxService.currentMessage.subscribe(message=> {

            if (message==="eliminar"){
              this.cargarConversacionesUsuario();
              this.chatAuxService.changeMessage("none");
            }

            })

          } catch (error) {
            console.log(error)
          }

          try {
            this.chatAux.currentMessage.subscribe(message=> {

            if (message==="cambiado"){
              this.chatCambiar = "none";
            }
            })

          } catch (error) {
            console.log(error)
          }

    }


    ngOnInit(): void {

      this.uid = this.devolverId();
      this.cargarConversacionesUsuario();
    }


    cargarConversacionesUsuario(){
      this.chatService.cargarConversacionesUsuario(this.uid, "").subscribe(
        {
        next: (res:any) => {
          this.chatList = res;
          console.log(this.chatList)
          this.totalReal = res[0].totalReal;
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

    abrirChat(uid:any){
      this.router.navigateByUrl(`chat/usuario/`+uid);
      this.chatAuxService.changeMessage2(uid);

      this.chatList.forEach((element:any) => {
        if (element.uid == uid){
          this.chatCambiar = element.uid;
        }
      });

    }

    onKeySearch(event: any) {
      clearTimeout(this.timeout);
      var $this = this;
      this.timeout = setTimeout(function () {
        if (event.keyCode != 13) {
          $this.executeListing(event.target.value);
        }
      }, 500);
    }

    private executeListing(value: string) {

      this.chatService.cargarConversacionesUsuario(this.uid, value).subscribe(
        {
        next: (res:any) => {
          this.chatList = res;

          console.log(this.chatList)
        },
        error: (err)=> {
          console.log(err);
        }
      }
      );

    }

}

