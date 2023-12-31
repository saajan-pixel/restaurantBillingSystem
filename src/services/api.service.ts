import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, shareReplay } from 'rxjs';
import { ItemList, MenuCategory, MenuItem } from 'src/app/interface/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private cachedData$!: Observable<ItemList[]>;
  apiUrl="https://rbsapi-4zn3.onrender.com"
  // apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getItemsList() {
    return this.http.get<ItemList[]>(`${this.apiUrl}/items`)
  }

  getMenuCategories() {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/menuCategory`);
  }

  addToMenuItems(data: ItemList) {
    return this.http.post<ItemList>(`${this.apiUrl}/menuItems`, data);
  }

  updateMenuItem(id: number, data: MenuItem) {
    return this.http.put<MenuItem>(`${this.apiUrl}/menuItems/${id}`, data);
  }

  deleteMenuItem(id: number) {
    return this.http.delete<MenuItem>(`${this.apiUrl}/menuItems/${id}`);
  }

  fetchAddedMenuItems() {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menuItems`);
  }

  clearMenuItems(): Observable<any> {
    return this.http.put(`${this.apiUrl}/menuItems`, []);
  }

  orderedItems(orderedItems: any) {
    return this.http.post(`${this.apiUrl}/orders`, orderedItems);
  }

  fetchOrderedItems(){
    return this.http.get<MenuItem[]>(`${this.apiUrl}/orders`);
  }

  cancelOrder(id:number){
    return this.http.delete<MenuItem>(`${this.apiUrl}/orders/${id}`);
  }
}
