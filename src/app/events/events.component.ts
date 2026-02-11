import { DatePipe } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, first, fromEvent, interval, map, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { LiveComponent } from 'src/utilities/live/live.component';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { SiteService } from 'src/services/site.service';

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
  ) {}

  intervalId: any;
  eventInterval: any;
  eventPolling = true;
  path: any;
  user: any;
  environment = environment.eventImageUrl;
  ngOnInit() {
    this.path = this.router.url.split('/').at(-1);
    this.user = this.storage_service.getUser();

    this.event_service
      .consumeConsoleEvents({
        userId: 0,
        consoleType: '',
        consumeType: 'refresh',
      })
      .subscribe((res: any) => {});

    this.getActionTagCategories();
    this.getDispatchData();

    this.poolEvents();

    this.aliveUser();

    this.intervalId = setInterval(() => {
      this.aliveUser();
    }, 60000);
  }

  aliveUser() {
    this.event_service.aliveUser().subscribe();
  }

  poolEvents() {
    this.eventInterval = setInterval(() => {
      let menu = this.storage_service.getData('menu');
      if (this.eventData.length < 6 && !menu) {
        if (!this.eventPolling) return;
        this.eventPolling = false;
        this.event_service.getDispatchData().subscribe({
          next: (res: any) => {
            this.eventPolling = true;
            if (res.length !== 0) {
              this.storage_service.status_text = '';
              res[0].landingTime = this.storage_service.getTimeWithTimezone(
                res[0].timezone,
              );
              res[0].audioPlayed = false;
              this.event_service
                .addQueusInfoRedis({
                  userId: 0,
                  level: '',
                  queueInfo: { ...res[0] },
                  queueName: '',
                  consoleType: '',
                })
                .subscribe((res: any) => {});
              this.eventData.push(...res);
              if (this.eventData.length === 1) {
                const [event] = this.eventData;
                this.displayCurrent(event);
              }
            }
          },
          error: (err) => {
            this.eventPolling = true;
          },
        });
      }
      this.storage_service.events_sub.next(this.eventData.length);
    }, 2000);
  }

  eventData: any = [
    // {
    //     "siteId": 36347,
    //     "siteName": "Barbee Pharmacy & Gifts",
    //     "timezone": "America/New_York",
    //     "httpUrl": "https://gisusorin1017live-repo.us1.pitunnel.com/GISUSORIN1017C1",
    //     "cameraId": "GISUSORIN1017C1",
    //     "color": "green",
    //     "id": "603101a8-694a-4585-b430-737c31ca3771",
    //     "imageName": "GISUSORIN1017C1_603101a8-694a-4585-b430-737c31ca3771_2025-10-15_08-29-36_green.png",
    //     "timestamp": "2025-10-15 08:29:36",
    //     "userLevels": 0,
    //     "actionTag": "suspicious",
    //     "actionTime": "2025-10-15 08:29:38",
    //     "eventTag": "",
    //     "userLevelAlarmInfo": [
    //         {
    //             "level": 1,
    //             "user": 1614,
    //             "alarm": "N",
    //             "landingTime": "2025-10-15 08:29:36",
    //             "reviewStart": "2025-10-15 08:29:36",
    //             "reviewEnd": "2025-10-15 08:29:36",
    //             "actionTag": 2,
    //             "subActionTag": 23,
    //             "notes": "",
    //             "activityDetTime": "2025-10-15 08:29:36"
    //         }
    //     ],
    //     "userName": "vamsiv@ivisecurity.com"
    // }
  ];

  getDispatchData() {
    this.storage_service.status_text = 'loading...';
    this.event_service.getDispatchData().subscribe({
      next: (res: any) => {
        if (res.length !== 0) {
          this.storage_service.status_text = '';
          res[0].landingTime = this.storage_service.getTimeWithTimezone(
            res[0].timezone,
          );
          res[0].audioPlayed = false;
          this.eventData.push(...res);
          this.displayCurrent(this.eventData[0]);
          this.storage_service.events_sub.next(this.eventData.length);
          this.event_service
            .addQueusInfoRedis({
              userId: 0,
              level: '',
              queueInfo: { ...res[0] },
              queueName: '',
              consoleType: '',
            })
            .subscribe((res: any) => {});
        } else {
          this.storage_service.status_text = 'no events!';
        }
      },
      error: (err: any) => {
        this.storage_service.status_text = 'failed to load event!';
      },
    });
  }

  currentItem: any;
  object: string = 'person';
  // selectedActionTag: any;
  emailObject: any;
  alertType: any;
  alertSubType: any;
  // eventIndex!: number;

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
      // this.eventIndex = this.eventData.indexOf(this.currentItem);
      this.getCurrentSiteAlerts(data);
      this.listActionTags(data);
    }, 500);
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

  closeEvent(data: any) {
    if (!data) return;
    this.currentItem = data;
    let index = this.eventData.indexOf(this.currentItem);

    if (this.eventData.length === index + 1) {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index - 1];
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
    if (this.eventData.length === index + 1) {
      this.eventData.splice(index, 1);
      this.currentItem = this.eventData[index - 1];
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
          error: (err) => {
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
        error: (err) => [this.alert_service.snackError('connection failed!')],
      });
    }
  }

  eventsGenericEmail(type: string) {
    if (this.emailData?.recipientEmails?.length) {
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
          textDetails: this.smsDetails,
        })
        .subscribe({
          next: (res: any) => {
            // this.cancelEvent();
            // this.displayCurrent(this.currentItem)
            if (res.statusCode === 200) {
              this.alert_service.snackSuccess(res.message);
            } else {
              this.alert_service.error(res.message);
            }
          },
          error: (err) => {
            // this.cancelEvent();
            // this.displayCurrent(this.currentItem);
            this.alert_service.error('Sending Email Failed!');
          },
        });
    } else {
      this.alert_service.error('Email data not Found');
    }
  }
  notes: string = '';
  updateEventFullDetails(type: number | string) {
    if (type === 2) return;
    if (type === 'second-level') {
      this.eventsGenericEmail('complete');
    }

    let user = this.storage_service.getData('session');
    let endTime = this.storage_service.getTimeWithTimezone(
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
          });

    // this.currentItem.imageName = null;

    this.event_service
      .consumeConsoleEvents({
        userId: 0,
        eventTime: [this.currentItem.timestamp],
        consoleType: '',
        consumeType: '',
      })
      .subscribe((res: any) => {});

    this.storage_service.show_loader = true;
    this.event_service
      .updateEventFullDetails({
        ...this.currentItem,
        type,
        actionTag: this.currentActionTag?.categoryId,
        subActionTag: this.currentSubActionTag?.subCategoryId,
        objectName: this.object,
        actionTagTime: this.actionTagTime,
        // activityDetTime: this.sirenTime ?? '',
        userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo,
      })
      .subscribe({
        next: () => {
          this.storage_service.show_loader = false;
          this.sirenTime = null;

          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackSuccess('Event Updated successfully!');
        },
        error: (err) => {
          this.storage_service.show_loader = false;
          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackError('Failed!');
        },
      });
  }

  actionTagTime: any;
  getTime() {
    this.actionTagTime = this.storage_service.getTimeWithTimezone(
      this.currentItem?.timezone,
    );
  }

  write2Dispatch(queue_name: string) {
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
      .subscribe((res: any) => {});

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
        error: (err) => {
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
      disableClose: false,
    });
  }

  listActionTags(data: any) {
    // this.camera_service
    //   .listActionTags(data)
    //   .subscribe((res: any) => {
    //     if (res.statusCode === 200) {
    //       // this.getTypes();
    //       this.actionTags = res.data.flatMap((item: any) => item.actionTags);
    //     }
    //   });
  }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  // getTypes() {
  //   this.metadata_service.getMetadata().subscribe((res: any) => {
  //     res.forEach((item: any) => {
  //       if (item.type === 98) {
  //         this.alertTypes = item.metadata;
  //       }
  //       if (item.type === 99) {
  //         this.alertSubTypes = item.metadata;
  //       }
  //     });
  //   });
  // }

  actionTagsNew: any = [];
  subActionTags: any = [];
  currentActionTag: any;
  currentSubActionTag: any;
  getActionTagCategories() {
    this.event_service.getActionTagCategories().subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.actionTagsNew = res.actionTagCategories.filter(
            (item: any) => item.categoryId !== 3,
          );
        }
      },
    });
  }

  cameraDetails: any;
  getCurrentType(type: any) {
    this.currentSubActionTag = null;
    this.cameraDetails = null;
    this.alertType = null;
    this.alertSubType = null;
    this.emailData = null;
    this.notes = '';
    this.getTime();
    this.currentActionTag = type;
    let filteredData = this.actionTagsNew.filter(
      (item: any) => item.categoryId === type.categoryId,
    );
    this.subActionTags = filteredData.flatMap(
      (el: any) => el.actionTagSubCategories,
    );
    this.event_service
      .getMonitoringInfo(this.currentItem)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.cameraDetails = res;
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
    clearInterval(this.eventInterval);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
