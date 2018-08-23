import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith,map} from 'rxjs/operators';
import { UsersService } from '../../../services/users.service';
import swal from 'sweetalert2';

export interface City {
  flag: string;
  name: string;
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettings implements OnInit {
  userEdit:any = {
    email: '',
    password: '',
    password1: '',
    firstName: '',
    lastName: '',
    city: '',
    street: ''
  }
  hide:boolean = false;
  hide1:boolean = false;
  userOrderList:any = [];
  logged: any=[]
  cityCtrl: FormControl = new FormControl();
  filteredCites: Observable<any[]>;
  constructor(private user:UsersService) { }

  ngOnInit() {
    this.logged = this.user.logged;
    this.user.getUser().subscribe(
      result=>{
        this.userEdit.email = result.email;
        this.userEdit.firstName = result.firstName;
        this.userEdit.lastName = result.lastName;
        this.userEdit.city = result.city;
        this.userEdit.street = result.street;
        this.userOrderList = result.orders.slice().reverse();
      }
    )
    this.filteredCites = this.cityCtrl.valueChanges
    .pipe(
      startWith(''),
      map(city => city ? this.filterCites(city) : this.cities.slice())
    );
  }
  filterCites(name: string) {
    return this.cities.filter(city =>
      city.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  doUserProfile({valid,value}){
    try{
      if(value.password != value.password1){
        throw "Password fields must match"
      }
      this.user.updateUser(value).subscribe(
        result => {
          this.user.setLogged(result,null,true);
          swal('Update User',`Your User Updated`,'success');
        },
        err=>{
          swal({
            type: 'error',
            title: 'Oops...',
            text: err.error,
            timer: 3000
          })
        }
      )

    }catch(e){
      swal({
        type: 'error',
        title: 'Oops...',
        text: e,
        timer: 3000
      })
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
