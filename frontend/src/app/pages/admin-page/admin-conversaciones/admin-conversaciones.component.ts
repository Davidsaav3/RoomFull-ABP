import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { mergeMap, Observable } from 'rxjs';
import { of } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-conversaciones',
  templateUrl: './admin-conversaciones.component.html',
  styleUrls: ['./admin-conversaciones.component.css']
})
export class AdminConversacionesComponent implements OnInit {

  public textoBusqueda: string = "";
  public desde: number;
  public primero: boolean = true;
  public ultimo: boolean = false;
  public ultimaPage: number;
  public paginas: any;
  public estaVacio:Boolean = true;

  public chatList: any;
  private chatsReceptor: any;
  private chatsEmisor: any;
  public hayMensajes: Boolean;
  private idChat:any;
  private uidChat:any;
  private token: any = '';
  public uid: string = '';

  timeout: any = null;

  public itemsSelector:string[] = new Array<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private usuarioService: UsuarioService,) {



}

ngOnInit(): void {
  this.desde = 1;
  this.itemsSelector = [];
  this.uid = this.devolverId();
  this.cargarChats();
}

comprobarVacio(){

  if (this.itemsSelector.length<=0){
    this.estaVacio = true;
  }
  else {
    this.estaVacio = false;
  }

  console.log(this.estaVacio);
}

seleccionarTodo(e:any){

  this.comprobarVacio();
  this.itemsSelector = [];

  this.chatList.forEach((chat:any)=> {
  chat.checked = e.target.checked

  if(chat.checked===true){
    this.itemsSelector.push(chat.uid);
  }

  this.comprobarVacio();

  })

  console.log(this.itemsSelector)

}

eliminarTodos(){

  this.itemsSelector.forEach(chat=> {
    this.chatService.borrarChats(chat).subscribe({
      next:((res:any)=>{
        console.log(res)
        this.ngOnInit();
        this.EsconderModalEliminar2();
        this.comprobarVacio();
      })
    })
  })

}


getChatId(e:any, id:string)
{
  this.comprobarVacio();

	if(e.target.checked)
	{
		this.itemsSelector.push(id);
	}
	else{
		this.itemsSelector = this.itemsSelector.filter(m=>m!=id);
	}

  this.comprobarVacio();

	console.log(this.itemsSelector);
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
  this.cargarChats();
}

cargarChats(){

    this.chatService.obtenerChatsAdminReceptor(this.desde, this.textoBusqueda).subscribe({
      next: (res:any) => {
        this.chatsReceptor = res;
        let tam = res.length;
        this.ultimaPage = Math.ceil(tam/10);
        this.paginas = Array(this.ultimaPage).fill(1).map((x,i)=>i);

        setTimeout( () =>{

          const page = Array.from(document.getElementsByClassName('page') as HTMLCollectionOf<HTMLElement>);
          console.log(page)

          page.forEach((element, index) => {
            if(index === this.desde - 1){
              element.style.color='#0073ca';
              element.style.textDecoration='underline';
            }else{
              element.style.color='';
              element.style.textDecoration='';
            }
          });
          }, 100);

        // this.ultimaPage = Math.ceil(res.page.total/6);

        this.chatService.obtenerChatsAdminEmisor().subscribe(
        {
          next: (res:any) => {
            this.chatsEmisor = res;

            // Unimos los dos objetos de momento solo me interesa el nombre del usuario
            this.chatList = this.chatsReceptor;

            for (let i = 0; i < this.chatList.length; i++){
              this.chatList[i]["nombreReceptor"] = this.chatsReceptor[i].usuarioRec.nombreUsuario;
            }
            for (let i = 0; i < this.chatList.length; i++){
              this.chatList[i]["nombreEmisor"] = this.chatsEmisor[i].usuarioEmi.nombreUsuario;
            }
            console.log(this.chatList);

            if (this.chatList.length <= 0){
              this.hayMensajes = false;
            }
            else {
              this.hayMensajes = true;
            }
            console.log(this.hayMensajes)

          },
          error: (err)=> {
            console.log(err);
          }
        })
      },
      error:(res:any)=>{

      }
    })
  }

  EsconderModalEliminar(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='none';
  }

  EsconderModalEliminar2(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='none';
  }


MostrarModalesEliminar(){
  // const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
  // containerModal[0].style.display='flex';
  // var body = document.body,
  // html = document.documentElement;

  // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

  // containerModal[0].style.height= body.scrollHeight.toString()+'px';

  Swal.fire({
    title: 'Eliminar conversaciones',
    text: `¿Desea eliminar las ${this.itemsSelector.length} conversaciones seleccionadas?`,
    icon: 'question',
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
    confirmButtonColor: '#0073ca',
    focusConfirm: true,
    allowOutsideClick: true
  }).then((result) =>{
    if(result.isConfirmed){
      this.eliminarTodos();
    }
  });

}

MostrarModalEliminar(id:string){
    // const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    // containerModal[0].style.display='flex';
    // var body = document.body,
    // html = document.documentElement;

    // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

    // containerModal[0].style.height= body.scrollHeight.toString()+'px';

    this.uidChat = id;

    Swal.fire({
      title: 'Eliminar conversación',
      text: '¿Desea eliminar esta conversación?',
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#0073ca',
      focusConfirm: true,
      allowOutsideClick: true
    }).then((result) =>{
      if(result.isConfirmed){
        this.eliminarConver();
      }
    });

  }

  menos(){
    this.desde = this.desde - 1;
    const page = Array.from(document.getElementsByClassName('page') as HTMLCollectionOf<HTMLElement>);
    page.forEach((element, index) => {
      if(index === this.desde - 1){
        element.style.color='#0073ca';
        element.style.textDecoration='underline';
      }else{
        element.style.color='';
        element.style.textDecoration='';
      }
    });
    this.cargarChats();
    if(this.desde <= 1){
      this.desde = 1;
      this.primero = true;
      this.ultimo = false;
    }else{
      this.primero = false;
      this.ultimo = false;
    }
  }


  mas(){
    this.desde = this.desde + 1;
    const page = Array.from(document.getElementsByClassName('page') as HTMLCollectionOf<HTMLElement>);
    page.forEach((element, index) => {
      if(index === this.desde - 1){
        element.style.color='#0073ca';
        element.style.textDecoration='underline';
      }else{
        element.style.color='';
        element.style.textDecoration='';
      }
    });
    if(page.length > 1){
      this.cargarChats();
    if(this.desde >= this.ultimaPage){
      this.desde = this.ultimaPage;
      this.primero = false;
      this.ultimo = true;
    }else{
      this.primero = false;
      this.ultimo = false;
    }
    }

  }

  pagina(p: any){
    this.desde = p + 1;
    const page = Array.from(document.getElementsByClassName('page') as HTMLCollectionOf<HTMLElement>);
    page.forEach((element, index) => {
      if(index === this.desde - 1){
        element.style.color='#0073ca';
        element.style.textDecoration='underline';
      }else{
        element.style.color='';
        element.style.textDecoration='';
      }
    });
    if(this.desde <= 1){
      this.desde = 1;
      this.primero = true;
      this.ultimo = false;
    }else{
      if(this.desde >= this.ultimaPage){
        this.desde = this.ultimaPage;
        this.primero = false;
        this.ultimo = true;
      }else{
        this.primero = false;
        this.ultimo = false;
      }
    }

    this.cargarChats();
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



  // Eliminar el chat
  eliminarConver(){
    this.chatService.borrarChats(this.uidChat).subscribe({
      next:((res:any)=>{
        this.EsconderModalEliminar();
        this.cargarChats();
      })
    })
  }
}
