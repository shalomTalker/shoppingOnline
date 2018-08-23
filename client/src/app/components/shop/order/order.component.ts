import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { OrderService } from '../../../services/order.service';
import swal from 'sweetalert2';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
              {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},],
})

export class OrderComponent implements OnInit {
  date = new FormControl(moment());
  products: any = [];
  loading:boolean = false;
  totalPrice:number = 0;
  orderForm:any = {
    city: '',
    street: '',
    date: null,
    creditCard: '',
  }
  allDates:any = []
  minDate = new Date();
  dateFilter = (d) => {
    let invalid = 0; 
    let ret = true;
    let day = d._d.getDay();
    for(let all of this.allDates){
      if(all.month == d._i.month+1 && all.date == d._i.date && all.year == d._i.year){
        invalid++;
      }
    }
    if(day == 5 || day == 6 || invalid>=3){
      ret = false;
    }
    return ret;
  }
  constructor(private cart: CartService,private order: OrderService, private user: UsersService, private router:Router) {}
  ngOnInit() {
    this.loading = true;
    this.cart.getCart().subscribe(
      result=>{
        if(result.cart.products.length > 0 && result.active){
          this.products = result.cart.products;
          this.totalPrice = result.cart.totalPrice;
        }else{
          this.router.navigate(['shopping']); 
        }
        this.loading = false;
      },
      error =>{
        this.router.navigate(['shopping']); 
        this.loading = false;
      }
    )
    this.user.getUser().subscribe(
      result => {
        this.orderForm.street = result.street
        this.orderForm.city = result.city
      }
    )
    this.order.getAllShippingDates().subscribe(
      result=>{
        this.allDates = result;
      }
    )
  }

  doOrder({value,valid}){
    if(valid){
      try{
        let tomorrow:any = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if(this.orderForm.date === null || this.orderForm.city === null || this.orderForm.street === null || this.orderForm.creditCard === null){
          throw "Please fill in all required fields"
        };
        if(this.orderForm.date._d < tomorrow){
          throw "You can choose a date only two days ahead"
        }
        if(!(/^(?:(5[1-5]\d{14})|(4\d{12}(\d{3})?)|(3[47]\d{13})|(6011\d{14})|((30[0-5]|36\d|38\d)\d{11}))$/.test(this.orderForm.creditCard))){
          throw "Invalid credit card"
        }
        this.order.createOrder(this.orderForm).subscribe(
          result=>{
            let order = result;
            swal({
              type: 'success',
              title: 'Thank for you your order!',
              text: `Your order ID #${result._id}`,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Download order'
            }).then((result) => {
              if (result.value) {
                swal(
                  'Downloading!',
                  'Downloading your order...',
                  'success'
                )
                this.router.navigate(['/order', order._id]);
              }else{
                swal(
                  'For Your Information',
                  'You can download your order any time on settings.',
                  'info'
                )
                this.router.navigate(['']);
              }
            })
          }
        )
      }
      catch(e){
        swal({
          type: 'error',
          title: 'Oops...',
          text: e,
          timer: 3000
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
  

}
