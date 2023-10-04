import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Column } from './master-table.types';

@Component({
  selector: 'app-master-table',
  templateUrl: './master-table.component.html',
  styleUrls: ['./master-table.component.css']
})
export class MasterTableComponent implements OnChanges {

  @Input() columns: Column[] = []
  @Input() records: any[] = [];
  @Input() maxRecords = 0;
  @Output() dataToShow: EventEmitter<any[]> = new EventEmitter();
  @Input() enableSearch = true;

  public recordsPerPage = 10;

  public currentPage = 0;
  public filteredRecords: any[] = [];
  public recordsToShow: any[] = [];

  public sortedKey = 'created_at';
  public sortedOrder: string | undefined = 'desc';

  ngOnChanges(): void {
    if (this.maxRecords) this.recordsPerPage = this.maxRecords;

    const mainSort: Column | undefined = this.columns.find((column) => column && column['mainSort'] === true);
    this.sortedKey = mainSort && mainSort.key ? mainSort.key : this.sortedKey;
    this.sortedOrder = mainSort && mainSort.key ? mainSort.order : this.sortedOrder;

    this.filteredRecords = [...this.records];
    this.sortBy(this.sortedKey, this.sortedOrder);
  }

  sliceDevices(event: Record<'start' | 'end' | 'currentPage', number>) {
    this.recordsToShow = this.filteredRecords.slice(event.start, event.end);
    this.currentPage = event.currentPage;
    this.sortBy(this.sortedKey, this.sortedOrder);
  }

  filterDevices(event: any[]) {
    this.filteredRecords = event;
  }

  sortBy(key?: string, order?: string) {
    this.defineKeyAndOrder(key, order);
    const isAscending = this.sortedOrder === 'asc';
    this.filteredRecords.sort((a, b) => {
      const valueA = this.parseValue(a[this.sortedKey]);
      const valueB = this.parseValue(b[this.sortedKey]);
      if (valueA > valueB) return isAscending ? -1 : 1;
      else if (valueA < valueB) return -1 * (isAscending ? -1 : 1);
      return 0;
    });
    const start = this.currentPage * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    this.dataToShow.emit(this.filteredRecords.slice(start, end));
  }

  defineKeyAndOrder(key?: string, order?: string) {
    if (key) {
      this.sortedKey = key;
      if (order) {
        this.sortedOrder = order;
      } else {
        this.sortedOrder = this.sortedOrder === 'asc' ? 'desc' : 'asc';
      }
    }
  }

  parseValue(element: any) {
    const date = new Date(element);
    if (!isNaN(date.getTime())) {
      return date;
    }
    return element || '';
  }

}
