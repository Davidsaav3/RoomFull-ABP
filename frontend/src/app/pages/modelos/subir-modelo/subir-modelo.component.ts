import { Component, EventEmitter,Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { subirModelForm } from 'src/app/interfaces/subir-model-form.interface';
import { FormGroup ,FormBuilder, Validators } from '@angular/forms';
import { EscenaService } from 'src/app/services/escena.service';
import { Escena } from '../../../models/escena.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-subir-modelo',
  templateUrl: './subir-modelo.component.html',
  styleUrls: ['./subir-modelo.component.css']
})
export class SubirModeloComponent implements OnInit {
  @Input () menuState2:boolean = false;

  public subirModelForm = this.fb.group({
    title:['', Validators.compose([Validators.required])  ],
    description: ['', Validators.required ],
    image: ['', Validators.required ],
    model: ['', Validators.required ],
    public: [false]
  });

  newForm = this.fb.group({
    sel:['']
  });


  ngOnInit(): void {
    this.idEscena = this.actRoute.snapshot.params['id'];
  }

  @Output() messageEvent = new EventEmitter<string>();

  public puntos: any;
  public cameraSpeed: any;
  opcionActiva = 'none';
  idescena : string;
  firstValidation = false;

  fileName = '';

  modelcontent = '';

  modelfile : any;

  imageName='';

  imagecontent:any;

  imagefile:File;
  stateNavOptions = 'momentoD'; //camara , fondo, momentoD, meteo

  idEscena:string;
  uidNuevaEscena : any;

  constructor(private http: HttpClient, private data:DataService,private fb: FormBuilder, private escenaService : EscenaService, private router: Router, private actRoute: ActivatedRoute) {
    this.data.currentMessage.subscribe(message => this.modelcontent = message);
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

      /* this.imagefile.text().then((value:string)=>{
        console.log(value);}); */
    }
  }

  anadirpunto(){

  }

  iralpunto($event){

  }

  cambiaVelocidad($event){

  }

  cerrarVentana(){
    this.opcionActiva = 'none';
   }

   cambiarStateNavOptions(state : string){
    this.stateNavOptions=state;
  }

  mostrarOcultarMenu(){

    const dropMenu = document.getElementsByClassName('dropMenu')[0] as HTMLElement;
    const dropB = document.getElementById('dropdownMenuButton') as HTMLElement;
    if(dropB){
      this.menuState2=!this.menuState2;
      /* if(dropMenu.classList.contains('arriba')){
        dropB.classList.remove('abiertoM');
        dropMenu.classList.remove('arriba');

      } else{
        dropB.classList.add('abiertoM');
        dropMenu.classList.add('arriba');
        this.opcionActiva = 'none';
      } */
    }

   }

  mostrarOcultarSeccion(aux:any){
    if(this.opcionActiva != aux){
      this.opcionActiva = aux;
    } else{
      this.opcionActiva = 'none';
    }
   }



  cargarmodelo (event : any) {
    var output = document.getElementById('output') as HTMLImageElement;
    let file2:File = event.target.files[0];
    //console.log(event.target.files);
    if (file2) {

      this.fileName = file2.name;
      /* console.log(file2.size) */
      this.modelfile=new File ([file2],file2.name);
      file2.text().then(r => {
        /* console.log(r); */
        this.data.changeMessage(r);
      })
    }
  }

  subirModelo(){
    this.firstValidation = true;
    if(!this.checkForm()){
      //Validacion negativa
      console.log('formulario invalido');

    } else{
      console.log('formulario valido');
      // orden peticiones: 1-crear modelo y 2-asignar imagen y 3-archivo modelo con la uid de la entidad modelo creada

      //info modelo
      const title = this.subirModelForm.controls.title.value || '';
      const desc = this.subirModelForm.controls.description.value || '';
      const imag = this.imageName || '';
      const model = this.fileName || '';
      const priv = this.subirModelForm.controls.public.value || false;
      const creatorid = '';

      //CREAR ENTIDAD MODELO

      const escenadata = new Escena ('',new Date(),title,desc,creatorid,model,imag,'',!priv,0,0,0);

      console.log(escenadata);
      this.escenaService.subirDatosModelo(escenadata).subscribe({
        next: (res : any)=>{
          /* console.log("Soy la respuesta");
          console.log(res); */
          this.uidNuevaEscena = res['escena']['uid'];
           //SUBIR IMAGEN Y ASIGNAR
          /* console.log('uid var this : ',this.uidNuevaEscena);
          console.log(res['escena']['uid']); */

         /*  this.imagefile.text().then((value:string)=>{
            console.log(value);
            this.escenaService.subirImagenModelo(this.uidNuevaEscena,imag,value).subscribe({
              next:(res : any)=>{
                console.log(res);
              }, error: (err)=>{
                console.log(err);
              }
            });
          }) */

          const reader = new FileReader;
        reader.onloadend = () =>{
        // se va a cargar la imagen
          this.escenaService.subirImagenModelo(this.uidNuevaEscena,imag,reader.result).subscribe({
            next:(res : any)=>{
              console.log(res);
            }, error: (err)=>{
              console.log(err);
            }
          });
        }
        reader.readAsDataURL(this.imagefile);


          this.modelfile.text().then((value:string)=>{

            this.escenaService.subirModeloModelo(this.uidNuevaEscena,model,value).subscribe({
            next:(res : any)=>{
              console.log(res);
            }, error: (err)=>{
               console.log(err);
            }
          });

        })


       this.router.navigateByUrl('/inicio');
        }, error: (err)=>{
          console.log(err);
          Swal.fire({
            title: 'Límite alcanzado',
            text: err.error.msg || 'Actualice su suscripción para subir más modelos',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Suscripciones',
            confirmButtonColor: '#0073ca',
            cancelButtonText: 'Cancelar',
            focusConfirm: true,
            cancelButtonColor: '#d40d06',
            allowOutsideClick: false
          }).then((result) =>{
            if(result.isConfirmed){
              this.router.navigateByUrl('/premium');
            }
          });
        }
      })



    }

   /*  const obj : subirModelForm = {

      title:this.subirModelForm.value.title || '',
      description: this.subirModelForm.value.description || '',
      image: this.subirModelForm.value.image || '',
      model: this.subirModelForm.value.model || '',
      public: this.subirModelForm.value.public || false

    }

    console.log(obj) */
  }

  checkForm(){

    let validForm = true;

    for (const field in this.subirModelForm.controls) { // 'field' is a string

      const control = this.subirModelForm.get(field);
      if(!control?.valid){
        /* console.log(field, '  invalid');
        console.log(control?.hasError('email')); */
        const elem = document.getElementById('input'+field);
        if(elem?.classList.contains('is-valid')){
          elem?.classList.remove('is-valid');
        }
        elem?.classList.add('is-invalid');
        validForm=false;
      } else {
        //console.log(field);
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

}


