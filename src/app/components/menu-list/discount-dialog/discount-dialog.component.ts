import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-discount-dialog',
  templateUrl: './discount-dialog.component.html',
  styleUrls: ['./discount-dialog.component.scss'],
})
export class DiscountDialogComponent implements OnInit {
  menuItem: any = {};
  discountAmount = 0;
  discountPercent = 0;
  constructor(
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _apiService:ApiService
  ) {}

  ngOnInit(): void {
    this.menuItem = this.data;
  }

  calculateDiscountPercent() {
    this.discountPercent =
      (this.discountAmount / this.menuItem.price) * 100;
  }

  calculateDiscountAmount() {
    this.discountAmount =
      (this.discountPercent * this.menuItem.price) / 100;
  }

  update(){

    const data={...this.menuItem,subTotal: this.menuItem.price- this.discountAmount,isDiscounted:true}
    console.log(data)
    debugger

    this._apiService.updateMenuItem(this.menuItem.id,data).pipe(first()).subscribe({
      next:()=>{

      },error:(error:HttpErrorResponse)=>{
        throw error
      }
    })
  }
}
