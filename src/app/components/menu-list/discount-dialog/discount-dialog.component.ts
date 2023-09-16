import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
  @Output() saveClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  menuItem!: MenuItem 
  discountAmount!: number;
  discountPercent!:number
  isDiscountApplied=false

  constructor(
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuItem,
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.menuItem = this.data;
    console.log("iut",this.menuItem)
  }

  calculateDiscountAmount() {
    this.discountAmount = (this.menuItem.discountPercent * this.menuItem.subTotal) / 100;
  }

  update() {
    this.spinner.show();
    this.saveClicked.emit(true)
    const subTotalAfterDiscount = this.menuItem.subTotal - this.discountAmount;
    const data:MenuItem = {
      ...this.menuItem,
      subTotal: subTotalAfterDiscount,
      isDiscounted: true,
      discountAmount:this.discountAmount
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

  applyDiscount(){
    this.isDiscountApplied=!this.isDiscountApplied
    this.calculateDiscountAmount()

  }
}
