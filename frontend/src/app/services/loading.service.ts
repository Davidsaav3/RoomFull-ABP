import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'
})

export class LoadingService {
  private _isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() { }

  get isLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  public async startLoading(): Promise<void> {
    this._isLoading.next(true);
  }

  public async stopLoading(): Promise<void> {
    this._isLoading.next(false);
  }
  //Método para lanzamiento manual de modal
  public toggleLoading(): void {
    let toggle = !this._isLoading.getValue();
    this._isLoading.next(toggle);
  }
}
