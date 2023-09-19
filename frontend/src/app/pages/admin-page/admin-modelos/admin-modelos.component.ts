import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { EscenaService } from '../../../services/escena.service';


@Component({
  selector: 'app-admin-modelos',
  templateUrl: './admin-modelos.component.html',
  styleUrls: ['./admin-modelos.component.css']
})
export class AdminModelosComponent implements OnInit {
  nombre: string = "";
  fecha: string = "";
  visualizaciones: string = "";
  likes: string = "";
  guardados: string = "";
  etiquetas: string = "";
  uid: string = "";

  textoBusqueda: string = "";
  desde: number;
  modelos: any;
  primero: boolean = true;
  ultimo: boolean = false;
  ultimaPage: number;
  paginas: any;
  public hayMod: Boolean;
  public itemsSelector:string[] = new Array<string>();
  public estaVacio:Boolean = true;

  private uidModelo:any;

  timeout: any = null;



    constructor(private activatedRoute: ActivatedRoute,
      private router: Router,
      public admin: AdminService,
      public escena: EscenaService) {
  }

    ngOnInit(): void {
      this.desde = 1;
      this.listarModelos();
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

      this.modelos.forEach((sus:any)=> {
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


    // eliminarSuscripcion (){
    //   this.tipoSuscripcion.borrarTipoSus(this.uidSuscripcion, this.tipo).subscribe({
    //     next:((res:any)=>{
    //       console.log(res)
    //       this.ngOnInit();
    //       this.EsconderModalEliminar();
    //       this.comprobarVacio();
    //     })
    //   })
    // }


    eliminarTodos(){

      this.itemsSelector.forEach(mode=> {
        this.escena.borrarEscena(mode).subscribe({
          next:((res:any)=>{
            console.log(res)
            this.ngOnInit();
            this.EsconderModalEliminar2();
            this.comprobarVacio();
          })
        })
      })

    }

    listarModelos(){
      this.admin.cargarModelos(this.desde, this.textoBusqueda)
      .subscribe((res: any) => {
        this.modelos = res.escenas;
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

        console.log(res);
        console.log(res.escenas);


        if (this.modelos.length <= 0){
          this.hayMod = false;
        }
        else {
          this.hayMod = true;
        }
      })
    }

    eliminarModelos (){
      this.escena.borrarEscena(this.uidModelo).subscribe({
        next:((res:any)=>{

          this.admin.cargarModelos(this.desde, this.textoBusqueda)
          .subscribe((res: any) => {
            this.modelos = res.escenas;
            this.ultimaPage = Math.ceil(res.page.total/6);
            this.paginas = Array(this.ultimaPage).fill(1).map((x,i)=>i);
            this.EsconderModalEliminar();

            if (this.modelos.length <= 0){
              this.hayMod = false;
            }
            else {
              this.hayMod = true;
            }
          })
        })
      })
    }

    verModelos(){
      this.router.navigateByUrl("/admin/administracion/ver-modelos");
    }

    editarModelos(){
      this.router.navigateByUrl("/admin/administracion/editar-modelos");
    }

    crearModelo(){
      this.router.navigateByUrl("/subir-modelo");
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
      this.listarModelos();
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
        this.listarModelos();
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

      this.listarModelos();
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
      this.listarModelos();
    }

    seleccionarTodos(){
      var checkedItems = document.getElementsByClassName('check');
      for (let item = 0; item < checkedItems.length; item++) {
        console.log((checkedItems[item] as HTMLInputElement).checked = true);
    }

    }

    deseleccionarTodos(){

    }


  EsconderModalEliminar(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='none';
  }

  MostrarModalEliminar(id:string){
    // const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    // containerModal[0].style.display='flex';
    // var body = document.body,
    // html = document.documentElement;
    // var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );
    // containerModal[0].style.height= body.scrollHeight.toString()+'px';
    this.uidModelo = id;

    Swal.fire({
      title: 'Eliminar modelo',
      text: `¿Desea eliminar el modelo seleccionado`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#0073ca',
      focusConfirm: true,
      allowOutsideClick: true
    }).then((result) =>{
      if(result.isConfirmed){
        this.eliminarModelos();
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
      title: 'Eliminar modelos',
      text: `¿Desea eliminar los ${this.itemsSelector.length} modelos seleccionados?`,
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

  EsconderModalEliminar2(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='none';
  }



  }
