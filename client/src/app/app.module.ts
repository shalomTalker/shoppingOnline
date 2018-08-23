import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
//addons
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MyDatePickerModule } from 'mydatepicker';
import { MatButtonModule,MatTableModule,MatListModule,MatSlideToggleModule, MatCheckboxModule,MatAutocompleteModule,MatProgressBarModule, MatSelectModule,MatDatepickerModule,MatNativeDateModule, MatTabsModule,MatInputModule,MatIconModule,MatFormFieldModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FileUploadModule } from 'ng2-file-upload';
import { ChartsModule } from 'ng2-charts';
//inject authorization header
import { TokenInterceptorService } from './token-interceptor.service';
//apis
import { UsersService } from './services/users.service';
import { EmitLoggedService } from './emit-logged.service';
import { CartService } from './services/cart.service';
import { ProductsService } from './services/products.service';
//websocket
import { SocketDataService } from './socket-data.service';
import { WebsocketService } from './websocket.service';
//components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/main/login/login.component';
import { AboutComponent } from './components/main/about/about.component';
import { HeaderComponent } from './components/common/header/header.component';
import { GeneralinfoComponent } from './components/main/generalinfo/generalinfo.component';
import { HomepageComponent } from './components/main/homepage/homepage.component';
import { ShopmainComponent } from './components/shop/shopmain/shopmain.component';
import { CartComponent } from './components/shop/cart/cart.component';
import { OrderComponent } from './components/shop/order/order.component';
import { ItemsComponent } from './components/shop/items/items.component'
import { OrderService } from './services/order.service';
import { OrderPDFComponent } from './components/shop/order/order-pdf/order-pdf.component';
import { AuthGuard } from './auth.guard';
import { Statistics } from './components/settings/statistics/statistics.component';
import { UserSettings } from './components/settings/user-settings/user-settings.component';
import { CategoryComponent } from './components/shop/cart/category/category.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    HeaderComponent,
    GeneralinfoComponent,
    HomepageComponent,
    ShopmainComponent,
    CartComponent,
    OrderComponent,
    ItemsComponent,
    OrderPDFComponent,
    Statistics,
    UserSettings,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MyDatePickerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatSelectModule,
    FileUploadModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatListModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MDBBootstrapModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers: [
    UsersService,
    CartService,
    ProductsService,
    EmitLoggedService,
    SocketDataService,
    WebsocketService,
    OrderService,
    AuthGuard,
    { 
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
