import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsEndpoint = 'http://localhost:3000/products';

  constructor(private http: HttpClient, private router: Router) { }

  //categories

  getCategory(id:any = null){
    let server = `${this.productsEndpoint}/category`;
    if(id) {
      server += `/${id}`; 
    }
    return this.http.get< any >(server);
  }

  addCategory(name){
    return this.http.post< any >(`${this.productsEndpoint}/category`,{
      name:name
    })
  }

  editCategory(id,name){
    return this.http.put< any >(`${this.productsEndpoint}/category/${id}`,{
      name: name
    })
  }


  //products
  getProducts() {
    return this.http.get< any >(`${this.productsEndpoint}`);
  }

  searchProduct(search){
    return this.http.post< any >(`${this.productsEndpoint}/search`,{
      search: search
    });
  }

  addProduct(obj){
    return this.http.post< any >(`${this.productsEndpoint}`,{
      name: obj.name,
      category: obj.category,
      price: obj.price,
      image: obj.image,
      kg: obj.kg
    })
  }
  updateProduct(id,obj){
    return this.http.put< any >(`${this.productsEndpoint}/${id}`,{
      name: obj.name,
      category: obj.category,
      price: obj.price,
      image: obj.image,
      kg: obj.kg
    })
  }

}
