import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class LoginAuxService {

  private messageSource = new BehaviorSubject('none');

  currentMessage = this.messageSource.asObservable();


  constructor() { }

  changeMessage(message: any) {
    this.messageSource.next(message)
  }
}
