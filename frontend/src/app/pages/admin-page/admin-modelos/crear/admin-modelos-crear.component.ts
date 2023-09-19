import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../../modelos/subir-modelo/data.service';
import { subirModelForm } from 'src/app/interfaces/subir-model-form.interface';
import { FormGroup ,FormBuilder, Validators } from '@angular/forms';
import { EscenaService } from 'src/app/services/escena.service';
import { Escena } from '../../../../models/escena.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-modelos-crear',
  templateUrl: './admin-modelos-crear.component.html',
  styleUrls: ['./admin-modelos-crear.component.css']
})
export class AdminModelosCrearComponent implements OnInit {
  public subirModelForm = this.fb.group({
    title:['', Validators.compose([Validators.required])  ],
    description: ['', Validators.required ],
    image: ['', Validators.required ],
    model: ['', Validators.required ],
    public: [false]
  });

  ngOnInit(): void {
  }

  @Output() messageEvent = new EventEmitter<string>();

  firstValidation = false;

  fileName = '';

  modelcontent = '';

  modelfile : any;

  imageName='';

  imagecontent:any;

  imagefile:File;

  uidNuevaEscena : any;

  constructor(private http: HttpClient, private data:DataService,private fb: FormBuilder, private escenaService : EscenaService, private router: Router) {
    this.data.currentMessage.subscribe(message => this.modelcontent = message);
  }

  volver (){
    this.router.navigateByUrl("/admin/administracion/modelos");
  }

  eliminarConver (){

  }

  verConver(){
    this.router.navigateByUrl("/admin/administracion/ver-modelos");
  }

  crearConver(){
    this.router.navigateByUrl("/admin/administracion/crear-modelos");
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

  cargarmodelo (event : any) {
    var output = document.getElementById('output') as HTMLImageElement;
    let file2:File = event.target.files[0];
    //console.log(event.target.files);
    if (file2) {
      this.fileName = file2.name;
      this.modelfile=new File ([file2],file2.name);
      file2.text().then(r => {
        //console.log(r);
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
          console.log(res);
          this.uidNuevaEscena = res['escena']['uid'];
           //SUBIR IMAGEN Y ASIGNAR
          console.log('uid var this : ',this.uidNuevaEscena);
          console.log(res['escena']['uid']);
          var reader = new FileReader();

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

       //SUBIR ARCHIVO MODELO Y ASIGNAR
       var reader2 = new FileReader();

       reader2.onloadend = () =>{
       // se va a cargar la imagen
       console.log(reader2.result);
         this.escenaService.subirModeloModelo(this.uidNuevaEscena,model,reader2.result).subscribe({
           next:(res : any)=>{
             console.log(res);
           }, error: (err)=>{
             console.log(err);
           }
         });
       }
       reader2.readAsDataURL(this.modelfile);
     /*   this.escenaService.subirModeloModelo(this.uidNuevaEscena,model,this.modelfile).subscribe({
        next:(res : any)=>{
          console.log(res);
        }, error: (err)=>{
          console.log(err);
        }
      }); */


       this.router.navigateByUrl('/');
        }, error: (err)=>{
          console.log(err);
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
