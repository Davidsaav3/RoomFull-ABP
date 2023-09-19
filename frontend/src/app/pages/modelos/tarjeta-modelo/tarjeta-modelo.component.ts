import { Component, Input, OnInit } from '@angular/core';
import { ConnectableObservable } from 'rxjs';
import { EscenaService } from 'src/app/services/escena.service';
import { AjustesPerfilAuxService } from '../../user-profile-page/user-profile-ajustes/ajustes-perfil/ajustesPerfilAux.service';

@Component({
  selector: 'app-tarjeta-modelo',
  templateUrl: './tarjeta-modelo.component.html',
  styleUrls: ['./tarjeta-modelo.component.css']
})
export class TarjetaModeloComponent implements OnInit {

  @Input() escenaObj:any;
  //inicialiación parametros de la tarjeta

  @Input() uidModelo= '3';

  @Input() bannerPriv = 'false';

  rutaImagenUsu= '';
  nombreusu= 'berna';
  imagenPrevisualizacion= 'noimage.jpg';
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


  constructor(private escenaService : EscenaService, private perfilAuxService: AjustesPerfilAuxService) {

   }

  ngOnInit(): void {

    this.obtenerEscena();
    /* var aux = new Date(this.fechaModelo);
    this.fechaFixed = `${aux.getDate()}/${aux.getMonth()}/${aux.getFullYear()}` */
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

  darLikeGuardar(accion:any){
    console.log(accion);
    this.perfilAuxService.changeMessage3("cambiar");
    this.perfilAuxService.changeMessage4("cambiar");
    this.escenaService.darLikeGuardar(accion,this.uidModelo).subscribe({
      next:((res:any)=>{
        console.log(res);
        this.obtenerEscena();
      })
    });
  }

}
