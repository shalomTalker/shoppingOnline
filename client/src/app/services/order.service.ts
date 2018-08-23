import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderEndpoint = 'http://localhost:3000/order';

  constructor(private http: HttpClient, private router: Router) { }

  createOrder(orderObj){
    return this.http.post< any >(`${this.orderEndpoint}`,{
      year: orderObj.date._i.year,
      month: orderObj.date._i.month,
      date: orderObj.date._i.date,
      creditCard: orderObj.creditCard,
      city: orderObj.city,
      street: orderObj.street
    })
  }

  getAllShippingDates(){
    return this.http.get< any >(`${this.orderEndpoint}/dates`)
  }

  getOrder(id){
    return this.http.get< any >(`${this.orderEndpoint}/${id}`);
  }

  getAllOrders(){
    return this.http.get< any >(`${this.orderEndpoint}`);
  }

  getNumberOfOrders(){
    return this.http.get< any >(`${this.orderEndpoint}/ordersCount`);
  }

}