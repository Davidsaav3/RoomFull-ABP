import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EscenaService } from 'src/app/services/escena.service';
import Swal from 'sweetalert2';
import { AjustesPerfilAuxService } from '../../user-profile-page/user-profile-ajustes/ajustes-perfil/ajustesPerfilAux.service';

@Component({
  selector: 'app-tarjeta-modelo-index-destacados',
  templateUrl: './tarjeta-modelo-index-destacados.component.html',
  styleUrls: ['./tarjeta-modelo-index-destacados.component.css']
})
export class TarjetaModeloIndexDestacadosComponent implements OnInit {

  @Input() escenaObj:any;
  //inicialiación parametros de la tarjeta

  @Input() uidModelo= '3';

  @Input() bannerPriv = 'false';

  rutaImagenUsu= '';
  nombreusu= '';
  imagenPrevisualizacion= '';
  nombreCompleto = '';

  tituloModelo= '';
  NVisitasModelo= '';
  NValoracionesModelo= '';
  NGuardadosModelo= '';
  descripcionModelo= '';

  privado=true;

  fechaModelo: Date;

  fechaFixed : any;

  liked:any;
  saved:any;

  bannerClass='';

  token:any;
  public hayToken:Boolean = false;

  constructor(private escenaService : EscenaService, private router:Router, private perfilAuxService: AjustesPerfilAuxService) {

   }
   registrate(){
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
  ngOnInit(): void {

    this.token = localStorage.getItem('token');

    if (this.token != null){
      this.hayToken = true;
      this.obtenerEscena();
    }
    else{
      this.obtenerEscenaNoUsu();
    }

    /* var aux = new Date(this.fechaModelo);
    this.fechaFixed = `${aux.getDate()}/${aux.getMonth()}/${aux.getFullYear()}` */
  }

  darLikeGuardar(accion:any){
    // console.log(accion);
    this.escenaService.darLikeGuardar(accion,this.uidModelo).subscribe({
      next:((res:any)=>{
        // console.log(res);
        this.obtenerEscena();
        this.perfilAuxService.changeMessage4("cambiar");
        this.perfilAuxService.changeMessage3("cambiar");
      })
    });
  }

  obtenerEscena(){
    this.escenaService.cargarEscena(this.uidModelo).subscribe({
      next:((data:any)=>{
        const aux = data['escenas']['creadorID']['imagen'] as string;
        if(aux.indexOf('google')==-1){
          this.rutaImagenUsu = "../../assets/uploads/fotoperfil/" + aux ;
        } else {
          this.rutaImagenUsu = aux ;
        }
        this.tituloModelo=data['escenas']['nombre'];

        this.nombreusu= data['escenas']['creadorID']['nombre'];
        this.nombreCompleto= data['escenas']['creadorID']['nombreUsuario'];
        this.imagenPrevisualizacion = data['escenas']['imagen'];
        this.NVisitasModelo= data['escenas']['NVisitas'];
        this.privado= data['escenas']['privado'];
        if(this.privado){
          this.bannerClass='privado';
        } else{
          this.bannerClass='publico'
        }
        this.NValoracionesModelo = data['escenas']['NValoraciones'];
        this.NGuardadosModelo=data['escenas']['NGuardados'];
        this.descripcionModelo=data['escenas']['descripcion'];
        this.fechaModelo=new Date(data['escenas']['fecha']);
        this.fechaFixed=`${this.fechaModelo.getDate()}/${this.fechaModelo.getMonth()+1}/${this.fechaModelo.getFullYear()}`;

        this.liked=data['liked'];
        this.saved=data['saved'];




      })
    })
  }

  obtenerEscenaNoUsu(){
    this.escenaService.cargarEscenaNoUsu(this.uidModelo).subscribe({
      next:((data:any)=>{
        const aux = data['escenas']['creadorID']['imagen'] as string;
        if(aux.indexOf('google')==-1){
          this.rutaImagenUsu = "../../assets/uploads/fotoperfil/" + aux ;
        } else {
          this.rutaImagenUsu = aux ;
        }
        this.tituloModelo=data['escenas']['nombre'];

        this.nombreusu= data['escenas']['creadorID']['nombre'];
        this.nombreCompleto= data['escenas']['creadorID']['nombreUsuario'];
        this.imagenPrevisualizacion = data['escenas']['imagen'];
        this.NVisitasModelo= data['escenas']['NVisitas'];
        this.privado= data['escenas']['privado'];
        if(this.privado){
          this.bannerClass='privado';
        } else{
          this.bannerClass='publico'
        }
        this.NValoracionesModelo = data['escenas']['NValoraciones'];
        this.NGuardadosModelo=data['escenas']['NGuardados'];
        this.descripcionModelo=data['escenas']['descripcion'];
        this.fechaModelo=new Date(data['escenas']['fecha']);
        this.fechaFixed=`${this.fechaModelo.getDate()}/${this.fechaModelo.getMonth()+1}/${this.fechaModelo.getFullYear()}`;

        this.liked=data['liked'];
        this.saved=data['saved'];




      })
    })
  }
}

