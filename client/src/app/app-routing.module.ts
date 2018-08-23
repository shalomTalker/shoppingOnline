import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/main/homepage/homepage.component';
import { ShopmainComponent } from './components/shop/shopmain/shopmain.component';
import { OrderComponent } from './components/shop/order/order.component';
import { OrderPDFComponent } from './components/shop/order/order-pdf/order-pdf.component';
import { AuthGuard } from './auth.guard';
import { UserSettings } from './components/settings/user-settings/user-settings.component';
import { Statistics } from './components/settings/statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard],
    data: {
      redirectAdmin: '/shopping'
    }
  },
  {
    path: 'shopping',
    component: ShopmainComponent,
    canActivate: [AuthGuard],
    data: {
      minLevelAllowed: 1
    }
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: {
      minLevelAllowed: 1,
      redirectAdmin: '/shopping'
    }
  },
  {
    path: 'userSettings',
    component: UserSettings,
    canActivate: [AuthGuard],
    data: {
      minLevelAllowed: 1,
    }
  },
  {
    path: 'statistics',
    component: Statistics,
    canActivate: [AuthGuard],
    data: {
      minLevelAllowed: 2,
    }
  },
  {
    path: 'order/:id',
    component: OrderPDFComponent,
    canActivate: [AuthGuard],
    data: {
      minLevelAllowed: 1,
      redirectAdmin: '/shopping'
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
