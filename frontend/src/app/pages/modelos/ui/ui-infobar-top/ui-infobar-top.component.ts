import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { EngineComponent } from '../../engine/engine.component';
import { UsuarioService } from '../../../../services/usuario.service';
import { EscenaService } from '../../../../services/escena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatService } from '../../../../services/chat.service';
import { chatForm } from '../../../../interfaces/enviar-chat-form.interface';



@Component({
  selector: 'app-ui-infobar-top',
  templateUrl: './ui-infobar-top.component.html',
  styleUrls:['ui-infobar-top.component.css']

})
  export class UiInfobarTopComponent implements OnInit {

    @Output () menuState :EventEmitter<string> = new EventEmitter;
    menuStateBoolean = false; // false cerrado true abierto

    public isLoaded: boolean = true;
    imagenUsu : any;
    usuario: string = 'Usuario';
    titulo: string = 'Titulo del modelo';
    descripcion: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium accusamus iure dicta deserunt ipsam odio molestias consequatur cum explicabo est?';
    idmodelo: string;
    nguardados: string = '0';
    nvaloraciones: string = '0';
    nvisitas: string = '0';
    fechastr: string = '99/99/9999';
    liked:any;
    saved:any;
    modeloModelo:'jaja';
    uidDuenyo='';
    nombreCompleto='';
    modeloPropio = false;
    token: string;
    display: string = 'display:none';

    public miId :any;


    private _router: Router | undefined;
    /*router!: Router;*/

    public ocultao = false;

    public ocultaoHW = false;
    public ocultaoXD= false;
    perfilPropio : Boolean = false;
    private tokenUserName : string = '';
    private uid: string = '';


    public imagen = '';
    public nombre: string = '';
    public empresa: string = '';
    public nombreUsuario: string = '';

    public numGuardados: string = '';
    public numLikes: string = '';
    public numModelos: string = '';

    private modelosUsuario : any;


    private ruta:string = '';

    public formSubmit = false;
    public waiting = false;
    private uidRec: string = '';

    public chatForm = this.fb.group({
      asunto: [''],
      mensajes: [''],
    });


    public constructor(private _location: Location, private usuarioService: UsuarioService, private route: ActivatedRoute, private escenaService:EscenaService, private router: Router,private fb: FormBuilder,private chatService: ChatService) {

      this.route.params.subscribe({
        next:((id)=>{
          this.idmodelo=id['id'];
          console.log("id: "+id['id']);
        }),
      });
    }

    ngOnInit(): void {
      this.miId = this.devolverId();
      this.obtenerEscenaSinVisita();

    }

    MostrarModalConversacion(){
      const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      containerModal[0].style.display='flex';
    }


    sendChat(){
      this.usuarioService.cargarUsuarioNombre(this.usuario).subscribe({
        next: (res:any) => {
          this.uidRec = res.usuario.uid;
          this.uid = this.devolverId();
          this.enviarFormChat();
          },
          error: (err)=> {
            console.log(err);
          }
      })

    }

    enviarFormChat(){

      console.log('id emisor' + this.uid)
      console.log('id receptor' + this.uidRec)


     const obj : chatForm = {
       idUsuarioEmi: this.uid || '',
       idUsuarioRec: this.uidRec || '',
       asunto : this.chatForm.value.asunto || '',
       mensajes : this.chatForm.value.mensajes || ''
     }

     let modal = document.getElementById("modalConver");

     if (modal != null){
       modal.style.display='none';
     }


     // console.log(obj)
     this.chatService.enviar(obj)
     .subscribe({
       next: (res:any) => {

         setTimeout(() => {
           window.open('/chat', '_blank');

         }, 1)
         this.waiting = false;


       },
       error: (err) => {
         console.warn('Error respuesta api:',err);
         Swal.fire({
           title: 'Error!',
           text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
           icon: 'error',
           confirmButtonText: 'Ok',
           allowOutsideClick: false
         });
         setTimeout(() =>{
             this.waiting = false;
           },1)
       }
     });

   }

    maximizarModelo(){
      const uiWrp = Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
      const uiIdEL = document.getElementById('ui-id');
      const iconMin =  Array.from(document.getElementsByClassName('fa-compress') as HTMLCollectionOf<HTMLElement>)[0];
      const iconMax =  Array.from(document.getElementsByClassName('fa-expand') as HTMLCollectionOf<HTMLElement>)[0];

      const uiElems = Array.from(uiWrp.children as HTMLCollectionOf<HTMLElement>);

      const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
      const renderSon = Array.from(engineWrp.children as HTMLCollectionOf<HTMLElement>)[0];
      const mdlWrp = document.getElementById('model-wrapper');

      if(renderSon.dataset['state']=="no-max"){

        engineWrp.style.position='fixed';
        engineWrp.style.top='0px';
        engineWrp.style.width=document.documentElement.clientWidth.toString()+'px';

        renderSon.style.maxWidth='100vw';
        renderSon.style.maxHeight='100vh';

        document.body.classList.add('scroll_invisible');

        engineWrp.style.height=window.innerHeight.toString()+'px';

        uiElems.forEach(function (elem){
          elem.style.position='fixed';
        });

        iconMin.style.display='initial';
        iconMax.style.display='none';
        if (mdlWrp)
        mdlWrp.style.backgroundColor='black';
        renderSon.dataset['state']="si-max";

      } else{
        document.body.classList.remove('scroll_invisible');
        engineWrp.style.position='';
        engineWrp.style.width='';
        engineWrp.style.height='';

        engineWrp.style.top='';
        //engineWrp.style.width=document.documentElement.clientWidth.toString()+'px';

        renderSon.style.maxWidth='';
        renderSon.style.maxHeight='';

        //engineWrp.style.height=window.innerHeight.toString()+'px';
        if (mdlWrp)
        mdlWrp.style.backgroundColor='rgba(0,0,0,0)';
        uiElems.forEach(function (elem){
          elem.style.position='absolute';
        });


        if(uiIdEL!=undefined){
          uiIdEL.style.minWidth=renderSon.clientHeight.toString()+'px';
          uiIdEL.style.minHeight=renderSon.clientHeight.toString()+'px';
        }

        iconMin.style.display='none';
        iconMax.style.display='initial';

        renderSon.dataset['state']="no-max";

        renderSon.scrollIntoView();
      }
    }


    mostrarOcultarMenu(){
      const butonM = document.getElementById('dropdownMenuButton');
      if(butonM){
        if(this.menuStateBoolean){
          this.menuStateBoolean=false;
          this.menuState.emit('cerrado');
          butonM.classList.remove('abiertoM');
        } else{
          this.menuStateBoolean=true;
          this.menuState.emit('abierto');
          butonM.classList.add('abiertoM');
        }
      }

    }

    backClicked() {
      console.log( 'goBack()...' );
      this._location.back();
    }



    obtenerEscena(){
      this.escenaService.cargarEscenaVisita(this.idmodelo).subscribe({
        next:((res : any)=>{
          const aux = res['escenas']['creadorID']['imagen'] as string;
          if(aux.indexOf('google')==-1){
            this.imagenUsu = "../../assets/uploads/fotoperfil/" + aux ;
          } else {
            this.imagenUsu = aux ;
          }
          var fecha = new Date(Date.parse(res['escenas']['fecha']));
          this.uidDuenyo=res['escenas']['creadorID']['_id'];
          this.usuario = res['escenas']['creadorID']['nombre'];
          this.nombreCompleto= res['escenas']['creadorID']['nombreUsuario'];

          this.fechastr = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
          this.descripcion = res['escenas']['descripcion'];
          this.titulo = res['escenas']['nombre'];
          this.nguardados = res['escenas']['NGuardados'];
          this.nvaloraciones = res['escenas']['NValoraciones'];
          this.nvisitas = res['escenas']['NVisitas'];
          this.liked=res['liked'];
          this.saved=res['saved'];
          this.modeloModelo = res['escenas']['modelo'];

          if(this.devolverId()==this.uidDuenyo){
            this.modeloPropio=true;
          }
        })
      });
    }

    obtenerEscenaSinVisita(){
      this.escenaService.cargarEscena(this.idmodelo).subscribe({
        next:((res : any)=>{

          const aux = res['escenas']['creadorID']['imagen'] as string;
          if(aux.indexOf('google')==-1){
            this.imagenUsu = "../../assets/uploads/fotoperfil/" + aux ;
          } else {
            this.imagenUsu = aux ;
          }

          var fecha = new Date(Date.parse(res['escenas']['fecha']));
          this.usuario = res['escenas']['creadorID']['nombreUsuario'];
          this.uidDuenyo=res['escenas']['creadorID']['_id'];

          this.fechastr = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
          this.descripcion = res['escenas']['descripcion'];
          this.titulo = res['escenas']['nombre'];
          this.nguardados = res['escenas']['NGuardados'];
          this.nvaloraciones = res['escenas']['NValoraciones'];
          this.nvisitas = res['escenas']['NVisitas'];
          this.liked=res['liked'];
          this.saved=res['saved'];
          this.modeloModelo = res['escenas']['modelo'];
        })
      });
    }


    /* public eventosRender(): void{
      const canv = document.getElementById('renderCanvas');
      canv?.addEventListener('load',this.cargadoBool);
    } */
    //Metodos mensaje modal



    public onCargado($event: any){
      const el = document.getElementById('engineLoader');
      if(el)
      el.remove();
      this.isLoaded = false;
    }

    /* cargadoBool(){
      this.isLoaded = true;
    } */

    MostrarModalEliminar(){
      // const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      // containerModal[0].style.display='flex';
      // var body = document.body,
      // html = document.documentElement;

      // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

      // containerModal[0].style.height= body.scrollHeight.toString()+'px';

      Swal.fire({
        title: 'Eliminar modelo',
        text: `Se eliminará de manera permanente el modelo ${this.titulo}`,
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
          this.eliminarModelo();
        }
      });

    }

    EsconderModalEliminar(){
      const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      containerModal[0].style.display='none';
    }

    eliminarModelo(){
        const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
        this.escenaService.borrarEscena(this.idmodelo).subscribe({
          next:((res:any)=>{
            console.log(res);
            containerModal[0].style.display='none';
            this.router.navigateByUrl('/');
          })
        })

      }


    darLikeGuardar(accion:any){
      console.log(accion);
      this.escenaService.darLikeGuardar(accion,this.idmodelo).subscribe({
        next:((res:any)=>{
          console.log(res);
          this.obtenerEscenaSinVisita(  );
        })
      });
    }

    devolverId (){
      this.token = localStorage.getItem('token') || '';
      var uid='';
      if(this.token!=''){
        var base64Url = this.token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        // console.log(jsonPayload);
        var objPayload = JSON.parse(jsonPayload);
        uid = objPayload.uid;
      }
      return uid;
    }


  }






