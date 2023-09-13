import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, catchError, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private cachedData$!: Observable<any>;
  apiUrl="https://rbsapi-4zn3.onrender.com"

  constructor(private http:HttpClient) { }

  getItemsList(){
    if (!this.cachedData$) {
      // If data is not cached, make the API call and cache the result using shareReplay
      this.cachedData$ = this.http.get<any>(`${this.apiUrl}/items`).pipe(
        catchError((error) => {
          console.error('API call failed', error);
          return [];
        }),
        shareReplay(1) // Cache the result and replay it to new subscribers
      );
    }

    return this.cachedData$;
  }

  getMenuCategories(){
    return this.http.get<any>(`${this.apiUrl}/menuCategory`)
  }

  addToMenuItems(data:any){
    return this.http.post<any>(`${this.apiUrl}/menuItems`,data)
  }

  updateMenuItem(id:number,data:any){
    return this.http.put<any>(`${this.apiUrl}/menuItems/${id}`,data)
  }

  deleteMenuItem(id:number){
    return this.http.delete<any>(`${this.apiUrl}/menuItems/${id}`)
  }

  fetchAddedMenuItems(){
    return this.http.get<any>(`${this.apiUrl}/menuItems`)
  }

}
