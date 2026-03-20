import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog_input: any,
    private metadata_service: MetadataService,
    private storage_service: StorageService
  ) { }
  notrequiredFields:any[]=['createdBy', "createdTime", "modifiedTime",  "modifiedBy"];
  fields: Array<any> = new Array();
  arrayFields: Array<any> = new Array();
  metadata: Array<any> = new Array();
  ngOnInit(): void {
    // this.fields = Object.entries(this.object?.data).reduce((acc: any, [key, value]: any) => {
    //   acc.push({key, value});
    //   return acc;
    // }, []);

    // this.getmetadata();
    this.fields = Object.keys(this.dialog_input.body).filter((item) => !Array.isArray(this.dialog_input.body[item]) && !this.notrequiredFields.includes(item));
    this.arrayFields = Object.keys(this.dialog_input.body).filter((item) => Array.isArray(this.dialog_input.body[item]));
  }

  getmetadata() {
    this.metadata = this.storage_service.getMetaDataArray('Object_Names');
  }

}
