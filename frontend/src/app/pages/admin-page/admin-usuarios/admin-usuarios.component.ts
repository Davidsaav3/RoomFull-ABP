import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { check } from 'express-validator';
import { EscenaService } from 'src/app/services/escena.service';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  textoBusqueda: string = "";
  desde: number;
  usuarios: any;
  primero: boolean = true;
  ultimo: boolean = false;
  ultimaPage: number;
  paginas: any;
  private uidUsuarios:any;
  public hayUsu: Boolean;

  timeout: any = null;

  public itemsSelector:string[] = new Array<string>();
  public estaVacio:Boolean = true;

  constructor(
    public admin: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuario: UsuarioService,
    private escenaService:EscenaService) {
}

ngOnInit(): void {
  this.desde = 1;
  this.listarUsuarios();
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

  this.usuarios.forEach((sus:any)=> {
    sus.checked = e.target.checked

  if(sus.checked===true){
    this.itemsSelector.push(sus.uid);
  }

  this.comprobarVacio();

  })

  console.log(this.itemsSelector)

}

getUsusId(e:any, id:string)
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


eliminarTodos(){

  this.itemsSelector.forEach(id=> {
    this.admin.borrarUsuario(id).subscribe({
      next:((res:any)=>{
        console.log(res)
        this.ngOnInit();
        this.EsconderModalEliminar2();
        this.comprobarVacio();
      })
    })
  })

}

listarUsuarios(){
  this.admin.cargarUsuarios(this.desde, this.textoBusqueda)
  .subscribe((res: any) => {
    console.log(res)
    this.usuarios = res.usuarios;
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

    if (this.usuarios.length <= 0){
      this.hayUsu = false;
    }
    else {
      this.hayUsu = true;
    }
  })
}

eliminarUsuario(){
  this.admin.borrarUsuario(this.uidUsuarios).subscribe({
    next:((res:any)=>{
      this.ngOnInit();
      this.EsconderModalEliminar();
    })
  })
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
  this.listarUsuarios();
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
    this.listarUsuarios();
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

  this.listarUsuarios();
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
  this.listarUsuarios();
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
  this.uidUsuarios = id;

  Swal.fire({
    title: 'Eliminar usuario',
    text: `¿Desea eliminar el usuario seleccionado?`,
    icon: 'question',
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
    confirmButtonColor: '#0073ca',
    focusConfirm: true,
    allowOutsideClick: true
  }).then((result) =>{
    if(result.isConfirmed){
      this.eliminarUsuario();
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
    title: 'Eliminar usuarios',
    text: `¿Desea eliminar los ${this.itemsSelector.length} usuarios seleccionados?`,
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
