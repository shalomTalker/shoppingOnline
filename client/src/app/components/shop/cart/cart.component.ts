import {  Component,  OnInit,  EventEmitter, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService} from '../../../services/cart.service';
import { SocketDataService} from '../../../socket-data.service';
import { UsersService} from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';
import swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/products/upload';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  @ViewChild('uploadForm') uploadForm: ElementRef;
  @Input() updateBtn: any;
  @Output() updateForm = new EventEmitter<any>();
  uploader:FileUploader = new FileUploader({
    url: URL,
    authToken:'Bearer ' + this.user.token,
    allowedMimeType: ['image/jpeg', 'image/jpg', 'image/tiff', 'image/gif', 'image/bmp', 'image/png', 'image/bpg', 'image/svg']
  });
  logged: any = null;
  products: any = {};
  totalPrice: number = 0;
  newItem: any;
  loading: boolean = false;
  categoriesList: any = [];
  addProductObj:any = {
    name: '',
    category: '',
    price: '',
    image: false,
    kg: false
  }
  updateProductObj:any = {
    name: '',
    category: '',
    price: '',
    image: false,
    kg: false
  }
  addForm:boolean = true;

  constructor(private socket: SocketDataService,private router:Router,private product: ProductsService, private user: UsersService, private cart: CartService) {
    this.logged = this.user.logged;
    if(this.logged.token == null){
      this.router.navigate(['']);
    }
  }

  ngOnChanges(e) {
    //listener for change on input value from items component when the user click on "update product"
    if(e.updateBtn.currentValue){
      this.updateProduct(e.updateBtn.currentValue[0]);
    }
  }

  ngOnInit() {
    this.product.getCategory().subscribe(
      result=>{
        this.categoriesList = result;
      }
    )
    if (this.logged.user.level == 1) {
      this.loading = true;
      this.cart.createCart().subscribe(
        result => {
          this.products = result.cart.products;
          this.products.sort(this.sortArrayByName);
          for(let f of this.products){
            f.update = false;
          }
          this.totalPrice = result.total;
          this.loading = false;
          this.itemInCart();
        }
      )

      this.socket.data.subscribe(result => {
        if (result.data.type == "addCart") {
          let exists = false;
          this.totalPrice = 0;
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].product._id == result.data.object.product._id) {
              this.products[i].amount = result.data.object.amount;
              exists = true;
            }
          }
          if (!exists) {
            let newObj = {
              "_id": result.data.object.product._id,
              "product": result.data.object.product,
              "amount": result.data.object.amount
            }
            this.products.push(newObj);
            this.products.sort(this.sortArrayByName);
          }
          for (let f of this.products) {
            this.totalPrice += f.amount * f.product.price;
          }
          this.products = this.products.slice();
          this.itemInCart();
        }
      });
    } else {
      //socket add\edit category
      this.socket.data.subscribe(result => {
        if (result.data.type == "updateCategory") { 
          this.categoriesList = result.data.object;
        }
      })
      //upload functions
      this.uploader.onAfterAddingFile = (file) => {
        this.addProductObj.image = true;
        file.withCredentials = false;
      }
      this.uploader.onWhenAddingFileFailed = () => {
        swal('Oops...','Upload photos only','error'); 
        this.updateProductObj.image = false;
        this.uploadForm.nativeElement.value = '';
      }

    }
  }

  itemInCart(): void {
    //update items exists in cart
    this.socket.sendMsg({
      "type": "itemInCart",
      "object": this.products
    });
  }

  sortArrayByName(a,b) {
    //sort list by name
    if (a.product.name < b.product.name)
      return -1;
    if (a.product.name > b.product.name)
      return 1;
    return 0;
  }

  removeFromCart(id): void {
    //remove item
    this.cart.removeFromCart(id).subscribe(
      result => {
        //update cart
        this.cart.getCart().subscribe(
          result => {
            if (result.active) {
              this.products = result.cart.products;
              this.totalPrice = result.cart.totalPrice;
              this.products.sort(this.sortArrayByName);
              //update items list
              this.itemInCart();
            }
          }
        )
      }
    );
  }
  btnUpdate(id){
    //show 'v' icon
    for(let p of this.products){
      if(p.product._id == id){
        p.update = true;
      }
    }
  }

  doUpdateItem(e){
    if(e.amount != 0 && !isNaN(e.amount) && e.amount > 0){
      e.amount = e.amount*1
      if(!e.product.kg){
        e.amount = e.amount.toFixed(0);
      }
      this.cart.addItem(e.product._id,e.amount).subscribe(
        result => {
          //update list and total price
          this.cart.createCart().subscribe(
            result => {
              this.products = result.cart.products;
              this.products.sort(this.sortArrayByName);
              for(let f of this.products){
                f.update = false;
              }
              this.totalPrice = result.total;
            }
          )
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



  // ---- admin methods ----

  doAddProduct({value,valid}){
    try{
      if(!value.name || !value.category || !value.price || !this.addProductObj.image){
        throw "Please fill in all required fields";
      }
      if(value.price <= 0){
        throw "Negative number can not be used";
      }
      this.uploader.uploadAll();
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        response = JSON.parse(response);
        let fileName = response.filename;
        value.image = fileName;
        this.product.addProduct(value).subscribe(
          result => {
            swal('New product',`Product added`,'success');
            this.updateForm.emit(result);
            this.clearFields("Add",true)
          },err=>{
            swal('Oops...',err.error,'error');
            this.clearFields("Add",false)
          }
        )
      };
    }catch(e){
      swal({
        type: 'error',
        title: 'Oops...',
        text: e
      })
    }
  }
  
  doUpdateProduct({value,valid}){
    try{
      if(value.price != null){
        if(value.price < 1 ){
          throw "Negative number can not be used";
        }
      }
     if(this.uploadForm.nativeElement.value != ''){
        this.uploader.uploadAll();
        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
          response = JSON.parse(response);
          let fileName = response.filename;
          value.image = fileName;
          this.product.updateProduct(this.updateProductObj.id,value).subscribe(
            result => {
              swal('Update product',`Product Updated`,'success');
              this.updateForm.emit(result);
              this.clearFields("Update",true);
              this.addProduct();
            },err=>{
              swal('Oops...',err.error,'error');
              this.clearFields("Update",false);
            }
          )
        };
        
      }else{
        this.product.updateProduct(this.updateProductObj.id,value).subscribe(
          result => {
            swal('Update product',`Product Updated`,'success');
            this.updateForm.emit(result);
            this.clearFields("Update",true);
            this.addProduct();
          },err=>{
            swal('Oops...',err.error,'error');
            this.clearFields("Update",false);
          }
        )
      }
    }catch(e){
      swal({
        type: 'error',
        title: 'Oops...',
        text: e
      })
    }
  }

  clearFields(type,boolean){
    if(type=="Add" && boolean){
      this.uploadForm.nativeElement.value = '';
      this.addProductObj.image = false;
      this.addProductObj.name = '';
      this.addProductObj.price = '';
      this.addProductObj.category = '';
      this.addProductObj.kg = false;
    }
    if(type=="Add" && !boolean){
      this.uploadForm.nativeElement.value = '';
      this.addProductObj.image = false;
    }
    if(type=="Update" && boolean){
      this.uploadForm.nativeElement.value = '';
      this.updateProductObj.image = false;
      this.updateProductObj.name = '';
      this.updateProductObj.price = '';
      this.updateProductObj.category = '';
      this.updateProductObj.kg = false;
    }
    if(type=="Update" && !boolean){
      this.uploadForm.nativeElement.value = '';
      this.updateProductObj.image = false;
    }
  }


    //reset updateProductObj inputs and change panel back to add product
    addProduct(){
      this.addForm = true;
      this.updateProductObj.image = false;
      this.updateProductObj.name = '';
      this.updateProductObj.price = '';
      this.updateProductObj.category = '';
      this.updateProductObj.kg = false;
    }
  
    updateProduct(p){
      this.addForm = false;
      //reset add product inputs
      this.addProductObj.image = false;
      this.addProductObj.name = '';
      this.addProductObj.price = '';
      this.addProductObj.category = '';
      this.addProductObj.kg = false;
      //update update product inputs
      this.updateProductObj.id = p._id;
      this.updateProductObj.image = false;
      this.updateProductObj.name = p.name;
      this.updateProductObj.price = p.price;
      this.updateProductObj.category = p.category._id;
      this.updateProductObj.kg = p.kg;
    }




}
