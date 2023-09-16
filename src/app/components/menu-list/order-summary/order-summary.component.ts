import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, first } from 'rxjs';
import { ItemList, MenuItem } from 'src/app/interface/interfaces';
import { resetMenuItem, retrieveMenuItems } from 'src/app/store/menuItem.action';
import { ApiService } from 'src/services/api.service';

interface OrderSummary {
  menuItems: MenuItem[];
  total: number;
  discountAmount: number;
  netPrice: number;
  tax: number;
}

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  menuItems!: MenuItem[];

  constructor(
    public dialogRef: MatDialogRef<OrderSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderSummary,
    private router: Router,
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private store: Store<{ menuItems: { menuItems: {} } }>,
  ) {}

  ngOnInit(): void {
    this.menuItems = this.data.menuItems;
  }

  order() {
    this.spinner.show();
    this.menuItems.forEach((item) => {
      this._apiService
        .orderedItems(item)
        .pipe(
          first(),
          finalize(() => this.spinner.hide())
        )
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/orderSuccess');
            this.store.dispatch(resetMenuItem())
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 500) {
              this.toastr.error(
                'The listed items are already in your order',
                'Error'
              );
            }
            throw error;
          },
        });
    });
  }

  ngOnDestroy(): void {
    this.menuItems.forEach((item) => {
      this._apiService.deleteMenuItem(item.id).pipe(first()).subscribe();
    });
  }
}
