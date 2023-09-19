import { Component, OnInit } from '@angular/core';
import { EngineComponent } from '../../engine/engine.component';
import { UiComponent } from '../../ui/ui.component';
import { UsuarioService } from '../../../../services/usuario.service';
import { EscenaService } from '../../../../services/escena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { UiEventsService } from '../uiEvents.service';

@Component({
	selector: 'app-ui-infobar-bottom',
	templateUrl: './ui-infobar-bottom.component.html',
  styleUrls:['ui-infobar-bottom.component.css']
})
export class UiInfobarBottomComponent implements OnInit {
  private _router: Router | undefined;

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

  modeloPropio = false;
  token: string;

  constructor( private usuarioService: UsuarioService, private route: ActivatedRoute, private escenaService:EscenaService, private router: Router, private uiEventsService:UiEventsService,) {

    this.route.params.subscribe({
      next:((id)=>{
        this.idmodelo=id['id'];
        console.log("id: "+id['id']);
      }),
    });

  }
  ngOnInit(): void {
   this.obtenerEscenaSinVisita();

    // Para iniciar maximizado a no
    const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const renderSon = Array.from(engineWrp.children as HTMLCollectionOf<HTMLElement>)[0];
    renderSon.dataset['state']="no-max";
    const mdlWrp = document.getElementById('model-wrapper');
    const uiWrp = Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const nav = document.getElementById('barra-nav');

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && mdlWrp && nav) {
        console.log("El usuario ha salido del modo fullscreen.");
        nav.style.display = '';
        renderSon.dataset['state']="no-max";
        mdlWrp.classList.remove('eng-max2')
        renderSon.classList.remove('eng-max')
        uiWrp.classList.remove('eng-max')
        document.body.style.overflowY = 'visible';
      }
    });

  }
  maximizar(){

    const uiWrp = Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const uiIdEL = document.getElementById('ui-id');
    const uiElems = Array.from(uiWrp.children as HTMLCollectionOf<HTMLElement>);

    const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const renderSon = Array.from(engineWrp.children as HTMLCollectionOf<HTMLElement>)[0];
    const mdlWrp = document.getElementById('model-wrapper');

    const nav = document.getElementById('barra-nav');

    if(mdlWrp && nav){


      if(renderSon.dataset['state']=="no-max" ){
        console.log('le doy a maximizar')
        nav.style.display = 'none';
        document.documentElement.requestFullscreen();
        mdlWrp.classList.add('eng-max2')
        renderSon.classList.add('eng-max')
        uiWrp.classList.add('eng-max')
        renderSon.dataset['state']="si-max";
        renderSon.style.minHeight = "100vh";
        document.body.style.overflowY = 'hidden';

      } else {
        console.log('le doy a minimizar')
        document.exitFullscreen();
        nav.style.display = '';
        renderSon.dataset['state']="no-max";
        mdlWrp.classList.remove('eng-max2')
        renderSon.classList.remove('eng-max')
        renderSon.style.minHeight = "90vh";
        uiWrp.classList.remove('eng-max')
        document.body.style.overflowY = 'visible';

      }
    }

  }



  mostrarOcultarUi(){
    const container = document.getElementsByClassName('animation')[0] as HTMLElement;
    const buton = document.getElementById('ocultarBot');

    if(buton){
      const pin = buton.childNodes[0].childNodes[0] as HTMLElement;

        if(container.classList.contains('fijo')){
          //desfijar
          pin.classList.remove('bi-pin-angle-fill');
          pin.classList.add('bi-pin-angle');
          buton.classList.add('animationflechi');
          container.classList.remove('fijo');
        } else{
            //fijar
            pin.classList.remove('bi-pin-angle');
            pin.classList.add('bi-pin-angle-fill');
            container.classList.add('fijo');
            buton.classList.remove('animationflechi');
        }

    }



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

        this.fechastr = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        this.descripcion = res['escenas']['descripcion'];
        this.titulo = res['escenas']['nombre'];
        this.nguardados = res['escenas']['NGuardados'];
        this.nvaloraciones = res['escenas']['NValoraciones'];
        this.nvisitas = res['escenas']['NVisitas'];
        this.liked=res['liked'];
        this.saved=res['saved'];
        this.modeloModelo = res['escenas']['modelo'];

        // Llamar al servicio
        this.uiEventsService.changeMessage("cambiar")
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
      text: `Se eliminará de forma permanente el modelo ${this.titulo}`,
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
        this.obtenerEscenaSinVisita();
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
