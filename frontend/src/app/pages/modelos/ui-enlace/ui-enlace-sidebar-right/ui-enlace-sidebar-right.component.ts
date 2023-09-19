import {Component, Input, OnInit} from '@angular/core';
import { EscenaService } from '../../../../services/escena.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2';
import { UiEventsService } from '../../ui/uiEvents.service';

@Component({
  selector: 'app-ui-enlace-sidebar-right',
  templateUrl: './ui-enlace-sidebar-right.component.html',
  styleUrls:['ui-enlace-infobar-right.component.css']
})
export class UiEnlaceSidebarRightComponent implements OnInit {
  public isLoaded: boolean = true;
  imagenUsu : any;
  usuario2: string;
  usuario: string;
  titulo: string;
  descripcion: string;
  idmodelo: string;
  nguardados: string;
  nvaloraciones: string;
  nvisitas: string;
  fechastr: string;
  liked:any;
  saved:any;
  imagen: string;
  modeloModelo:'jaja';
  uidDuenyo='';
  url:any;
  public miId :any;
  public navUrl:string = "";
  public esPrivado:Boolean = true;
  puntos = ['asd']
  recorrido: boolean = false;

  modeloPropio = false;
  token: string;
  @Input () menuState2:boolean = false;

  opcionActiva = 'none';

  stateNavOptions = 'momentoD'; //camara , fondo, momentoD, meteo

  autoRotate : boolean;

  public constructor(private uiEventsService:UiEventsService, private escenaService:EscenaService,  private router: Router) {
    this.uiEventsService.autoRotateCurrent.subscribe(message => {
      this.autoRotate=message;
    });

    // Para la edición desde admin
    try {
      this.uiEventsService.currentMessage.subscribe(message=> {

      if (message==="cambiar"){
        console.log('cambiado')
        this.ngOnInit();
        this.uiEventsService.changeMessage("none");
      }
      })

    } catch (error) {
      console.log(error)
    }
  }

  public ngOnInit(): void {

    console.log(this.menuState2);
    this.idmodelo = this.router.routerState.snapshot.url.split('/')[2];

    this.navUrl = this.router.routerState.snapshot.url.split('/')[1];
    if (this.navUrl === "enlace-modelo"){
      this.esPrivado = true;
      this.obtenerEscenaNoToken();

    }

    console.log(this.nvaloraciones)
    console.log(this.nguardados)
  }

  iralPunto(id){
    this.uiEventsService.changePuntoAlQueIr(id);
  }

  iniciarDetenerRecorrido(){
    this.recorrido = !this.recorrido;
    this.uiEventsService.changeHacerRecorrido(this.recorrido);
  }


   mostrarOcultarMenu(){

    const dropMenu = document.getElementsByClassName('dropMenu')[0] as HTMLElement;
    const dropB = document.getElementById('dropdownMenuButton') as HTMLElement;
    if(dropB){
      this.menuState2=!this.menuState2;
      /* if(dropMenu.classList.contains('arriba')){
        dropB.classList.remove('abiertoM');
        dropMenu.classList.remove('arriba');

      } else{
        dropB.classList.add('abiertoM');
        dropMenu.classList.add('arriba');
        this.opcionActiva = 'none';
      } */
    }

   }

  obtenerEscenaNoToken(){


    this.escenaService.cargarEscenaVisitaNoToken(this.idmodelo).subscribe({
      next:((res : any)=>{

        console.log(res.escenas)

        const aux = res['escenas']['creadorID']['imagen'] as string;
        if(aux.indexOf('google')==-1){
          this.imagenUsu = "../../assets/uploads/fotoperfil/" + aux ;
        } else {
          this.imagenUsu = aux ;
        }
        var fecha = new Date(Date.parse(res['escenas']['fecha']));
        this.uidDuenyo=res['escenas']['creadorID']['_id'];
        this.usuario = res['escenas']['creadorID']['nombre'];
        this.usuario2 = res['escenas']['creadorID']['nombreUsuario'];

        this.fechastr = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        this.descripcion = res['escenas']['descripcion'];
        this.titulo = res['escenas']['nombre'];
        this.nguardados = res.escenas.NGuardados
        this.nvaloraciones = res.escenas.NValoraciones
        this.nvisitas = res['escenas']['NVisitas'];
        this.liked=res['liked'];
        this.imagen=res['escenas']['imagen'];
        this.saved=res['saved'];
        this.modeloModelo = res['escenas']['modelo'];
        this.url = `../../../../assets/uploads/imagenEscena/`+ this.imagen
        this.puntos = res['escenas']['puntos']


        this.uiEventsService.changePuntos(this.puntos);
        if(this.devolverId()==this.uidDuenyo){
          this.modeloPropio=true;
        }

        console.log(this.puntos)

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

  MostrarModalEliminar(){
    Swal.fire({
      title: 'Eliminar punto',
      text: `¿Desea eliminar el punto seleccionado?`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#0073ca',
      focusConfirm: true,
      allowOutsideClick: true
    }).then((result) =>{
      if(result.isConfirmed){

      }
    });
  }

  eliminarModelo(){
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
        const thisElem = document.getElementById(this.idmodelo);
        const modelCont = document.getElementById('resultados');
        console.log(thisElem)
        if(thisElem && modelCont){
          modelCont.removeChild(thisElem);
          this.eliminarModeloReq();
        }
      }
    });

  }

  eliminarModeloReq(){
    this.escenaService.borrarEscena(this.idmodelo).subscribe({
      next:((res:any)=>{
        console.log(res);
      })
    })
  }


   mostrarOcultarSeccion(aux:any){
    if(this.opcionActiva != aux){
      this.opcionActiva = aux;
    } else{
      this.opcionActiva = 'none';
    }
   }

   cambiarAutorrotate(){
    this.uiEventsService.changeAutorrotate(!this.autoRotate);
   }

   cerrarVentana(){
    this.opcionActiva = 'none';
   }

   reproducir() {
    const audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
    audio.play();
  }

  cambiarStateNavOptions(state : string){
    this.stateNavOptions=state;
  }

  descargarPdf(){
    this.crearPdf();
  }


  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
  cambiarColor(radio) {
    this.uiEventsService.changeAmbientColor(radio);
  }
  crearPdf(){

    this.getBase64ImageFromUrl(this.url)
    .then(
      (base64:any) => {



         const pdfDef: any = {
        content: [
          {
            text: this.titulo,
            bold: true,
            fontSize: 20,
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          {
          columns: [
            [
            {
              image:base64,
              height: 200,
              width: 500,
            },
            {
              text: '\n\n'
            },
            {
              text: 'Creado por: ' + this.usuario
            },
            {
              text: 'Descripción: ' + this.descripcion
            },
            {
              text: 'Fecha creación: ' + this.fechastr
            },
            {
              text: 'Cantidad de likes: ' + this.nvaloraciones
            },
            {
              text: 'Cantidad de visitas: ' + this.nvisitas
            },
            {
              text: 'Cantidad de guardados: ' + this.nguardados
            },
            {
              text: 'QR a modelo: '
            },
          ]
           ]
          }],
          styles: {
            name: {
              fontSize: 16,
              bold: true
          }
        }
      }

      const pdf = pdfMake.createPdf(pdfDef);
      // pdf.open();
      pdf.download();

      }



    )
    .catch(err => console.error(err));


  }

  cambiarFondo(radio) {
    this.uiEventsService.changeFondo(radio);
  }


}
