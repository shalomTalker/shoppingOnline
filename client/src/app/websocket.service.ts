import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
 private socket;
 constructor() { }
 connect(): Rx.Subject<MessageEvent> {
   this.socket = io(environment.ws_url); //http://localhost:4000
   let observable = new Observable(observer => {
       this.socket.on('dataSend', (data) => {
         observer.next(data);
       })
       return () => {
         this.socket.disconnect();
       }
   });
   let observer = {
       next: (data: Object) => {
           this.socket.emit('dataSend', data);
       },
   };
   return Rx.Subject.create(observer, observable);
 }
}
