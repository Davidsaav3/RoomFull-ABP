import {Component, Input, OnInit} from '@angular/core';
import { UiEventsService } from '../uiEvents.service';
import { EscenaService } from '../../../../services/escena.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ui-sidebar-right',
  templateUrl: './ui-sidebar-right.component.html',
  styleUrls:['ui-infobar-right.component.css']
})
export class UiSidebarRightComponent implements OnInit {
  public isLoaded: boolean = true;
  imagenUsu : any;
  usuario: string;
  usuario2: string;
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
  privado: boolean;
  url:any;
  enlace: string;
  public miId :any;



  modeloPropio = false;
  token: string;
  @Input () menuState2:boolean = false;

  opcionActiva = 'none';

  stateNavOptions = 'momentoD'; //camara , fondo, momentoD, meteo

  autoRotate : boolean;


  recorrido: boolean = false;

  puntos = ['asd']


  public constructor(private uiEventsService:UiEventsService, private escenaService:EscenaService,  private router: Router, private fb: FormBuilder) {
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


    this.uiEventsService.hacerRecorridoCurrent.subscribe(bool => {

      this.recorrido=bool;

    })
  }

  public ngOnInit(): void {
    console.log(this.menuState2);
    this.idmodelo = this.router.routerState.snapshot.url.split('/')[2];
    this.obtenerEscena();
    this.miId = this.devolverId();


    console.log(this.nvaloraciones)
    console.log(this.nguardados)
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

   MostrarModalEliminar(index){
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
        this.puntos.splice(index, 1);
        this.eliminarPunto(index);
      }
    });
  }

   obtenerEscena(){


    this.escenaService.cargarEscena(this.idmodelo).subscribe({
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
        this.privado = res['escenas']['privado'];
        this.enlace = res['escenas']['url'];
        this.url = `../../../../assets/uploads/imagenEscena/`+ this.imagen
        this.puntos = res['escenas']['puntos']

        console.log(this.puntos)

        this.uiEventsService.changePuntos(this.puntos);

        if(this.devolverId()==this.uidDuenyo){
          this.modeloPropio=true;
        }
      })
    });
  }


  obtenerPuntos(){
    this.escenaService.cargarEscena(this.idmodelo).subscribe({
      next:((res : any)=>{
        this.puntos = res['escenas']['puntos']
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

  async crearPdf(){
    let codigoQR: any;
    // if(this.privado === true){
      console.log(this.idmodelo)
      codigoQR = window.location.href.split('/');
      codigoQR = codigoQR[0] + "/" + codigoQR[1] + "/" + codigoQR[2] + "/enlace-modelo" + "/" + this.idmodelo;
    // }
    await this.getBase64ImageFromUrl(this.url)
    .then(
      (base64:any) => {

         const pdfDef: any = {

        content: [
          {
            text: this.titulo.toUpperCase(),
            bold: true,
            fontSize: 20,
            alignment: 'center',
          },
          {
          columns: [
            [
            {
              image: base64,
              height: 250,
              width: 300,
              margin: [110,5,0,5]
            },
            {
              text: '\n\n'
            },
            {
              text: 'Propietario ' + this.usuario,
              margin: [110,0,0,5],
              style: 'cabeceras'
            },
            {
              text: this.usuario,
              margin: [140,0,0,5],
            },
            {
              text: 'Descripción',
              margin: [110,5,0,5],
              style: 'cabeceras'
            },
            {
              text: this.descripcion,
              margin: [140,5,0,5],
            },
            {
              text: 'Fecha de creación',
              margin: [110,5,0,5],
              style: 'cabeceras'
            },
            {
              text: this.fechastr,
              margin: [140,5,0,5]
            },
            {
              text: 'Métricas del modelo',
              margin: [110,5,0,5],
              style: 'cabeceras'
            },
            {
              text: 'Visitas: ' + this.nvisitas + '  Likes: ' + this.nvaloraciones + '  Guardados: ' + this.nguardados,
              margin: [140,5,0,5]
            },
            {
              text: 'Enlace privado' ,
              margin: [110,5,0,5],
              style: 'cabeceras'
            },
            {
              text: 'Enlace',
              color:'#3c70bd',
              link: codigoQR,
              margin: [200,5,0,5]
            },
            {
              qr: codigoQR, background: '#3c70bd', foreground:'white',
              margin: [200,5,0,5]
            }
          ]]
          }],
          styles: {
            name: {
              fontSize: 16,
              bold: true
          },
          cabeceras: {
            fontSize: 20,
            bold: true
          },
          texto: {
            fontSize: 20,
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

  cargarPuntos(){
    this.uiEventsService.changePuntos(this.puntos);
  }

  editarNombre(pos:any){

   // console.log(res.escenas.puntos[pos])
    let formu = <HTMLInputElement>document.getElementById(`inputNombrePunto${pos}`);

    if (formu != null && formu.value != ""){

      let auxNombre = formu.value;

      if (auxNombre!= null){
        let escenaUpdate = {
          "nombre": auxNombre
         }

         this.escenaService.cambiarNombre(escenaUpdate, this.idmodelo, pos).subscribe({
          next: (res:any) =>{
              console.log(res)
              this.ngOnInit()

            }
        });

       }
    }

  }


  addPunto(){
    this.uiEventsService.changeGuardarPunto(true);

    this.uiEventsService.puntoQueGuardarCurrent.subscribe({
      next: (res:any) =>{

        let aux : any[]= []

        this.puntos.forEach((value)=>{
          aux.push(value);
        })

        aux.push(res[0]);

        let escenaUpdate = {
          "puntos": aux
         }

         this.escenaService.editarDatosModelo(escenaUpdate, this.idmodelo).subscribe({
           next: (res:any) =>{

             this.obtenerPuntos()
           }
         })

      }
    });


  }

  iralPunto(id){

    this.uiEventsService.changePuntoAlQueIr(id);
  }

  eliminarPunto(id){

    this.uiEventsService.changePuntoQueEliminar(id);

    this.uiEventsService.puntoQueEliminarCurrent.subscribe({
      next: (res:any) =>{

        let aux : any[]= []

        this.puntos.forEach((value)=>{
          if(value != undefined){
            aux.push(value);
          }
        })

        let escenaUpdate = {
          "puntos": aux
         }

         this.escenaService.editarDatosModelo(escenaUpdate, this.idmodelo).subscribe({
           next: (res:any) =>{
             this.obtenerPuntos()
           }
         })

      }
    });
  }


  iniciarDetenerRecorrido(){
    this.recorrido = !this.recorrido;
    this.uiEventsService.changeHacerRecorrido(this.recorrido);
  }

  cambiarColor(radio) {
    this.uiEventsService.changeAmbientColor(radio);
  }

  cambiarFondo(radio) {
    this.uiEventsService.changeFondo(radio);
  }
}
