import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { Validators, FormBuilder, AbstractControl} from '@angular/forms';
import Swal from 'sweetalert2';
import { editarForm } from '../../../../interfaces/editar-form.interface';
import { editarFotoForm } from '../../../../interfaces/editar-fotoform.interface';
import { editarPassForm } from '../../../../interfaces/editar-passform.interface';
import { ChatService } from '../../../../services/chat.service';
import { EscenaService } from '../../../../services/escena.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { editarNotificacionesForm } from '../../../../interfaces/editar-formNotificaciones.interface';
import { AjustesPerfilAuxService } from './ajustesPerfilAux.service';
import { NavBarAuxComponent } from 'src/app/commons/navbar/navbar-aux.service';


@Component({
  selector: 'app-ajustes-perfil',
  templateUrl: './ajustes-perfil.component.html',
  styleUrls: ['./ajustes-perfil.component.css']
})
export class AjustesPerfilComponent implements OnInit {

  formDesc = this.fb.group({
    description: ['', Validators.required]
  });

  private uid: string = '';
  public opciones: Array<boolean> = [];
  public notificaciones: Boolean;
  public interacciones: Boolean;
  public asistente: Boolean;
  public descripcion: string = 'Sin descripción';

  usuario: Usuario;
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
  imagen = '';
  nombreUsuario = '';
  empresa = '';
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

  constructor(public usu: UsuarioService, private fb: FormBuilder, private router: Router ,private usuarioService: UsuarioService,  private perfilAuxService: AjustesPerfilAuxService, private navBarAuxService: NavBarAuxComponent) { }

  ngOnInit(): void {
    this.uid = this.usuarioService.recuperarUidToken();
    this.cargarUsuarios();

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
          this.descripcion = res.usuario.descripcion;
          this.actualizarForm();
        }),
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
        this.router.navigateByUrl(`/user/ajustes/${this.editarForm.value.nombreUsuario}/perfil`)
        this.perfilAuxService.changeMessage(this.editarForm.value.nombreUsuario);
        this.navBarAuxService.changeMessage(this.editarForm.value.nombreUsuario);
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
                this.perfilAuxService.changeMessage2("cambiar");
                this.navBarAuxService.changeMessage5("cambiar");
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

  editarPass(){
    if (!this.checkPassForm()) {
      console.warn('Errores en el formulario');
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

        if(field == "email" && control?.hasError('required')){
          this.mensajeErrorEmail = "Este campo no debe estar vacío.";
        }
        if(field == "email" && control?.hasError('pattern')){
          this.mensajeErrorEmail = "El email no es válido.";
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

        if(field == "passNueva1" && control?.hasError('required')){
          this.mensajeErrorPassNueva1 = "Este campo no debe estar vacío.";
          console.log("Fail vacia")
        }
        if(field == "passNueva1" && control?.hasError('pattern')){
          this.mensajeErrorPassNueva1 = "La contraseña no es válida.";
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
      this.checkForm();
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

  cambiarNotificaciones(valor:boolean) {
    this.notificaciones = valor;
    const obj : editarNotificacionesForm = {
      opciones: {
        notificaciones: this.notificaciones
      }
    }
    this.usuarioService.cambiarOpciones(this.uid, obj).subscribe(
      {
        next: (res:any) => {
          console.log(res.usu.opciones[0].notificaciones);
        },
        error: (err: any)=> {
          console.log(err);
        }
      }
    );
  }

  cambiarInteracciones(valor:boolean) {
    this.interacciones= valor;
  }


  cargarUsuarios() {
    this.usuarioService.cargarUsuario(this.uid).subscribe(
      {
        next: (res:any) => {

          if (res.usuario.opciones[0].notificaciones == true){
            this.notificaciones = true;
          }
          else {
            document.getElementById('notificaciones')?.attributes.removeNamedItem('checked');
          }

          console.log(res.usuario.opciones[0].notificaciones);

        },
        error: (err: any)=> {
          console.log(err);
        }
      }
    );
  }

  cambiarDescripcion(data:any){
    if(this.formDesc.valid){
      console.log(this.formDesc.controls.description.value);
      this.usuarioService.actualizarUsuDescription(this.uid,this.formDesc.controls.description.value).subscribe({
        next:((res:any)=>{
          console.log(res);
          if(res.ok){
            console.log('descripcion actualizada')
            this.descripcion=this.formDesc.controls.description.value || '';
            this.perfilAuxService.changeMessage("cambiar");
            Swal.fire({
              title: 'Descripción editada!',
              text: 'La descripción se ha actualizado',
              icon: 'success',
              showConfirmButton: false,
              allowOutsideClick: true
            });

            setTimeout(() => {
              Swal.close();
              this.ngOnInit();
            }, 1500)

          }
        })
      });
    }
  }

}






