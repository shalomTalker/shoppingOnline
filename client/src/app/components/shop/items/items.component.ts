import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import swal from 'sweetalert2';
import { SocketDataService } from '../../../socket-data.service';
import { CartService } from '../../../services/cart.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @Input() updateForm: any;
  @Output() updateBtn = new EventEmitter<any>();

  productsList:any = [];
  categoryList:any = [];
  searchString:string='';
  userCart: any = [];
  indexCategory:number = null;
  loading: boolean = false;
  logged:any = null;

  constructor(private cart:CartService,private user:UsersService, private socket:SocketDataService,private products:ProductsService) { 
    this.logged = this.user.logged; 
  }

  ngOnInit() {
    this.loading = true;
    this.products.getCategory().subscribe(
      result =>{
        this.categoryList = result;
        this.loading = false;
      }
    )
    this.socket.data.subscribe(
      result => {
        if(result.data.type == "itemInCart"){
          this.userCart = result.data.object;
          if(this.indexCategory != null){
            this.getCategory();
          }
        }
        if(result.data.type == "updateAmount"){
          console.log('was here');
          this.addToCart(result.data.object.product,result.data.object.amount)
        }
    });
  }

  ngOnChanges(e){
    if(e.updateForm.currentValue){
      if(this.indexCategory != null){
        this.getCategory();
      }
    }
  }

  addToCart(product,amount){
    if(amount != 0 && !isNaN(amount) && amount > 0){
      amount = amount*1
      if(!product.kg){
        amount = amount.toFixed(0);
      }
      this.cart.addItem(product._id,amount).subscribe(
        result => {
          console.log(result);
          this.socket.sendMsg({
            "type": "addCart",
            "object": {"product":product, "amount":amount}
          });
        }
      );
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Missing Quantity',
        timer: 1500
      })
    }
  }

  getCategory(index=null){
    this.indexCategory = index != null ? index : this.indexCategory;
    this.products.getCategory(this.categoryList[this.indexCategory]._id).subscribe(
      result=>{
        this.productsList = result;
        //check if items exists on cart user
        for(let x=0;x<this.productsList.length;x++){
          for(let y=0;y<this.userCart.length;y++){
            if(this.userCart[y].product._id == this.productsList[x]._id){
              this.productsList[x]["inCart"] = true;
            }
          }
        }
      }
    )
  }

  search(){
    let search = this.searchString.trim();
    if(search != ''){
      this.products.searchProduct(search).subscribe(
        result=>{
          if(result){
          this.productsList = result;
          }else{
            swal({
              type: 'info',
              title: 'Not found',
              text: 'Product not found',
              timer: 1500
            })
          }
        }
      )
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Missing details',
        timer: 1500
      })
    }
  }

  //admin methods 
  updateProduct(p){
    //add date cuz if the user click on the same button the event "ngOnChange" is not called
    let date = Date.now()
    this.updateBtn.emit([p,date])
  }

  addCategory(c){
    let categoryName = c.trim();
    if(categoryName != ''){
      this.products.addCategory(categoryName).subscribe(
        result=>{
          this.categoryList.push(result);
          this.socket.sendMsg({
            "type": "updateCategory",
            "object": this.categoryList
          });
        },
        err =>{
          swal({
            type: 'error',
            title: 'Oops...',
            text: err.error,
            timer: 1500
          })    
        }
      )
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Missing details',
        timer: 1500
      })    
    }
  }

  editCategory(newName,c){
    let categoryName = newName.trim();
    if(categoryName != ''){
      this.products.editCategory(c._id,categoryName).subscribe(
        result=>{
          for(let f of this.categoryList){
            if(f._id == c._id){
              f.name = categoryName;
            }
          }
          this.socket.sendMsg({
            "type": "updateCategory",
            "object": this.categoryList
          });
        },
        err => {
          swal({
            type: 'error',
            title: 'Oops...',
            text: err.error,
            timer: 1500
          })   
        }
      )
    }else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Missing details',
        timer: 1500
      })    
    }
  }

}
