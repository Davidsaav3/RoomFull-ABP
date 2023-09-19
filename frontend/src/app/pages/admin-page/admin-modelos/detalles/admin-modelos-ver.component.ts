import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { EscenaService } from '../../../../services/escena.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-admin-modelos-ver',
  templateUrl: './admin-modelos-ver.component.html',
  styleUrls: ['./admin-modelos-ver.component.css']
})
export class AdminModelosVerComponent implements OnInit {
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

  constructor( private usuarioService: UsuarioService, private route: ActivatedRoute, private escenaService:EscenaService, private router: Router) {

    this.route.params.subscribe({
      next:((_value)=>{

        this.idmodelo=_value['nombreModelo'];
      }),
    });

  }
  ngOnInit(): void {
   this.obtenerEscena();

  }

  editar(){
    this.router.navigateByUrl("/admin/administracion/modelos/"+this.idmodelo+"/editar");
  }

  obtenerEscena(){
    this.escenaService.cargarEscenaVisita(this.idmodelo).subscribe({
      next:((res : any)=>{

        var fecha = new Date(Date.parse(res['escenas']['fecha']));
        this.uidDuenyo=res['escenas']['creadorID']['_id'];
        this.usuario = res['escenas']['creadorID']['nombre'];
        this.imagenUsu = res['escenas']['creadorID']['imagen'];
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
        this.imagenUsu = res['escenas']['creadorID']['imagen'];
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
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='flex';
    var body = document.body,
    html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

    containerModal[0].style.height= body.scrollHeight.toString()+'px';

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

  volver (){
    this.router.navigateByUrl("/admin/administracion/modelos");
  }

  eliminarConver (){

  }

  verConver(){
    this.router.navigateByUrl("/admin/administracion/ver-modelos");
  }

  crearConver(){
    this.router.navigateByUrl("/admin/administracion/crear-modelos");
  }

}



