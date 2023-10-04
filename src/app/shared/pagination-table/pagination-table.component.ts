import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-table',
  templateUrl: './pagination-table.component.html',
  styleUrls: ['./pagination-table.component.css']
})
export class PaginationTableComponent implements OnChanges {

  @Input() totalRecords = 0;
  @Input() recordsPerPage = 10;
  @Input() currentPageNumber = 0;
  @Output() pageChange: EventEmitter<Record<'start' | 'end' | 'currentPage', number>> = new EventEmitter();


  public currentIntervalStartItem = 0;
  public currentIntervalEndItem = 0;

  public totalPages = 0;

  ngOnChanges(): void {
    setTimeout(() => {
      this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
      this.goToPage(0);
    }, 100)
  }

  isPageValid(page: number) {
    return page >= 0 && page < this.totalPages;
  }

  goToPage(newPageNumber: number) {
    if (this.isPageValid(newPageNumber)) {
      this.currentPageNumber = newPageNumber;
      this.currentIntervalStartItem = this.currentPageNumber * this.recordsPerPage;
      this.currentIntervalEndItem = this.currentIntervalStartItem + this.recordsPerPage;
      this.pageChange.emit({
        start: this.currentIntervalStartItem,
        end: this.currentIntervalEndItem,
        currentPage: this.currentPageNumber
      });
    }
  }

}
