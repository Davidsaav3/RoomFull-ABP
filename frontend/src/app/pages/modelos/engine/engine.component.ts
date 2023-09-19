import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import {EngineService} from './engine.service';
import { Subscription } from 'rxjs';
import { UiEventsService } from '../ui/uiEvents.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls:['../modelo-engine-general.css','../modelo-normal-page/modelo-normal-page.component.css','../modelo-privado-page/modelo-privado-page.component.css']
})
export class EngineComponent implements OnInit,OnChanges, OnDestroy {
  @Input() detalles:any;

  @Input() landing:any;

  @Input() modeloacargar:string;

  @Input() page : string; // landing || subirM || verM || privM

  @Output() cargadoComp: EventEmitter<any> = new EventEmitter();
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService, private uiEventsService: UiEventsService) {
    // Eventos del ui

    this.uiEventsService.autoRotateCurrent.subscribe(message => {

      console.log(message)
      this.engServ.cambiarAutorrotate(message);

    });

  }

  public ngOnInit(): void {

    if(this.landing === "true"){
      const canvasE = document.getElementById('renderCanvas');
      if (canvasE){
        this.engServ.cambiarAlpha(true);
        canvasE.style.maxWidth='100%';
        canvasE.style.maxHeight='25em';

      }
    }

    if(this.detalles === "true"){
      const canvasE = document.getElementById('renderCanvas');
      if (canvasE){
        canvasE.style.maxWidth='45vw';
        canvasE.style.maxHeight='45vh';

      }
    }

    this.engServ.state = this.page;

    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();

    this.engServ.cargado.subscribe(next => {
      this.cargadoComp.emit();
    } )


  }

  ngOnDestroy(): void {
      this.engServ.pararAnimacion();
  }

  ngOnChanges(){
    if(this.modeloacargar!='')
    this.engServ.cargarObjetoPath(this.modeloacargar);

  }

  public cargarobjeto(obejo:Event){
    console.log(obejo);
    // this.engServ.cargarobjeto(obejo);
  }

}
