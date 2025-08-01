import { Component, ElementRef, QueryList, TemplateRef, ViewChild, ViewChildren, } from '@angular/core';
import { CameraService } from 'src/services/camera.service';
import { StorageService } from 'src/services/storage.service';
import { Router } from '@angular/router';
import { CdkDragEnter, moveItemInArray, } from '@angular/cdk/drag-drop';
import { Observable, Subscription, fromEvent, } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import * as moment from 'moment-timezone';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { SiteService } from 'src/services/site.service';
import { v4 as uuid } from 'uuid';
import { MetadataService } from 'src/services/metadata.service';
import { environment } from 'src/environments/environment';
import { DeviceStatusComponent } from '../device-status/device-status.component';
import { LoginService } from 'src/services/login.service';

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
    private storageSer: StorageService,
    private camSer: CameraService,
    private siteSrvc: SiteService,
    private router: Router,
    private alertSrvc: AlertService,
    private matDialog: MatDialog,
    private metadaSer: MetadataService,
    private http: HttpClient,
    private loginSer: LoginService
  ) { }

  searchText!: string;
  showLoader: boolean = false;
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  currentTime: any;
  displayTime: any;
  intervalId: any;
  count: number = 0;
  ngOnInit() {
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

  isMaximized: boolean = false;
  maxWidth: boolean = false;
  iframeIndex: number = -1;
  toggleMaximize(index: any) {
    this.isMaximized = !this.isMaximized;
    this.isMaximized ? (this.iframeIndex = index) : (this.iframeIndex = -1);
  }

  audioIndex: number = -1;
  audio(data: any, index: any) {
    this.audioIndex = index;
    this.http
      .get(`${environment.site_url}/play_1_0/${data.cameraId}`)
      .subscribe(
        (res: any) => {
          this.audioIndex = -1;
          if (res.statusCode === 200) {
            this.alertSrvc.snackSuccess(res.message);
          } else {
            this.alertSrvc.snackError(res.message);
          }
        },
        (err: HttpErrorResponse) => {
          this.audioIndex = -1;
          this.alertSrvc.snackError('Siren not Played!');
        }
      );

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
    const placeholderEl = this.dropListContainer.nativeElement.querySelector('.cdk-drag-placeholder');
    const receiverEl = this.dragDropInfo?.dragIndex > this.dragDropInfo?.dropIndex ? placeholderEl?.nextElementSibling : placeholderEl?.previousElementSibling;
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

  /** drag and drop cameras */

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  getTypes() {
    this.metadaSer.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        // if (item.type === 36) {
        //   this.actionTags = item.metadata;
        // }
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
    { id: 1, label: 'Small' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'Large' },
    { id: 4, label: 'Person', },
    { id: 5, label: 'Vehicle', },
  ];

  oneWatchTypes = [
    { id: 0, label: 'None' },
    { id: 1, label: 'Person Entry' },
    { id: 2, label: 'Person Exit' },
    { id: 3, label: 'Vehicle Entry' },
    { id: 4, label: 'Vehicle Exit' },
  ];

  btnInterval: any;
  analyticsObj: any = {};
  createButton(event: any, data: any) {
    this.currentItem = data;
    if (this.listType !== 0 && !this.isMaximized) {
      this.displayTime = moment()
        .tz(data?.timezone)
        ?.format('YYYY-MM-DD HH:mm:ss');
      const rect = (event.target as HTMLImageElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let timeAlert;
      if (data.siteId == 36415) {
        timeAlert = environment.kennedyAlert;
      }
      else if (data.siteId == 36444 || data?.siteId === 36446) {
        timeAlert = environment.oneWatchAlert;
      }
      else if (data.siteId == 36562) {
        timeAlert = environment.springAlert;
      }
      else {
        timeAlert = environment.firstAlert;
      }
      
      // let d1 = new Date();
      // let check1 = new Date(d1);
      // check1.setMinutes((d1.getMinutes() + timeAlert.time1));
      // let check2 = new Date(d1);
      // check2.setMinutes(d1.getMinutes() + timeAlert.time2);
      // let check3 = new Date(d1);
      // check3.setMinutes(d1.getMinutes() + timeAlert.time3);
      // let check4 = new Date(d1);
      // check4.setMinutes(d1.getMinutes() + timeAlert.time4);
      // let check5 = new Date(d1);
      // check5.setMinutes(d1.getMinutes() + timeAlert.time5);
      
      data.buttons.push({
        id: uuid(),
        x: x,
        y: y,
        elementWidth: event.target.offsetParent.clientWidth,
        elementHeight: event.target.offsetParent.clientHeight,
        chkTime1: new Date().setMinutes(new Date().getMinutes() + timeAlert.time1),
        chkTime2: new Date().setMinutes(new Date().getMinutes() + timeAlert.time2),
        chkTime3: new Date().setMinutes(new Date().getMinutes() + timeAlert.time3),
        chkTime4: new Date().setMinutes(new Date().getMinutes() + timeAlert.time4),
        chkTime5: new Date().setMinutes(new Date().getMinutes() + timeAlert.time5),
        dspTime: this.displayTime,
        width: `${this.listType === 1 ? 8 : this.listType === 2 ? 12 : 15}`,
        height: `${this.listType === 1 ? 8 : this.listType === 2 ? 12 : 15}`,
      });
      
      // let hourVal = formatDate(this.displayTime, 'HH:MM:SS', 'en-us').split(':')[0];
      // this.analyticsObj = {
        //   siteId: data?.siteId,
        //   cameraId: data?.cameraId,
        //   cameraTime: moment().tz(data?.timezone)?.format('YYYY-MM-DD HH:mm:ss'),
        //   hour: parseInt(hourVal),
        //   no_of_objects: 1,
        //   createdBy: null
        // }
        // this.addVehicleCount();
        
      this.currentTime = new Date();
      this.btnInterval = setInterval(() => {
        this.currentTime = new Date();
      }, 1000);
    }
  }

  url: any;
  selectedFiles: Array<any> = new Array();
  async onFileSelected(event: any) {
    let x: Array<any> = event.target.files ?? [];
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(event.target.files[0]);
    //   reader.onload = (event: any) => {
    //     this.url = event.target.result;
    //   }
    // }
    for (let i = 0; i < x.length; i++) {
      await this.selectedFiles.push(x[i]);
      // this.emailBody.mannualEmailBody.push(item);
    }
  }

  deleteFile(index: any) {
    this.selectedFiles.splice(index, 1);
  }

  //** for instant email and incident */
  emailLimited(data: any) {
    let dateObj = {
      eventFromTime: moment().tz(data?.timezone)?.format('YYYY-MM-DD HH:mm:ss'),
      eventToTime: moment().tz(data?.timezone)?.format('YYYY-MM-DD HH:mm:ss')
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

  sendScreenshot(data: any, file: any) {
    this.camSer.screenshots(data, file).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          if (data.color == 'yellow') {
            if (
              this.currentItem?.siteId === 36346 ||
              this.currentItem?.siteId === 36360 ||
              this.currentItem?.siteId === 36444 ||
              this.currentItem?.siteId === 36446
            ) {
              this.emailLimited({ ...data, ...this.emailObject })
            }
            else if (this.currentItem?.siteId === 36336) {
              console.log(data.internalPort)
              setTimeout(() => {
                this.emailLimited({ ...data, ...this.emailObject })
              }, data.internalPort * 60 * 1000)
            }
            else {
              this.openEmaiDialog(data);
            }
          }
        }
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
    this.mannualEmailBody.eventToTime = moment().tz(data.timezone)?.format('YYYY-MM-DD HH:mm:ss');
    this.cameraCurrentTime = moment().tz(data?.timezone)?.format('YYYY-MM-DD HH:mm:ss');

    this.siteSrvc.getCamerasForSiteId(data).subscribe((res: any) => {
      this.eventCameras = res;
    });
    this.mannualEmailBody.siteId = data?.siteId;

    this.camSer.listActionTags(data).toPromise().then((res: any) => {
      if (res.statusCode === 200) {
        this.actionTags = res.data[0].actionTags;
      }
    });
    this.matDialog.open(this.mannualEmailDialog, { disableClose: true });
  }

  dialogLoader: boolean = false;
  getEmailData() {
    this.dialogLoader = true;
    this.emailObject.camerasList.push(this.selectedCameras);
    this.emailObject.alertTypeId = this.mannualEmailBody.alertType;
    this.emailObject.subTypeId = this.mannualEmailBody.alertSubType;
    this.camSer.getEmailData(this.emailObject).subscribe({
      next: (res: any) => {
        this.dialogLoader = false;
        if (res.statusCode === 200) {
          this.mannualEmailBody.recipientEmails = res.emailDetails.recipientEmails.join(', ');
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
    this.mannualEmailBody.files.splice(this.mannualEmailBody.files.indexOf(data), 1);
  }

  downloadImg(url: string) {
    this.http.get(url).subscribe((res) => {
      console.log(res);
    });
  }

  emailObject: any;
  emailCurrentItem: any;
  getImageFromVideo(data: any) {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.cameraCurrentTime = moment().tz(data.camera?.timezone)?.format('YYYY-MM-DD HH:mm:ss');
    let day = new Date(this.cameraCurrentTime).getDay();
    let hour = new Date(this.cameraCurrentTime).getHours();

    this.emailObject = {
      siteId: this.currentItem?.siteId,
      camerasList: [],
      alertTypeId: this.mannualEmailBody.alertType,
      subTypeId: this.mannualEmailBody.alertSubType,
      day: weekday[day],
      hour: hour,
      currentTime: this.cameraCurrentTime,
    };
    this.sendScreenshot(data.camera, data.image);
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
      // let hourVal = formatDate(data.buttons[btnIndex].dspTime, 'H:MM:SS', 'en-us').split(':')[0];
      // this.analyticsObj.cameraId = data.cameraId;
      // this.analyticsObj.cameraTime = formatDate(data.buttons[btnIndex].dspTime, 'yyyy-MM-dd HH:MM:SS', 'en-us'),
      // this.analyticsObj.cameraTime = moment().tz(data?.timezone)?.format('YYYY-MM-DD HH:mm:ss'),
      // this.analyticsObj.hour = Number(hourVal),
      // this.analyticsObj.no_of_objects = -1;
      // this.addVehicleCount();
      data.buttons.splice(btnIndex, 1);
    }
  }

  normalCapture(camera: any, index: any) {
    let videoComponents = this.videos.toArray();
    if (videoComponents[index]) {
      videoComponents[index].plainCapture(camera);
    }
  }

  @ViewChildren('video') videos!: QueryList<any>;
  @ViewChildren('btn') btns!: QueryList<any>;
  captureScreenshot(camera: any, index: any, color: any, btnItem: any, btnIndex: any) {
    let a = this.btns.toArray()[index].nativeElement.children[btnIndex];
    let imgElement = a.firstChild;
    let videoComponents = this.videos.toArray();
    if (videoComponents[index]) {
      videoComponents[index].capture(camera, color, imgElement, btnItem);
    } else {
      console.log('No Component Found!');
    }
  }

  openDevices() {
    this.matDialog.open(DeviceStatusComponent);
  }

  logout() {
    this.showLoader = true;
    this.loginSer.manageUserSession('logOut').subscribe({
      error: (err: any) => {
        this.showLoader = false;
        this.router.navigateByUrl('/login');
        localStorage.clear();
        window.location.reload();
      },
      complete: () => {
        this.showLoader = false;
        this.router.navigateByUrl('/login');
        localStorage.clear();
        window.location.reload();
      }
    })
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
    clearInterval(this.btnInterval);
    clearInterval(this.intervalId);
  }
}
