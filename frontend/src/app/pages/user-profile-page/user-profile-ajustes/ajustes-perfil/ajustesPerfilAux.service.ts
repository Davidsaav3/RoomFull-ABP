import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class AjustesPerfilAuxService {

  private messageSource = new BehaviorSubject('none');
  private messageSource2 = new BehaviorSubject('none');
  private messageSource3 = new BehaviorSubject('none');
  private messageSource4 = new BehaviorSubject('none');
  private messageSource5 = new BehaviorSubject('none');



  currentMessage = this.messageSource.asObservable();
  currentMessage2 = this.messageSource2.asObservable();
  currentMessage3 = this.messageSource3.asObservable();
  currentMessage4 = this.messageSource4.asObservable();
  currentMessage5 = this.messageSource5.asObservable();





  constructor() { }

  changeMessage(message: any) {
    this.messageSource.next(message)
  }

  changeMessage2(message: any) {
    this.messageSource2.next(message)
  }

  changeMessage3(message: any) {
    this.messageSource3.next(message)
  }


  changeMessage4(message: any) {
    this.messageSource4.next(message)
  }

  changeMessage5(message: any) {
    this.messageSource5.next(message)
  }
}
