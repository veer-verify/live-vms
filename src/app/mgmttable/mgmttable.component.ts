import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/services/storage.service';
import { EditFormComponent } from '../edit-form/edit-form.component';

@Component({
  selector: 'app-mgmttable',
  templateUrl: './mgmttable.component.html',
  styleUrls: ['./mgmttable.component.css']
})
export class MgmttableComponent {

   @Input({required: true}) fields!: any;

  @Input({required: true}) data!: any;

  @Input({required: true}) search!: any;

  @Output() childEvent: any = new EventEmitter();

  constructor(
    private storage_service: StorageService,
    private dialog: MatDialog
  ) {}

  showLoader!: boolean;
  ngOnInit(): void {
    this.storage_service.table_loader_sub.subscribe((res) => this.showLoader = res)
      // console.log(this.data)
  }

  isSort:boolean=false;
  sort(label:any) {
    this.isSort = !this.isSort;
    if(this.isSort) {
      this.data.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0)
    } else {
      this.data.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
}
