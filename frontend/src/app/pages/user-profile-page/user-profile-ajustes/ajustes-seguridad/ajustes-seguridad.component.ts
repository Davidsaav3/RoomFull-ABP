import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { Validators, FormBuilder, AbstractControl} from '@angular/forms';
import Swal from 'sweetalert2';
import { editarForm } from '../../../../interfaces/editar-form.interface';
import { editarFotoForm } from '../../../../interfaces/editar-fotoform.interface';
import { editarPassForm } from '../../../../interfaces/editar-passform.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../../services/chat.service';
import { EscenaService } from '../../../../services/escena.service';
import { editarAsistenteForm } from '../../../../interfaces/editar-formAsistente.interface';
import {
  Output,
  EventEmitter
} from '@angular/core';
import { AppAuxService } from 'src/app/app-aux.service';
import { SuscripcionService } from 'src/app/services/suscripcion.service';
import { NavBarAuxComponent } from 'src/app/commons/navbar/navbar-aux.service';

@Component({
  selector: 'app-ajustes-seguridad',
  templateUrl: './ajustes-seguridad.component.html',
  styleUrls: ['./ajustes-seguridad.component.css']
})
export class AjustesSeguridadComponent implements OnInit {

  public opciones: Array<boolean> = [];
  public asistente: Boolean;
  caracteresEspeciales=` $ @ ! # ^ ~ % * ? & , . < > " ' ; : { } [ ] | + - = _ ( ) \` ` +  ' / ' + ' \\ ';

  public usuario = new Usuario('', '', '','','','','', '', 1, '','',[],[],'');
  public subscription = '';
  public uidusuario = '';
  imagen: string = '';
  nombre: string = 'Usuario';
  nom: string = 'Usuario';
  empresa: string = 'Arquitecto';
  private uid: string = '';
  private token: any = '';
  public descripcion: string = '';
  nav: any;
  display: string = "display:none";
  displayLogout: string = "display:block";

  public mensajeErrorEmail = "El email no es válido.";
  public mensajeErrorPass = "La contraseña no es válida.";
  public mensajeErrorPassNueva1 = "La contraseña no es válida.";
  public mensajeErrorPassNueva2 = "La contraseña no es válida.";
  public formSubmit = false;
  private firstValidation = false;
  public waiting = false;
  private n: number;
  imagefile:File;
  imageName = '';
  nombreUsuario = '';
  public noGoogle = false;

  public editarForm = this.fb.group({
    apellidos: ['', Validators.required],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
    empresa: [''],
    nombre: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    telefono: [Number(0)]
  });

  public editarFotoForm = this.fb.group({
    image: ['', Validators.required ]
  });

