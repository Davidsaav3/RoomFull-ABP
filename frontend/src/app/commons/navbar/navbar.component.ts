import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ChatAuxService } from '../../pages/chat-page/chat/chat-aux.service';
import { NavBarAuxComponent } from './navbar-aux.service';
import { EscenaService } from '../../services/escena.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { TipoSuscripcionService } from '../../services/tipoSuscripcion.service';
import { TarjetaAuxService } from '../../pages/modelos/tarjeta-planes/tarjeta-planes-aux.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedin = false;
  timeout: any = null;
  tarjetasModelos = ``;
  escenasDes : Array<any>;
  escenasRec : any;

  private uid: string = '';
  private token: any = '';
  public nombreUsuario: string = '';
  public nombreSolo: string = '';
  public rol: string = '';
  public display: string = 'display:block';
  public displayLogout: string = 'display:none';
  imagenUsuario:string = '';
  private usuarioNoRecuperado:boolean;

  susPremium:any = false;

  constructor(private escenaService:EscenaService,  private usuarioService: UsuarioService, private router: Router,   private chatAux:NavBarAuxComponent, private navBarAuxService: NavBarAuxComponent, private sus: SuscripcionService, private tipoSus:TipoSuscripcionService, private tarjetaAux: TarjetaAuxService) {

    // Para la edición desde perfil
    try {
      this.navBarAuxService.currentMessage.subscribe(message=> {

      if (message!=="cambiar" && message!== "none"){
        this.ngOnInit();
        this.navBarAuxService.changeMessage("none");
      }
      })

    } catch (error) {
      console.log(error)
    }

    // Para el pago con paypal
    try {
      this.tarjetaAux.currentMessage2.subscribe(message=> {

      if (message=="cambiar"){
        this.ngOnInit();
        console.log('cambiado')
        this.tarjetaAux.changeMessage2("none");
      }
      })

    } catch (error) {
      console.log(error)
    }

    // Para la edición desde admin
    try {
      this.navBarAuxService.currentMessage3.subscribe(message=> {

      if (message!=="cambiar" && message!== "none"){
        this.ngOnInit();
        this.navBarAuxService.changeMessage3("none");
      }
      })

    } catch (error) {
      console.log(error)
    }

    // Para carga desde login
    try {
      this.navBarAuxService.currentMessage4.subscribe(message=> {

      if (message==="cambiar"){
        this.ngOnInit();
        this.navBarAuxService.changeMessage4("none");
      }
      })

    } catch (error) {
      console.log(error)
    }

    try {
      this.navBarAuxService.currentMessage5.subscribe(message=> {

      if (message==="cambiar"){
        this.ngOnInit();
        this.navBarAuxService.changeMessage5("none");
      }
      })

    } catch (error) {
      console.log(error)
    }
    // Reiniciar navbar eliminar cuenta
    try {
      this.navBarAuxService.currentMessage6.subscribe(message=> {

      if (message=="cambiar"){
        this.ngOnInit();
        this.navBarAuxService.changeMessage6("none");
      }
      })

    } catch (error) {
      console.log(error)
    }
  }

  comprobarGratis(){

    this.sus.getSus().subscribe({
      next: (res:any)=>{
        let arrSus = res.Sus;
        let idUsu = this.uid;
        let idTipoSus;
        let encontrada = false;



          for (let index = 0; index < arrSus.length; index++) {
            if (idUsu == arrSus[index].idUsuario){
              idTipoSus = arrSus[index].idTipoSus;
              encontrada = true;
            }
          }


          if (encontrada== false){
            this.susPremium = false;
            }

          this.tipoSus.getTipoSus().subscribe({
            next: (res:any)=> {
              let arrTipoSus = res.tipoSus;
              let nombreTipoSus:any = '';

              for (let index = 0; index < arrTipoSus.length; index++) {
                if (idTipoSus == arrTipoSus[index].uid){
                  nombreTipoSus = arrTipoSus[index].nombre;
                }
              }

              // No borrar por si acaso
              // if (nombreTipoSus == 'Gratis'){
              //   this.susPremium = false;
              // }
              // else if (nombreTipoSus == ''){
              //   this.susPremium = false;
              // }
              // else {
              //   this.susPremium = true;
              // }

              this.susPremium = true;


            }
          })
        }

    })
  }


  ngOnInit(): void {
    if(localStorage.getItem('token')!=null){

      this.uid = this.devolverId ();
      this.cargarUsuario();
      this.comprobarGratis();



    }else{
      this.display = "display:block";
      this.displayLogout = "display:none";
    }


    /* window.addEventListener('scroll', function() {
      const barra = this.document.getElementById('barra-nav') as HTMLElement;
      if(barra){
        if(window.pageYOffset>=10){
          barra.style.height='8vh';
        } else{
          barra.style.height='10vh';
        }
      }

    }) */

  }

  irChat(){
    this.chatAux.changeMessage("cambiado");
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
    this.escenaService.cargarEscenasNombre(value).subscribe({
      next:(res:any)=>{
        this.escenasRec = res['escenas'].filter((elem : any, i:number) => (elem['privado']!=true));

      }, error:(err)=>{
        console.log(err);
      }
    })
  }
  irPerfil(){
    this.navBarAuxService.changeMessage2(this.nombreUsuario);
  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
    console.log(this.display);
    console.log(this.displayLogout);
    this.display = "display:block";

    this.displayLogout = "display:none";
    console.log(this.display);
    console.log(this.displayLogout);
  }

    // Decodificar el jwt del localstorage para sacar el id
    devolverId (){
      this.token = localStorage.getItem('token');
      var uid = ''
      if(this.token){
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


    cargarUsuario(){
      this.usuarioService.cargarUsuario(this.uid).subscribe(
        {
          next: (res:any) => {
            console.log(res);
            this.nombreSolo = res.usuario.nombre;
            this.nombreUsuario = res.usuario.nombreUsuario;
            this.rol = res.usuario.rol;

            if (res.usuario.metodo == "google"){
              this.imagenUsuario = res.usuario.imagen;
            }
            else {
              this.imagenUsuario = "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
            }
            this.usuarioNoRecuperado = true;
            this.display = "display:none"; //this.usuarioService.imagen;
            this.displayLogout = "display:block";
          },
          error: (err)=> {
            console.log(err);
            this.usuarioNoRecuperado = false;
          }
        }
      );
    }


  /*if(localStorage.getItem('token')!=null){
    this.display = "display:none"; //this.usuarioService.imagen;
  }

      this.usuarioService.cargarUsuario( this.usuarioService.uid  ) //this.usuarioService.uid
      .subscribe( res => {
        if(this.usuarioService.uid!=undefined){
          this.display = "display:none"; //this.usuarioService.imagen;
        }
      });*/

}
