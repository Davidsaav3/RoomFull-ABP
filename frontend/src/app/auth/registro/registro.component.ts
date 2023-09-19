import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { TipoSuscripcionService } from '../../services/tipoSuscripcion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { registerForm } from '../../interfaces/register-form.interface';
import Swal from 'sweetalert2';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../../environments/environment';
import { LoginAuxService } from '../login/loginAux.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  caracteresEspeciales=` $ @ ! # ^ ~ % * ? & , . < > " ' ; : { } [ ] | + - = _ ( ) \` ` +  ' / ' + ' \\ ';
  public mensajeErrorEmail = "El email no es válido.";
  public mensajeErrorPass = "La contraseña no es válida.";
  public formSubmit = false;
  private firstValidation = false;
  public waiting = false;
  private clientId = environment.client_id;
  private imageName = "";
  imagefile:File;
  public uidNuevoUsuario : any;
  public idTipoSus : any;
  public registroPasosIniciado: Boolean = false;
  public localizacion: String;

  public registerForm = this.fb.group({
    uid: [''],
    apellidos: [''],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
    empresa: [''],
    nombre: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{9,}')]],
    password2: ['', Validators.required ],
    telefono: [''],
    terminos: [''],
    imagen: [''],
    imagenUrl: [''],
    rol: [''],
    localizacion: [''],
    formTer: [false, Validators.requiredTrue]
  });
  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private tipoSuscripcionService : TipoSuscripcionService,
               private suscripcionService : SuscripcionService,
               private router: Router,
               private route: ActivatedRoute,
               private loginAuxService: LoginAuxService ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
      // @ts-ignore
      //window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
          context: "signup"
        });
        // @ts-ignore
        google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("buttonDiv"),
          { theme: "outline", size: "large", shape:'rectangular', text: "continue_with"  }
        );
        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    });
  }

  async handleCredentialResponse(response: CredentialResponse) {
    // Pasamos el token generado por google y esperamos la respuesta
    this.usuarioService.registroGoogle(response.credential).subscribe(
      {
        next: () => {
          this.usuarioService.registrarUsuario().subscribe(
            {
              next: (res)=> {
                this.uidNuevoUsuario = res['usuario']['uid'];
                this.obtenerIdSuscripcionMasBarata();
                console.log('Registro hecho');
                Swal.fire({
                  title: '¡Registro hecho!',
                  text: 'El usuario ha sido registrado',
                  icon: 'success',
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  timer: 1000
                });

                this.loginAuxService.changeMessage("login")
                setTimeout(() => {
                  this.router.navigateByUrl('/login');
                }, 1500)
                this.waiting = false;

              },
              error: (err:any)=> {
                console.warn('Error respuesta api al registrar usuario:',err);
                Swal.fire({
                  title: 'Error!',
                  text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
                  icon: 'error',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#0073ca',
                  allowOutsideClick: false
                });
              }
            }
          )
        },
        error: (err:any)=> {
          console.warn('Error respuesta api registro:',err);
          Swal.fire({
            title: 'Error!',
            text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#0073ca',
            allowOutsideClick: false
          });
        }
      }
    )
  }

  obtenerIdSuscripcionMasBarata(){

    this.tipoSuscripcionService.cargarTipoSusAll().subscribe({
      next: (res: any) => {
        console.log("Respuesta de cargaSus");
        console.log(res);
        console.log(res.tipoSus[0]);
        this.idTipoSus = res.tipoSus[0].uid;
        this.suscribirUsuarioMasBarata(this.idTipoSus);
      },
      error: (err: any) =>{
        console.log(err)
      }
    })
  }

  suscribirUsuarioMasBarata(idTipoSusParam : any){
    const suscripcionForm : any = {
      idUsuario : this.uidNuevoUsuario || '',
      idTipoSus : idTipoSusParam || '',
      fechaIni : new Date().toLocaleDateString('es-Es') || '',
      fechaFin: new Date().toLocaleDateString('es-Es') || '',
      metodoPago : 1,
      renovacion : true
    }
    this.suscripcionService.crearSus(suscripcionForm).subscribe({
      next: (res: any) => {
        console.log("Usuario suscrito");
        console.log(res);
      },
      error: (err: any) =>{
        console.log(err)
      }
    })
  }

  getIpClient() {
    try {
      fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=34f7058cd325493688d64c0a2a27a24d')
      .then(response => response.json())
      .then(data =>{
        console.log(data['country']);
        this.localizacion = data['country'];
      }).catch(err => {
        console.error("ERROR: ", err.message)
      });
    } catch (error) {
      console.error(error);
    }
  }

  register() {
    this.getIpClient();
    console.log('le di a registrarse')
    this.formSubmit = true;
    this.firstValidation = true;
    if (!this.checkForm()) {
      console.warn('Errores en el formulario');
      console.log(this.registerForm);
      return;
    }
    this.waiting = true;
    const obj : registerForm = {
      uid : this.registerForm.value.uid || '',
      apellidos : this.registerForm.value.apellidos || '',
      email : this.registerForm.value.email || '',
      empresa : this.registerForm.value.empresa || '',
      nombre : this.registerForm.value.nombre || '',
      nombreUsuario : this.registerForm.value.nombreUsuario || '',
      password : this.registerForm.value.password || '',
      telefono : Number(this.registerForm.value.telefono),
      imagen : this.registerForm.value.imagen || '',
      imagenUrl : this.registerForm.value.imagenUrl || '',
      rol : this.registerForm.value.rol || 'Usuario',
      localizacion: this.localizacion || ''
    }


    // console.log(obj);
    this.usuarioService.register(obj).subscribe(
    {
      next: (res: any) => {
        if(this.registerForm.value.password != this.registerForm.value.password2){
          console.warn('Error');
          return;
        }
        if(this.registerForm.value.terminos=="false"){
          console.warn('Error');
          return;
        }

        this.uidNuevoUsuario = res['usuario']['uid'];
        this.obtenerIdSuscripcionMasBarata();
        var reader = new FileReader();


          reader.onloadend = () =>{
          // se va a cargar la imagen
            this.usuarioService.subirImagenUsuarioRegistro(this.uidNuevoUsuario,this.imagefile.name,reader.result).subscribe({
              next:(res : any)=>{
              }, error: (err)=>{
                console.log(err);
              }
            });
          }

          try {
            console.log(this.imagefile);
            reader.readAsDataURL(this.imagefile);
          } catch (error) {
            console.log(error);
          }

          Swal.fire({
            title: '¡Registro hecho!',
            text: 'El usuario ha sido registrado',
            icon: 'success',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1000
          });

          this.registroPasosIniciado = true;

          this.loginAuxService.changeMessage("login")
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1500)
          this.waiting = false;

          //Suscribir al usuario al plan

      },
      error: (err) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#0073ca',
          allowOutsideClick: false
        });
        this.waiting = false;
      }
    });
  }

  checkForm(){

    let validForm = true;

    for (const field in this.registerForm.controls) { // 'field' is a string

      const control = this.registerForm.get(field);
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
        if(field == "password" && control?.hasError('required')){
          this.mensajeErrorPass = "Este campo no debe estar vacío.";
        }
        if(field == "password" && control?.hasError('pattern')){
          this.mensajeErrorPass = "La contraseña no es válida.";
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
    return this.registerForm.get(campo)!.valid || !this.formSubmit;
  }

  // All is this method
  onPasswordChange() {
    if(this.firstValidation){
      if (this.confirm_password.value == this.password.value) {
        this.confirm_password.setErrors(null);
      } else {
        this.confirm_password.setErrors({ mismatch: true });
      }
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.registerForm.controls['password2'];
  }

  ocultar(){
    var boton = document.getElementById("botonRegistro");

    if (boton != null){
      boton.style.display = "none";
    }

  }

  mostrar(){
    var boton = document.getElementById("botonRegistro");

    if (boton != null){
      boton.style.display = "block";
    }

  }

  r1 (){

    var modal = document.getElementById("r0");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r1");
    if(modal != null){
      modal.style.display = "block";
    }

    this.registroPasosIniciado = true;
  }

  r2 (){
    var modal = document.getElementById("r1");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r2");
    if(modal != null){
      modal.style.display = "block";
    }
  }

  r3 (){
    var modal = document.getElementById("r2");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r3");
    if(modal != null){
      modal.style.display = "block";
    }
  }

  v0 (){
    var modal = document.getElementById("r1");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r0");
    if(modal != null){
      modal.style.display = "block";
    }
  }

  v1 (){
    var modal = document.getElementById("r2");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r1");
    if(modal != null){
      modal.style.display = "block";
    }
  }

  v2 (){
    var modal = document.getElementById("r3");
    if(modal != null){
      modal.style.display = "none";
    }

    var modal = document.getElementById("r2");
    if(modal != null){
      modal.style.display = "block";
    }
  }




}