  public editarPassForm = this.fb.group({
    passActual: ['', Validators.required ],
    passNueva1: ['', [Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{9,}')]],
    passNueva2: ['', Validators.required ]
  });

  constructor(public usu: UsuarioService, private fb: FormBuilder, private router: Router ,private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private appAux: AppAuxService, private suscripcionService: SuscripcionService, private navbarService: NavBarAuxComponent) {
    this.cargarUsuarios();
   }

  ngOnInit(): void {
    this.checkPassForm2();
    const id = this.usu.recuperarUidToken();
    this.usu.cargarUsuario( id )
      .subscribe({
        next:((res: any)=>{
          this.usuario = res.usuario;
          if (res.usuario.metodo == "google"){
            this.imagen = res.usuario.imagen;
          }
          else {
            this.imagen =  "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
          }
          this.nombreUsuario = res.usuario.nombreUsuario;
          this.empresa = res.usuario.empresa;
          this.actualizarForm();
        }),
    });

    this.uid = this.devolverId();
    console.log(this.uid);

    this.cargarUsuarios();
    this.uid = this.usuarioService.recuperarUidToken();
    this.obtenerSuscripcion();
  }

  obtenerSuscripcion(){
    this.suscripcionService.getSusUsuario(this.uid).subscribe({
      next: (res) =>{
        console.log("Obtener Suscripcion")
        console.log(res)
        this.subscription = res['Sus'][0]['uid'];
        console.log(this.subscription)
      },
      error: (error) =>{
        console.log(error);
      }
    });
  }
  actualizarForm(){
    if(this.usuario.telefono != null){
      let numero = this.usuario.telefono.toString();
      this.n = +numero;
    }else{
      this.n = 0;
    }

    this.editarForm.setValue({
      apellidos: this.usuario.apellidos || null,
      email: this.usuario.email || null,
      empresa: this.usuario.empresa || null,
      nombre: this.usuario.nombre || null,
      nombreUsuario: this.usuario.nombreUsuario || null,
      telefono: this.n || null
    });

    if(this.usuario.metodo == "google"){
      this.editarPassForm.disable();
    }
  }

  editar() {
    this.formSubmit = true;
    this.firstValidation = true;
    if (!this.checkForm()) {
      console.warn('Errores en el formulario');
      console.log(this.editarForm);
      return;
    }
    this.waiting = true;
    const obj : editarForm = {
      apellidos : this.editarForm.value.apellidos || '',
      email : this.editarForm.value.email || '',
      empresa : this.editarForm.value.empresa || '',
      nombre : this.editarForm.value.nombre || '',
      nombreUsuario : this.editarForm.value.nombreUsuario || '',
      telefono : Number(this.editarForm.value.telefono)
    }

    this.usu.actualizarUsuario(this.usuario.uid, obj).subscribe(
    {
      next: () => {
        Swal.fire({
          title: '¡Usuario editado!',
          text: 'El usuario se ha actualizado',
          icon: 'success',
          showConfirmButton: false,
          allowOutsideClick: true
        });

        setTimeout(() => {
          Swal.close();
          this.ngOnInit();
        }, 1500)
      },
      error: (err: any) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      }
    });
  }

  editarFoto(){
    if (!this.checkFotoForm()) {
      console.warn('Errores en el formulario');
      return;
    }
    this.waiting = true;
    const obj : editarFotoForm = {
      imagen: this.editarFotoForm.value.image || ''
    }

    this.usu.actualizarFotoUsuario(this.usuario.uid, obj).subscribe(
      {
        next: (res:any) => {

          var reader = new FileReader();
          reader.onloadend = () =>{
          // se va a cargar la imagen
            this.usu.subirImagenUsuario(this.usuario.uid,obj.imagen,reader.result).subscribe({
              next:(res : any)=>{

              }, error: (err)=>{
                console.log(err);
              }
            });
          }
          reader.readAsDataURL(this.imagefile);


          // Cambiar el atributo normal a usuario
          this.usu.cargarUsuario(this.usuario.uid).subscribe({
            next:(res : any)=>{

              const obj  = {
                metodo : res.usuario.metodo || '',
              }

              if (res.usuario.metodo == 'google'){
                this.usu.actualizarUsuMetodo(this.usuario.uid, obj).subscribe({
                  next:(res : any)=>{

                    console.log(res);
                  }, error: (err:any)=>{
                    console.log(err);
                  }
                })
              }
            }, error: (err)=>{
              console.log(err);
            }
          })

          Swal.fire({
            title: '¡Foto de perfil actualizada!',
            text: 'La foto de perfil se ha actualizado correctamente',
            icon: 'success',
            showConfirmButton: false,
            allowOutsideClick: true
          });

          setTimeout(() => {
            Swal.close();
            this.ngOnInit();
          }, 1500)
        },
        error: (err: any) => {
          console.warn('Error respueta api:',err);
          Swal.fire({
            title: 'Error!',
            text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          this.waiting = false;
        }
      });
  }
  checkPassForm2(){

    let validForm = true;

    for (const field in this.editarPassForm.controls) { // 'field' is a string

      const control = this.editarPassForm.get(field);
      if(!control?.valid){
        const elem = document.getElementById('input'+field);
        console.log('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }

        elem?.classList.add('is-invalid');

        if(field == "PassActual" && control?.hasError('required')){
          this.mensajeErrorPassNueva2 = "La contraseña no puede estar vacía .";
        }
        if(field == "PassNueva1" && control?.hasError('required')){
          this.mensajeErrorPassNueva1 = "La contraseña no puede estar vacía .";
        }
        if(field == "PassNueva2" && control?.hasError('required')){
          this.mensajeErrorPassNueva2 = "La contraseña no puede estar vacía .";
        }

        validForm=false;
      } else {
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-invalid')){
          elem?.classList.remove('is-invalid');
        }
        elem?.classList.add('is-valid');
      }
       // 'control' is a FormControl

    }
    return validForm;
  }

  editarPass(){
    if (!this.checkPassForm2()) {
      console.warn('Errores en el formulario');
      console.log(this.editarPassForm);
      return;
    }
    this.waiting = true;
    const obj : editarPassForm = {
      passActual: this.editarPassForm.value.passActual || '',
      passNueva1: this.editarPassForm.value.passNueva1 || '',
      passNueva2: this.editarPassForm.value.passNueva2 || ''
    }

    this.usu.actualizarPassUsuario(this.usuario.uid, obj).subscribe(
      {
        next: () => {
          Swal.fire({
            title: '¡Contraseña actualizada!',
            text: 'La contraseña se ha actualizado correctamente',
            icon: 'success',
            showConfirmButton: false,
            allowOutsideClick: true
          });

          setTimeout(() => {
            Swal.close();
            this.ngOnInit();
          }, 1500)
        },
        error: (err: any) => {
          console.warn('Error respueta api:',err);
          Swal.fire({
            title: 'Error!',
            text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          this.waiting = false;
        }
      });
  }

  checkForm(){

    let validForm = true;

    for (const field in this.editarForm.controls) { // 'field' is a string

      const control = this.editarForm.get(field);
      if(!control?.valid){
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }

        elem?.classList.add('is-invalid');

        if(field == "passActual" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }
        if(field == "passNueva1" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }
        if(field == "passNueva2" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }


        validForm=false;
      } else {
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-invalid')){
          elem?.classList.remove('is-invalid');
        }
        elem?.classList.add('is-valid');
      }
       // 'control' is a FormControl

    }
    return validForm;
  }

  checkFotoForm(){

    let validFotoForm = true;

    for (const field in this.editarFotoForm.controls) { // 'field' is a string

      const control = this.editarFotoForm.get(field);
      if(!control?.valid){
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }

        elem?.classList.add('is-invalid');

        validFotoForm=false;
      } else {
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-invalid')){
          elem?.classList.remove('is-invalid');
        }
        elem?.classList.add('is-valid');
      }
       // 'control' is a FormControl

    }
    return validFotoForm;
  }

  checkPassForm(){

    let validPassForm = true;

    for (const field in this.editarPassForm.controls) { // 'field' is a string

      const control = this.editarPassForm.get(field);
      if(!control?.valid){
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }

        elem?.classList.add('is-invalid');


        if(field == "PassActual" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }
        if(field == "PassNueva1" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }
        if(field == "PassNueva2" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "La contraseña no es correcta.";
        }

        validPassForm=false;
      } else {
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-invalid')){
          elem?.classList.remove('is-invalid');
        }
        elem?.classList.add('is-valid');
      }
       // 'control' is a FormControl

    }
    return validPassForm;
  }

  cambioCheckForm(){
    if(this.firstValidation){
      this.checkPassForm2();
    }
  }

  cargararchivo (event : any) {
    var output = document.getElementById('output') as HTMLImageElement;
    let file2:File = event.target.files[0];

    if(output){
      //console.log(file2);
      this.imagefile=new File ([file2],file2.name);
      //console.log(this.imagefile);
      output.src =  URL.createObjectURL(file2);
      output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
      }
      this.imageName = file2.name;
    }
  }

  campoValido( campo: string) {
    return this.editarForm.get(campo)!.valid || !this.formSubmit;
  }


  cargarUsuarios2() {

    this.usuarioService.cargarUsuario(this.uid).subscribe(
      {
        next: (res:any) => {
            this.nom = res.usuario.nombre;
            this.empresa = res.usuario.empresa;

            if(res.usuario!=null){
              if (res.usuario.metodo == "google"){
                this.imagen = res.usuario.imagen;
              }
              else {
                this.imagen =  "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
              }
            }

        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
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

      @Output() displayEmitter = new EventEmitter < string > ();
      logout() {
        this.displayEmitter.emit(this.displayLogout);
        this.displayEmitter.emit(this.display);
        this.usuarioService.logout();
      }


  cargarUsuarios() {
    this.usuarioService.cargarUsuario(this.uid).subscribe(
      {
        next: (res:any) => {

          if (res.usuario.opciones[0].asistente == true){
            this.asistente = true;
          }
          else {
            document.getElementById('asistente')?.attributes.removeNamedItem('checked');
          }

          console.log(res.usuario.opciones[0].asistente);

        },
        error: (err: any)=> {
          console.log(err);
        }
      }
    );
  }

  cambiarAsistente(valor:boolean) {
    this.asistente = valor;
    const obj : editarAsistenteForm = {
      opciones: {
        asistente: this.asistente
      }
    }
    this.usuarioService.cambiarOpciones(this.uid, obj).subscribe(
      {
        next: (res:any) => {
          this.appAux.changeMessage("cambiar");
          console.log(res.usu.opciones[0].asistente);
        },
        error: (err: any)=> {
          console.log(err);
        }
      }
    );
  }

  eliminarCuenta(){
    console.log(this.subscription)
    this.suscripcionService.borrarSus(this.subscription).subscribe({
      next: (res) =>{
        console.log(this.subscription)
        this.borrarUsuario();
        localStorage.removeItem('token');
        this.navbarService.changeMessage6('cambiar');
        this.router.navigateByUrl('login');
      },
      error: (error) =>{
        console.log(error)
      }
    })
  }

  borrarUsuario(){
    this.usuarioService.borrarUsuario(this.uid).subscribe({
      next: (res) =>{
        console.log(res);
      },
      error: (error) =>{
        console.log(error);
      }
    });
  }
  EsconderModalEliminar2(){
    const containerModal = Array.from(document.getElementsByClassName('ModalContainer2') as HTMLCollectionOf<HTMLElement>);
    containerModal[0].style.display='none';
  }

  MostrarModalesEliminar(){
    Swal.fire({
      title: 'Eliminar cuenta',
      text: `¿Desea eliminar su cuenta de forma irreversible?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#0073ca',
      cancelButtonText: 'Cancelar',
      cancelButtonColor:'#dc3545',
      focusCancel: true,
      allowOutsideClick: true
    }).then((result) =>{
      if(result.isConfirmed){
        this.eliminarCuenta();
      }
    });

  }

}








