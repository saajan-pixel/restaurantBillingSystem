import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, first } from 'rxjs';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit{
  orderedItems:any
  constructor(private _apiService:ApiService,private spinner:NgxSpinnerService,private toastr:ToastrService){}

  ngOnInit(): void {
    this.getOrderedItems()
  }

  getOrderedItems(){
    this.spinner.show()
    this._apiService.fetchOrderedItems().pipe(first(),finalize(()=> this.spinner.hide())).subscribe({
      next:(res:any)=>{
        this.orderedItems=res.flat(1)
      },error:(error:HttpErrorResponse)=>{
        throw error
      }
    })
  }

  cancelOrder(item:any){
    this.spinner.show()
    this._apiService.cancelOrder(item.id).pipe(first(),finalize(()=> this.spinner.hide())).subscribe({
      next:()=>{
        this.toastr.error(`${item.name} got cancelled !!`, 'Cancel');
        this.getOrderedItems()
      },error:(error:HttpErrorResponse)=>{
        throw error
      }
    })
  }

}
