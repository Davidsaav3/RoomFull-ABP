import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { EscenaService } from '../../../services/escena.service';
import { fromEvent } from 'rxjs';
import { Collection } from 'mongoose';
import Swal from 'sweetalert2';
import { AjustesPerfilAuxService } from '../../user-profile-page/user-profile-ajustes/ajustes-perfil/ajustesPerfilAux.service';


declare var $: any;
@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.css']
})
export class InicioPageComponent implements OnInit {

  public loggedin = false;
  public uid = '';
  private token : any;
  timeout: any = null;
  tarjetasModelos = ``;
  escenasDes : Array<any>;
  escenasRec : any;
  public filtro: any = 'Más recientes';
  private valor: any = 1;
  private nombre:any = '';
  private numDestacadas:any = 5;
  desde: number = 1;
  primero: boolean = true;
  ultimo: boolean = false;
  ultimaPage: number;
  paginas: any;
  paginaTotal : any = 0;
  modelos: any;
  private maximo: any = 8;
  mensajeErrorCantidad = 'No se han encontrado resultados';
  cantidadModelos: Number = 0;
  public usuNoRegistrado:Boolean = false;

  constructor( private usuarioService: UsuarioService, private escenaService:EscenaService,private perfilAuxService: AjustesPerfilAuxService) {

            // Para actualizar el modelo
            try {
              this.perfilAuxService.currentMessage5.subscribe(message=> {

                if (message=="cambiar" && this.escenasRec.length <= 1){
                  this.ngOnInit();
                  this.menos();
                  this.perfilAuxService.changeMessage5("none");
                }
                if (message==="cambiar"){
                this.ngOnInit();
                this.perfilAuxService.changeMessage5("none");
              }
              })

            } catch (error) {
              console.log(error)
            }
  }

