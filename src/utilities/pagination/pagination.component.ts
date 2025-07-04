import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Input({required: true}) totalPages: any;
  @Output() emitPage: any = new EventEmitter();

  page: number = 0;
  noOfPages: any = [];
  ngOnChanges(): void {
    if(this.totalPages) {
      this.noOfPages = [...new Array(this.totalPages).keys()];
    }
  }

  changePage(): void {
    this.emitPage.emit(this.page);
  }

}
