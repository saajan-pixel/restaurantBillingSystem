import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SuccessfulOrderComponent } from './pages/successful-order/successful-order.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'orderSuccess',component:SuccessfulOrderComponent},
  {path:'orders',component:MyOrdersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
