import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, first } from 'rxjs';
import { ItemList, MenuItem } from 'src/app/interface/interfaces';
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
export class OrderSummaryComponent implements OnInit {
  menuItems!: MenuItem[];

  constructor(
    public dialogRef: MatDialogRef<OrderSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderSummary,
    private router: Router,
    private _apiService: ApiService,
    private spinner: NgxSpinnerService
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
            this._apiService.deleteMenuItem(item.id).pipe(first()).subscribe();
          },
          error: (error: HttpErrorResponse) => {
            throw error;
          },
        });
    });
  }
}
