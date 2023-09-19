import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChatService } from '../../../services/chat.service';
import { chatForm } from '../../../interfaces/enviar-chat-form.interface';

//import { DragulaService } from 'ng2-dragula';
import { AjustesPerfilAuxService } from '../user-profile-ajustes/ajustes-perfil/ajustesPerfilAux.service';
import { NavBarAuxComponent } from '../../../commons/navbar/navbar-aux.service';
import { EscenaService } from 'src/app/services/escena.service';

@Component({
  selector: 'app-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.css']
})
export class UserProfileHeaderComponent implements OnInit {

  perfilPropio : Boolean = false;

  private tokenUserName : string = '';
  private uid: string = '';
  private token: any = '';


  public imagen = '';
  public descripcion = '';
  public nombre: string = '';
  public empresa: string = '';
  public nombreUsuario: string = '';

  public numGuardados: string = '';
  public numLikes: string = '';
  public numModelos: string = '';

  private modelosUsuario : any;


  private ruta:string = '';

  display: string = 'display:none';
  public formSubmit = false;
  public waiting = false;
  private uidRec: string = '';

  public chatForm = this.fb.group({
    asunto: [''],
    mensajes: [''],
  });

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private perfilAuxService: AjustesPerfilAuxService,
    private navBarAuxService: NavBarAuxComponent,
    private escenaService:EscenaService,
    private chatService: ChatService
    ) {

      // Para cambiar la descripción, nombre de usuario
      try {
        this.perfilAuxService.currentMessage.subscribe(message=> {

        if (message==="cambiar"){
          this.ngOnInit();
          this.perfilAuxService.changeMessage("none");
        }
        else if(message!=="cambiar" && message !== "none") {
          this.ruta = message;
          this.ngOnInit();
          this.perfilAuxService.changeMessage("none");
        }
        else {
          this.ruta =this.route.snapshot.children[0].params['usu'];
        }
        })

      } catch (error) {
        console.log(error)
      }

      // Para actualizar el navbar
      try {
        this.navBarAuxService.currentMessage2.subscribe(message=> {

        if(message!=="cambiar" && message !== "none") {
          this.ruta = message;
          this.ngOnInit();
          this.navBarAuxService.changeMessage2("none");
        }
        else {
          this.ruta =this.route.snapshot.children[0].params['usu'];
        }
        })

      } catch (error) {
        console.log(error)
      }

      // Para actualizar el header
      try {
        this.perfilAuxService.currentMessage2.subscribe(message=> {

        if (message==="cambiar"){
          this.ngOnInit();
          this.cambiarRuta('modelo');
          this.perfilAuxService.changeMessage2("none");
        }
        })

      } catch (error) {
        console.log(error)
      }

      // Para actualizar el header valores de likes, guardados
      try {
        this.perfilAuxService.currentMessage3.subscribe(message=> {
          // console.log(message)
        if (message==="cambiar"){
          this.ngOnInit();
          this.perfilAuxService.changeMessage3("none");
        }
        })

      } catch (error) {
        console.log(error)
      }

    }

  ngOnInit(): void {

    let ruta = this.router.routerState.snapshot.url.split('/')[2];
    if (ruta == "like"){
      ruta = "megusta"
    }
    this.cambiarRuta(ruta)

    this.usuarioService.cargarUsuarioNombre(this.ruta).subscribe({
      next:((res : any)=> {
        this.descripcion = res.usuario.descripcion;

        if(res.usuario!=null){
          if (res.usuario.metodo == "google"){
            this.imagen = res.usuario.imagen;
          }
          else {
            this.imagen =  "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
          }

          this.nombre = res.usuario.nombreUsuario;
          this.descripcion= res.usuario.descripcion;
          this.empresa = res.usuario.empresa;
          this.nombreUsuario = res.usuario.nombreUsuario;
          this.uid = this.devolverId();

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

            // Obtener guardados
            this.escenaService.obtenerEscenasGuardados("").subscribe({
              next:(res:any)=>{

                //console.log(res);
                this.modelosUsuario = res['escenas']['escenasGuardadas'];
                this.numGuardados = this.modelosUsuario.length;
              }, error:(err)=>{
                console.log(err);
              }
            })

            // Obtener modelos
            this.escenaService.obtenerEscenasPropias('').subscribe({
              next:(res:any)=>{

                //console.log(res);
                this.modelosUsuario = res['escenas'];
                this.numModelos = res['escenas'].length;

              }, error:(err)=>{
                console.log(err);
              }
            })

            //console.log('usuario propio loggeado')


          // console.log(res)

          this.usuarioService.cargarUsuario(this.uid).subscribe(
            {
              next: (res:any) => {
                this.tokenUserName = res.usuario.nombreUsuario;
                /* console.log('userProfile', this.nombreUsuario);
                console.log('userLogged',this.tokenUserName);
   */
                if(this.nombreUsuario==this.tokenUserName){
                  //this.usuarioService.imagen;
                  this.perfilPropio = true;
                  //console.log('usuario propio loggeado')

                }
                else{
                  //this.display = "display:none";
                  //console.log('perfil de otro usuario')
                }
              },
              error: (err)=> {
                console.log(err);
              }
            }
          );

        } else{
          window.alert('meter modal o algo, usuario no encontrado');
        }
      })
    })



  }

  ngAfterViewChecked (): void {
    let NavState = this.router.routerState.snapshot.url.split('/')[2];
    //console.log(NavState);
    const navElems  = Array.from(document.getElementsByClassName('userL'));

    navElems.forEach((elem : any) =>{
    //console.log(elem.dataset)
      if(NavState === elem.dataset['page']){
          elem.classList.add('selected')
      } else{
          elem.classList.remove('selected')
      }
    })
  }

  cambiarRuta(ruta: string){


    let NavState = this.router.routerState.snapshot.url.split('/')[2];

    const navElems  = Array.from(document.getElementsByClassName('nav-item-admin'));

    navElems.forEach((elem : any) =>{
      if(ruta === elem.dataset['page']){
        elem.classList.add('selected');
      }else{
        elem.classList.remove('selected');
      }
    })

    console.log(NavState);
  }


  // Decodificar el jwt del localstorage para sacar el id
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

    cargarUsuarios(){

      this.usuarioService.cargarUsuario(this.uid).subscribe(
        {
          next: (res:any) => {
            this.tokenUserName = res.usuario.nombreUsuario;
          },
          error: (err)=> {
            console.log(err);
          }
        }
      );
    }

    crearImagenUrl(imagen: string){
      return this.usuarioService.crearImagenUrl(imagen);
    }


  logout() {
    this.usuarioService.logout();
  }

  MostrarModalEliminar(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='flex';
  }

  sendChat(){
    this.usuarioService.cargarUsuarioNombre(this.router.routerState.snapshot.url.split('/')[3]).subscribe({
      next: (res:any) => {
        this.uidRec = res.usuario.uid;
        this.uid = this.devolverId();
        this.enviarFormChat();
        },
        error: (err)=> {
          console.log(err);
        }
    })

  }

  enviarFormChat(){

     console.log('id emisor' + this.uid)
     console.log('id receptor' + this.uidRec)


    const obj : chatForm = {
      idUsuarioEmi: this.uid || '',
      idUsuarioRec: this.uidRec || '',
      asunto : this.chatForm.value.asunto || '',
      mensajes : this.chatForm.value.mensajes || ''
    }

    let modal = document.getElementById("modalConver");

    if (modal != null){
      modal.style.display='none';
    }


    // console.log(obj)
    this.chatService.enviar(obj)
    .subscribe({
      next: (res:any) => {

        setTimeout(() => {
          this.router.navigateByUrl('chat');
        }, 1)
        this.waiting = false;


      },
      error: (err) => {
        console.warn('Error respuesta api:',err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        setTimeout(() =>{
            this.waiting = false;
          },1)
      }
    });

  }

    EsconderModalEliminar(){
      const containerModal = Array.from(document.getElementsByClassName('ModalContainer') as HTMLCollectionOf<HTMLElement>);
      containerModal[0].style.display='none';
    }


}