  modal(){
    Swal.fire({
      title: 'Identificación necesaria',
      text: `¡Regístrate o inicia sesión para ver más modelos!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      confirmButtonColor: '#0073ca',
      cancelButtonColor: '#d40d06',
      cancelButtonText: 'Cancelar',
      focusConfirm: true,
      allowOutsideClick: true
    })
  }

 ngOnInit(): void {

    this.uid = this.devolverId();

    window.addEventListener('scroll', function() {
      const barra = this.document.getElementById('filtrosDiv') as HTMLElement;
      if(barra){
        if(window.pageYOffset>=440){
          barra.style.position = "fixed";
          barra.style.top = "19vh";
        } else{
          barra.style.position = "unset";
          barra.style.top = "0";
        }
      }
      const cabecera = this.document.getElementById('busquedaCabeceraDiv') as HTMLElement;
      if(cabecera){
        if(window.pageYOffset>=440){
          cabecera.style.position = "fixed";
          cabecera.style.zIndex = "100";
          cabecera.style.top = "5vh";
        } else{
          cabecera.style.position = "unset";
          cabecera.style.top = "0";
        }
      }
    })

    if (this.token != null){

      this.usuNoRegistrado = false;

      this.escenaService.cargarEscenasDestacadas().subscribe({
        next:(res:any)=>{

          this.escenasDes = res['escenas'].filter((elem : any, i:number) => (elem['privado']!=true)).filter((el:any,i:number)=> i<this.numDestacadas);
          console.log(this.escenasDes);


        }, error:(err)=>{
          console.log(err);
        }
      })

      this.escenaService.cargarEscenasRecientesNoPrivados(this.nombre, this.valor, this.desde).subscribe({
        next:(res:any)=>{
          // this.escenasRec = res['escenas'].filter((elem : any, i:number) => (elem['privado']!=true));
          this.escenasRec = res['escenas'];
          this.cantidadModelos = this.escenasRec.length;

          console.log(res.page.maximo)

          this.ultimaPage = Math.ceil(res.page.maximo/this.maximo);
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
          }, 20);


        }, error:(err)=>{
          console.log(err);
        }
      })
    }
    else {

      this.usuNoRegistrado = true;

      this.escenaService.cargarEscenasDestacadasNoUsu().subscribe({
        next:(res:any)=>{

          this.escenasDes = res['escenas'].filter((elem : any, i:number) => (elem['privado']!=true)).filter((el:any,i:number)=> i<this.numDestacadas);
          console.log(this.escenasDes);


        }, error:(err)=>{
          console.log(err);
        }
      })

      this.escenaService.cargarEscenasRecientesNoPrivadosNoUsu(this.nombre, this.valor, this.desde).subscribe({
        next:(res:any)=>{
          this.escenasRec = res['escenas'];
          this.cantidadModelos = this.escenasRec.length;

          this.ultimaPage = Math.ceil(res.page.maximo/this.maximo);
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
        }, 20);

          console.log(this.escenasRec)
        }, error:(err)=>{
          console.log(err);
        }
      })
    }



    setTimeout(()=>{
      this.configurarcarouseldest();
      this.configurarcarouselrec();
    },2000);
  }


  devolverId (){
    this.token = localStorage.getItem('token');
    let uid = '';

    if (this.token != null){
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

  configurarcarouseldest(){
    var carouselWidth = $('#inner-dest')[0].scrollWidth;
    var cardWidth = $('.item-dest').width();
    var scrollPosition = 0;
    var multiplier = 3;
    $('.control-next-dest').on('click', function(){
      if(scrollPosition < (carouselWidth - (cardWidth * multiplier))){
        scrollPosition = scrollPosition + cardWidth;
        $('#inner-dest').animate({scrollLeft: scrollPosition},600);
      }
    });
    $('.control-prev-dest').on('click', function(){

      if(scrollPosition >0){
        scrollPosition = scrollPosition - cardWidth;
        $('#inner-dest').animate({scrollLeft: scrollPosition},600);
      }
    });
  }

  configurarcarouselrec(){
    var carouselWidth = $('#inner-rec')[0].scrollWidth;
    var cardWidth = $('.item-rec').width();
    var scrollPosition = 0;
    var multiplier = 3;
    $('.control-next-rec').on('click', function(){
      if(scrollPosition < (carouselWidth - (cardWidth * multiplier))){
        scrollPosition = scrollPosition + cardWidth;
        $('#inner-rec').animate({scrollLeft: scrollPosition},600);
      }
    });
    $('.control-prev-rec').on('click', function(){

      if(scrollPosition >0){
        scrollPosition = scrollPosition - cardWidth;
        $('#inner-rec').animate({scrollLeft: scrollPosition},600);
      }
    });
  }

  filtros(){
    var ocultar = document.getElementById("ocultar");
    var mostrar = document.getElementById("mostrar");
    var filtros = document.getElementById("filtros");
    var resultados = document.getElementById("resultados");
    var tarjetas = Array.from(document.getElementsByClassName('tarjeta-modelo')) as HTMLElement[];

    if(ocultar != null && mostrar != null && filtros != null && resultados != null){

      if(ocultar.style.display != "none"){
        ocultar.style.display = "none";
        mostrar.style.display = "unset";
        filtros.style.marginRight = "-235px";
        resultados.style.width = "100%";
        tarjetas.forEach((elem)=>{


          let aux = elem.childNodes[0] as HTMLElement;
          aux.style.width="45vh";
          aux.style.height="45vh";

        });

      }else{
        ocultar.style.display = "unset";
        mostrar.style.display = "none";
        filtros.style.marginRight = "35px";
        resultados.style.width = "80%";
        tarjetas.forEach((elem)=>{

          let aux = elem.childNodes[0] as HTMLElement;
          aux.style.width="37vh";
          aux.style.height="37vh";
        });
      }
    }
  }

  ordenar(valor:any){

    this.desde = 1;
    this.paginas = Array(this.ultimaPage).fill(1).map((x,i)=>i);
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

    switch(valor){
      case 1:
        this.filtro = 'Más recientes';
        this.valor = 1;
        break;
      case 2:
        this.filtro = 'Más antiguos';
        this.valor = 2;
        break;
      case 3:
        this.filtro = 'Más visitas'
        this.valor = 3;
        break;
      case 4:
        this.filtro = 'Menos visitas';
        this.valor = 4;
        break;
      case 5:
        this.filtro = 'Popularidad';
        this.valor = 5;
        break;
      default:
        this.filtro = 'Más recientes';
        this.valor = 1;
        break;
    }

    this.ngOnInit()


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
    this.ngOnInit();
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
      this.ngOnInit();
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

    this.ngOnInit();
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

    this.nombre = value;
    this.ngOnInit();


  }

}

