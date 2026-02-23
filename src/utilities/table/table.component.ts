import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  @Input({ required: true }) fields!: any[];

  @Input({ required: true }) data!: any[];

  @Input() index!: number;

  @Input() showLoader!: any;

  @Input() search!: any;

  @Output() childEvent = new EventEmitter<any>();

  isSort: boolean = false;

  sort(label: any) {

    this.isSort = !this.isSort;

    var x = this.data;

    this.isSort ? x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0)
      : x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);



  }
  openPopup(field: any, item: any, type?: string) {

    this.childEvent.emit({ field, item, type });
  }

}
