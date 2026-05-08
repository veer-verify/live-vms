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
import { finalize } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [AlertService]
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
    this.event_service.getDispatchData()
      .subscribe({
        next: (res: any) => {
          if (res.length === 0) return;
          this.storage_service.status_text = '';
          const updated = res.map((item: any) => ({
            ...item,
            landingTime: this.storage_service.getTimeWithTimezone(item?.timezone),
            audioPlayed: false,
          }));
          const existingIds = new Set(this.eventData.map((e: any) => e.id));
          const uniqueEvents = updated.filter((e: any) => !existingIds.has(e.id));
          this.eventData = [...this.eventData, ...uniqueEvents];

          uniqueEvents.forEach((event: any) => {
            this.event_service
              .addQueusInfoRedis({
                userId: 0,
                level: '',
                queueInfo: { ...event },
                queueName: '',
                consoleType: '',
              }).subscribe();
          });

          if (this.eventData.length === 1) {
            this.displayCurrent(this.eventData[0]);
          }
        },
        error: () => { }
      });

    this.storage_service.status_text = this.eventData.length === 0 ? 'no events' : '';
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
    this.cameraDetails = null;
    this.resetVals();

    data.reviewStart = this.storage_service.getTimeWithTimezone(data.timezone);
    this.storage_service.status_text = 'loading...';
    setTimeout(() => {
      this.storage_service.status_text = '';
      this.currentItem = data;
      // console.log(this.currentItem);
      // allActions.filter((el: any) => Array.isArray(el) && el.length > 0);
      const allActions = this.currentItem?.userLevelAlarmInfo.flatMap((item: any) => item?.actionsTakenInfo).filter(Boolean);
      console.log(allActions);
      this.getCurrentSiteAlerts(data);

      this.event_service
        .getMonitoringInfo(this.currentItem)
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.cameraDetails = res;

            // this.actionsTaken = allActions.map((item: any) => ({
            //   ...item,
            //   selected: true
            // }))

            this.actionsTaken = Array.from(
              this.cameraDetails?.actionsTaken,
              (el: any) => ({
                name: el.value,
                selected: false,
                time: null,
                status: false,
                editing: false,
              }),
            );

            //   const updated = allActions.map((item: any) => ({
            //     ...item,
            //     status: this.cameraDetails?.actionsTaken.some((sel: any) => sel.name === item.name)
            //   }));
            //   console.log(updated);
            //   this.actionsTaken = updated;
          }
        });
      // this.listActionTags(data);
    }, 100);
  }

  get isMailEnabled(): boolean {
    return this.actionsTaken?.some((item: any) => item.selected);
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

    const index = this.eventData.findIndex(
      (el: any) => el.id === this.currentItem?.id,
    );
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
    }

    if (this.eventData.length === 0) {
      this.storage_service.status_text = 'no events';
    }

    this.actionsTaken = Array.from(
      this.cameraDetails?.actionsTaken,
      (el: any) => ({
        id: el.id,
        name: el.value ?? el.name,
        selected: false,
        time: null,
        status: false,
        disabled: false,
        editing: false,
      }),
    );
    this.syncActionTakenDisabledStates();
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
    const output = this.currentItem?.userLevelAlarmInfo.flatMap(
      (item: any) => item?.actionsTakenInfo,
    );

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

    const user = this.storage_service.getData('session');
    if (user?.userLevel === 3 && type !== 1) {
      if (!this.actionsTaken.some((item: any) => item?.selected))
        return this.alert_service.error(
          'Actions are mandatory please update atleast one of them!'
        );
    }

    if (type === 'second-level') {
      this.eventsGenericEmail('complete');
    }

    const endTime = this.storage_service.getTimeWithTimezone(this.currentItem?.timezone);
    this.currentItem?.userLevelAlarmInfo.push({
      level: user?.userLevel,
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
      actionsTakenInfo: user?.userLevel === 3 ? this.actionsTaken.map((el: any) => {
        const { id, disabled, editing, ...rest } = el;
        return rest;
      }) : [],
    })

    this.event_service
      .consumeConsoleEvents({
        cameraId: [this.currentItem?.cameraId],
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
        error: () => {
          this.storage_service.show_loader = false;
          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackError('Failed!');
        },
      });
  }

  write2Dispatch(queue_name: string) {
    let user = this.storage_service.getData('session');

    if (user?.userLevel === 3) {
      if (!this.actionsTaken.some((item: any) => item?.selected))
        return this.alert_service.error(
          'Actions are mandatory please update atleast one of them!'
        );
    }

    if (this.path === 'pre-dispatch') {
      this.eventsGenericEmail('escalate');
    }

    this.event_service
      .consumeConsoleEvents({
        cameraId: [this.currentItem?.cameraId],
        userId: 0,
        eventTime: [this.currentItem.timestamp],
        consoleType: '',
        consumeType: '',
      })
      .subscribe();

    const endTime = this.storage_service.getTimeWithTimezone(this.currentItem?.timezone);
    this.currentItem?.userLevelAlarmInfo.push({
      level: user?.userLevel,
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
      actionsTakenInfo: user?.userLevel === 3 ? this.actionsTaken.map((el: any) => {
        const { id, disabled, editing, ...rest } = el;
        return rest;
      }) : [],
    })
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
    // });
  }

  //   noActionChecked = false;
  // noActionToggle(event: any) {
  //   this.noActionChecked = event.selected;
  // }



  private isNoActionNecessary(item: any): boolean {
    return (
      item?.id === 4 ||
      String(item?.name ?? '').trim().toLowerCase() === 'no action necessary'
    );
  }

  private syncActionTakenDisabledStates(): void {
    const noActionSelected = this.actionsTaken.some(
      (action: any) =>
        this.isNoActionNecessary(action) && action.selected,
    );
    const hasOtherSelected = this.actionsTaken.some(
      (action: any) =>
        !this.isNoActionNecessary(action) && action.selected,
    );

    this.actionsTaken.forEach((action: any) => {
      if (this.isNoActionNecessary(action)) {
        action.disabled = hasOtherSelected;
      } else {
        action.disabled = noActionSelected;
      }
    });
  }

  onSelectionChange(item: any, event: any) {
    item.selected = event.selected;
    if (item.selected) {
      this.removedActionTakenChips = this.removedActionTakenChips.filter(
        (name: string) => name !== item.name,
      );
    }
    item.time = item.selected
      ? this.storage_service.getTimeWithTimezone(this.currentItem?.timezone)
      : null;
    if (!item.selected) {
      item.status = false;
      item.editing = false;
    }

    if (this.isNoActionNecessary(item) && item.selected) {
      this.actionsTaken.forEach((action: any) => {
        if (!this.isNoActionNecessary(action)) {
          action.selected = false;
          action.time = null;
          action.status = false;
          action.editing = false;
        }
      });
    }

    if (!this.isNoActionNecessary(item) && item.selected) {
      const noActionItem = this.actionsTaken.find((action: any) =>
        this.isNoActionNecessary(action),
      );

      if (noActionItem) {
        noActionItem.selected = false;
        noActionItem.time = null;
        noActionItem.status = false;
        noActionItem.editing = false;
      }
    }

    this.syncActionTakenDisabledStates();
    this.actionsTaken = [...this.actionsTaken];
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
            (item: any) => item.categoryId !== 3,
          );
        }
      },
    });
  }

  cameraDetails: any;
  userActionTime: any;
  getCurrentType(type: any) {
    this.currentSubActionTag = null;
    // this.cameraDetails = null;
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






  @ViewChild('openmailtemplate') openmailtemplate!: TemplateRef<any>;

  isMediaLoading = false;

  resolution: any;

  openMail() {

    if (!this.actionsTaken.some((item: any) => item?.selected))
      return this.alert_service.error(
        'Actions are mandatory please select atleast one of them!'
      );


    this.getEmailDataForVMSEventsmail();

    this.dialog.open(this.openmailtemplate, {
      disableClose: true
    });

  }



  selectedFiles: File[] = [];
  showPreview: boolean = false;
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const allowedTypes = ["image/", "video/"];
    const filesArray = Array.from(input.files);

    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    filesArray.forEach((file) => {
      if (allowedTypes.some((type) => file.type.startsWith(type))) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    // Add valid files
    this.selectedFiles = [...this.selectedFiles, ...validFiles];

    // 🔴 Show toast if invalid files found
    if (invalidFiles.length) {
      this.alert_service.snackError(
        "Only images and videos allowed."
      );
    }

    // Reset input so same file can be selected again
    input.value = "";
  }

  removeFile(index: number, fileInput: HTMLInputElement) {
    this.selectedFiles.splice(index, 1);

    // reset actual input so filename disappears
    fileInput.value = "";
  }

  action: string[] = [];
  chipText: string = "";
  removedActionTakenChips: string[] = [];


  handleChipInput(event: KeyboardEvent) {
    const value = this.chipText.trim();

    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      event.preventDefault();

      if (value && !this.action.includes(value)) {
        this.action.push(value);
        this.chipText = "";
      }
    }

    if (event.key === "Backspace" && !this.chipText && this.action.length) {
      this.action.pop();
    }
  }

  addChipOnBlur() {
    const value = this.chipText.trim();

    if (value && !this.action.includes(value)) {
      this.action.push(value);
    }

    this.chipText = "";
  }

  // removeChip(index: number) {
  //   this.combinedActions.splice(index, 1);
  // }

  removeChip(value: string) {
    this.action = this.action.filter(item => item !== value);

    const selectedAction = this.actionsTaken.find(
      (item: any) => item.name === value && item.selected,
    );

    if (selectedAction && !this.removedActionTakenChips.includes(value)) {
      this.removedActionTakenChips = [...this.removedActionTakenChips, value];
    }
  }

  getEmailDataForVMSEventsmail() {

    const level2ValidAlerts = this.currentItem.userLevelAlarmInfo
      .filter((item: any) => item.level === 2 && item.alertTag !== null)
      .map((item: any) => ({
        alertTag: item.alertTag,
        subAlertTag: item.subAlertTag
      }));



    this.emailObject = {
      siteId: this.currentItem?.siteId,
      siteName: this.currentItem?.siteName,
      alertTypeId: level2ValidAlerts[0]?.alertTag,
      subTypeId: level2ValidAlerts[0]?.subAlertTag,
      cameraId: this.currentItem?.cameraId,
      day: this.storage_service.weekdays[
        this.storage_service.getDay(this.currentItem?.timezone)
      ],
      hour: this.storage_service.getHour(this.currentItem?.timezone),
      currentTime: this.currentItem?.timestamp,
    };

    this.isMediaLoading = true;

    this.event_service.getEmailDataForVMSEvents(this.emailObject).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.emailData = res.emailDetails;
          this.smsDetails = res.smsDetails;
          this.isMediaLoading = false;

          // console.log(this.emailData)

          // const level1Data = this.currentItem.userLevelAlarmInfo
          //   .filter((item: any) => item?.level == 1 && Array.isArray(item.actionsTakenInfo))
          //   .flatMap((item: any) =>
          //     item.actionsTakenInfo?.map((action: any) => action.name),
          //   );


          // const level2Data =
          //  this.currentItem.userLevelAlarmInfo
          //   .filter((item: any) => item?.level == 2 && Array.isArray(item.actionsTakenInfo))
          //   .flatMap((item: any) =>
          //    item.actionsTakenInfo?.map((action: any) => action.name),
          //   );


          // const level3Data =
          //   this.currentItem.userLevelAlarmInfo
          //   .filter((item: any) => item?.level == 3 && Array.isArray(item.actionsTakenInfo))
          //   .flatMap((item: any) =>
          //     item.actionsTakenInfo?.map((action: any) => action.name),
          //   );

          const level1Data =
            res.actionsTakenInfo.find((obj: any) => obj.level_1)?.level_1 || [];

          const level2Data =
            res.actionsTakenInfo.find((obj: any) => obj.level_2)?.level_2 || [];

          const level3Data =
            res.actionsTakenInfo.find((obj: any) => obj.level_3)?.level_3 || [];


          // Directly display API response strings
          this.action = [...level1Data, ...level2Data, ...level3Data];
        } else {
          this.isMediaLoading = false;
        }
      },
      error: (err) => {
        this.isMediaLoading = false;

        this.alert_service.error("Connection Failed Something went wrong!")
      },
    });

  }

  get combinedActions(): string[] {
    const selected = this.actionsTaken
      .filter(
        (item: any) =>
          item.selected && !this.removedActionTakenChips.includes(item.name),
      )
      .map((item: any) => item.name);

    return [...new Set([...this.action, ...selected])];
  }



  closeMailoverlay() {


    this.dialog.closeAll();

    this.emailData = null;
    this.selectedFiles = [];
    this.action = [];
    this.removedActionTakenChips = [];
    this.resolution = null;
  }

  isSubmitting = false;


  updateEventFullDetails3rdlevel(type: number | string) {
    const user = this.storage_service.getData('session');
    // if (user?.userLevel === 3 && type !== 1) {
    //   if (!this.actionsTaken.some((item: any) => item?.selected))
    //     return this.alert_service.error(
    //       'Actions are mandatory please select atleast one of them!'
    //     );
    // }


    this.isSubmitting = true;

    const endTime = this.storage_service.getTimeWithTimezone(this.currentItem?.timezone);
    this.currentItem?.userLevelAlarmInfo.push({
      level: user?.userLevel,
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
      actionsTakenInfo: user?.userLevel === 3 ? this.actionsTaken.map((el: any) => {
        const { id, disabled, editing, ...rest } = el;
        return rest;
      }) : [],
    })

    this.event_service
      .consumeConsoleEvents({
        cameraId: [this.currentItem?.cameraId],
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
        userLevelAlarmInfo: this.currentItem?.userLevelAlarmInfo,
      })
      .subscribe({
        next: () => {
          this.storage_service.show_loader = false;
          this.sirenTime = null;
          this.isSubmitting = false;
          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackSuccess('Event Updated successfully!');
        },
        error: () => {
          this.storage_service.show_loader = false;
          this.isSubmitting = false;
          this.cancelEvent();
          this.displayCurrent(this.currentItem);
          this.alert_service.snackError('Failed!');
        },
      });


  }

  submitResolution(type?: number | string) {

    const hasAction =
      (this.action?.length ?? 0) > 0 ||
      this.actionsTaken?.some((item: any) => item.selected);

    if (
      !this.emailData?.recipientEmails?.length ||
      !hasAction ||
      !this.resolution?.trim()
    ) {
      this.alert_service.snackError(

        "Recipient Email ,action taken and notes are mandatory",
      );

      return;
    }

    // this.updateEventFullDetails('third-level');

    const level2ValidAlerts = this.currentItem.userLevelAlarmInfo
      .filter((item: any) => item.level === 2 && item.alertTag !== null)
      .map((item: any) => ({
        alertTag: item.alertTag,
        subAlertTag: item.subAlertTag
      }));

    this.isSubmitting = true;
    this.event_service
      .sendResolution({
        ...this.currentItem,
        ...this.emailData,
        alertTagId1: level2ValidAlerts[0]?.alertTag,
        subTypeId1: level2ValidAlerts[0]?.subAlertTag,
        selectedFiles: this.selectedFiles,
        // action: this.action.join(", "),
        action: this.combinedActions,
        resolution: this.resolution,
      })
      .subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert_service.snackError("Successfully completed");
            this.isSubmitting = false;
            this.closeMailoverlay();
            this.showPreview = false;
            this.selectedFiles = [];
            if (type !== undefined) {
              this.updateEventFullDetails3rdlevel(type);
            }

            // this.preloadClosedCounts();   //counts
          } else {
            this.alert_service.snackError("Something went wrong");
            this.isSubmitting = false;
          }
        },
        (error: any) => {
          this.isSubmitting = false;
          this.alert_service.snackError("Something went wrong");
        },
      );
  }













  ngOnDestroy() {
    this.eventData = [];
    this.storage_service.events_sub.next(this.eventData.length);

    this.event_service.stopUserPooling();
    this.event_service.stopEventPooling();
  }




}




import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filePreview", standalone: true })
export class FilePreviewPipe implements PipeTransform {
  transform(file: File): string {
    return URL.createObjectURL(file);
  }
}
