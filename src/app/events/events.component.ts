import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, first, fromEvent, interval, map, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { LiveComponent } from 'src/utilities/live/live.component';
import { Send800Component } from '../send800/send800.component';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';

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
  eventPolling = true;
  path: any;
  environment = environment.eventImageUrl;
  ngOnInit() {
    this.path = this.router.url.split('/').at(-1);
    this.listActionTags();
    this.getActionTagCategories();
    this.getDispatchData();
    this.poolEvents();

  }

  poolEvents() {
    this.eventInterval = setInterval(() => {
      if (this.eventData.length < 6) {
        if (!this.eventPolling) return;
        this.eventPolling = false;
        this.event_service.getDispatchData().subscribe({
          next: (res: any) => {
            this.eventPolling = true;
            if (res.length !== 0) {
              this.storage_service.status_text = '';
              res[0].landingTime = moment().tz(res[0].timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
              res[0].audio = false;
              this.eventData.push(...res);
              if (this.eventData.length === 1) {
                this.displayCurrent(this.eventData[0]);
              }
            }
          },
        });
      }
    }, 2000);
  }

  eventData: any = [
    // {
    //     "siteId": 36428,
    //     "siteName": "Albemarle Crossing",
    //     "timezone": "America/Los_Angeles",
    //     "httpUrl": "https://gisus7028live-repo.us2.pitunnel.com/GISUS7028C1",
    //     "cameraId": "GISUS7028C1",
    //     "color": "green",
    //     "id": "3b8a790d-56ea-44bd-9682-048fd01aef4c",
    //     "imageName": "GISUS7028C1_3b8a790d-56ea-44bd-9682-048fd01aef4c_2025-09-20_00-12-24_green.png",
    //     "timestamp": "2025-09-20 00:12:24:290",
    //     "userLevels": 0,
    //     "actionTag": "suspicious",
    //     "actionTime": "2025-09-20 12:12:25:193",
    //     "eventTag": "",
    //     "userLevelAlarmInfo": [
    //         {
    //             "level": 1,
    //             "user": 1626,
    //             "alarm": "N",
    //             "landingTime": "2025-09-20 00:12:24:290",
    //             "reviewStart": "2025-09-20 00:12:24:290",
    //             "reviewEnd": "2025-09-20 00:12:24:290",
    //             "actionTag": 2,
    //             "subActionTag": 23,
    //             "notes": ""
    //         }
    //     ],
    //     "userName": "ivisusnew"
    // }
  ];

  getDispatchData() {
    this.storage_service.status_text = 'loading...';
    this.event_service.getDispatchData().subscribe({
      next: (res: any) => {
        if (res.length !== 0) {
          this.storage_service.status_text = '';
          res[0].landingTime = moment().tz(res[0].timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
          res[0].audio = false;
          this.eventData.push(...res);
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

  @ViewChild('currentBtn') currentBtn!: ElementRef;
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
    this.currentActionTag = null;
  }

  closeEvent(data: any) {
    this.currentItem = data;
    let index = this.eventData.indexOf(this.currentItem);

    if (this.eventData.length === (index + 1)) {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index - 1]
    } else {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index];
    }

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  cancelEvent() {
    this.resetVals();

    let index = this.eventData.indexOf(this.currentItem);
    if (this.eventData.length === (index + 1)) {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index - 1]
    } else {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index];
    }

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events!';
    }
  }

  isPlaying: boolean = false;
  sirenTime: any;
  audio() {
    this.isPlaying = true;
    this.currentItem.audio = true;
    this.sirenTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS'),
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
    let day = moment.tz(this.currentItem?.timezone).day();
    let hour = moment.tz(this.currentItem?.timezone).hours();

    this.emailObject = {
      siteId: this.currentItem?.siteId,
      alertTypeId: this.alertType,
      subTypeId: this.alertSubType,
      camerasList: this.currentItem?.cameraId,
      day: this.storage_service.weekdays[day],
      hour: hour,
      currentTime: moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss'),
      imageName: this.currentItem?.imageName
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
        this.cancelEvent();
        this.displayCurrent(this.currentItem)

        if (res.statusCode === 200) {
          this.alert_service.snackSuccess(res.message);
        } else {
          this.alert_service.snackError(res.message);
        }
      },
      error: (err) => {
        this.cancelEvent();
        this.displayCurrent(this.currentItem)
      }
    });
  }

  submit(type: number) {
    if (type === 2) return;

    let user = this.storage_service.getData('userData');
    let endTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
    this.path === 'events' ?
      this.currentItem?.userLevelAlarmInfo.push(
        {
          level: 2,
          user: user?.UserId,
          alarm: this.currentItem?.audio ? 'P' : 'N',
          activityDetTime: this.sirenTime ?? '',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: ''
        }
      ) :
      this.currentItem?.userLevelAlarmInfo.push(
        {
          level: 3,
          user: user?.UserId,
          alarm: this.currentItem?.audio ? 'P' : 'N',
          activityDetTime: this.sirenTime ?? '',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: ''
        }
      );

    // this.currentItem.imageName = null;
    this.storage_service.show_loader = true;
    this.event_service.updateEventFullDetails({
      ...this.currentItem,
      type,
      actionTag: this.currentActionTag?.categoryId,
      subActionTag: this.currentSubActionTag?.subCategoryId,
      objectName: this.object,
      actionTagTime: this.actionTagTime,
      // activityDetTime: this.sirenTime ?? '',
      userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
    }).subscribe({
      next: () => {
        this.storage_service.show_loader = false;
        this.sirenTime = null;
        this.alert_service.snackSuccess('Alert sent successfully!');
        if (type === 3) {
          this.sendEmail();
        } else {
          this.cancelEvent();
          this.displayCurrent(this.currentItem)
        }
      },
      error: (err) => {
        this.storage_service.show_loader = false;
        this.cancelEvent();
        this.displayCurrent(this.currentItem);
        this.alert_service.snackError('failed!');
      }
    })
  }

  actionTagTime: any;
  getTime() {
    this.actionTagTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');
  }

  submitAndSend() {
    let user = this.storage_service.getData('userData');
    let endTime = moment().tz(this.currentItem?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');

    this.path === 'events' ?
      this.currentItem?.userLevelAlarmInfo.push(
        {
          level: 2,
          user: user?.UserId,
          alarm: 'N',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
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
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: ''
        }
      );

    this.currentItem.time = this.currentItem.timestamp;
    this.storage_service.show_loader = true;
    this.event_service.write2Dispatch({
      ...this.currentItem,
      queue_name: 'dispatch-3rd-level',
      userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
    })
      .subscribe({
        next: () => {
          this.storage_service.show_loader = false;
          // this.sendEmail();
          this.cancelEvent();
          this.alert_service.snackSuccess('Alert sent successfully!');
        },
        error: (err) => {
          this.cancelEvent();
          this.storage_service.show_loader = false;
        }
      });
  }

  @ViewChild('image') image!: ElementRef;
  async downloadImg() {
    html2canvas(this.image.nativeElement).then((canvas) => {
      let imageData = canvas.toDataURL("image/png");
      let link = document.createElement('a');
      link.href = imageData;
      link.download = `${new Date()}.png`
      link.click();
    });

    // const img = new Image();
    // img.crossOrigin = 'anonymous';
    // img.src = this.environment + this.currentItem?.imageName;
    // img.onload = () => {
    //     const ctx = this.image.nativeElement.getContext('2d');
    //     ctx.drawImage(img, 0, 0);
    //     const screenshotDataUrl = this.image.nativeElement.toDataURL('image/png');
    //     const link = document.createElement('a');
    //     link.href = screenshotDataUrl;
    //     link.download = `${new Date()}.png`
    //     link.click();
    // };
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

  actionTagsNew: any = [];
  subActionTags: any = [];
  currentActionTag: any;
  currentSubActionTag: any;
  getActionTagCategories() {
    this.event_service.getActionTagCategories().subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.actionTagsNew = res.actionTagCategories;
        }
      }
    })
  }

  getCurrentType(type: any) {
    this.currentSubActionTag = null;
    this.getTime();
    this.currentActionTag = type;
    let filteredData = this.actionTagsNew.filter((item: any) => item.categoryId === type.categoryId);
    this.subActionTags = filteredData.flatMap((el: any) => el.actionTagSubCategories);
  }

  open800() {
    this.dialog.open(Send800Component, {
      data: { ...this.currentItem, ...this.emailData }
    });
  }

  ngOnDestroy() {
    clearInterval(this.eventInterval)
  }
}
