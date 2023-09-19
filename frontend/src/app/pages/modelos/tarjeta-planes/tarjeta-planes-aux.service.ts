import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class TarjetaAuxService {

  private messageSource = new BehaviorSubject('none');
  private messageSource2 = new BehaviorSubject('none');

  currentMessage = this.messageSource.asObservable();
  currentMessage2 = this.messageSource2.asObservable();


  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeMessage2(message: string) {
    this.messageSource2.next(message)
  }


}
