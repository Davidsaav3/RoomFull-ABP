import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Engine2Service } from './engine2.service';
import * as glMatrix from 'gl-matrix';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EscenaService } from '../../../services/escena.service';
import { LoadingService } from '../../../services/loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-engine2',
  templateUrl: './engine2.component.html',
  styleUrls: ['./engine2.component.css']
})
export class Engine2Component implements OnInit {
  newForm = this.fb.group({
    sel:['']
  });


  @Input() modeloacargar : string;
  @Input() pagina : string; //Para el tamaño: landing, subir, normal, privado

  modelo: string;
  token: string;

  cameraSpeed = 20;

  puntos : Array<string> =  [];

  constructor(private eng2Serv : Engine2Service, private httpClient : HttpClient, private fb: FormBuilder, private escenaService : EscenaService, public loadingService:LoadingService) {



   }

  async ngOnInit(): Promise<void> {


    console.log(this.pagina)
    this.eng2Serv.pagina = this.pagina;



    await this.loadingService.startLoading();
    this.eng2Serv.createScene( document.getElementById('renderCanvas') as HTMLCanvasElement);
    console.log(this.modeloacargar);

    this.token = localStorage.getItem('token') || '';

    if (this.token){
      this.escenaService.cargarEscena(this.modeloacargar).subscribe({
        next:(async (res : any)=>{
          this.modelo = res['escenas']['modelo'];

          await this.eng2Serv.addGLTF2Scene(this.modelo);

          await this.eng2Serv.run();
          this.eng2Serv.printScene();
          await this.loadingService.stopLoading();
        })
      });

    }
    else {
      this.escenaService.cargarEscenaNoToken(this.modeloacargar).subscribe({
        next:(async (res : any)=>{
          this.modelo = res['escenas']['modelo'];

          await this.eng2Serv.addGLTF2Scene(this.modelo);

          await this.eng2Serv.run();
          this.eng2Serv.printScene();
          await this.loadingService.stopLoading();
        })
      });

    }


    window.addEventListener("resize", (event) => {
      this.eng2Serv.resize();
    });

  }

  getpuntos(){
    this.puntos = this.eng2Serv.getpuntos();
  }

  anadirpunto(){
    this.eng2Serv.anadirpunto();
    this.puntos = this.eng2Serv.getpuntos();
  }

  iralpunto(aux : any){

    if(aux!=''){
      this.eng2Serv.iralpunto(Number(aux))
    }
  }

  cambiaVelocidad(aux){
    this.cameraSpeed = aux.target.value;
    this.eng2Serv.cambiaVelocidad(aux.target.value);
  }

  add(){
     this.eng2Serv.addGLTF2Scene(this.modelo);
  }

}
