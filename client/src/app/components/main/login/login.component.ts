import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { EmitLoggedService } from '../../../emit-logged.service';
import swal from 'sweetalert2';
import { CartService } from '../../../services/cart.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith,map} from 'rxjs/operators';
import { Router } from '@angular/router';

export interface City {
  flag: string;
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  logged:any = null; 
  panel:boolean= true;
  userLogin:any = {
    email: '',
    password: ''
  }
  userRegister:any = {
    email: '',
    password: '',
    password1: '',
    firstName: '',
    lastName: '',
    city: '',
    street: ''
  }
  userOrders:any =[];
  cartStatus:string = null;
  cityCtrl: FormControl = new FormControl();
  filteredCites: Observable<any[]>;

  constructor(private user:UsersService,private router: Router,private cart: CartService,private emitLogged:EmitLoggedService) {
    this.logged = this.user.logged;
    this.emitLogged.configObservable.subscribe(userStatus => {
      if(userStatus){
        if(this.logged.user.level==2){
          this.router.navigate(['/shopping']);
        }
        this.ngOnInit();
        this.userLogin.email = '';
        this.userLogin.password = '';
        this.userRegister.email = '',
        this.userRegister.firstName = '',
        this.userRegister.lastName = '',
        this.userRegister.city = '',
        this.userRegister.street = '',
        this.userRegister.password = '',
        this.userRegister.password1 = ''
        swal({
          position: 'top-end',
          type: 'success',
          title: 'Successful Login',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  ngOnInit() {
    this.user.getUser().subscribe(
      result=>{
        this.userOrders = result.orders.length;
      }
    )
    this.getBtnText();
  }

  filterCites(name: string) {
    return this.cities.filter(city =>
      city.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  getBtnText(){
    if(this.logged){
      if(this.logged.user.level == 2){
        this.cartStatus = "Add / Update Products"
      }else{
        if(this.logged.token){
          this.cart.getCart().subscribe(
            result => {
              if(result.active){
                this.cartStatus = 'Resume Shopping';
              }
            },
            error=>{
              this.cartStatus = 'Start Shopping';
            }
          )
        }
      }
    }
  }


  doRegister({value,valid}){
    if(valid){
      if(value.password == value.password1){
        this.user.register(this.userRegister);
      }else{
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Passwords do not match',
          timer: 1500
        })
      }
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields',
        timer: 1500
      })
    }
  }


  doLogin({value,valid}){
    if(valid){
      this.user.login(value.email,value.password);
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields',
        timer: 1500
      })
    }
  }

  tabChanged(e){
    if(e.index == 0){
      this.userRegister.email = '',
      this.userRegister.firstName = '',
      this.userRegister.lastName = '',
      this.userRegister.city = '',
      this.userRegister.street = '',
      this.userRegister.password = '',
      this.userRegister.password1 = ''
    }
    else{
      this.userLogin.email = '';
      this.userLogin.password = '';
      this.filteredCites = this.cityCtrl.valueChanges
        .pipe(
          startWith(''),
          map(city => city ? this.filterCites(city) : this.cities.slice())
        );
    }
  }

  cities: City[] = [
    {
      name: 'Tel aviv',
      flag: 'Tel_Aviv.svg.png'
    },
    {
      name: 'Rishon leZion',
      flag: 'Rishon_leZion.svg.png'
    },
    {
      name: 'Jerusalem',
      flag: 'Jerusalem.svg.png'
    },
    {
      name: 'Petah Tiqua',
      flag: 'Petah_Tiqua.jpg'
    },
    {
      name: 'Haifa',
      flag: 'Haifa.svg.png'
    },
    {
      name: 'Ashdod',
      flag: 'ashdod.png'
    },
    {
      name: 'Netanya',
      flag: 'Netanya.png'
    },
    {
      name: 'Beer Sheva',
      flag: 'Beer_Sheva.svg.png'
    },
    {
      name: 'Holon',
      flag: 'Holon.svg.png'
    },
    {
      name: 'Bnei Brak',
      flag: 'Bnei_Brak.svg.png'
    },
    {
      name: 'Ramat Gan',
      flag: 'Ramat_Gan.svg.png'
    },
    {
      name: 'Kfar Yona',
      flag: 'Kfar_Yona.png'
    },
    {
      name: 'Kfar Saba',
      flag: 'Kfar_Saba.svg.png'
    },
    {
      name: 'Ness Ziona',
      flag: 'Ness_Ziona.svg.png'
    },
    {
      name: 'Herzliya',
      flag: 'Herzliya.svg.png'
    },
    {
      name: 'Raanana',
      flag: 'Raanana.svg.png'
    }
  ];


}