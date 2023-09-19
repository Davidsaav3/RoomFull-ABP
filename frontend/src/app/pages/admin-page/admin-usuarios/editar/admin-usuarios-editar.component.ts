import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Usuario } from '../../../../models/usuario.model';
import { Validators, FormBuilder, AbstractControl} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { editarForm } from '../../../../interfaces/editar-form.interface';
import { editarFotoForm } from '../../../../interfaces/editar-fotoform.interface';
import { check } from 'express-validator';
import { disableDebugTools } from '@angular/platform-browser';
import { NavBarAuxComponent } from '../../../../commons/navbar/navbar-aux.service';
import { SuscripcionService } from 'src/app/services/suscripcion.service';
import { TipoSuscripcionService } from 'src/app/services/tipoSuscripcion.service';

@Component({
  selector: 'app-admin-usuarios-editar',
  templateUrl: './admin-usuarios-editar.component.html',
  styleUrls: ['./admin-usuarios-editar.component.css']
})
export class editarUsuariosComponent implements OnInit {
  formDesc = this.fb.group({
    description: ['', Validators.required]
  });
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
  susc = '';
  nombreUsuario = '';
  empresa = '';
  suscription = '';
  public noGoogle = false;
  tieneSub: boolean = false;
  private uid: any;
  private token:any;
  public nombreSus:any;
  private idSus:any;
  private idUsu:any;

  tipoSus: any;
  sus: any;

  name: any;
  url: any;

  susUsu: any;

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

  constructor(public usu: AdminService, private fb: FormBuilder, private router: Router, private navBarAuxService: NavBarAuxComponent,private susService: SuscripcionService,
    private tipoSuscripcionService : TipoSuscripcionService) { }

  ngOnInit(): void {
    this.uid = this.devolverId ();
    this.url = window.location.href.split("/");
    this.name = this.url[this.url.length - 2];
    this.usu.cargarUsuarioNombre( this.name )
      .subscribe({
        next:((res: any)=>{
          this.usuario = res.usuario;
          this.idUsu = this.usuario.uid;

          if (res.usuario.metodo == "google"){
            this.imagen = res.usuario.imagen;
          }
          else {
            this.imagen =  "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
          }
          this.nombreUsuario = res.usuario.nombreUsuario;
          this.empresa = res.usuario.empresa;
          this.suscription = res.usuario.subscription;
          this.actualizarForm();
          this.comprobarSuscripcion();

          if(res.usuario.subscription.includes("registro_")){
            this.tieneSub = true;
            this.obtenerSub();
          }else{
            this.tieneSub = false;
          }



        }),
    });
    this.usu.cargarTipoSus().subscribe({
      next:(res:any) => {
        this.tipoSus = res.tipoSus;
      },error:(err:any) => {
        console.log(err);
      }
    });

  }


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

  obtenerSub(){

    // Dado su id hago una petición a las suscripciones
    this.susService.getSus().subscribe({
      next: (res:any) => {

        let arrIdUsu = res.Sus;
        console.log(arrIdUsu)

        let encontrado = false;

        for (let i = 0; i < arrIdUsu.length; i++){
          if (arrIdUsu[i].idUsuario == this.idUsu && !encontrado){
            // Hemos encontrado la suscripción asociada con el usuario
            this.sus = arrIdUsu[i].idTipoSus;
            encontrado = true;
          }
        }

        // Obtenemos el nombre
        this.tipoSuscripcionService.cargarTipoSusId(this.sus).subscribe({
          next:(res:any)=>{
            this.nombreSus = res.tipoSus.nombre;
            this.susUsu = res.tipoSus;
          }
        })



      },
    })

    }

    seleccionarSus(nombre:any){
      console.log(nombre)
      let elem = document.getElementById(nombre);
      let elemActivo = document.getElementById("activo");
      let input = document.getElementById("tablaTipos");
      let hijos = input?.children;
      let arrayLabels :string [] = [];


      if (hijos != null){
        for (let i = 0; i < hijos.length; i++){
          // Recorro los hijos del input
          let id = hijos [i].children[0].id;
          arrayLabels.push(id);
        }

        // Con el array que almacena los id
        for (let i = 0; i < arrayLabels.length; i++){
          if (arrayLabels[i] != nombre){
            let item = document.getElementById(arrayLabels[i])

            if (item != null){
              item.style.backgroundColor = 'white';
            }
          }
          else {
            let item = document.getElementById(arrayLabels[i])
            if (item != null){
              item.style.backgroundColor = 'rgb(206, 206, 206)';
            }
          }
        }

        // Tenemos el id de la suscripción
        console.log(nombre)
        this.idSus = nombre;

      }



    }

