import { Component,EventEmitter,OnInit, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  @Input() categoryInfo:any = [];
  @Input() products:any;
  @Output() btnUpdate = new EventEmitter<any>();
  @Output() doUpdateItemEmit = new EventEmitter<any>();
  @Output() removeFromCart = new EventEmitter<any>();
  productsCatrgory:any =[];
  constructor() {}
  ngOnChanges(e: SimpleChanges): void {
    if(e.products){
      this.ngOnInit()
    }
  }
  ngOnInit() {
    let productC = [];
    for(let p of this.products){
      if(this.categoryInfo._id == p.product.category._id){
        productC.push(p);
        }
      }
     this.productsCatrgory = productC;
  }

  doUpdateItem(amount:any,product,e){
    e.stopPropagation();
    amount = amount*1;
    if(!isNaN(amount)){
      if(amount < 1 ){
        this.removeFromCart.emit(product._id);
      }else{
        if(!product.kg){
          amount = amount.toFixed(0)
        }
        this.doUpdateItemEmit.emit({amount,product})
      }
      for(let p of this.products){
        p.update = false;
      }
    }
  }

  changeValue(boolean,id,e){
    if(boolean == 'Specific'){
      let value:any = e*1;
      if(!isNaN(value)){
        for(let i=0;i<this.products.length;i++){
          if(this.products[i].product._id == id){
            if(!this.products[i].product.kg){
              value = value.toFixed(0);
            }
            this.products[i].amount = value;
            i = this.products.length - 1;
            }
          }
          this.btnUpdate.emit(id)
      }
    }else{
      e.stopPropagation();
      if(boolean){
        for(let i=0;i<this.products.length;i++){
          if(this.products[i].product._id == id){
            this.products[i].amount = this.products[i].amount*1;
            this.products[i].amount = this.products[i].product.kg ? this.products[i].amount + 0.5 : this.products[i].amount + 1
            i = this.products.length - 1;
          }
        }
        this.btnUpdate.emit(id);
      }else{
        for(let i=0;i<this.products.length;i++){
          if(this.products[i].product._id == id){
            if(this.products[i].amount > 1){
              this.products[i].amount = this.products[i].amount*1;
              this.products[i].amount = this.products[i].product.kg ? this.products[i].amount - 0.5 : this.products[i].amount - 1
              i = this.products.length - 1;
              this.btnUpdate.emit(id);
            }
            else{
              this.removeFromCart.emit(id);
            }
          }
        }
      }
    }
  }
  

}
