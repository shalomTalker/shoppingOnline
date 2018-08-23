import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { UsersService } from './services/users.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{

  constructor( private users: UsersService) {}
  intercept(req,next) { 
    if(this.users.token)  {
      let tokenizedHeader = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.users.token}`
        }
      });
      return next.handle(tokenizedHeader);      
    }
    else {
      return next.handle(req);
    }      
  }

}
