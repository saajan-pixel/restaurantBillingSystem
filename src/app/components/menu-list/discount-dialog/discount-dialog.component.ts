import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { MenuItem } from 'src/app/interface/interfaces';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-discount-dialog',
  templateUrl: './discount-dialog.component.html',
  styleUrls: ['./discount-dialog.component.scss'],
})
export class DiscountDialogComponent implements OnInit {
  menuItem: any = {};
  discountAmount!: number;
  discountPercent!: number;

  constructor(
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    console.log(this.discountAmount);
    this.menuItem = this.data;
  }

  get discountValidation() {
    return (
      (this.discountAmount === undefined || this.discountAmount === 0) &&
      (this.discountPercent === undefined || this.discountAmount === 0)
    );
  }

  calculateDiscountPercent() {
    if (this.discountAmount > this.menuItem.price) {
      this.discountAmount = 0;
    }

    this.discountPercent = (this.discountAmount / this.menuItem.price) * 100;
  }

  calculateDiscountAmount() {
    if (this.discountPercent > 100) {
      this.discountPercent = 0;
    }

    this.discountAmount = (this.discountPercent * this.menuItem.price) / 100;
  }

  update() {
    this.spinner.show();
    const subTotalAfterDiscount = this.menuItem.price - this.discountAmount;
    const data:MenuItem = {
      ...this.menuItem,
      subTotal: subTotalAfterDiscount,
      isDiscounted: true,
    };

    this._apiService
      .updateMenuItem(this.menuItem.id, data)
      .pipe(first())
      .subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          throw error;
        },
      });
  }
}
