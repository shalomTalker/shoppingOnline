import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopmain',
  templateUrl: './shopmain.component.html',
  styleUrls: ['./shopmain.component.css']
})
export class ShopmainComponent implements OnInit {
  updateBtn:any;
  updateForm:any;
  constructor() { }

  ngOnInit() {
  }

  updateProduct(e,boolean){
    if(boolean){
      this.updateForm = e;
    }else{
      this.updateBtn = e;
    }
  }

}
