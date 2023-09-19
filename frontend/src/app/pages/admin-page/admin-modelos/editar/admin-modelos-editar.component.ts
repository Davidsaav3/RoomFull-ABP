import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { DataService2 } from '../../../modelos/editar-modelo/data2.service';
import { subirModelForm } from 'src/app/interfaces/subir-model-form.interface';
import { FormGroup ,FormBuilder, Validators } from '@angular/forms';
import { EscenaService } from 'src/app/services/escena.service';
import { Escena } from '../../../../models/escena.model';
import { Router, ActivatedRoute } from '@angular/router';
import { check } from 'express-validator';
import { json } from 'express';

@Component({
  selector: 'app-admin-modelos-editar',
  templateUrl: './admin-modelos-editar.component.html',
  styleUrls: ['./admin-modelos-editar.component.css']
})

export class AdminModelosEditarComponent implements OnInit {
  public subirModelForm = this.fb.group({
    title:['', Validators.compose([Validators.required])  ],
    description: ['', Validators.required ],
    image: ['', Validators.required ],
    model: ['', Validators.required ],
    public: [false]
  });


  usuario: any;
  imagenUsu: any;
  fechastr: string;
  descripcion: any;
  titulo: any;
  nguardados: any;
  nvaloraciones: any;
  nvisitas: any;
  liked: any;
  saved: any;
  modeloModelo: any;

  @Output() messageEvent = new EventEmitter<string>();

  old_name_model : string = '';
  old_name_image : string = '';


  firstValidation = false;

  fileName :string = '';

  modelcontent = '';

  modelfile : any;

  imageName='';

  imagecontent:any;

  imagefile:File;

  idEscena : any;

  cambiosSinGuardar:boolean = false;

  private modeloCambiado: boolean = false; // Si ha cambiado el modelo subido
  private imagenCambiado: boolean = false; // Si ha cambiado la imagen subida
  private datosCambiado : boolean = false; // Si han cambiado los datos

  constructor(private http: HttpClient, private data:DataService2,private fb: FormBuilder, private escenaService : EscenaService, private router: Router, private actRoute: ActivatedRoute) {
    this.data.currentMessage.subscribe(message => this.modelcontent = message);

    this.idEscena = actRoute.snapshot.params['id'];
    this.idEscena = this.router.routerState.snapshot.url.split('/')[4];

  }

  ngOnInit(): void {
    this.cargarDatosModelo();
  }

  cargarDatosModelo(){
    var output = document.getElementById('output') as HTMLImageElement;
    var checkPublico = document.getElementById('flexSwitchCheckChecked') as HTMLInputElement;

    this.escenaService.cargarEscena(this.idEscena).subscribe({
      next:((res : any)=>{
        console.log(res);

        var fecha = new Date(Date.parse(res['escenas']['fecha']));
        this.usuario = res['escenas']['creadorID']['nombreUsuario'];
        if(output){
          //console.log(file2);

          //console.log(this.imagefile);
          output.src =  '../../../../assets/uploads/imagenEscena/' + res['escenas']['imagen'];
          this.imageName =  res['escenas']['imagen'];
          this.old_name_image = res['escenas']['imagen'];
        }

        this.fileName = res['escenas']['modelo'];
        this.old_name_model = res['escenas']['modelo'];

        if(checkPublico){
          checkPublico.checked = !res['escenas']['privado'];
        }

        this.imagenUsu = res['escenas']['creadorID']['imagen'];
        this.fechastr = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        this.descripcion = res['escenas']['descripcion'];
        this.titulo = res['escenas']['nombre'];
        this.nguardados = res['escenas']['NGuardados'];
        this.nvaloraciones = res['escenas']['NValoraciones'];
        this.nvisitas = res['escenas']['NVisitas'];
        this.liked=res['liked'];
        this.saved=res['saved'];
        this.modeloModelo = res['escenas']['modelo'];

        this.subirModelForm.controls.title.setValue(this.titulo);
        this.subirModelForm.controls.description.setValue(this.descripcion);
      })
    });
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

      this.imagenCambiado = true;
      this.cambiosSinGuardar=true;
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
        this.modeloCambiado=true;
        this.cambiosSinGuardar=true;
      })
    }
  }

  cambiadatos(){
    this.datosCambiado = true;
    this.cambiosSinGuardar=true;
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

      if(this.datosCambiado){
        //cambian los datos del moelo
        const escenaUpdate = {
          nombre:title,
          descripcion : desc,
          privado: !priv
        }
        this.escenaService.editarDatosModelo(escenaUpdate, this.idEscena).subscribe({
          next: (res:any) =>{
            console.log(res);
          }
        })
      }

      if(this.modeloCambiado){
        //eliminar modelo anterior
        this.escenaService.retirarArchivoAntiguo(this.old_name_model,'escena').subscribe({
          next: (res:any)=>{
            console.log(res);
          }
        });

        //subir nuevo modelo
        this.modelfile.text().then((value:string)=>{
          this.escenaService.subirModeloModelo(this.idEscena,model,value).subscribe({
            next:(res : any)=>{
              console.log(res);
            }, error: (err)=>{
              console.log(err);
            }
          });
        })
      }

      if(this.imagenCambiado){
        //eliminar imagen anterior
        this.escenaService.retirarArchivoAntiguo(this.old_name_image,'imagenEscena').subscribe({
          next: (res:any)=>{
            console.log(res);
          }
        });
        //subir nueva imagen
        var reader = new FileReader();
        reader.onloadend = () =>{
          // se va a cargar la imagen
          this.escenaService.subirImagenModelo(this.idEscena,imag,reader.result).subscribe({
            next:(res : any)=>{
              console.log(res);
            }, error: (err)=>{
              console.log(err);
            }
          });
        }
        reader.readAsDataURL(this.imagefile);
      }
    }

    this.router.navigateByUrl('admin/administracion/modelos');
  }

  checkForm(){

    let validForm = true;

    for (const field in this.subirModelForm.controls) { // 'field' is a string
      const control = this.subirModelForm.get(field);
      if(!control?.valid && field!='image' && field!='model'){
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


