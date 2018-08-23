import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service'
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketDataService {

  data: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.data = <Subject<any>>wsService
      .connect()
      
   }

  sendMsg(msg){
    this.data.next(msg);
  }
}
