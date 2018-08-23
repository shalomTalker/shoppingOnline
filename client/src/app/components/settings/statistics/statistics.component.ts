import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class Statistics implements OnInit {
  users:any = [];
  orders:any = [];
  products:any = [];
  loading:boolean = false;
  logged:any;

  barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false

  };

  barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];
  barChartType:string = 'bar';
  barChartLegend:boolean = true;


  salesCategories:any = [];
  ProfitMonth:any = [];


  constructor(private user:UsersService, private router: Router,private product:ProductsService,private order:OrderService) {}
  
  ngOnInit() {
    this.logged = this.user.logged;
    if(!this.logged){
      this.router.navigate([''])
    }
    this.loading = true;

    this.order.getAllOrders().subscribe(
      result=>{
        this.orders = result;
        this.orders.sort(this.sortArrayByName);
        let date:any;
        let now = new Date();
        let shippingDate:string = '';
        for(let o of this.orders){
          shippingDate = `${o.shippingDate[0].year}/${o.shippingDate[0].month}/${o.shippingDate[0].date}`;
          date = new Date(shippingDate);
          if (date < now) {
            o.end = true;
          }
        }
        this.SalesByCategories();
        this.ProfitByMonth();
        this.product.getProducts().subscribe(
          result=>{
            this.products = result.slice().reverse();
            this.user.getAllUsers().subscribe(
              result=>{
                this.users = result.slice().reverse();
                this.loading = false;
              }
            )
          }
        )
      }
    )
  }

  SalesByCategories(){
    let date = new Date();
    let year = date.getFullYear();
    this.product.getCategory().subscribe(
      result => {
        for(let i=0;i<result.length;i++){
          this.salesCategories[i] = {"data":[0,0,0,0,0,0,0,0,0,0,0,0] , "label": result[i].name};
        }
        for(let o of this.orders){
          if(o.shippingDate[0].year == year){
            let month = o.shippingDate[0].month - 1;
            for(let p of o.products){
              for(let c of this.salesCategories){
                if(c.label == p.product.category.name){
                  c.data[month] += p.amount;
                }
              }
            }
          }
        }
      }
    )
  }

  ProfitByMonth(){
  let date = new Date();
  let year = date.getFullYear();
  this.ProfitMonth[0] = {"data":[0,0,0,0,0,0,0,0,0,0,0,0] , "label": "cash"};
    for(let o of this.orders){
      if(o.shippingDate[0].year == year){
      let month = o.shippingDate[0].month - 1;
      for(let c of this.ProfitMonth){
        c.data[month] += o.totalPrice;
       }
      }
    }
  }
  
  sortArrayByName(a,b) {
    a =  `${a.shippingDate[0].year}/${a.shippingDate[0].month}/${a.shippingDate[0].date}`;
    b = `${b.shippingDate[0].year}/${b.shippingDate[0].month}/${b.shippingDate[0].date}`;
    if (a > b){
      return -1;
    }
    if (b > a){
      return 1;
    }  
    return 0;
  }

  

}
