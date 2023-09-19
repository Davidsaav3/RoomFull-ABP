import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent implements OnInit {

  hiddenEmail = '';

  firstTimePassValidation=false;

  caracteresEspeciales=` $ @ ! # ^ ~ % * ? & , . < > " ' ; : { } [ ] | + - = _ ( ) \` ` +  ' / ' + ' \\ ';

  emailForm = this.fb.group({
    emailRecov:['',Validators.compose([Validators.email,Validators.required])]
  });

  codigoForm = this.fb.group({
    codigoVerif:['',Validators.compose([Validators.required, Validators.pattern('[0-9]{6}')])]
  });

   passwordForm = this.fb.group({
    passw: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{9,}')]],
    passwRepe:['',Validators.required]
  });


  state = 0;


  constructor(private fb: FormBuilder,private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  nextState(aux:any){

    switch(aux){
      case 'email':
        console.log(this.emailForm.controls.emailRecov);
        if(this.emailForm.controls.emailRecov.valid){
          try{
            this.usuarioService.generarCodigoVerificacion(this.emailForm.controls.emailRecov.value).subscribe({
              next:((res:any)=>{
                console.log(res)
                this.lanzarMensajeCorrecto('Se ha enviado un email con el codigo de verificación a tu cuenta');
                if(this.emailForm.controls.emailRecov.value)
                this.hiddenEmail = this.emailForm.controls.emailRecov.value;


                this.hiddenEmail = '*****' + this.hiddenEmail.split('@')[0].slice(this.hiddenEmail.split('@')[0].length-4) + '@' + this.hiddenEmail.split('@')[1];

              }), error:((err:any)=>{
                console.log(err);
                this.lanzarMensajeError(err.error.msg)
              })
            })
          } catch (e){

          }
          //this.state+=1;
        }else{
          document.getElementById('inputEmail')?.classList.add('is-invalid');
          //this.lanzarMensajeError('Introduce un email válido');
        }



        break;
      case 'code':
        console.log(this.codigoForm.controls);
        if(this.codigoForm.controls.codigoVerif.valid){
          try{
            this.usuarioService.comprobarCodigoGenerado(this.codigoForm.controls.codigoVerif.value, this.emailForm.controls.emailRecov.value).subscribe({
              next:((res:any)=>{
                console.log(res)
                this.lanzarMensajeCorrecto('El código es correcto');

              }), error:((err:any)=>{
                console.log(err);
                if(err.error.msg!='Ha caducado el codigo'){
                  this.lanzarMensajeError(err.error.msg)
                }else{
                  this.lanzarMensajeErrorCodigocaducao();
                }

              })
            })
          } catch (e){

          }
        } else{
          document.getElementById('inputCode')?.classList.add('is-invalid');
          //this.lanzarMensajeError('El código debe ser numérico y deben ser 6 digitos');
        }

        break;
      case 'passw':
        console.log(this.passwordForm.controls);
        if(this.passwordForm.valid){
          try{
            this.usuarioService.nuevaContrasena(this.passwordForm.controls.passw.value,this.passwordForm.controls.passwRepe.value, this.emailForm.controls.emailRecov.value).subscribe({
              next:((res:any)=>{
                console.log(res)
                this.lanzarMensajeCorrectoNewPass();

              }), error:((err:any)=>{
                console.log(err);


              })
            })
          } catch (e){

          }
        } else{
          this.firstTimePassValidation=true;
          this.checkPassForm();
          //this.lanzarMensajeError('2 contraseñas una repetida');
        }
        break;
    }



  }


  checkPassForm(){
    if(this.firstTimePassValidation){
      console.log(this.passwordForm.controls.passw.valid)
      if(!this.passwordForm.controls.passw.valid){
        document.getElementById('inputPassw')?.classList.remove('is-valid');
        document.getElementById('inputPassw')?.classList.add('is-invalid');
      } else{
        document.getElementById('inputPassw')?.classList.remove('is-invalid');
        document.getElementById('inputPassw')?.classList.add('is-valid');
      }

      if(this.passwordForm.controls.passw.value!=this.passwordForm.controls.passwRepe.value){
        document.getElementById('inputPasswRepe')?.classList.remove('is-valid');
        document.getElementById('inputPasswRepe')?.classList.add('is-invalid');
      } else{
        document.getElementById('inputPasswRepe')?.classList.remove('is-invalid');
        document.getElementById('inputPasswRepe')?.classList.add('is-valid');
      }
    }

  }

  prevState(){
    this.state-=1;
  }

  lanzarMensajeError(mensaje:any){
    Swal.fire({
      icon: 'error',
      title: 'Ha habido un error',
      text: mensaje || 'Algo ha ido mal'

    })
  }

  lanzarMensajeErrorCodigocaducao(){
    Swal.fire({
      icon: 'error',
      title: 'Ha habido un error',
      text: 'Tu código de verificación ha caducado, vuelve a pedir otro.'

    }).then((result)=>{
      this.state=0;
    })
  }

  lanzarMensajeCorrecto(mensaje:any){
    Swal.fire({
      icon: 'success',
      title: 'Todo ha ido bien',
      text: mensaje || 'Todo ha salido correctamente'

    }).then((result)=>{
      this.state+=1;
    })
  }

  lanzarMensajeCorrectoNewPass(){
    Swal.fire({
      icon: 'success',
      title: 'Todo ha ido bien',
      text: 'La contraseña ha sido cambiada'

    }).then((result)=>{
      this.router.navigateByUrl('/login');
    })
  }

}
