import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { first, switchMap } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  itemsPerPage: number = 16;
  menuItems: any;
  pagedMenuItems: any;
  form!: FormGroup;
  total = 0;
  discountAmount = 0;
  netPrice = 0;
  tax = 13;
  isRemoved = false;
  constructor(
    private _apiService: ApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store<{ menuItem: { menuItem: {} } }>
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getMenuItems();
  }

  createForm(item: any = {}) {
    this.form = new FormGroup({
      arr: new FormArray([
        new FormGroup({
          qty: new FormControl(item.qty),
          subTotal: new FormControl(`Rs ${item.subTotal}`), // Provide an initial value here if needed
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

  getMenuItems(): void {
    this._apiService
      .fetchAddedMenuItems()
      .pipe(
        first(),
        switchMap((res) => {
          this.menuItems = res;
          if (!this.isRemoved) {
            return this.store.select('menuItem');
          } else {
            return [];
          }
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.updateMenuItems(res);
          }
        },
        error: (error: HttpErrorResponse) => {
          throw error;
        },
      });
  }
  calculateTotal() {
    this.total = this.menuItems.reduce(
      (acc: number, item: any) => acc + item.subTotal * item.qty,
      0
    );
    this.calculateDiscountPrice();
  }

  calculateTotalDiscountAmount() {
    // const totalPrice = this.menuItems.reduce(
    //   (acc: number, item: any) => acc + item.price,
    //   0
    // );

    console.log(this.total);
    // this.discountAmount = totalPrice - this.total;
  }

  onPagedMenuItemsReceived(pagedItems: any[]) {
    // Handle the pagedMenuItems data received from the child component here
    this.pagedMenuItems = pagedItems;
  }

  onInputQty(data: any) {
    this.total = data.qty * data.subTotal + this.total;
  }

  calculateDiscountPrice() {
    this.netPrice = this.total - this.discountAmount;
  }

  openDialog(item: any): void {
    this.dialog.open(DiscountDialogComponent, {
      width: '50%',
      data: item,
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
}