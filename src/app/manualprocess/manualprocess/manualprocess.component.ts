import { trigger, transition, style, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-manualprocess',
  templateUrl: './manualprocess.component.html',
  styleUrls: ['./manualprocess.component.css'],
  // animations: [
  //   trigger('inOutPaneAnimation', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateX(100%)' }),
  //       animate(
  //         '500ms ease-in-out',
  //         style({ opacity: 1, transform: 'translateX(0)' }),
  //       ),
  //     ]),
  //     transition(':leave', [
  //       style({ opacity: 1, transform: 'translateX(0)' }),
  //       animate(
  //         '500ms ease-in-out',
  //         style({ opacity: 0, transform: 'translateX(100%)' }),
  //       ),
  //     ]),
  //   ]),
  // ],
})
export class ManualprocessComponent {
  selectedDate: any;
  dateTimeForm!: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<ManualprocessComponent>,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService,
      private camSer: CameraService,
    public storageSer: StorageService,
    private fb: FormBuilder,
    private event_service:EventService,
    private alertSrvc:AlertService,
    private datePipe: DatePipe
  ) {

    this.isDialogMode = !!this.dialogRef;
    this.dateTimeForm = this.fb.group({
      date: ['',[Validators.required]],
      hours: ['00',[Validators.required]],
      minutes: ['00',[Validators.required]],
      seconds: ['00',[Validators.required]],
      site: [null,[Validators.required]],
      camera: [null,[Validators.required]],

      isActive: [false]
    });
  }

  isDialogMode = false;

  @Input() isSidePanelOpen: any;

  @Output() sidePanelClosed = new EventEmitter<boolean>();

  Cameras: any[] = [];
 Sites: any=[];
  site: any;
  camera: any;

  ngOnInit() {
    this.getSitesforUser();

      this.dateTimeForm.get('site')?.valueChanges.subscribe((siteId: any) => {

    if (siteId) {

      // reset camera when site changes
      this.dateTimeForm.patchValue({ camera: null });

      this.getMonitoringStatus_cameras(siteId);
    }

  });

  }


    getSitesforUser() {

    this.SiteSer.getSites().subscribe((res: any) => {

      if (res.Status === 'Success') {

        this.Sites = res.sites;
      }
    });
  }

monitoringCameras:any=[];

    getMonitoringStatus_cameras(siteId: any) {
      this.monitoringCameras=[];

    this.SiteSer.getCamerasForForPortal({ siteId: siteId }).subscribe(
      (res: any) => {
        this.monitoringCameras = res;
      }
    );
  }

  closeSidePanel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.sidePanelClosed.emit(false);
  }

  getFormattedDateTime() {
    const { date, hours, minutes, seconds } = this.dateTimeForm.value;

    if (!date) return ;

const formattedDate = this.datePipe.transform(
  this.dateTimeForm.value.date,
  'yyyy-MM-dd'
);

    return `${formattedDate} ${hours}:${minutes}:${seconds}`;
  }


onFileChange(event: any) {
  const file = event.target.files[0];

  if (!file) return;

  this.setSingleFile(file);
    event.target.value = '';
}



 selectedFiles: any = null;

setSingleFile(file: File) {

  const reader = new FileReader();

  reader.onload = () => {
    this.selectedFiles = {
      file: file,
      name: file.name,
      type: file.type,
      preview: reader.result
    }
  };

  reader.readAsDataURL(file);
}

  removeFile() {
    this.selectedFiles=null;
  }
isLoading = false;


  postScreenshot() {
    if(this.selectedFiles==null){
       return this.alertSrvc.error("Please upload image");
    }

        if (this.dateTimeForm.invalid) {
       return this.alertSrvc.error("Please fill all fields");
     }

     this.isLoading=true;

    let user = this.storageSer.getData('session');
   let data = this.dateTimeForm.get('camera')?.value;
    let time = this.getFormattedDateTime();
    data.time = time;
    data.color = 'green';
    data.nativeApp=this.dateTimeForm.get('isActive')?.value;
    data.id= uuid();


    let file= this.selectedFiles?.file;

    this.camSer.screenshots(data, file).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
              this.event_service
                .write2Dispatchcustomevent({
                  ...data,
                  queue_name: this.storageSer.getData(2),
                  actionTag: 'suspicious',
                  userName: user?.UserName,
                  userLevelAlarmInfo: [
                    {
                      level: 1,
                      user: user?.UserId,
                      actionTag: 2,
                      subActionTag: 23,
                      activityDetTime: time,
                      alarm: data?.audioUrl ? 'P' : 'N',
                      landingTime: time,
                      reviewStart: time,
                      reviewEnd: time,
                      notes: '',
                      userName: user?.UserName,
                    },
                  ],
                })
                .subscribe({
                  next: (res) => {

                    this.dialogRef.close();
                    this.alertSrvc.snackSuccess(
                      'Event generated successfully!'
                    );
                       this.isLoading=false;
                  },
                  error: (err) => {

                     this.isLoading=false;
                    this.alertSrvc.snackError('Event generated failed!');
                  },
                });

        }
      },
      error: (err) => {

         this.isLoading=false;
        this.alertSrvc.snackError('Event generated failed!');
      },
    });
  }
}
