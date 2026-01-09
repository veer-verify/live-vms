import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-alerts-info',
  templateUrl: './alerts-info.component.html',
  styleUrls: ['./alerts-info.component.css'],
})
export class AlertsInfoComponent {
  constructor(
    private eventSer: CameraService,
    public matdialog: MatDialog,
    private alertSer: AlertService,
    private metadaSer: MetadataService,
    private siteSer: SiteService,
    public storage_service: StorageService,
    private fb: FormBuilder
  ) { }
  myForm!: FormGroup;
  environment = environment.download_url;
  userData: any;
  searchText: any;
  latestIncidentTime: any;
  objectNames = ['Person', 'Vehicle'];
  showLoader: boolean = false;

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('session')!);
    let d1 = new Date();
    let d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() - 360);
    this.latestIncidentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us');

    this.myForm = this.fb.group({
      siteId: [''],
      cameraId: [''],
      actionTag: [0],
      fromDate: [''],
      toDate: [''],
    });
    this.getSitesListForUserName();

  }

  getTimeDifference(date1: Date, date2: Date): string {
    let first: any = new Date(date1);
    let second: any = new Date(date2);
    const diffInMs: number = Math.abs(first.getTime() - second.getTime());
    const hours: number = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes: number = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds: number = Math.floor((diffInMs % (1000 * 60)) / 1000);
    return `${hours} hours, ${minutes} min`;
  }

  isVid(data: string) {
    if (!data) return;
    let arr = ['mp4', 'avi'];
    return arr.includes(data?.split('.')[data.split('.').length - 1]);
  }

  siteIdToNav: Array<any> = new Array();
  errInfo: any;
  getSitesListForUserName() {
    this.storage_service.status_text = 'loading...';
    this.siteSer.getSites(this.userData).subscribe(
      (res: any) => {
        if (res.Status === 'Success') {
          this.storage_service.status_text = '';
          this.siteIdToNav = res?.sites.sort((a: any, b: any) =>
            a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0
          );
          this.siteId = this.siteIdToNav[0].siteId;
          this.myForm.get('siteId')?.setValue(this.siteIdToNav[0].siteId);
          this.filter();
          this.getTags();
        } else if (res.Status === 'Failed') {
          this.storage_service.status_text = 'no data!';
          this.errInfo = res.message;
        }
      },
      (err: any) => {
        this.storage_service.status_text = 'failed to load data!';
        this.errInfo = 'CONNECTION TIMED OUT!';
      }
    );
  }

  camData: Array<any> = new Array();
  camerasListForSites(siteId: any) {
    this.siteSer
      .getCamerasForSiteId({ siteId: siteId })
      .subscribe((res: any) => {
        this.camData = res;
      });
  }

  actionTags: Array<any> = new Array();
  getTags() {
    this.metadaSer.getMetadataByType(36).subscribe((res: any) => {
      this.actionTags = res[0].metadata;

    });
  }

  newTags: any = [];
  listActionTags(data: any) {
    this.newTags = [];
    let cam = data?.cameraId;
    this.eventSer.listActionTags({ cameraId: cam }).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.newTags = res.data.filter(
          (item: any) => item.siteId == this.siteId
        )[0].actionTags;
      }
    });
  }

  getData(data: any) {
    this.newEventData = data;
  }

  eventData: Array<any> = new Array();
  newEventData: Array<any> = new Array();
  currentPage!: number;
  totalPages!: number;
  siteId: any = '';
  cameraId: any = '';
  actionTag: any = '';
  fromDate: any = '';
  toDate: any = '';
  visibleTags: any;
  remainingTags: any;
  showMore = false;
  displayedColumns: string[] = ['actionTag', 'actionTagCount'];

  filter(i?: number, type?: string) {

    if (i === 1) {
      this.myForm.get('cameraId')?.setValue('');
      this.myForm.get('actionTag')?.setValue('');
      this.myForm.get('fromDate')?.setValue('');
      this.myForm.get('toDate')?.setValue('');
    }


    this.camerasListForSites(this.myForm.get('siteId')?.value);

    let pageNumber;
    if (type === 'next') {
      pageNumber = this.currentPage + 1;
    } else if (type === 'prev') {
      pageNumber = this.currentPage - 1;
    } else if (type === '' || type == null) {
      pageNumber = this.currentPage;
    }

    this.storage_service.status_text = 'loading...';
    this.eventSer
      .incidentList(this.myForm.value)
      .subscribe(
        (res: any) => {
          this.currentPage = res.page;
          this.totalPages = res.totalPages;
          if (res.statusCode === 200) {
            this.storage_service.status_text = '';
            this.eventData = res.IncidentList;

            // this.visibleTags = res.actionTagCounts.slice(0, 5);
            // this.remainingTags = res.actionTagCounts.slice(5);
            this.newEventData = [...this.eventData];
          } else {
            this.storage_service.status_text = 'no data!';
            this.newEventData = [];
          }
        },
        (err: HttpErrorResponse) => {
          this.storage_service.status_text = 'failed to load data!';
        }
      );
  }

  getPaginatedData(data: number) {
    this.currentPage = data + 1;
    this.filter();
  }

  selectedFile: any;
  public onFileSelected(event: any): void {
    let file = event.target.files;
    this.selectedFile = file[0];
  }

  @ViewChild('galleryDialog') galleryDialog = {} as TemplateRef<any>;
  galleryData: any;
  openGalleryDialog(data: any) {
    this.galleryData = data;
    this.matdialog.open(this.galleryDialog);
  }

  @ViewChild('confirmationDialog') confirmationDialog = {} as TemplateRef<any>;
  currentDeletingFile: any;
  openConfirmationDialog(data: any) {
    this.currentDeletingFile = data;
    this.matdialog.open(this.confirmationDialog);
  }

  @ViewChild('maxDialog') maxDialog = {} as TemplateRef<any>;
  currentFullImage: any;
  toggleImage(data: any) {
    this.currentFullImage = data;
    this.matdialog.open(this.maxDialog);
  }

  @ViewChild('playbackDialog') playbackDialog = {} as TemplateRef<any>;
  currentImageIndex: number = 0;
  currentVideoData: any;
  isVideo: boolean = false;
  getImageDataforMode(data: any) {
    this.currentImageIndex = 0;
    if (data?.files.length !== 0) {
      let check = data?.files[0].split('.');
      if (
        check[check.length - 1] === 'mp4' ||
        check[check.length - 1] === '3gp'
      ) {
        this.isVideo = true;
      } else {
        this.isVideo = false;
      }
    }
    this.currentVideoData = data;
    this.matdialog.open(this.playbackDialog);
  }

  showPrev() {
    if (this.currentVideoData?.files.length !== 0) {
      let check =
        this.currentVideoData?.files[this.currentImageIndex - 1].split('.');
      if (
        check[check.length - 1] === 'mp4' ||
        check[check.length - 1] === '3gp'
      ) {
        this.isVideo = true;
        this.currentImageIndex--;
      } else {
        this.isVideo = false;
        this.currentImageIndex--;
      }
    }
  }

  showNext() {
    if (this.currentVideoData?.files.length !== 0) {
      let check =
        this.currentVideoData?.files[this.currentImageIndex + 1].split('.');
      if (
        check[check.length - 1] === 'mp4' ||
        check[check.length - 1] === '3gp'
      ) {
        this.isVideo = true;
        this.currentImageIndex++;
      } else {
        this.isVideo = false;
        this.currentImageIndex++;
      }
    }
  }

  @ViewChild('uploadFileDialog') uploadFileDialog = {} as TemplateRef<any>;
  openUploadDialog(data: any) {
    this.currentItem = data;
    this.matdialog.open(this.uploadFileDialog);
  }

  uploadVideoFile() {
    // this.showLoader = true;
    // this.eventSer.uploadVideoFile({file: this.selectedFile, data: this.currentItem}).subscribe((res: any) => {
    //   // console.log(res);
    //   this.showLoader = false;
    //   if(res.statusCode === 200) {
    //     this.alertSer.snackSuccess(res.message)
    //     this.footageList(this.currentSite, this.navActive);
    //   } else {
    //     this.alertSer.error(res.message);
    //   }
    // }, (err: any) => {
    //   this.showLoader = false;
    // })
  }

  @ViewChild('editDialog') editDialog = {} as TemplateRef<any>;
  currentItem: any;
  openEditDialog(data: any) {
    this.listActionTags(data);
    this.currentItem = data;
    this.matdialog.open(this.editDialog);
  }

  deleteIncident(data: any) {
    // this.alertSer.confirm('do you want to delete!').then((res) => {
    //   if(!res.isConfirmed) return;
    //   this.showLoader = true;
    //   this.eventSer.deleteIncident(data).subscribe((res: any) => {
    //     this.showLoader = false;
    //     if(res.statusCode === 200) {
    //       this.footageList(this.currentSite, this.navActive)
    //       this.alertSer.snackSuccess(res.message)
    //     } else {
    //       this.alertSer.snackError(res.message)
    //     }
    //   }, (err: any) => {
    //     this.showLoader = false;
    //   })
    // })
  }

  deleteIncidentClip() {
    // this.eventSer.deleteIncidentClip(this.currentDeletingFile).subscribe((res: any) => {
    //   if(res.statusCode === 200) {
    //     this.footageList(this.currentSite, this.navActive)
    //     this.alertSer.snackSuccess(res.message)
    //   } else {
    //     this.alertSer.snackError(res.message)
    //   }
    // })
  }

  updateIncidents() {
    // this.showLoader = true;
    // this.eventSer.updateIncidents(this.currentItem, this.selectedFile).subscribe((res: any) => {
    //   // console.log(res);
    //   this.showLoader = false;
    //   if(res.statusCode === 200) {
    //     this.alertSer.snackSuccess(res.message)
    //     this.footageList(this.currentSite, this.navActive);
    //   } else {
    //     this.alertSer.snackSuccess(res.message);
    //   }
    // }, (err: any) => {
    //   this.showLoader = false;
    // })
  }

  showAddRequest: boolean = false;
  show() {
    this.showAddRequest = true;
  }

  close() {
    this.showAddRequest = false;
  }


  showactiontagscount() {
    this.showMore = !this.showMore;
  }
}
