import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { loginForm } from '../../interfaces/login-form.interface';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../../environments/environment';
import { NavBarAuxComponent } from '../../commons/navbar/navbar-aux.service';
import { LoginAuxService } from './loginAux.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmit = false;
  public firstValidation = false;
  public waiting = false;
  private clientId = environment.client_id;
  caracteresEspeciales=` $ @ ! # ^ ~ % * ? & , . < > " ' ; : { } [ ] | + - = _ ( ) \` ` +  ' / ' + ' \\ ';
  public mensajeErrorNombre = "El nombre no es válido.";
  public mensajeErrorContraseña = "La contraseña no es válida.";
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email'), [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [false]
  });


  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router,
               private route: ActivatedRoute,
               private navBarAuxService: NavBarAuxComponent,
               private loginAuxService: LoginAuxService,
                private zone: NgZone
  ) {

              // Para la edición desde admin
              try {
                this.loginAuxService.currentMessage.subscribe(message=> {

                if (message==="cambiar"){
                  this.ngOnInit();
                  this.loginAuxService.changeMessage("none");
                }
                })

              } catch (error) {
                console.log(error)
              }


               }

  ngOnInit(): void {
    this.checkForm();
    this.route.params.subscribe(
      params => {
        // comprobar remmeber par poner true

        // @ts-ignore
        //window.onGoogleLibraryLoad = () => {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
            context: "signin"
          });
          // @ts-ignore
          google.accounts.id.renderButton(
          // @ts-ignore
            document.getElementById("buttonDiv"),
              { theme: "outline", size: "large", shape:'rectangular', text: "signin_with"  }
          );

          // @ts-ignore
          google.accounts.id.prompt((notification: PromptMomentNotification) => {});
      });
  }

  async handleCredentialResponse(response: CredentialResponse) {
    // console.log("Token JWT de Google: " + response.credential);

    // Pasamos el token generado por google y esperamos la respuesta
    this.usuarioService.loginGoogle(response.credential).subscribe(
    {
      next: () => {
        // Enviar a navbar
        this.navBarAuxService.changeMessage4("cambiar");
        this.zone.run(() => {
          this.router.navigateByUrl('/inicio')
         });

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Login correcto'
        })

        this.waiting = false;
      },
      error: (err) => {
        console.warn('Error respuesta api:',err);
        Swal.fire({
          title: 'Login fallido',
          text: err.error.msg || 'Usuario o contraseña incorrectos',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#0073ca',
          focusConfirm: true,
          allowOutsideClick: false
        });
      }
    });
  }

  checkForm(){

    let validForm = true;

    for (const field in this.loginForm.controls) { // 'field' is a string

      const control = this.loginForm.get(field);
      if(!control?.valid){
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }

        elem?.classList.add('is-invalid');

        if(field == "email" && control?.hasError('required')){
          this.mensajeErrorNombre = "Este campo no debe estar vacío.";
        }
        if(field == "password" && control?.hasError('required')){
          this.mensajeErrorContraseña = "Este campo no debe estar vacío.";
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

  login() {
    this.formSubmit = true;
    this.firstValidation = true;
    if (!this.loginForm.valid) {
      console.warn('Errores en el formulario');
      console.log(this.loginForm);
      return;
    }
    this.waiting = true;
    const obj : loginForm = {
      email : this.loginForm.value.email || '',
      password : this.loginForm.value.password || '',
      remember :  this.loginForm.value.remember || false
    }
    this.usuarioService.login(obj)
      .subscribe({
        next: () => {
          if (obj.remember) {
                localStorage.setItem('email', this.loginForm.value.email || '');
              } else {
                localStorage.removeItem('email');
              }
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'success',
                title: 'Login correcto'
              })
            // Enviar a navbar

            this.navBarAuxService.changeMessage4("cambiar");
            this.router.navigateByUrl('/inicio')
            this.waiting = false;
        },
        error: (err) => {

          console.warn('Error respuesta api:',err);
          setTimeout(() =>{
              this.waiting = false;
            },1500);

            Swal.fire({
              title: 'Login fallido',
              text: err.error.msg || 'Usuario o contraseña incorrectos',
              icon: 'error',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#0073ca',
              focusConfirm: true,
              allowOutsideClick: false
            });
        }
      });
  }

  campoValido( campo: string) {
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

}
