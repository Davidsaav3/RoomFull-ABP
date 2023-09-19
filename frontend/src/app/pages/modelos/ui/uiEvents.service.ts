import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class UiEventsService {
  //autorrotate from engine
  private autoRotateSource = new BehaviorSubject(true);
  autoRotateCurrent = this.autoRotateSource.asObservable();

  //Like, guardar, etc para pdf
  private messageSource = new BehaviorSubject('none');
  currentMessage = this.messageSource.asObservable();

  private puntos = new BehaviorSubject([]);
  puntosCurrent = this.puntos.asObservable();

  private puntoAlQueIr = new BehaviorSubject(-1);
  puntoAlQueIrCurrent = this.puntoAlQueIr.asObservable();

  private puntoQueGuardar = new BehaviorSubject([]);
  puntoQueGuardarCurrent = this.puntoQueGuardar.asObservable();

  private puntoQueEliminar = new BehaviorSubject(-1);
  puntoQueEliminarCurrent = this.puntoQueEliminar.asObservable();

  private guardarPunto =  new BehaviorSubject(false);
  guardarPuntoCurrent = this.guardarPunto.asObservable();

  private hacerRecorrido = new BehaviorSubject(false);
  hacerRecorridoCurrent = this.hacerRecorrido.asObservable();

  private ambienteColor = new BehaviorSubject(1);
  colorAmbienteCurrent = this.ambienteColor.asObservable();

  private fondo = new BehaviorSubject(1);
  fondoCurrent = this.fondo.asObservable();

  constructor() { }

  changeAutorrotate(message: boolean) {
    this.autoRotateSource.next(message)
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changePuntos(puntos){
    this.puntos.next(puntos);
  }

  changePuntoAlQueIr(punto){
    this.puntoAlQueIr.next(punto);
  }

  changePuntoQueEliminar(punto){
    this.puntoQueEliminar.next(punto);
  }

  changePuntoQueGuardar(punto){
    this.puntoQueGuardar.next(punto);
  }

  changeGuardarPunto(bool){
    this.guardarPunto.next(bool);
  }

  changeHacerRecorrido(bool){
    this.hacerRecorrido.next(bool)
  }

  changeAmbientColor(valor){
    this.ambienteColor.next(valor)
  }

  changeFondo(valor){
    this.fondo.next(valor)
  }

}
