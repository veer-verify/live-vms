import {
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CameraService } from 'src/services/camera.service';
import { StorageService } from 'src/services/storage.service';
import { Router } from '@angular/router';
import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, Subscription, fromEvent, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { SiteService } from 'src/services/site.service';
import { v4 as uuid } from 'uuid';
import { MetadataService } from 'src/services/metadata.service';
import { environment } from 'src/environments/environment';
import { DeviceStatusComponent } from '../device-status/device-status.component';
import { LoginService } from 'src/services/login.service';
import { EventService } from 'src/services/event.service';
import { ManualprocessComponent } from '../manualprocess/manualprocess/manualprocess.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  gridBtnTypes: Array<any> = [
    {
      label: '1X2',
      rows: 2,
      items: 2,
    },
    {
      label: '2X3',
      rows: 3,
      items: 6,
    },
    {
      label: '3X3',
      rows: 3,
      items: 9,
    },
    {
      label: '3X4',
      rows: 4,
      items: 12,
    },
    {
      label: '4X4',
      rows: 4,
      items: 16,
    },
    {
      label: '4X5',
      rows: 5,
      items: 20,
    },
  ];

  constructor(
    public storageSer: StorageService,
    private camSer: CameraService,
    private siteSrvc: SiteService,
    private router: Router,
    private alertSrvc: AlertService,
    private matDialog: MatDialog,
    private metadaSer: MetadataService,
    private http: HttpClient,
    private loginSer: LoginService,
    private event_service: EventService
  ) { }

  searchText!: string;
  showLoader: boolean = false;
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  currentTime: any;
  displayTime: any;
  intervalId: any;

  ngOnInit(): void {
    this.getSites();
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe((evt: any) => {
      if (evt.target.innerWidth < 768) {
        this.gridList.nativeElement.style.gridTemplateColumns = `repeat(1, 1fr)`;
      } else {
        this.gridList.nativeElement.style.gridTemplateColumns = `repeat(${this.gridCount}, 1fr)`;
      }
    });

    //   this.intervalId = setInterval(() => {
    //  this.openChatbot1()
    //   }, 60000);
  }

  // ngDoCheck(): void {
  //   let user = this.storageSer.getData('session');
  //   let tempUser = this.storageSer.session_sub.getValue();
  //   if (!user) {
  //     this.storageSer.saveData(
  //       'session',
  //       this.storageSer.session_sub.getValue()
  //     );
  //   }
  //   if (!tempUser) {
  //     this.storageSer.session_sub.next(this.storageSer.getData('session'));
  //   }
  // }

  // getUrl(data: any) {
  //   this.siteSrvc.getUrl(data).subscribe({
  //     error: (err: HttpErrorResponse) => {
  //       if (err.status === 200) {
  //         data.videoUrl = err.url;
  //       } else if(err.status === 0) {
  //         data.videoUrl = null;
  //       }
  //     },
  //   });
  // }

  openManualevent() {
  this.matDialog.open(ManualprocessComponent, {
    width: '600px',
    maxHeight: '600px',
    disableClose: true,
    panelClass: 'custom-dialog'
  });
}

  sitesList: any = [];
  errInfo: any;
  getSites() {
    this.showLoader = true;
    this.siteSrvc.getSites().subscribe(
      (res: any) => {
        this.showLoader = false;
        if (res.Status === 'Success') {
          this.getTypes();
          this.sitesList = res.sites.sort((a: any, b: any) =>
            a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0
          );
          // this.getCamerasForSiteId(res.sites[0]);
        } else {
          this.sitesList = [];
          this.errInfo = 'NO SITES';
          this.showSidenav = false;
        }
      },
      (err: any) => {
        this.showLoader = false;
        this.errInfo = 'NO SITES';
      }
    );
  }

  cameras: any = [];
  currentSite: any;
  showCamLoader: boolean = false;
  getCamerasForForPortal(data: any) {
    this.currentSite = data;
    this.showCamLoader = true;
    this.siteSrvc.getCamerasForForPortal(data).subscribe((res: any) => {
      this.showCamLoader = false;
      this.cameras = res;

      this.cameras.forEach((object: any) => {
        object.isPlaying = false;
        object.buttons = [];
        if (
          object.siteName.startsWith('DSW') ||
          object.siteName.startsWith('Whole Foods') ||
          object.siteName.startsWith('Guitar Center') ||
          object.siteName.startsWith('Fifth Season')
        ) {
          object.showSiteName = true;
        } else {
          object.showSiteName = false;
        }
      });
      // this.findCommon();
      this.selector();
    });
  }

  findCommon() {
    let commonObjects = this.cameras?.filter((obj1: any) => {
      return this.gridListItems.some((obj2: any) => {
        return obj2.cameraId === obj1.cameraId;
      });
    });
    commonObjects.forEach((commonObj: any) => {
      const foundIndex = this.cameras?.findIndex(
        (obj: any) => obj.cameraId === commonObj.cameraId
      );
      if (foundIndex !== -1) {
        this.cameras[foundIndex].isPlaying = true;
      }
    });
  }

  checkCam(data: any) {
    return this.getCurrentPageItems.includes(data) ? true : false;
  }

  showSidenav: boolean = true;
  openSidenav() {
    this.showSidenav = !this.showSidenav;
  }

  @ViewChild('gridList') gridList: any = ElementRef;
  iframeHeight: any = '24.7vh';
  gridCount: number = 5;
  gridType: any;
  adjustGrid(count: any, rows: any) {
    this.currentPage = 1;
    this.camerasForPage = count;
    this.gridCount = rows;
    this.gridList.nativeElement.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;

    // this.resizeSubscription = this.resizeObservable.subscribe((evt: any) => {
    //   if(evt.target.innerWidth < 768) {
    //     this.gridList.nativeElement.style.gridTemplateColumns = `repeat(1, 1fr)`;
    //   } else {
    //     this.gridList.nativeElement.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    //   }
    // });
    // switch (count) {
    //   case 16:
    //     this.iframeHeight = '24.7vh';
    //     break;
    //   case 12:
    //     this.iframeHeight = '33px';
    //     break;
    //   case 9:
    //     this.iframeHeight = '33vh';
    //     break;
    //   case 6:
    //     this.iframeHeight = '49.3vh';
    //     break;
    //   case 2:
    //     this.iframeHeight = '70vh';
    //     break;
    //   default:
    //     this.iframeHeight = '24.7vh';
    // }
    this.selector();
  }

  gridListItems: any = [];
  currentPage: any = 1;
  totalPages: any;
  camerasForPage: any = 20;
  pagesForDropdown: any = [];
  selector(): void {
    this.totalPages = Math.ceil(
      this.gridListItems.length / this.camerasForPage
    );
    this.pagesForDropdown = new Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  changeCurrent(input: any) {
    this.currentPage = input;
  }

  moveAllCams() {
    this.cameras.map((item: any) => {
      item.isPlaying = true;
    });
    this.gridListItems.push(...this.cameras);
    this.selector();
  }

  @ViewChild('panel') panel = ElementRef;
  onDrop(item: any) {
    item.isPlaying = true;
    this.gridListItems.push(item);
    this.selector();
  }

  get getCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.camerasForPage;
    const endIndex = startIndex + this.camerasForPage;
    return this.gridListItems?.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const maxPages = Math.ceil(this.gridListItems.length / this.camerasForPage);
    if (this.currentPage < maxPages) {
      this.currentPage++;
    }
  }

  clearCams(item: any): void {
    if (item) {
      item.isPlaying = false;
      let index: number = this.gridListItems.indexOf(item);
      this.gridListItems.splice(index, 1);
    } else {
      this.currentPage = 1;
      this.gridListItems = [];
      this.cameras.map((item: any) => {
        item.isPlaying = false;
      });
    }
    this.selector();
  }

  cameraIndex: number = -1;
  toggleMaximize(index: number) {
    if (this.camerasForPage === 2) {
      this.streamEl
        .toArray()
      [index].video.nativeElement.parentElement.classList.remove('h2');
    } else if (this.camerasForPage === 6) {
      this.streamEl
        .toArray()
      [index].video.nativeElement.parentElement.classList.remove('h6');
    } else if (this.camerasForPage === 9 || this.camerasForPage === 12) {
      this.streamEl
        .toArray()
      [index].video.nativeElement.parentElement.classList.remove('h9');
    } else {
      this.streamEl
        .toArray()
      [index].video.nativeElement.parentElement.classList.remove('h20');
    }

    this.streamEl
      .toArray()
    [index].video.nativeElement.parentElement.classList.add('tile-active');
    this.cameraIndex = index;
  }

  audioIndex: number = -1;
  audio(data: any) {
    this.audioIndex = this.getCurrentPageItems.indexOf(data);
    this.camSer.siren_sub.next(true);

    this.http
      .get(`${environment.site_url}/play_1_0/${data.cameraId}`)
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.camSer.siren_sub.next(false);
          }, 120000);
          this.audioIndex = -1;
          if (res.statusCode === 200) {
            this.alertSrvc.success(res.message);
          } else {
            this.alertSrvc.error(res.message);
          }
        },
        error: (err) => {
          setTimeout(() => {
            this.camSer.siren_sub.next(false);
          }, 120000);
          this.audioIndex = -1;
          this.alertSrvc.snackError('Siren not Played!');
        },
      });

    // this.camSer.play(data).subscribe({
    //   next: (res) => {
    //     this.alertSrvc.snackSuccess('Siren Played!');
    //   },
    //   error: (err) => {
    //     this.alertSrvc.snackSuccess('Failed!');
    //   }
    // });
  }

  currentItem: any;
  showActionDialog: boolean = false;
  openuserActionDialog(data: any) {
    this.currentItem = data;
    this.showActionDialog = true;
  }

  closeActionDialog(data: boolean) {
    this.showActionDialog = data;
  }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  getTypes() {
    this.metadaSer.getMetadata().subscribe((res: any) => {
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

  listType: any = 0;
  listTypes = [
    { id: 0, label: 'None' },
    { id: 6, label: 'Event' },
    { id: 1, label: 'Small' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'Large' },
    { id: 4, label: 'Person' },
    { id: 5, label: 'Vehicle' },
  ];

  filteredListTypes() {
    return this.currentSite?.manualEvents === 'T'
      ? this.listTypes.filter(
        (type: any) => type.label === 'Event' || type.label === 'None'
      )
      : this.listTypes;
  }

  btnInterval: any;
  analyticsObj: any = {};
  createButton(event: any, data: any) {
    this.currentItem = data;
    if (this.listType !== 0 && this.cameraIndex === -1) {
      this.displayTime = this.storageSer.getTimeWithTimezone(data?.timezone);
      const rect = (event.target as HTMLImageElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let timeAlert;
      if (this.listType === 6) {
        // this.createBtnEl.toArray().forEach((item) => {
        //   item.nativeElement.style.pointerEvents = 'none';

        //   setTimeout(() => {
        //     item.nativeElement.style.pointerEvents = 'all';
        //   }, 1500);
        // })

        this.createBtnEl.toArray().forEach((item) => {
          item.nativeElement.style.pointerEvents = 'none';
        });

        timeAlert = {
          time1: 160,
          time2: 180,
          time3: 210,
          time4: 240,
          time5: 270,
        };
      } else if (data.siteId == 36415) {
        timeAlert = environment.kennedyAlert;
      } else if (data.siteId == 36562) {
        timeAlert = environment.springAlert;
      } else if (data.siteId == 36587) {
        timeAlert = environment.shopAlert;
      } else if (data.siteId == 36444 || data?.siteId === 36446) {
        timeAlert = environment.oneWatchAlert;
      } else {
        timeAlert = environment.firstAlert;
      }

      data.buttons.push({
        id: uuid(),
        x: x,
        y: y,
        elementWidth: event.target.offsetParent.clientWidth,
        elementHeight: event.target.offsetParent.clientHeight,
        chkTime1: new Date().setMinutes(
          new Date().getMinutes() + timeAlert.time1
        ),
        chkTime2: new Date().setMinutes(
          new Date().getMinutes() + timeAlert.time2
        ),
        chkTime3: new Date().setMinutes(
          new Date().getMinutes() + timeAlert.time3
        ),
        chkTime4: new Date().setMinutes(
          new Date().getMinutes() + timeAlert.time4
        ),
        chkTime5: new Date().setMinutes(
          new Date().getMinutes() + timeAlert.time5
        ),
        dspTime: this.displayTime,
        width: `${this.listType === 1 ? 8 : this.listType === 2 ? 12 : 15}`,
        height: `${this.listType === 1 ? 8 : this.listType === 2 ? 12 : 15}`,
      });

      this.currentTime = new Date();
      this.btnInterval = setInterval(() => {
        this.currentTime = new Date();
      }, 1000);
    }
  }

  url: any;
  selectedFiles: Array<any> = new Array();
  onFileSelected(event: any) {
    let x: Array<any> = event.target.files ?? [];
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(event.target.files[0]);
    //   reader.onload = (event: any) => {
    //     this.url = event.target.result;
    //   }
    // }
    for (let i = 0; i < x.length; i++) {
      this.selectedFiles.push(x[i]);
    }
  }

  deleteFile(index: any) {
    this.selectedFiles.splice(index, 1);
  }

  //** for instant email and incident */
  emailLimited(data: any) {
    let dateObj = {
      eventFromTime: this.storageSer.getTimeWithTimezone(data?.timezone),
      eventToTime: this.storageSer.getTimeWithTimezone(data?.timezone),
      objectName: 'Person',
      alertTypeId: '1',
      subTypeId: '10',
    };
    this.camSer.email_with_incident({ ...data, ...dateObj }).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.alertSrvc.snackSuccess(res.message);
        } else {
          this.alertSrvc.snackError(res.message);
        }
      },
    });
  }

  postScreenshot(data: any, file: any) {
    let user = this.storageSer.getData('session');
    let time = this.storageSer.getTimeWithTimezone(data?.timezone);
    data.time = time;

    this.camSer.screenshots(data, file).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          if (this.listType === 6) {
            if (data.color == 'green') {
              // this.audio(data);
              this.event_service
                .write2Dispatch({
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
                      activityDetTime: data?.audioUrl ? time : '',
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
                    data.buttons.splice(0, 1);
                    this.createBtnEl.toArray().forEach((item) => {
                      item.nativeElement.style.pointerEvents = 'all';
                    });
                    this.alertSrvc.snackSuccess(
                      'Event generated successfully!'
                    );
                  },
                  error: (err) => {
                    data.buttons.splice(0, 1);
                    this.createBtnEl.toArray().forEach((item) => {
                      item.nativeElement.style.pointerEvents = 'all';
                    });
                    this.alertSrvc.snackError('Event generated failed!');
                  },
                });
            }
          } else {
            if (
              data.color == 'yellow' ||
              (this.currentItem?.siteId === 36336 && data.color == 'green')
            ) {
              if (
                this.currentItem?.siteId === 36346 ||
                this.currentItem?.siteId === 36360 ||
                this.currentItem?.siteId === 36444 ||
                this.currentItem?.siteId === 36446
              ) {
                this.emailLimited({ ...data, ...this.emailObject });
              } else if (this.currentItem?.siteId === 36336) {
                setTimeout(() => {
                  this.openEmaiDialog(data);
                }, data?.internalPort * 60 * 1000);
              } else {
                this.openEmaiDialog(data);
              }
            }
          }
        }
      },
      error: (err) => {
        data.buttons.splice(0, 1);
        this.createBtnEl.toArray().forEach((item) => {
          item.nativeElement.style.pointerEvents = 'all';
        });
        this.alertSrvc.snackError('Event generated failed!');
      },
    });
  }

  selectedCameras: any = [];
  mannualEmailBody: any = {
    siteId: null,
    recipientEmails: null,
    cameraId: null,
    eventFromTime: null,
    eventToTime: null,
    actionTag: null,
    eventTag: null,
    alertType: null,
    alertSubType: null,
    subject: null,
    body: null,
    bcc: null,
    cc: null,
    fields: null,
    footer: null,
    files: [],
  };

  emailObjects: any = [];

  @ViewChild('mannualEmailDialog') mannualEmailDialog = {} as TemplateRef<any>;
  eventCameras: any = [];
  cameraCurrentTime: any;
  async openEmaiDialog(data: any) {
    this.selectedFiles = [];
    this.selectedCameras = [];
    this.currentItem = data;

    Object.keys(this.mannualEmailBody).map((key: any) => {
      if (this.mannualEmailBody[key] instanceof Array) {
        this.mannualEmailBody[key] = [];
      } else {
        this.mannualEmailBody[key] = null;
      }
    });

    this.mannualEmailBody.siteId = data.siteId;
    this.mannualEmailBody.cameraId = data.cameraId;
    this.mannualEmailBody.eventFromTime = data.dspTime;
    this.mannualEmailBody.eventToTime = this.storageSer.getTimeWithTimezone(
      data?.timezone
    );
    this.cameraCurrentTime = this.storageSer.getTimeWithTimezone(
      data?.timezone
    );

    this.siteSrvc.getCamerasForSiteId(data).subscribe((res: any) => {
      this.eventCameras = res;
    });
    this.mannualEmailBody.siteId = data?.siteId;

    this.camSer
      .listActionTags(data)
      .toPromise()
      .then((res: any) => {
        if (res.statusCode === 200) {
          this.actionTags = res.data[0].actionTags;
        }
      });
    this.matDialog.open(this.mannualEmailDialog, { disableClose: true });
  }

  dialogLoader: boolean = false;
  getEmailData() {
    this.dialogLoader = true;
    this.emailObject.camerasList = this.selectedCameras;
    this.emailObject.alertTypeId = this.mannualEmailBody.alertType;
    this.emailObject.subTypeId = this.mannualEmailBody.alertSubType;
    this.camSer.getEmailData(this.emailObject).subscribe({
      next: (res: any) => {
        this.dialogLoader = false;
        if (res.statusCode === 200) {
          this.mannualEmailBody.recipientEmails =
            res.emailDetails.recipientEmails.join(', ');
          this.mannualEmailBody.subject = res.emailDetails.emailSubject;
          this.mannualEmailBody.body = res.emailDetails.emailBody;
          this.mannualEmailBody.bcc = res.emailDetails.BCC.join(', ');
          this.mannualEmailBody.cc = res.emailDetails.Cc.join(', ');
          this.mannualEmailBody.fields = res.emailDetails.emailFields;
          this.mannualEmailBody.footer = res.emailDetails.emailFooter;
          this.mannualEmailBody.files = res.emailDetails.screenshots;
        }
      },
    });
  }

  guardEmail() {
    this.camSer.send_guard_email(this.mannualEmailBody).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.alertSrvc.snackSuccess(res.message);
        } else {
          this.alertSrvc.snackError(res.message);
        }
      },
    });
  }

  closeImage1(data: any) {
    this.mannualEmailBody.files.splice(
      this.mannualEmailBody.files.indexOf(data),
      1
    );
  }

  downloadImg(url: string) {
    this.http.get(url).subscribe();
  }

  emailObject: any;
  emailCurrentItem: any;
  getImageFromVideo(data: any) {
    this.emailObject = {
      siteId: this.currentItem?.siteId,
      camerasList: [],
      alertTypeId: this.mannualEmailBody.alertType,
      subTypeId: this.mannualEmailBody.alertSubType,
      day: this.storageSer.weekdays[
        this.storageSer.getDay(data?.camera?.timezone)
      ],
      hour: this.storageSer.getHour(data?.camera?.timezone),
      currentTime: this.cameraCurrentTime,
    };
    this.postScreenshot(data.camera, data.image);
  }

  addVehicleCount() {
    this.camSer.addVehicleCount(this.analyticsObj).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.alertSrvc.snackSuccess(res.message);
        }
      },
    });
  }

  closeEvent(data: any, btnIndex: any) {
    if (this.listType === 0) {
      data.buttons.splice(btnIndex, 1);
    }
  }

  normalCapture(camera: any, index: any) {
    let videoComponents = this.streamEl.toArray();
    if (videoComponents[index]) {
      videoComponents[index].plainCapture(camera);
    }
  }

  @ViewChildren('streamEl') streamEl!: QueryList<any>;
  @ViewChildren('createBtnEl') createBtnEl!: QueryList<any>;
  async captureScreenshot(
    camera: any,
    index: any,
    color: any,
    btnItem: any,
    btnIndex: any
  ) {
    let btnEl = await this.createBtnEl.toArray()[index].nativeElement.children[
      btnIndex
    ];
    let imgEl = await btnEl.firstChild;
    let videoComponents = this.streamEl.toArray();

    if (videoComponents[index]) {
      videoComponents[index].capture(camera, color, imgEl, btnItem);
    } else {
      console.log('no component!');
    }
  }

  openDevices() {
    this.matDialog.open(DeviceStatusComponent);
  }

  logout() {
    this.showLoader = true;
    this.loginSer.manageUserSession('logOut').subscribe({
      error: () => {
        this.showLoader = false;
        this.loginSer.logout();
      },
      complete: () => {
        this.showLoader = false;
        this.loginSer.logout();
      },
    });
  }

  /** drag and drop cameras */

  @ViewChild('dropListContainer') dropListContainer!: ElementRef;
  dropListReceiverElement: any;
  dragDropInfo: any;
  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    this.dragDropInfo = { dragIndex: drag?.data, dropIndex: dropList?.data };
    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');
    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);
      moveItemInArray(this.gridListItems, drag?.data, dropList?.data);
    }
  }

  dragMoved() {
    if (!this.dropListContainer) return;
    const placeholderEl = this.dropListContainer.nativeElement.querySelector(
      '.cdk-drag-placeholder'
    );
    const receiverEl =
      this.dragDropInfo?.dragIndex > this.dragDropInfo?.dropIndex
        ? placeholderEl?.nextElementSibling
        : placeholderEl?.previousElementSibling;
    if (!receiverEl) return;
    receiverEl.style.display = 'none';
    this.dropListReceiverElement = receiverEl;
  }

  dragDropped() {
    if (!this.dropListReceiverElement) return;
    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
    clearInterval(this.btnInterval);
    clearInterval(this.intervalId);
  }
}
