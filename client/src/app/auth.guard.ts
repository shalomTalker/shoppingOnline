import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsersService } from './services/users.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private user: UsersService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    // console.log('guarded route:',next.routeConfig.path);   
    // console.log('route data:',next.data);
    // console.log('user level:',this.user.level);
    if(next.data) {
      if(next.data.minLevelAllowed) {
        if( this.user.level < next.data.minLevelAllowed ) {
          this.router.navigate(['/']);
        }
      }
      else if(next.data.redirectAdmin && this.user.level==2){
        this.router.navigate([next.data.redirectAdmin]);
      }
    }
    return true;
  }
}