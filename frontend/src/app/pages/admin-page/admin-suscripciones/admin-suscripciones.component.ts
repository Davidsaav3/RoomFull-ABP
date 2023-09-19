import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { TipoSuscripcionService } from '../../../services/tipoSuscripcion.service';
import { Suscripcion } from '../../../models/suscripcion.model';
import { TipoSuscripcion } from '../../../models/tipoSuscripcion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-suscripciones',
  templateUrl: './admin-suscripciones.component.html',
  styleUrls: ['./admin-suscripciones.component.css']
})
export class AdminSuscripcionesComponent implements OnInit {

  tipo: TipoSuscripcion;
  paginas: any;
  textoBusqueda: string = "";
  desde: number;
  Suscripcion: any;
  suscripciones: any;
  ultimaPage: number;
  primero: boolean = true;
  ultimo: boolean = false;
  private uidSuscripcion:any;
  public haySus: Boolean;


  public itemsSelector:string[] = new Array<string>();
  public estaVacio:Boolean = true;
  timeout: any = null;


  constructor( private activatedRoute: ActivatedRoute,
    private router: Router,
    public admin: AdminService,
    public tipoSuscripcion: TipoSuscripcionService) {
}

ngOnInit(): void {
  this.desde = 1;
  this.listarTipoSus();
  this.itemsSelector = [];

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

  this.suscripciones.forEach((sus:any)=> {
    sus.checked = e.target.checked

  if(sus.checked===true){
    this.itemsSelector.push(sus.uid);
  }

  this.comprobarVacio();

  })

  console.log(this.itemsSelector)

}

getSusId(e:any, id:string)
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


eliminarSuscripcion (){
  this.tipoSuscripcion.borrarTipoSus(this.uidSuscripcion, this.tipo).subscribe({
    next:((res:any)=>{
      console.log(res)
      this.ngOnInit();
      this.EsconderModalEliminar();
      this.comprobarVacio();
    })
  })
}


eliminarTodos(){

  this.itemsSelector.forEach(sus=> {
    this.tipoSuscripcion.borrarTipoSus(sus, this.tipo).subscribe({
      next:((res:any)=>{
        console.log(res)
        this.ngOnInit();
        this.EsconderModalEliminar2();
        this.comprobarVacio();
      })
    })
  })

}

volver (){
  this.router.navigateByUrl("/admin/administracion/suscripciones");
}

verSuscripciones(){
  this.router.navigateByUrl("/admin/administracion/ver-suscripciones");
}

editarSuscripciones(){
  this.router.navigateByUrl("/admin/administracion/editar-suscripciones");
}

crearSuscripciones(){
  this.router.navigateByUrl("/admin/administracion/crear-suscripciones");
}

listarTipoSus(){
  this.admin.cargarTipoSusAdmin(this.desde, this.textoBusqueda)
  .subscribe((res: any) => {
    console.log(res)
    this.suscripciones = res.tipoSus;

    for (let i = 0; i < this.suscripciones.length; i++){
      let caractAux = this.suscripciones[i].caract;
      this.suscripciones[i].caract = caractAux.split("\n");
    }

    this.ultimaPage = Math.ceil(res.page.total/10);
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

    if (this.suscripciones.length <= 0){
      this.haySus = false;
    }
    else {
      this.haySus = true;
    }


  })
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
  this.listarTipoSus();
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
  this.listarTipoSus();
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
  if(page.length > 1){
    this.listarTipoSus();
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

  this.listarTipoSus();
}


EsconderModalEliminar(){
  const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
  containerModal[0].style.display='none';
}

EsconderModalEliminar2(){
  const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
  containerModal[0].style.display='none';
}


MostrarModalEliminar(id:string){
  // const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
  // containerModal[0].style.display='flex';
  // var body = document.body,
  // html = document.documentElement;
  // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );
  // containerModal[0].style.height= body.scrollHeight.toString()+'px';
  this.uidSuscripcion = id;
  Swal.fire({
    title: 'Eliminar suscripción',
    text: `¿Desea eliminar la suscripción seleccionada?`,
    icon: 'question',
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
    confirmButtonColor: '#0073ca',
    focusConfirm: true,
    allowOutsideClick: true
  }).then((result) =>{
    if(result.isConfirmed){
      this.eliminarSuscripcion();
    }
  });
}

MostrarModalesEliminar(){
  // const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
  // containerModal[0].style.display='flex';
  // var body = document.body,
  // html = document.documentElement;

  // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );

  // containerModal[0].style.height= body.scrollHeight.toString()+'px';

  Swal.fire({
    title: 'Eliminar suscripciones',
    text: `¿Desea eliminar los ${this.itemsSelector.length} tipos de suscripción seleccionados?`,
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



}
