  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { FormBuilder, Validators, AbstractControl} from '@angular/forms';
  import { UsuarioService } from '../../../../services/usuario.service';
  import { tipoSuscripcionesForm } from '../../../../interfaces/tipoSuscripciones.interface';
  import Swal from 'sweetalert2';
  import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
  import { environment } from '../../../../../environments/environment';
  import { TipoSuscripcion } from '../../../../models/tipoSuscripcion.model';
  import { TipoSuscripcionService } from '../../../../services/tipoSuscripcion.service';
  import { Usuario } from '../../../../models/usuario.model';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';

  @Component({
    selector: 'app-admin-suscripciones-crear',
    templateUrl: './admin-suscripciones-crear.component.html',
    styleUrls: ['./admin-suscripciones-crear.component.css']
  })
  export class AdminSuscripcionesCrearComponent implements OnInit {
    nombre = '';
    descripcion = '';
    precio =  0;
    caract = '';
    modelos = 0;

    public mensajeErrorNombre = "El nombre no es válido.";
    public mensajeErrorDescripcion = "La descripción no es válida.";
    public mensajeErrorPrecio = "El precio no es válido.";
    public mensajeErrorModelos = "La cantidad de modelos no es válida.";
    public mensajeErrorCaract = "Las características no son válidas.";

    public formSubmit = false;
    private firstValidation = false;
    public waiting = false;
    private clientId = environment.client_id;
    private imageName = "";
    uidNuevoUsuario : any;alidation = false;
    suscripcion: TipoSuscripcion;
    suscripciones : any;
    usuario: Usuario;

    public tipoSuscripcionesForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [Number(0)],
      modelos: [Number(0)],
      caract: ['', Validators.required]
    });

    constructor( public usu: UsuarioService,
      private activatedRoute: ActivatedRoute,
      private router: Router,private fb: FormBuilder,
      public tipoSuscripcionService: TipoSuscripcionService) {
  }

    ngOnInit(): void {
      const id = this.usu.recuperarUidToken();
      this.usu.cargarUsuario( id )
        .subscribe({
          next:((res: any)=>{
            this.usuario = res.usuario;
          }),
      });
    }


    volver (){
      this.router.navigateByUrl("/admin/administracion/suscripciones");
    }



    verConver(){
      this.router.navigateByUrl("/admin/administracion/ver-discusiones");
    }

    crearConver(){
      this.router.navigateByUrl("/admin/administracion/crear-discusiones");
    }

    cambioCheckForm(){
      if(this.firstValidation){
        this.checkForm();
      }
    }


    actualizarForm(){
      if(this.suscripcion.precio != null){
        this.precio = Number(this.suscripcion.precio);
      }else{
        this.precio = Number(0);
      }

      this.tipoSuscripcionesForm.setValue({
        nombre: this.suscripcion.nombre || null,
        descripcion: this.suscripcion.descripcion || null,
        precio: Number(this.suscripcion.precio) || Number(0),
        modelos: Number(this.suscripcion.modelos) || Number(0),
        caract: this.suscripcion.caract || null
      });
    }


    checkForm(){

      let validForm = true;

      for (const field in this.tipoSuscripcionesForm.controls) { // 'field' is a string

        const control = this.tipoSuscripcionesForm.get(field);
        if(!control?.valid){
          const elem = document.getElementById('input'+field);
          if(elem?.classList.contains('is-valid')){
            elem?.classList.remove('is-valid');
          }

          elem?.classList.add('is-invalid');

          if(field == "nombre" && control?.hasError('required')){
            this.mensajeErrorNombre = "Este campo no debe estar vacío.";
          }
          if(field == "descripcion" && control?.hasError('pattern')){
            this.mensajeErrorDescripcion = "Este campo no debe estar vacío.";
          }
          if(field == "precio" && control?.hasError('required')){
            this.mensajeErrorPrecio = "Este campo no debe estar vacío.";
          }
          if(field == "modelos" && control?.hasError('required')){
            this.mensajeErrorModelos = "Este campo no debe estar vacío.";
          }
          if(field == "caract" && control?.hasError('required')){
            this.mensajeErrorCaract = "Este campo no debe estar vacío.";
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

      suscribir() {
        this.formSubmit = true;
        this.firstValidation = true;
        if (!this.checkForm()) {
          console.warn('Errores en el formulario');
          console.log(this.tipoSuscripcionesForm);
          return;
        }
        this.waiting = true;
        const obj : tipoSuscripcionesForm = {
          nombre : this.tipoSuscripcionesForm.value.nombre || '',
          descripcion : this.tipoSuscripcionesForm.value.descripcion || '',
          precio : Number(this.tipoSuscripcionesForm.value.precio),
          modelos: Number(this.tipoSuscripcionesForm.value.modelos),
          caract: this.tipoSuscripcionesForm.value.caract || ''
        }

        this.tipoSuscripcionService.crearTipoSus(obj).subscribe(
        {
          next: () => {
            Swal.fire({
              title: 'Suscripción creada!',
              text: 'La suscripción se ha creado',
              icon: 'success',
              showConfirmButton: false,
              allowOutsideClick: true
            });

            setTimeout(() => {
              Swal.close();
              this.router.navigateByUrl('/admin/administracion/suscripciones');
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



  }
