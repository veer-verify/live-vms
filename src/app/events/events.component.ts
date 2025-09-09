import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { fromEvent, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { LiveComponent } from 'src/utilities/live/live.component';
import { Send800Component } from '../send800/send800.component';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
  ) { }

  eventInterval: any;
  path: any;
  environment = environment.eventImageUrl;
  ngOnInit() {
    this.path = this.router.url.split('/').at(-1);
    this.listActionTags();
    // this.getDispatchData();

    // this.eventInterval = setInterval(() => {
    //   if (this.eventData.length < 6) {
    //     this.event_service.getDispatchData().subscribe({
    //       next: (res: any) => {
    //         if (res.length !== 0) {
    //           this.storage_service.status_text = '';
    //           this.eventData.push(...res);
    //           this.eventData.forEach((item: any) => item.landingTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'))
    //         }
    //       },
    //     });
    //   }
    // }, 2000);
  }

  eventData: any = [{
    "siteId": 36428,
    "siteName": "Albemarle Crossing",
    "timezone": "America/Los_Angeles",
    "httpUrl": "https://gisus7028live-repo.us2.pitunnel.com/GISUS7028C1",
    "cameraId": "GISUS7028C1",
    "color": "green",
    "id": "bc63d4a2-f62d-4ad6-a9e9-f6ac494ec167",
    "imageName": "GISUS7028C1_bc63d4a2-f62d-4ad6-a9e9-f6ac494ec167_2025-09-06_06-02-41_green.png",
    "timestamp": "2025-09-06 06:02:41",
    "userLevels": 0,
    "actionTag": "suspicious",
    "actionTime": "2025-09-06 06:02:46:022",
    "eventTag": "",
    "userLevelAlarmInfo": [
      {
        "level": 1,
        "user": 1626,
        "alarm": "N",
        "landingTime": "",
        "reviewStart": "",
        "reviewEnd": "",
        "actionTag": "suspicious",
        "subActionTag": "",
        "notes": ""
      }
    ]
  }];

  getDispatchData() {
    this.storage_service.status_text = 'loading...';
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

  @ViewChildren('currentBtn') currentBtn!: QueryList<ElementRef>;
  displayCurrent(data: any) {
    this.currentItem = null;
    this.resetVals();
    data.reviewStart = moment().tz(data?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
    this.storage_service.status_text = 'loading...'
    setTimeout(() => {
      this.storage_service.status_text = ''

      this.currentItem = data;
      this.eventIndex = this.eventData.indexOf(this.currentItem);
    }, 500);

  }

  resetVals() {
    this.emailData = null;
    this.actionTag = null;
    this.alertType = null;
    this.alertSubType = null;
    this.object = 'person';
  }

  closeEvent(data: any) {
    if (data?.timestamp == this.currentItem?.timestamp) {
      let index = this.eventData.indexOf(this.currentItem);
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index];
    } else {
      this.currentItem = null;
      let index = this.eventData.indexOf(data);
      this.eventData.splice(index, 1);
    }

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  cancelEvent() {
    this.resetVals();
    let index = this.eventData.indexOf(this.currentItem);
    this.eventData.splice(index, 1);
    this.currentItem = this.eventData[index];

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  isPlaying: boolean = false;
  audio() {
    this.isPlaying = true;
    this.http
      .get(`${environment.site_url}/play_1_0/${this.currentItem.cameraId}`)
      .subscribe({
        next: (res: any) => {
          this.isPlaying = false;
          if (res.statusCode === 200) {
            this.alert_service.snackSuccess(res.message);
          } else {
            this.alert_service.snackError(res.message);
          }

        },
        error: (err) => {
          this.isPlaying = false
          this.alert_service.snackError('Siren not Played!');

        }
      }
      );
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
  suspiciousTime: any;
  sendEmail() {
    let dateObj = {
      eventFromTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'),
      eventToTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'),
      objectName: 'Person',
    };
    // this.storage_service.show_loader = true;
    this.camera_service.email_with_incident({
      ...this.emailObject,
      ...dateObj,
      ...this.currentItem,
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          // this.storage_service.show_loader = false;
          this.alert_service.snackSuccess(res.message);
          this.cancelEvent();
        } else {
          // this.storage_service.show_loader = false;
          this.alert_service.snackError(res.message);
        }
      },
      error: (err) => {
        // this.storage_service.show_loader = false;
      }
    });
  }

  // getUserLevelInfo(): Array<any> {
  //   let user = this.storage_service.getData('userData');
  //   let level = this.path === 'events' ? 2 : 3;
  //   return [
  //     {
  //       level: level,
  //       user: user?.UserId,
  //       alarm: 'N',
  //       landingTime: this.currentItem?.landingTime ?? '',
  //       reviewStart: this.currentItem?.reviewStart ?? '',
  //       reviewEnd: this.currentItem?.reviewEnd ?? '',
  //       actionTag: this.currentItem?.actionTag ?? '',
  //       subActionTag: this.currentItem?.subActionTag ?? '',
  //       notes: ''
  //     }
  //   ]
  // }

  submitFalse() {
    let user = this.storage_service.getData('userData');
    this.falseActivityTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
    this.submitTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');

    this.path === 'events' ?
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 2,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    ) :
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 3,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    );
    // this.storage_service.show_loader = true;
    this.event_service.updateEventFullDetails({
      ...this.currentItem,
      actionTag: this.actionTag ? this.actionTag : 'Fasle Activity',
      // eventStartTime: this.currentItem?.timestamp,
      objectName: this.object,
      falseActivityTime: this.falseActivityTime,
      submitTime: this.submitTime,
      userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
    })
      .subscribe({
        next: () => {
          // this.storage_service.show_loader = false;
          this.alert_service.snackSuccess('Alert sent successfully!');
          this.cancelEvent();
        },
        error: (err) => {
          // this.storage_service.show_loader = false;
          this.alert_service.snackError('failed!');
          this.cancelEvent();

        }
      })
  }

  submit() {
    let user = this.storage_service.getData('userData');
    this.submitTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
    this.path === 'events' ?
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 2,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    ) :
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 3,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    );

    this.event_service.updateEventFullDetails({
      ...this.currentItem,
      actionTag: this.actionTag ? this.actionTag : 'Fasle Activity',
      // eventStartTime: this.currentItem?.timestamp,
      objectName: this.object,
      suspiciousTime: this.suspiciousTime,
      submitTime: this.submitTime,
      userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
    })
      .subscribe({
        next: () => {
          this.alert_service.snackSuccess('Alert sent successfully!');
          this.sendEmail();
        },
        error: (err) => {
          this.cancelEvent();
          this.alert_service.snackError('failed!');
        }
      })
  }

  getTime() {
    this.suspiciousTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
  }

  submitAndSend() {
    let user = this.storage_service.getData('userData');
    this.path === 'events' ?
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 2,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    ) :
    this.currentItem?.userLevelAlarmInfo.push(
      {
        level: 3,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: this.falseActivityTime ?? '',
        actionTag: this.currentActionTag?.label ?? '',
        subActionTag: this.currentSubActionTag?.subCategoryName ?? '',
        notes: ''
      }
    );

    this.currentItem.time = this.currentItem.timestamp;
    this.event_service.write2Dispatch({
      ...this.currentItem,
      queue_name: 'dispatch-3rd-level',
      userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
    })
      .subscribe({
        next: () => {
          this.sendEmail();
        }
      });
  }

  openLiveDialog() {
    this.dialog.open(LiveComponent, {
      data: this.currentItem,
      disableClose: false
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

  subActionTags: any = [];
  currentActionTag: any;
    currentSubActionTag: any;
  getActionTagCategories(data: any) {
    this.subActionTags = [];
    this.currentActionTag = data;
    this.event_service.getActionTagCategories(data).subscribe({
      next: (res: any) => {
        if(res.statusCode === 200) {
          this.subActionTags = res.actionTagSubCategories;
        }
      }
    })
  }

  open800() {
    this.dialog.open(Send800Component, {
      data: this.currentItem
    });
  }

  ngOnDestroy() {
    clearInterval(this.eventInterval)
  }
}
