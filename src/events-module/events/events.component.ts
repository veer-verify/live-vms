import { DatePipe } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { LiveComponent } from 'src/events-module/live/live.component';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { SiteService } from 'src/services/site.service';
import { ManualprocessComponent } from '../../app/manualprocess/manualprocess/manualprocess.component';
import { PlaybackInfoComponent } from '../playback-info/playback-info.component';
import moment from 'moment';

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
    private siteser: SiteService,
  ) { }


  environment = environment.eventImageUrl;
  path: any;
  user: any;
  eventData: any = [];

  ngOnInit() {
    this.path = this.router.url.split('/').at(-1);
    this.user = this.storage_service.getUser();

    this.getActionTagCategories();
    this.poolEvents();
    this.aliveUser();
    this.consumeConsoleEvents();
  }

  ngDoCheck() {
    if (this.eventData.length === 6) {
      this.event_service.stopEventPooling();
    }
    this.storage_service.events_sub.next(this.eventData.length);
  }

  aliveUser() {
    this.event_service.aliveUser().subscribe();
  }

  consumeConsoleEvents() {
    this.event_service
      .consumeConsoleEvents({
        userId: 0,
        consoleType: '',
        consumeType: 'refresh',
      })
      .subscribe();
  }

  poolEvents() {
    this.event_service.getDispatchData().subscribe({
      next: (res: any) => {
        if (res.length !== 0) {
          this.storage_service.status_text = '';
          this.event_service
            .addQueusInfoRedis({
              userId: 0,
              level: '',
              queueInfo: { ...res[0] },
              queueName: '',
              consoleType: '',
            })
            .subscribe();
          res.forEach((item: any) => {
            item.landingTime = this.storage_service.getTimeWithTimezone(item.timezone);
            item.audioPlayed = false;

            if (!this.eventData.some((el: any) => el.id === item.id)) {
              this.eventData.push(item);
            }
          })

          if (this.eventData.length === 1) {
            const [event] = this.eventData;
            this.displayCurrent(event);
          }
        }
      },
      error: () => { },
    });
    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events'
    } else {
      this.storage_service.status_text = ''
    }

  }

  currentItem: any;
  object: string = 'person';
  // selectedActionTag: any;
  emailObject: any;
  alertType: any;
  alertSubType: any;

  @ViewChild('currentBtn') currentBtn!: ElementRef;
  displayCurrent(data: any) {
    if (!data) return;
    this.currentItem = null;
    this.resetVals();
    data.reviewStart = this.storage_service.getTimeWithTimezone(data.timezone);
    this.storage_service.status_text = 'loading...';
    setTimeout(() => {
      this.storage_service.status_text = '';
      this.currentItem = data;
      this.getCurrentSiteAlerts(data);
      // this.listActionTags(data);
    }, 100);
  }

  getCurrentSiteAlerts(data: any) {
    this.siteser.getAlertCategoriesForSiteId(data).subscribe((res: any) => {
      this.alertTypes = res;
    });
  }

  onAlertChange(alertId: string) {
    const selectedAlert = this.alertTypes.find(
      (a: any) => a.guardAlertTypeId === this.alertType,
    );
    this.alertSubTypes = selectedAlert ? selectedAlert.subAlerts : [];
  }

  resetVals() {
    // this.emailData = null;
    // this.selectedActionTag = null;
    this.alertType = null;
    this.alertSubType = null;
    this.object = 'person';
    this.currentActionTag = null;
  }

  // closeEvent(data: any) {
  //   if (!data) return;
  //   this.currentItem = data;
  //   let index = this.eventData.indexOf(this.currentItem);

  //   if (this.eventData.length === index + 1) {
  //     this.eventData.splice(index, 1);
  //     this.currentItem = this.eventData[index - 1];
  //   } else {
  //     this.eventData.splice(index, 1);
  //     this.currentItem = this.eventData[index];
  //   }

  //   if (this.eventData.length === 0) {
  //     this.storage_service.status_text = 'no events';
  //   }
  // }

  cancelEvent() {
    this.resetVals();

    const index = this.eventData.findIndex((el: any) => el.id === this.currentItem?.id);
    if (this.eventData.length === index + 1) {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index - 1];
    } else {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index];
    }

    if (this.eventData.length < 6) {
      this.event_service.stopEventPooling();
      this.poolEvents();
    };

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events';
    }

    this.actionsTaken = Array.from(this.cameraDetails?.actionsTaken, (el: any) => ({ name: el.value, selected: false, time: null, status: false, editing: false }));

  }

  isPlaying: boolean = false;
  sirenTime: any;
  audio() {
    this.isPlaying = true;
    this.currentItem.audioPlayed = true;
    ((this.sirenTime = this.storage_service.getTimeWithTimezone(
      this.currentItem?.timezone,
    )),
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
          error: () => {
            this.isPlaying = false;
            this.alert_service.snackError('Siren not Played!');
          },
        }));
  }

  emailData: any;
  smsDetails: any;
  // toEmails: any;
  // ccEmails: any;
  // bccEmails: any;

  getEmailDataForVMSEvents() {
    this.emailObject = {
      siteId: this.currentItem?.siteId,
      alertTypeId: this.alertType,
      subTypeId: this.alertSubType,
      camerasList: this.currentItem?.cameraId,
      day: this.storage_service.weekdays[
        this.storage_service.getDay(this.currentItem?.timezone)
      ],
      hour: this.storage_service.getHour(this.currentItem?.timezone),
      currentTime: this.currentItem?.timestamp,
      imageName: this.currentItem?.imageName,
    };

    if (this.alertSubType != undefined && this.alertType != undefined) {
      this.camera_service.getEmailDataForVMSEvents(this.emailObject).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.emailData = res.emailDetails;
            this.smsDetails = res.smsDetails;
            // const emails = this.emailData;
            // this.toEmails = (emails.recipientEmails || []).filter((e: any) => e && e.trim() !== '');
            // this.ccEmails = (emails.Cc || []).filter((e: any) => e && e.trim() !== '');
            // this.bccEmails = (emails.BCC || []).filter((e: any) => e && e.trim() !== '');
          }
        },
        error: () => [this.alert_service.snackError('connection failed!')],
      });
    }
  }

  eventsGenericEmail(type: string) {
    // if (this.emailData?.recipientEmails?.length) {
    // const output = this.currentItem?.userLevelAlarmInfo.flatMap((item: any) => item?.actionsTakenInfo).filter((item: any) => item?.status).map((el: any) => el.name).join(',');
    const output = this.currentItem?.userLevelAlarmInfo.flatMap((item: any) => item?.actionsTakenInfo);

    this.camera_service
      .eventsGenericEmail({
        ...this.emailObject,
        ...this.currentItem,
        ...this.emailData,
        ...this.currentSubActionTag,
        ...{ type: type },
        ...{ address: this.cameraDetails?.address },
        ...{ objectName: this.object },
        // ...{ selectedAction: this.selectedActionTag },
        actionTaken: output,
        textDetails: this.smsDetails,
      })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.alert_service.snackSuccess(res.message);
          } else {
            this.alert_service.error(res.message);
          }
        },
        error: () => {
          this.alert_service.error('Sending Email Failed!');
        },
      });
    // } else {
    //   this.alert_service.error('Email data not Found');
    // }
  }

  notes: string = '';
  updateEventFullDetails(type: number | string) {
    if (type === 2) return;

    if (type !== 1) {
      const isChecked = this.actionsTaken.every((item: any) => item.selected);
      if (!isChecked) return this.alert_service.error('All actions are mandatory please update them!');
    }

    if (type === 'second-level') {
      this.eventsGenericEmail('complete');
    }

    const user = this.storage_service.getData('session');
    const endTime = this.storage_service.getTimeWithTimezone(
      this.currentItem?.timezone,
    );

    this.path === 'pre-dispatch'
      ? this.currentItem?.userLevelAlarmInfo.push({
        level: 2,
        user: user?.UserId,
        alarm: this.currentItem?.audioPlayed ? 'P' : 'N',
        activityDetTime: this.sirenTime ?? '',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: endTime ?? '',
        actionTag: this.currentActionTag?.categoryId,
        subActionTag: this.currentSubActionTag?.subCategoryId,
        notes: this.notes,
        userName: user?.UserName,
        alertTag: this.alertType,
        subAlertTag: this.alertSubType,
        actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
          delete el.editing
        })

      })
      : this.path === 'dispatch'
        ? this.currentItem?.userLevelAlarmInfo.push({
          level: 3,
          user: user?.UserId,
          alarm: this.currentItem?.audioPlayed ? 'P' : 'N',
          activityDetTime: this.sirenTime ?? '',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: this.notes,
          userName: user?.UserName,
          actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
            delete el.editing
          })

        })
        : this.currentItem?.userLevelAlarmInfo.push({
          level: 4,
          user: user?.UserId,
          alarm: this.currentItem?.audioPlayed ? 'P' : 'N',
          activityDetTime: this.sirenTime ?? '',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: this.notes,
          userName: user?.UserName,
          actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
            delete el.editing
          })
        });

    this.event_service
      .consumeConsoleEvents({
        userId: 0,
        eventTime: [this.currentItem.timestamp],
        consoleType: '',
        consumeType: '',
      })
      .subscribe();

    this.storage_service.show_loader = true;
    this.event_service
      .updateEventFullDetails({
        ...this.currentItem,
        type,
        actionTag: this.currentActionTag?.categoryId,
        subActionTag: this.currentSubActionTag?.subCategoryId,
        objectName: this.object,
        userActionTime: this.userActionTime,
        userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo
      })
      .subscribe({
        next: () => {
          this.storage_service.show_loader = false;
          this.sirenTime = null;

          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackSuccess('Event Updated successfully!');
        },
        error: () => {
          this.storage_service.show_loader = false;
          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackError('Failed!');
        },
      });
  }

  write2Dispatch(queue_name: string) {
    const isChecked = this.actionsTaken.every((item: any) => item.selected);
    if (!isChecked) return this.alert_service.error('All actions are mandatory please update them!');

    if (this.path === 'pre-dispatch') {
      this.eventsGenericEmail('escalate');
    }

    this.event_service
      .consumeConsoleEvents({
        userId: 0,
        eventTime: [this.currentItem.timestamp],
        consoleType: '',
        consumeType: '',
      })
      .subscribe();

    let user = this.storage_service.getData('session');
    let endTime = this.storage_service.getTimeWithTimezone(
      this.currentItem?.timezone,
    );
    this.path === 'pre-dispatch'
      ? this.currentItem?.userLevelAlarmInfo.push({
        level: 2,
        user: user?.UserId,
        alarm: 'N',
        landingTime: this.currentItem?.landingTime ?? '',
        reviewStart: this.currentItem?.reviewStart ?? '',
        reviewEnd: endTime ?? '',
        actionTag: this.currentActionTag?.categoryId,
        subActionTag: this.currentSubActionTag?.subCategoryId,
        notes: this.notes,
        userName: user?.UserName,
        alertTag: this.alertType,
        subAlertTag: this.alertSubType,
        actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
          delete el.editing
        })

      })
      : this.path === 'dispatch'
        ? this.currentItem?.userLevelAlarmInfo.push({
          level: 3,
          user: user?.UserId,
          alarm: 'N',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: this.notes,
          userName: user?.UserName,
          actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
            delete el.editing
          })

        })
        : this.currentItem?.userLevelAlarmInfo.push({
          level: 4,
          user: user?.UserId,
          alarm: 'N',
          landingTime: this.currentItem?.landingTime ?? '',
          reviewStart: this.currentItem?.reviewStart ?? '',
          reviewEnd: endTime ?? '',
          actionTag: this.currentActionTag?.categoryId,
          subActionTag: this.currentSubActionTag?.subCategoryId,
          notes: this.notes,
          userName: user?.UserName,
          actionsTakenInfo: this.actionsTaken.forEach((el: any) => {
            delete el.editing
          })

        });
    this.currentItem.time = this.currentItem.timestamp;
    this.storage_service.show_loader = true;
    this.event_service
      .write2Dispatch({
        ...this.currentItem,
        queue_name: queue_name,
        userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo,
      })
      .subscribe({
        next: () => {
          this.storage_service.show_loader = false;
          this.cancelEvent();
          this.alert_service.snackSuccess('Event Sent successfully!');
        },
        error: () => {
          this.cancelEvent();
          this.storage_service.show_loader = false;
        },
      });
  }

  @ViewChild('image') image!: ElementRef;
  async downloadImg() {
    html2canvas(this.image.nativeElement).then((canvas) => {
      let imageData = canvas.toDataURL('image/png');
      let link = document.createElement('a');
      link.href = imageData;
      link.download = `${new Date()}.png`;
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

  openLiveDialog(i: any) {
    this.currentItem.liveControl = i;
    this.dialog.open(LiveComponent, {
      data: this.currentItem,
      disableClose: true,
    });
  }

  // listActionTags(data: any) {
  // this.camera_service
  //   .listActionTags(data)
  //   .subscribe((res: any) => {
  //     if (res.statusCode === 200) {
  //       // this.getTypes();
  //       this.actionTags = res.data.flatMap((item: any) => item.actionTags);
  //     }
  //   });
  // }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  // actionsTakenTypes: any = [];
  actionsTaken: any = [];
  getTypes() {
    // this.metadata_service.getMetadata().subscribe((res: any) => {
    //   res.forEach((item: any) => {
    // if (item.type === 98) {
    //   this.alertTypes = item.metadata;
    // }
    // if (item.type === 99) {
    //   this.alertSubTypes = item.metadata;
    // }
    // if (item.typeName === 'ActionsTaken') {
    //   this.actionsTakenTypes = item.metadata;
    // }
    // });

    console.log(this.cameraDetails)
    this.actionsTaken = Array.from(this.cameraDetails?.actionsTaken, (el: any) => ({ name: el.value, selected: false, time: null, status: false, editing: false }));
    console.log(this.actionsTaken);
    // });
  }

  onSelectionChange(item: any, event: any) {
    item.selected = event.selected;
    if (item.selected) {
      item.time = this.storage_service.getTimeWithTimezone(this.currentItem?.timezone);
    } else {
      item.time = null;
    }
  }

  enableEdit(item: any, event: Event) {
    event.stopPropagation();
    item.editing = true;
    // item.time = this.storage_service.getTimeWithTimezone(this.currentItem?.timezone);
  }

  formatDate(date: any) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  updateTime(item: any, event: any) {
    const modifiedTime = new Date(event.target.value);
    item.time = this.datePipe.transform(modifiedTime, 'yyyy-MM-dd HH:mm:ss');
  }

  saveEdit(item: any, event: Event) {
    event.stopPropagation();
    item.editing = false;
  }

  toggleResponded(item: any, event: Event) {
    event.stopPropagation();
    item.status = !item.status;
  }

  actionTagsNew: any = [];
  subActionTags: any = [];
  currentActionTag: any;
  currentSubActionTag: any;
  getActionTagCategories() {
    this.event_service.getActionTagCategories().subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.actionTagsNew = res.actionTagCategories.filter(
            (item: any) => item.categoryId !== 3
          );
        }
      },
    });
  }

  cameraDetails: any;
  userActionTime: any;
  getCurrentType(type: any) {
    this.currentSubActionTag = null;
    this.cameraDetails = null;
    this.alertType = null;
    this.alertSubType = null;
    this.emailData = null;
    this.notes = '';

    this.currentActionTag = type;
    this.userActionTime = this.storage_service.getTimeWithTimezone(
      this.currentItem?.timezone,
    );

    const filteredData = this.actionTagsNew.filter(
      (item: any) => item?.categoryId === type?.categoryId,
    );
    this.subActionTags = filteredData.flatMap(
      (el: any) => el.actionTagSubCategories,
    );

    this.event_service
      .getMonitoringInfo(this.currentItem)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.cameraDetails = res;
          this.getTypes();
        }
      });
  }

  getDays(obj: any) {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({
      key,
      value: obj[key],
    }));
  }

  getValidEmails(emails: string | string[] | undefined): string[] {
    if (!emails) return [];

    if (Array.isArray(emails)) return emails;

    try {
      // Replace single quotes with double quotes and parse
      const parsed = JSON.parse(emails.replace(/'/g, '"'));
      return Array.isArray(parsed)
        ? parsed.filter((e) => e && e.trim() !== '')
        : [];
    } catch (e) {
      return [];
    }
  }
  currentScreen!: string;
  maxmizeScreen(type: string) {
    this.currentScreen = type;
  }

  monitoringImage: any;
  eventsImage: any;
  showLoader: boolean = false;

  get hasMonitoringHours(): boolean {
    const obj = this.cameraDetails?.cameras[0]?.monitoringHoursDetails;
    return obj && Object.keys(obj).length > 0;
  }

  @ViewChild('monitoringImg') monitoringImg = {} as TemplateRef<any>;
  @ViewChild('eventsImg') eventsImg = {} as TemplateRef<any>;
  @ViewChild('eventSrc') eventSrc!: ElementRef;
  @ViewChild('monitoringSrc') monitoringSrc!: ElementRef;

  getImages(i: any) {
    this.monitoringImage = null;
    this.eventsImage = null;

    this.storage_service.showMediaLoader = true;

    if (i == 1) {
      this.dialog.open(this.monitoringImg);
      this.event_service
        .getImagesForCameraId(this.currentItem)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.monitoringImage = res.data?.monitoringImage;
            this.storage_service.showMediaLoader = false;
          } else {
            this.monitoringSrc.nativeElement.src =
              'assets/icons/eyedisabled.svg';
          }
        });
    } else {
      this.dialog.open(this.eventsImg);
      this.event_service
        .getImagesForCameraId(this.currentItem)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.eventsImage = res.data?.eventsImage;
            this.storage_service.showMediaLoader = false;
          } else {
            this.eventSrc.nativeElement.src = 'assets/icons/eyedisabled.svg';
          }
        });
    }
  }

  ngOnDestroy() {
    this.eventData = [];
    this.storage_service.events_sub.next(this.eventData.length);

    this.event_service.stopUserPooling();
    this.event_service.stopEventPooling();
  }
}
