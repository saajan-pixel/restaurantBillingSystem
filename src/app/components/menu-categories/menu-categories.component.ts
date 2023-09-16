import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, first } from 'rxjs';
import { ItemList, MenuItem } from 'src/app/interface/interfaces';
import { retrieveMenuItems } from 'src/app/store/menuItem.action';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-menu-categories',
  templateUrl: './menu-categories.component.html',
  styleUrls: ['./menu-categories.component.scss'],
})
export class MenuCategoriesComponent implements OnInit, AfterContentChecked {
  allMenuItems!: ItemList[];
  mainCoursesItems!: ItemList[];
  pagedMainCoursesItems!: ItemList[];
  appeitizerItems!: ItemList[];
  beverageItems!: ItemList[];
  pagedMenuItems!: ItemList[];
  itemsOfMenu!: ItemList[];
  pagedAppeitizerItems!: ItemList[];
  pagedBeverageItems!: ItemList[];
  itemsPerPage = 6;

  constructor(
    private _apiService: ApiService,
    private store: Store<{ menuItems: { menuItems: {} } }>,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getItems();
  }

  /**
   * The ngAfterContentChecked function in TypeScript is used to detect changes in the content of a
   * component and trigger change detection.
   */
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getItems() {
    this._apiService
      .getItemsList()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.allMenuItems = res;
          this.getMainCourses();
          this.getAppeitizerItems();
          this.getBeverageItems();
        },
        error: (error: HttpErrorResponse) => {
          throw error;
        },
      });
  }

  getMainCourses() {
    this.mainCoursesItems = this.allMenuItems.filter(
      (item) => item.categoryId === 1
    );
  }

  getAppeitizerItems() {
    this.appeitizerItems = this.allMenuItems.filter(
      (item) => item.categoryId === 2
    );
  }

  getBeverageItems() {
    this.beverageItems = this.allMenuItems.filter(
      (item) => item.categoryId === 3
    );
  }

  addToMenu(itemList: ItemList) {
    const item = { ...itemList, subTotal: itemList.price, discountAmount: 0 };
    this.spinner.show();
    this._apiService
      .addToMenuItems(item)
      .pipe(
        first(),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: () => {
          // dispatching menuItem from MenuCategory
          this.store.dispatch(retrieveMenuItems({ value: item }));
          // this.getMenuItems();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 500) {
            itemList.qty = 1;
            this.toastr.info('Item is already added in Menu List !!', 'Info');
          }
          throw error;
        },
      });
  }

  onPagedMenuItemsReceived(pagedItems: ItemList[], type: string) {
    // Handle the pagedMenuItems data received from the child component here
    if (type === 'all') {
      this.pagedMenuItems = pagedItems;
    } else if (type === 'appeitizer') {
      this.pagedAppeitizerItems = pagedItems;
    } else if (type === 'beverages') {
      this.pagedBeverageItems = pagedItems;
    } else {
      this.pagedMainCoursesItems = pagedItems;
    }
  }

  incrementQty(item: ItemList) {
    item.qty += 1;
  }

  decrementQty(item: ItemList) {
    if (item.qty > 1) {
      item.qty -= 1;
    }
  }
}
