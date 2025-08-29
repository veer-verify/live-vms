import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
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
    private datePipe: DatePipe,
    private alert_service: AlertService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  eventInterval: any;
  path: any;
  environment = environment.eventImageUrl;
  ngOnInit() {
    this.path = this.router.url.split('/').at(-1);
    this.listActionTags();
    this.getDispatchData();

    this.eventInterval = setInterval(() => {
      this.event_service.getDispatchData().subscribe({
        next: (res: any) => {
          if (res.length !== 0) {
            this.storage_service.status_text = '';
            this.eventData.push(...res);
            this.eventData.forEach((item: any) => item.landingTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'))
          }
        },
      });
    }, 5000);
  }

  eventData: any = [];
  getDispatchData() {
    this.storage_service.status_text = 'loading...'
    this.event_service.getDispatchData().subscribe({
      next: (res: any) => {
        if (res.length !== 0) {
          this.storage_service.status_text = '';
          this.eventData.push(...res);
          this.eventData.forEach((item: any) => item.landingTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'))
          this.displayCurrent(this.eventData[0]);
        } else {
          this.storage_service.status_text = 'no events!'
        }
      },
      error: (err: any) => {
        this.storage_service.status_text = 'failed to load event!'
      }
    });
  }

  currentItem: any;
  object: string = 'person';
  actionTag: any;
  emailObject: any;
  alertType: any;
  alertSubType: any;
  eventIndex!: number;
  displayCurrent(data: any) {
    this.currentItem = data;
    this.eventIndex = this.eventData.indexOf(this.currentItem);
  }

  closeEvent(data: any) {
    if (data?.timestamp == this.currentItem?.timestamp) {
      let index = this.eventData.indexOf(this.currentItem);
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index];
    } else {
      let index = this.eventData.indexOf(data);
      this.eventData.splice(index, 1);
    }

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  cancelEvent() {
    let index = this.eventData.indexOf(this.currentItem);
    this.eventData.splice(index, 1);
    this.currentItem = this.eventData[index];

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  categoryEmpty(i: string) {
    this.falseActivityTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
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
      currentTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    };

    if (this.alertSubType != undefined && this.alertType != undefined) {
      this.camera_service.getEmailData(this.emailObject).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.emailData = res.emailDetails;
            // this.emailData.screenshots = ['assets/images/cam.png', 'assets/images/cam.png', 'assets/images/cam.png']
          } else {
            this.emailData = null;
            this.alert_service.snackError(res.message)
          }
        },
        error: (err) => [
          this.alert_service.snackError('connection failed!')
        ]
      });
    }
  }

  falseActivityTime: any;
  submitTime: any;

  sendEmail() {
    let dateObj = {
      eventFromTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'),
      eventToTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'),
      objectName: 'Person',
    };
    this.camera_service.email_with_incident({
      ...this.emailObject,
      ...dateObj,
      ...this.currentItem,
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.alert_service.snackSuccess(res.message);
          this.cancelEvent();
        } else {
          this.alert_service.snackError(res.message);
        }
      },
    });
  }

  submitFalse() {
    this.event_service.updateEventFullDetails({
      ...this.currentItem,
      actionTag: this.actionTag ? this.actionTag : 'Fasle Activity',
      eventStartTime: this.currentItem?.timestamp,
      objectName: this.object,
      submitTime: this.submitTime,
      falseActivityTime: this.falseActivityTime
    }).subscribe({
      next: () => {
        this.alert_service.snackSuccess('Alert sent successfully!');
        this.cancelEvent();
      },
      error: (err) => {
        this.alert_service.snackError('failed!');
        this.cancelEvent();

      }
    })
  }

  submit() {
    this.submitTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
    this.event_service.updateEventFullDetails({
      ...this.currentItem,
      actionTag: this.actionTag ? this.actionTag : 'Fasle Activity',
      eventStartTime: this.currentItem?.timestamp,
      objectName: this.object,
      submitTime: this.submitTime,
      falseActivityTime: this.falseActivityTime
    }).subscribe({
      next: () => {
        this.alert_service.snackSuccess('Alert sent successfully!');
        this.sendEmail();
      },
      error: (err) => [
        this.alert_service.snackError('failed!')
      ]
    })
  }

  submitAndSend() {
    this.event_service.write2Dispatch({ ...this.currentItem, queue_name: 'dispatch-3rd-level' }).subscribe({
      next: () => {
        this.sendEmail();
      }
    });
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
          this.getTypes();
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

  ngOnDestroy() {
    clearInterval(this.eventInterval)
  }
}
