import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent {

  @Input() records: any[] = [];
  @Output() filteredRecords: EventEmitter<any[]> = new EventEmitter();

  public noValidKey: string[] = [
    'id',
    'links',
    'created_at',
    'updated_at'
  ]

  filter(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const temp = this.records.filter((d) => {
      const tempVar = JSON.parse(JSON.stringify(d));
      this.deleteElementsInObject(tempVar, this.noValidKey);
      return JSON.stringify(tempVar).toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.filteredRecords.emit(temp);
  }

  deleteElementsInObject(obj: Record<string, string>, keys: string[]) {
    keys.forEach((key) => {
      delete obj[key];
    })
  }

}
