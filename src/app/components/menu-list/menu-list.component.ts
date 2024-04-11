import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { finalize, first, switchMap, timer } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'src/app/interface/interfaces';
import { MediaMatcher } from '@angular/cdk/layout';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
interface FormItem {
  qty: number;
  subTotal: string;
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  itemsPerPage: number = 16;
  menuItems: MenuItem[] = [];
  pagedMenuItems: MenuItem[] = [];
  form!: FormGroup;
  subTotal = 0;
  discountAmount = 0;
  netPrice = 0;
  tax = 10;
  isRemoved = false;
  mobileQuery!: MediaQueryList;

  constructor(
    private _apiService: ApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store<{ menuItem: { menuItem: {} } }>,
    private spinner: NgxSpinnerService,
    private mediaMatcher: MediaMatcher
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.createForm();
    this.getMenuItems();
  }

  createForm(item?: FormItem) {
    this.form = new FormGroup({
      arr: new FormArray([
        new FormGroup({
          qty: new FormControl(item?.qty),
          subTotal: new FormControl(`Rs ${item?.subTotal}`),
        }),
      ]),
    });
  }

  get arr() {
    return this.form.get('arr') as FormArray;
  }

  updateMenuItems(res: any): void {
    this.menuItems = [...this.menuItems, res.menuItem];
    this.menuItems = this.menuItems.filter(
      (obj: any) => Object.keys(obj).length !== 0
    );
    this.calculateTotal();
  }

  getMenuItems(discountAdded?: boolean): void {
    this.menuItems = [];
    this.spinner.show();
    this._apiService
      .fetchAddedMenuItems()
      .pipe(
        first(),
        finalize(() => this.spinner.hide()),
        switchMap((res) => {
          this.menuItems = res;
          this.calculateTotal();

          if (!this.isRemoved) {
            return this.store.select('menuItem');
          } else {
            return [];
          }
        })
      )
      .subscribe({
        next: (res) => {
          if (res && !discountAdded) {
            this.updateMenuItems(res);
          }
        },
        error: (error: HttpErrorResponse) => {
          throw error;
        },
      });
  }

  calculateTotal() {
    console.log('totla', this.menuItems);
    this.subTotal = this.menuItems.reduce(
      (acc: number, item: MenuItem) => acc + item.subTotal,
      0
    );

    this.calculateTotalDiscountAmount();
  }

  calculateTotalDiscountAmount() {
    const discount = this.menuItems.reduce(
      (acc: number, item: MenuItem) => acc + item.discountAmount,
      0
    );

    isNaN(discount)
      ? (this.discountAmount = 0)
      : (this.discountAmount = discount);

    this.calculateNetPrice();
  }

  onPagedMenuItemsReceived(pagedItems: any[]) {
    // Handle the pagedMenuItems data received from the child component here
    this.pagedMenuItems = pagedItems;
  }

  onInputQty(data: any) {
    this.subTotal = data.qty * data.subTotal + this.subTotal;
  }

  calculateNetPrice() {
    if (this.discountAmount !== 0) {
      const amount = this.subTotal - this.discountAmount;
      this.netPrice = amount + (amount * this.tax) / 100;
    } else {
      this.netPrice = this.subTotal + (this.subTotal * this.tax) / 100;
    }
  }

  openDialog(item: MenuItem, index: number): void {
    if (this.menuItems[index].isDiscounted) {
      this.toastr.info(
        'Discount for this item has been already provided !!',
        'Info'
      );
      return;
    }
    const dialogRef = this.dialog.open(DiscountDialogComponent, {
      width: this.mobileQuery.matches ? '100%' : '50%',
      data: item,
    });

    dialogRef.componentInstance.saveClicked.subscribe(() => {
      timer(2000)
        .pipe(first())
        .subscribe(() => {
          this.getMenuItems(true);
        });
    });
  }

  removeMenuItem(id: number, index: number) {
    this.isRemoved = true;
    this.arr.removeAt(index);
    this._apiService
      .deleteMenuItem(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Item remove from menu list !!', 'Success');
          this.getMenuItems();
        },
        error: (error: HttpErrorResponse) => {
          throw error;
        },
      });
  }

  incrementQty(item: MenuItem) {
    if (item.isDiscounted) {
      this.actionInfo();
      return;
    }
    this.updateMenuItemOnIncrementorDecrement(item, item.qty + 1);
  }

  decrementQty(item: MenuItem) {
    if (item.isDiscounted) {
      this.actionInfo();
      return;
    }
    if (item.qty > 1) {
      this.updateMenuItemOnIncrementorDecrement(item, item.qty - 1);
    }
  }

  updateMenuItemOnIncrementorDecrement(item: MenuItem, quantity: number) {
    const updatedItem = {
      ...item,
      qty: quantity,
      subTotal: quantity * item.price,
    };

    const indexOfItem = this.menuItems.indexOf(item);
    this.menuItems[indexOfItem] = updatedItem; // Replace the old item with the updated one
    this.calculateTotal();
  }

  actionInfo() {
    this.toastr.info(
      'Discount for this item is provided so action cannot be performed !!',
      'Info'
    );
  }

  viewOrderSummary() {
    this.dialog.open(OrderSummaryComponent, {
      width: this.mobileQuery.matches ? '100%' : '50%',
      data: {
        menuItems: this.menuItems,
        total: this.subTotal,
        discountAmount: this.discountAmount,
        tax: this.tax,
        netPrice: this.netPrice,
      },
    });
  }
}
