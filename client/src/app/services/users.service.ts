import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EmitLoggedService }   from '../emit-logged.service';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  loginmsg:any = {
    text: null
  }
 
  logged:any = {
    token: null,
    user: {
      level: null,
      name: null
    }
  }
  
  private usersEndpoint = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router,private emitLogged: EmitLoggedService) { 
    let _sess = localStorage.getItem('_sess');
    let date = new Date();
    if(_sess) {
      _sess = JSON.parse(_sess);
      this.setLogged(_sess);
      //check if token is expired
      if(this.getTokenExpirationDate(_sess) < date){
        this.doLogout();
      };
    }
  }

  //Checking the date of the token
  getTokenExpirationDate(token): Date {
    if(token.token === null) return null;
    const decoded = jwt_decode(token.token);
    if (decoded.exp === undefined) return null;
    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  login(email,password) {
    this.http.post< any >(`${this.usersEndpoint}/login`,{
      email: email.toLowerCase(),
      password: password
    }).subscribe(
      result => {
        if(result && result.token) {
          this.setLogged(result,null,true);
        }
        else {
          this.setLogged({
            token: null,
            user: {
              level: null,
              name: null
            }
          },'Invalid Login',true);
        }        
      },
      err => {
        this.setLogged({
          token: null,
          user: {
            level: null,
            name: null
          }
        },'Server Error',true);
      }
    );
  }

  register(objRegister){
    return this.http.post< any >(`${this.usersEndpoint}`,{
      email: objRegister.email.toLowerCase(),
      password: objRegister.password,
      firstName: objRegister.firstName,
      lastName: objRegister.lastName,
      street: objRegister.street,
      city: objRegister.city
    }).subscribe(
      result => {
        if(result && result.token) {
          this.setLogged(result,null,true);
          this.router.navigate(['/']);
        }
        else {
          this.setLogged({
            token: null,
            user: {
              level: null,
              name: null
            }
          },'Invalid Login',true);
        }        
      },
      err => {
        this.setLogged({
          token: null,
          user: {
            level: null,
            name: null
          }
        },err,true);
      }
    );
  }

  setLogged(obj,notice=null,doStore=false) {
    this.logged.token = obj.token;
    this.logged.user = obj.user;
    if(notice != null){
      Swal({
        type: 'error',
        title: 'Oops...',
        text: notice.error != null ? notice.error : notice,
        timer: 4000
      })
    }
    if(doStore) {
      localStorage.setItem('_sess',JSON.stringify(obj));
    }
    if(obj.token != null){
      this.emitLogged.emitConfig(true);
    }else{
      this.emitLogged.emitConfig(false);
    }
  }


  doLogout() {
    this.setLogged({
      token: null,
      user: {
        level: null,
        name: null
      }
    },null,true);
    this.router.navigate(['/']);
  }

  getUser(id=null){
    if(id==null){
      return this.http.get< any >(`${this.usersEndpoint}/${this.logged.user.id}`);
    }else{
      return this.http.get< any >(`${this.usersEndpoint}/${id}`);
    }
  }
  
  updateUser(objEdit,id=null){
    if(id==null){
      return this.http.put< any >(`${this.usersEndpoint}/${this.logged.user.id}`,{
        email: objEdit.email,
        firstName: objEdit.firstName,
        lastName: objEdit.lastName,
        city: objEdit.city,
        street: objEdit.street,
        password: objEdit.password
      })
    }else{
      return this.http.put< any >(`${this.usersEndpoint}/${id}`,{
        email: objEdit.email,
        firstName: objEdit.firstName,
        lastName: objEdit.lastName,
        city: objEdit.city,
        street: objEdit.street,
        password: objEdit.password
      });
    }
  }

  get token() {
    return this.logged.token ? this.logged.token : 'User not logged';
  }

  get level(){
    return this.logged.user.level ? this.logged.user.level : 'User not logged';
  }

  getAllUsers(){
    return this.http.get< any >(`${this.usersEndpoint}`)
  }
  
}
