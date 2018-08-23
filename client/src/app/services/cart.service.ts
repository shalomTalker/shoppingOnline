import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartEndpoint = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private router: Router) { }

  getCart() {
    return this.http.get< any >(`${this.cartEndpoint}`);
  }

  createCart(){
    return this.http.get< any >(`${this.cartEndpoint}/create`);
  }
  removeFromCart(id){
    return this.http.delete< any >(`${this.cartEndpoint}/${id}`)
  }

  addItem(pid,amount){
    return this.http.post< any >(`${this.cartEndpoint}`,{
      productID: pid,
      amount: amount
    })
  }

}
