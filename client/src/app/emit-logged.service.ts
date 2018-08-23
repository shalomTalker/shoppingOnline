import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitLoggedService {

  constructor() { }
  public configObservable = new Subject<number>();

  emitConfig(val) {
    this.configObservable.next(val);
  }
}