   suscribirse(nombreId:any) {
      let date = new Date();
      let dateFin = new Date();
      dateFin.setMonth(date.getMonth() + 1);
      const suscripcionForm : any = {
        idUsuario : this.idUsu || '',
        idTipoSus : nombreId || '',
        fechaIni : date || new Date(),
        fechaFin: dateFin || new Date(),
        metodoPago : 1,
        renovacion : true
      }
      this.susService.crearSus(suscripcionForm).subscribe({

        next: (res:any) => {
          console.log(res)
        },
        error: (err: any) => {
          console.warn('Error respuesta api:',err);
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

      setTimeout(() =>{
        this.ngOnInit()
      },100);



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
  }

  comprobarSuscripcion(){
    this.usu.cargarSus(this.usuario.subscription).subscribe({
      next:(res:any) => {
        this.sus = res.Sus;
        console.log(this.sus);
        if(this.sus.renovacion == true){
          let input = document.getElementById("renovacion") as HTMLInputElement;
          if(input)
            input.checked = true;
        }else{
          let input = document.getElementById("renovacion") as HTMLInputElement;
          if(input)
            input.checked = false;
        }

        let dateIni = document.getElementById("dateIni") as HTMLInputElement;
        let fechaInicioC = "";
        if(dateIni)
            var fecha = this.sus.fechaIni.split("/");
            fechaInicioC = fecha[2]+"-"+fecha[1]+"-"+fecha[0]
            dateIni.value = fechaInicioC;

        let dateFin = document.getElementById("dateFin") as HTMLInputElement;
        let fechaFinC = "";
        if(dateFin)
            var fecha = this.sus.fechaFin.split("/");
            fechaFinC = fecha[2]+"-"+fecha[1]+"-"+fecha[0]
            dateFin.value = fechaFinC;

        let diasR = document.getElementById("dias") as HTMLInputElement;
        let dias = this.calcularDias(fechaFinC);
        let text = document.createTextNode(dias.toString() + " Días");
        if(diasR)
            diasR.appendChild(text);

        let pago = document.getElementById("pago") as HTMLInputElement;
        if(pago)
          pago.value = this.sus.metodoPago;
      },error:(err:any) => {
        this.sus = false;
        let input = document.getElementById("sin") as HTMLInputElement;
        if(input)
          input.checked = true;
      }
    });
  }

  calcularDias(fechaFin: string){
    var dias = 0;
    let fechaInicio = Date.now();
    let fechaF = Date.parse(fechaFin);
    let milisecondsByDay = 86400000;

    let tiempoDiferencia = new Date(fechaF).getTime() - new Date(fechaInicio).getTime();
    dias = tiempoDiferencia / milisecondsByDay;

    return Math.ceil(dias);
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
        this.router.navigateByUrl(`/admin/administracion/usuarios/${this.editarForm.value.nombreUsuario}/editar`);
        this.ngOnInit();
        this.navBarAuxService.changeMessage3(this.editarForm.value.nombreUsuario);
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

  mostrarForm(){
    const formEl = document.getElementById('formDesc');
    if(formEl)
    formEl.style.display="inline";
  }

  cambiarDescripcion(data:any){
    if(this.formDesc.valid){
      console.log(this.formDesc.controls.description.value);
      this.usu.actualizarUsuDescription(this.usuario.uid,this.formDesc.controls.description.value).subscribe({
        next:((res:any)=>{
          console.log(res);
          if(res.ok){
            this.usuario.descripcion=this.formDesc.controls.description.value || '';

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
                this.navBarAuxService.changeMessage5("cambiar");
              }, error: (err: any)=>{
                console.log(err);
              }
            });
          }
          reader.readAsDataURL(this.imagefile);
          console.log(reader);

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
            }, error: (err: any)=>{
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

  restablecer(){

      this.usu.restablecerFoto(this.usuario.uid).subscribe({
          next: (res : any) => {
            Swal.fire({
              title: '¡Foto de perfil actualizada!',
              text: 'La foto de perfil se ha actualizado correctamente',
              icon: 'success',
              showConfirmButton: false,
              allowOutsideClick: true
            });
            setTimeout(() => {
              Swal.close();
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            }, 1500)
          },
          error: (err: any) => {
            Swal.fire({
              title: '¡Error al restablecer foto!',
              text: 'La foto de perfil no se ha actualizado correctamente',
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: true
            });
            setTimeout(() => {
              Swal.close();
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            }, 1500)
          }
      });
  }

  volver (){
    this.router.navigateByUrl("/admin/administracion/usuarios/"+this.nombreUsuario);
  }

  suscripcion (){
    var modal = document.getElementById("modalSus");

      if(modal != null){
        modal.style.display = "unset";
      }
      var modal2 = document.getElementById("modalSus1");

      if(modal2 != null){
        modal2.style.display = "none";
      }

  }

  aceptar (){

      Swal.fire({
        title: '¡Confirmación necesaria!',
        text: '¿Estás seguro de que quieres actualizar la suscripción del usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0073ca',
        cancelButtonColor: '#d40d06',
        cancelButtonText: 'Cancelar',
        focusConfirm: true,
        allowOutsideClick: true

      }).then((result) =>{
      if(result.isConfirmed){
        //Suscribirse
        this.suscribirse(this.idSus);
      }
      else {
        Swal.close()
      }
    })




  }

  restablecerDatos (){

  }

  cerrarModal (){
      var modal = document.getElementById("modalSus");

      if(modal != null){
        modal.style.display = "none";
      }

      var modal2 = document.getElementById("modalSus1");

      if(modal2 != null){
        modal2.style.display = "unset";
      }
  }
}

