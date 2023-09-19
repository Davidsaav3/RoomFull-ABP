import { Component, Input, OnInit } from '@angular/core';
import { TipoSuscripcionService } from 'src/app/services/tipoSuscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TarjetaAuxService } from './tarjeta-planes-aux.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SuscripcionService } from '../../../services/suscripcion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarjeta-planes',
  templateUrl: './tarjeta-planes.component.html',
  styleUrls: ['./tarjeta-planes.component.css']
})
export class TarjetaPlanesComponent implements OnInit {

  @Input() uidPlan= '';

  public nombre: any;
  public precio: any;
  public descripcion: any;
  public caract: any;
  public enlace: any;
  public estaRegistrado: any;
  public sus: any;
  private usuario: any;
  private token: any;
  private uid: any;
  public idSus: any;

  constructor(private tipoSuscripcionService : TipoSuscripcionService, private router: Router,
    private tarjetaAux: TarjetaAuxService, private usuarioService: UsuarioService, private susService: SuscripcionService) {

   }

  ngOnInit(): void {

      this.uid = this.recuperarUidToken();
      this.usuario = this.router.routerState.snapshot.url.split('/')[3];
      this.cargarPlan();
      this.comprobarRegistro();
      this.comprobarPlan();


      // Si está desde perfil
      if (this.router.routerState.snapshot.url == `/user/ajustes/${this.usuario}/premium`){
        this.enlace = "/premium/pago/" + this.uidPlan;
      }
      // Si está desde suscripciones
      else {
        this.enlace = "./pago/" + this.uidPlan;
      }

  }

  comprobarPlan(){

    // A partir de las suscripciones buscamos el id
    this.susService.getSus().subscribe({
      next: (res:any) => {

        let arrIdUsu = res.Sus;
        console.log(arrIdUsu)

        let encontrado = false;

        for (let i = 0; i < arrIdUsu.length; i++){
          if (arrIdUsu[i].idUsuario == this.uid && !encontrado){
            // Hemos encontrado la suscripción asociada con el usuario logueado
            this.sus = arrIdUsu[i].idTipoSus;
            encontrado = true;
          }
        }
      },
    })
  }

  recuperarUidToken() {
    var token = localStorage.getItem('token');

    let uid = "";

    if (token != null){

      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var objPayload = JSON.parse(jsonPayload);
      uid = objPayload.uid;
  }

    return uid;
}

lanzarRegistro(){

  Swal.fire({
    title: 'Identificación necesaria',
    text: `¡Regístrate o inicia sesión para acceder a este modelo!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Iniciar sesión',
    confirmButtonColor: '#0073ca',
    cancelButtonColor: '#d40d06',
    cancelButtonText: 'Cancelar',
    focusConfirm: true,
    allowOutsideClick: true
  }).then((result) =>{
  if(result.isConfirmed){
    this.router.navigateByUrl('/login')
  }

  });
}

  irPaypal(){
    this.tarjetaAux.changeMessage(this.router.routerState.snapshot.url);
  }

  comprobarRegistro(){
    this.token = localStorage.getItem('token');
    console.log(this.token)
    if (this.token == null){
      this.estaRegistrado = false;
    }
    else {
      this.estaRegistrado = true;
    }

  }

  cargarPlan(){
    this.tipoSuscripcionService.cargarTipoSusId(this.uidPlan).subscribe({
      next:(res:any)=>{
        this.idSus = res.tipoSus.uid;
        console.log(this.idSus)
        this.nombre = res.tipoSus.nombre;
        this.precio = res.tipoSus.precio;
        this.descripcion = res.tipoSus.descripcion;
        let caractAux = res.tipoSus.caract;

        this.caract = caractAux.split("\n");

      }
    })
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
