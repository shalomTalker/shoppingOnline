import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { EmitLoggedService }   from '../../../emit-logged.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-generalinfo',
  templateUrl: './generalinfo.component.html',
  styleUrls: ['./generalinfo.component.css']
})
export class GeneralinfoComponent implements OnInit {
  productsLength:number;
  orders:number;
  cartCreate:string;
  logged:any = null; 
  lastOrder:string = null;
  
  constructor(private user:UsersService,private order: OrderService, private products:ProductsService,private cart:CartService, private emitLogged:EmitLoggedService ) {
    this.logged = this.user.logged;
    //Listens to changes when user logs in / disconnects
    this.emitLogged.configObservable.subscribe(userStatus => {
      if(userStatus){
        this.getCart();
        this.getLastOrder();
      }else{
        this.cartCreate = null;
        this.lastOrder = null;
      }
    })
    this.getCart();
    this.getLastOrder();
  }

  ngOnInit() {
    this.products.getProducts().subscribe(
      result => {
        this.productsLength = result.length;
      }
    )
    this.order.getNumberOfOrders().subscribe(
      result =>{
        this.orders = result;
      }
    )


  }

  getCart(){
    if(this.logged.token){
      this.cart.getCart().subscribe(
        result => {
          if(result.active){
            this.cartCreate = result.cart.timeStamp
          }else{
            this.cartCreate = null;
          }
        }
      )
    }
  }

  getLastOrder(){
    if(this.logged.token){
      this.user.getUser().subscribe(
        result=>{
          if(result.orders.length > 0){
            this.lastOrder = result.orders[result.orders.length-1].date;
          }
        }
      )
    }
  }

}
