import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { ToastrModule, provideToastr } from 'ngx-toastr';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { NavbarComponent } from './layouts/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { ApiService } from 'src/services/api.service';
import { MenuCategoriesComponent } from './components/menu-categories/menu-categories.component';
import { PaginationComponent } from './utils/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscountDialogComponent } from './components/menu-list/discount-dialog/discount-dialog.component';
import { retrieveMenuItemsReducer } from './store/menuItem.reducer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderSummaryComponent } from './components/menu-list/order-summary/order-summary.component';
import { SuccessfulOrderComponent } from './pages/successful-order/successful-order.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';

const MaterialModule = [
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatTableModule,
  MatDividerModule,
  MatDialogModule,
  MatButtonModule,
  MatTabsModule,
  MatChipsModule,
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MenuListComponent,
    MenuCategoriesComponent,
    PaginationComponent,
    DiscountDialogComponent,
    OrderSummaryComponent,
    SuccessfulOrderComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ menuItem: retrieveMenuItemsReducer }),
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
  providers: [
    ApiService,
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
