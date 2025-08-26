import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { LiveComponent } from 'src/utilities/live/live.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  constructor(
    public storage_service: StorageService,
    private metadata_service: MetadataService,
    private camera_service: CameraService,
    private event_service: EventService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private alert_service: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.listActionTags();
    this.getTypes();
    this.getDispatchData();

    setInterval(() => {
      this.event_service.getDispatchData().subscribe({
        next: (res: any) => {
          if (res.length !== 0) {
            this.eventData.push(...res);
          }
        },
      });
    }, 10000);
  }

  actionForm!: FormGroup;
  initializeActionForm() {
    this.actionForm = this.fb.group({});
  }

  eventData: any = [];
  getDispatchData() {
    this.event_service.getDispatchData().subscribe({
      next: (res: any) => {
        if (res.length !== 0) {
          this.eventData.push(...res);
          this.displayCurrent(this.eventData[0]);
        }
      },
    });
  }

  currentItem: any;
  actionTag: any;
  emailObject: any;
  alertType: any;
  alertSubType: any;
  displayCurrent(data: any) {
    this.currentItem = data;
    // let cameraCurrentTime = moment().tz(data.camera?.timezone)?.format('YYYY-MM-DD HH:mm:ss');
  }

  categoryEmpty(i: string) {
    switch (i) {
      case 'action':
        // this.alertType = [];
        this.alertSubType = [];
        break;
      case 'alert':
        this.alertSubType = [];
        break;
      default:
    }
  }

  emailData: any;
  getEmailData() {
    let day = new Date().getDay();
    let hour = new Date().getHours();

    this.emailObject = {
      siteId: this.currentItem?.siteId,
      alertTypeId: this.alertType,
      subTypeId: this.alertSubType,
      camerasList: this.currentItem?.cameraId,
      day: this.storage_service.weekdays[day],
      hour: hour,
      currentTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:MM:SS'),
    };

    if (this.alertSubType != undefined && this.alertType != undefined) {
      this.storage_service.status_text = 'loading...';

      this.camera_service.getEmailData(this.emailObject).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.storage_service.status_text = '';
            this.emailData = res.emailDetails;
            // this.emailData.screenshots = ['assets/images/cam.png', 'assets/images/cam.png', 'assets/images/cam.png']
          } else {
            this.emailData = null;
            this.storage_service.status_text = res.message;
          }
        },
      });
    }
  }

  updateFulleventDetails() {
  

    this.event_service.updateEventFullDetails({...this.currentItem}).subscribe((res: any) => 
      {
        
      });
  }

  sendEmail() {
    let dateObj = {
      eventFromTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:MM:SS'),
      eventToTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:MM:SS'),
      objectName: 'Person',
    };
    this.camera_service
      .email_with_incident({
        ...this.emailObject,
        ...dateObj,
        ...this.currentItem,
      })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.alert_service.snackSuccess(res.message);
          } else {
            this.alert_service.snackError(res.message);
          }
        },
      });
  }

  sendsubmitEmail() {
    this.updateFulleventDetails();
    this.sendEmail();
  }

  submitsendEmailto3rdperson() {
    this.updateFulleventDetails();
    this.sendEmail();
  }

  openLiveDialog() {
    this.dialog.open(LiveComponent, {
      data: this.currentItem
    })
  }

  listActionTags() {
    this.camera_service
      .listActionTags({ siteId: 36416 })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.actionTags = res.data[0].actionTags;
        }
      });
  }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  getTypes() {
    this.metadata_service.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        if (item.type === 98) {
          this.alertTypes = item.metadata;
        }
        if (item.type === 99) {
          this.alertSubTypes = item.metadata;
        }
      });
    });
  }
}
