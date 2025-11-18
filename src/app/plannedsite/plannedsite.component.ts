import { MetadataService } from 'src/services/metadata.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SiteService } from 'src/services/site.service';
import { AlertService } from 'src/services/alert.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-plannedsite',
  templateUrl: './plannedsite.component.html',
  styleUrls: ['./plannedsite.component.css'],
})
export class PlannedsiteComponent {
  @Input() cameraList!: any;
  @Input() currentItem!: any;

  psaId: any;

  fields: any[] = [
    {
      serial: 0,
      label: 'S.no',
      showSerial: true,
    },
    {
      serial: 1,
      label: 'Site Id',
      id: 'siteId',
      sort: true,
    },
    {
      serial: 2,
      label: 'activityName',
      id: 'activityName',
      sort: true,
    },
    {
      serial: 3,
      label: 'fromdatetime',
      id: 'fromdatetime',
      sort: true,
    },
    {
      serial: 4,
      label: 'todatetime',
      id: 'todatetime',
      sort: true,
    },
    {
      serial: 5,
      label: 'description',
      id: 'description',
      sort: true,
    },
    {
      serial: 6,
      key: 'actions',
      label: 'Actions',
      actions: ['edit', 'delete'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch (type) {
          case 'edit':
            this.openEditPopup(data);
            break;
          case 'delete':
            this.openDelete(data);
            break;
          default:
            break;
        }
      },
    },
  ];

  myForm!: FormGroup;
  tagsList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private siteser: SiteService,
    private metadaSer: MetadataService,
    private alert: AlertService,
    private datePipe: DatePipe,
    private dialog : MatDialog
  ) {}

  ngOnInit(): void {

    this.myForm = this.fb.group({
      siteId: [this.currentItem?.item.siteId || 0, Validators.required],
      psaTagsId: [0, Validators.required],
      description: [''],
      fromDateTime: ['', Validators.required],
      toDateTime: ['', Validators.required],
      createdBy: [0],
    });

    this.getTypes();
 

    if(this.currentItem.type !='add'){

      this.getPlanned();
    }

  }

  data: any = [];

  formatDate(value: string) {
    return this.datePipe.transform(value, 'MMM d, y, h:mm:ss a');
  }

  getPlanned() {
    this.data = [];

    this.siteser
      .getPlannedSiteActivity({
        siteId: this.currentItem?.item.siteId,
        status: 'T',
      })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.data = res.Data.map((item: any) => ({
            ...item,
            fromdatetime: this.formatDate(item.fromdatetime),
            todatetime: this.formatDate(item.todatetime),
          }));
        } else {
          this.data = [];
        }
      });
  }

  psaTags: any = [];

  getTypes() {
    this.metadaSer.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        if (item.typeName === 'Activity Tags') {
          this.psaTags = item.metadata;
        }
      });
    });
  }



  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      this.alert.error('Kindly, fill all fields');
      return;
    }

    this.siteser.addPlannedSiteActivity(this.myForm.value).subscribe({
      next: (res: any) => {

        if(res.statusCode==200){

          this.alert.success(res.message);
          this.myForm.reset();
        }
      },
      error: (err) => {

        this.alert.error('Something went wrong!');
      },
    });
  }

editplanned:any;

convertToDateTimeLocal(str: string) {
  if (!str) return '';

  const date = new Date(str);

  // Format YYYY-MM-DD
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  // Format HH:mm
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

  @ViewChild('editplan') editplan!: TemplateRef<any>;
  editForm!: FormGroup;

  openEditPopup(data: any) {

    this.editplanned=data;
    this.editForm = this.fb.group({
      siteId: [this.currentItem?.item.siteId || 0, Validators.required],
      psaTagsId: [this.editplanned?.psaTagsId, Validators.required],
      id: [this.editplanned?.id, Validators.required],
      description: [this.editplanned?.description],
      fromDateTime: [this.convertToDateTimeLocal(this.editplanned?.fromdatetime), Validators.required],
      toDateTime: [this.convertToDateTimeLocal(this.editplanned?.todatetime), Validators.required],
      modifiedBy: [0],
    });

    this.dialog.open(this.editplan,{disableClose:true});
  }

  openDelete(data:any){


    this.alert.confirm("Do you want to delete ?").then((res:any)=>{

      if(res.isConfirmed){

             this.siteser.InActive_ActivityStatus({...data,modifiedBy:0}).subscribe((res:any)=>{

              if(res.statusCode==200){
                this.alert.success(res.message);
                 this.getPlanned();
              }
             })

      }
    })
  }

  editSubmit(){
     if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.alert.error('Kindly, fill all fields');
      return;
    }



    this.siteser.updatePlannedSiteActivity(this.editForm.value).subscribe({
      next: (res: any) => {

        if(res.statusCode==200){

          this.alert.success('Saved Successfully!');
          this.editForm.reset();
          this.dialog.closeAll();
          this.getPlanned();
        }
      },
      error: (err) => {

        this.alert.error('Something went wrong!');
      },
    });

  }
}
