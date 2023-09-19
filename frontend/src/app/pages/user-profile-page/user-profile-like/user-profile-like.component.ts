  import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
  import { UsuarioService } from '../../../services/usuario.service';
  import { EscenaService } from '../../../services/escena.service';
  import { ActivatedRoute, Router } from '@angular/router';
  import Swal from 'sweetalert2';
  import { Escena } from '../../../models/escena.model';
  import { FormBuilder, Validators } from '@angular/forms';
  //import { DragulaService } from 'ng2-dragula';
  import { Subscription } from 'rxjs';
import { AjustesPerfilAuxService } from '../user-profile-ajustes/ajustes-perfil/ajustesPerfilAux.service';

  @Component({
    selector: 'app-user-profile-like',
    templateUrl: './user-profile-like.component.html',
    styleUrls: ['./user-profile-like.component.css']
  })
  export class UserProfileLikeComponent implements OnInit {


    public loggedin = false;
    timeout: any = null;
    tarjetasModelos = ``;
    escenasDes : Array<any>;
    escenasRec : any;

    public uid: string = '';
    private token: any = '';

    public nameuser: string;
    tokenUserName: any;
    perfilPropio: boolean = false;
    public nFiltro: any = 'Más recientes';

    modelosUsuario : any;
    lengthModelosUsu : any;

    modelosLike: any;
    modelosTotal: any;

    // Para comprobar si hay modelos
    public cantidadReal: any;

    mensajeErrorCantidad = 'No se han encontrado resultados';

    cantidadModelos: Number = 0;

    desde: number = 1;
    ultimaPage: number;
    paginas: any;
    paginaTotal : any = 0;
    nombre:any = "";
    primero: boolean = true;
    ultimo: boolean = false;

    private maxModelos:any = 8;
    public numLikes:any;

    valor:any = 1;

    constructor( private activatedRoute: ActivatedRoute,
                  private router: Router,
                  private usuarioService: UsuarioService,
                  private escenaService:EscenaService,
                  private route: ActivatedRoute,
                  private perfilAuxService: AjustesPerfilAuxService) {

      // Para actualizar el like
      try {
        this.perfilAuxService.currentMessage4.subscribe(message=> {

          console.log(message + 'perfilaux3')

          if (message=="cambiar" && this.modelosUsuario.length <= 1){
            this.ngOnInit();
            this.menos();
            this.perfilAuxService.changeMessage4("none");
          }
          if (message==="cambiar"){
          this.ngOnInit();
          this.perfilAuxService.changeMessage4("none");
        }
        })

      } catch (error) {
        console.log(error)
      }


      this.nameuser=this.route.snapshot.params['usu'];

    }

    ngOnInit(): void {
      this.usuarioService.cargarUsuarioNombre(this.nameuser).subscribe({
        next:((res : any)=> {

          this.nameuser = res.usuario.nombreUsuario;

          // Obtener likes
          this.escenaService.obtenerEscenasLikes("").subscribe({
            next:(res:any)=>{

              // console.log(res);
              this.modelosUsuario = res['escenas']['escenasLikes'];
              this.numLikes= this.modelosUsuario.length;
              // console.log(this.numLikes)
            }, error:(err)=>{
              console.log(err);
            }
          })

          //pedir escenas

          this.uid = this.devolverId();
          this.usuarioService.cargarUsuario(this.uid).subscribe(
            {
              next: (res:any) => {
                this.tokenUserName = res.usuario.nombreUsuario;


                if(this.nameuser==this.tokenUserName){
                  //this.usuarioService.imagen;
                  this.perfilPropio = true;

                  this.escenaService.obtenerEscenasFiltrosPerfil(this.valor, this.nombre, this.desde, "likes").subscribe({
                    next:(res:any)=>{
                      console.log(res)
                      this.ultimaPage = Math.ceil(res.page.maximo/this.maxModelos);
                      console.log(this.ultimaPage)

                      this.paginas = Array(this.ultimaPage).fill(1).map((x,i)=>i);

                        //console.log(res);
                        this.modelosUsuario = res['escenas'];
                        this.cantidadReal = res.page.maximo;
                        this.cantidadModelos = res['escenas'].length;

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

                      console.log(res)

                    }

                  })

                  //console.log('usuario propio loggeado')
                }
                else{
                  //Si eso redirigir a descripcion de usuario
                  //console.log('perfil de otro usuario')
                }

              },
              error: (err)=> {
                console.log(err);
              }
            }
          );

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
          this.nFiltro = 'Más recientes';
          this.valor = 1;
          break;
        case 2:
          this.nFiltro = 'Más antiguos';
          this.valor = 2;
          break;
        case 3:
          this.nFiltro = 'Más visitas'
          this.valor = 3;
          break;
        case 4:
          this.nFiltro = 'Menos visitas';
          this.valor = 4;
          break;
        case 5:
          this.nFiltro = 'Popularidad';
          this.valor = 5;
          break;
        default:
          this.nFiltro = 'Más recientes';
          this.valor = 1;
          break;
      }

      // let inputValue = (<HTMLInputElement>document.getElementById("buscador")).value = "";
      this.ngOnInit()

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
          filtros.style.marginRight = "-245px";
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


    private executeListing(value: string) {
      this.nombre = value;
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


    devolverId (){
      this.token = localStorage.getItem('token');
      var base64Url = this.token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      // console.log(jsonPayload);
      var objPayload = JSON.parse(jsonPayload);
      var uid = objPayload.uid;
      return uid;
    }


  }



