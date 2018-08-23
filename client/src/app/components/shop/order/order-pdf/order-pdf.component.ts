import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-order-pdf',
  templateUrl: './order-pdf.component.html',
  styleUrls: ['./order-pdf.component.css']
})
export class OrderPDFComponent implements OnInit {
  @ViewChild('orderPDF') orderPDF: ElementRef;
  orderInfo:any = {
    products: null,
    user: {
      firstName: null,
      lastName: null,
      email: null,
      orderCreate: null
    }
  };
  now:any = Date.now();
  constructor(private route: ActivatedRoute,private router:Router,private order:OrderService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(!(new RegExp("^[0-9a-fA-F]{24}$")).test(params['id'] )){
        this.router.navigate(['']);
      }else{
        this.order.getOrder(params['id']).subscribe(
          result=>{
            this.orderInfo = result;
            setTimeout(() => {
              this.createPDF();
            }, 1500);      
          }
          )
        }
      })
    }
  
  

  createPDF(){
    const element = this.orderPDF.nativeElement;
    const _this = this;
		const opt = {
			margin:       0,
			filename:     'invoice.pdf',
			image:        { type: 'jpeg', quality: 0.98 },
			html2canvas:  { scale: 2 , dpi: 300,
				letterRendering: true,
				useCORS: true},
			jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
		};
    html2pdf().from(element).set(opt).save().then(() => {
      _this.homePage();
    });
  }

  homePage():void{
    this.router.navigate(['']);
  }

}

