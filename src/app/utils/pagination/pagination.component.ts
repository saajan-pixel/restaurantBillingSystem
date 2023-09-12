import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  currentPage: any = 1;
  @Input('itemsPerPage') itemsPerPage!: number;
  @Input('lists') lists: any;
  pagedMenuItems: any;

  @Output() pagedMenuItemsEmitter = new EventEmitter<any[]>();

  getPagedMenuItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedMenuItems = this.lists?.slice(startIndex, endIndex);
    this.pagedMenuItemsEmitter.emit(this.pagedMenuItems);
  }

  ngOnInit(): void {
    this.getPagedMenuItems();
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.lists.length) {
      this.currentPage = this.currentPage + 1;
      this.getPagedMenuItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.getPagedMenuItems();
    }
  }

  goToPage(page: number | string) {
    if(page !== '...'){
      this.currentPage = page;
      this.getPagedMenuItems();
    }
  }

  pageRange() {
    const totalItems = this.lists?.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const visiblePages = 2; // Number of page numbers to show around the current page

    const pages: Array<number | string> = [];
    if (totalPages <= visiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show the first page
      pages.push(1);

      // Show pages around the current page
      const startPage = Math.max(
        2,
        this.currentPage - Math.floor(visiblePages / 2)
      );
      const endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Show the last page
      pages.push(totalPages);
    }

    return pages;
  }
}
