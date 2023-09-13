import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { finalize, first, switchMap, timer } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  itemsPerPage: number = 16;
  menuItems: any[] = [];
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
    private store: Store<{ menuItem: { menuItem: {} } }>,
    private spinner: NgxSpinnerService
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
          this.calculateTotalDiscountAmount();
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
    this.total = this.menuItems.reduce(
      (acc: number, item: any) => acc + item.price * item.qty,
      0
    );
    this.calculateNetPrice();
  }

  calculateTotalDiscountAmount() {
    const subTotal = this.menuItems.reduce(
      (acc: number, item: any) => acc + item.subTotal,
      0
    );

    this.discountAmount = this.total - subTotal;
  }

  onPagedMenuItemsReceived(pagedItems: any[]) {
    // Handle the pagedMenuItems data received from the child component here
    this.pagedMenuItems = pagedItems;
  }

  onInputQty(data: any) {
    this.total = data.qty * data.subTotal + this.total;
  }

  calculateNetPrice() {
    if (this.discountAmount !== 0) {
      const amount = this.total - this.discountAmount;
      console.log('aaa', amount);
      this.netPrice = amount + (amount * this.tax) / 100;
    } else {
      this.netPrice = this.total + (this.total * this.tax) / 100;
    }
  }

  openDialog(item: any, index: number): void {
    if (item.subTotal !== this.menuItems[index].price) {
      this.toastr.info('Discount for this item has been already provided !!','Info')
      return
    }

    const dialogRef = this.dialog.open(DiscountDialogComponent, {
      width: '50%',
      data: item,
    });

    dialogRef.afterClosed().subscribe(() => {
      timer(2000)
        .pipe(first())
        .subscribe(() => this.getMenuItems(true));
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
