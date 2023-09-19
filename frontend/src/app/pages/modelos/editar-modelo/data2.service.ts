import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class DataService2 {

  private messageSource = new BehaviorSubject('none');
  currentMessage = this.messageSource.asObservable();

  private messageSource2 = new BehaviorSubject('none');
  currentMessage2 = this.messageSource2.asObservable();

  private messageSource3 = new BehaviorSubject('none');
  currentMessage3 = this.messageSource3.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeMessage2(message: string) {
    this.messageSource2.next(message)
  }

  changeMessage3(message: string) {
    this.messageSource3.next(message)
  }

}
