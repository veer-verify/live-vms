import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-nvr',
  templateUrl: './nvr.component.html',
  styleUrls: ['./nvr.component.css']
})
export class NvrComponent {

  constructor(
    private http: HttpClient,
    private eventSer: CameraService,
    private sanitizer: DomSanitizer,
    public matdialog: MatDialog,
    private alertSer: AlertService,
    private metadaSer: MetadataService,
    private siteSer: SiteService
  ) { }

  userData: any;
  showLoader: boolean = false;
  searchText: any;
  currentTime: any;
  objectNames = ['Person', 'Vehicle'];
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getSitesListForUserName();
    this.getTags();
  }

  nvrStatus: any = ['Active', 'Inactive']

  siteIdToNav: any = [];
  errInfo: any;
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSites(this.userData).subscribe((res: any) => {
      this.showLoader = false;
      if (res.Status === 'Success') {
        this.siteIdToNav = res?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
        this.camerasListForSites(this.siteIdToNav[0]);
        this.footageList(this.siteIdToNav[0], 0);
      } else if (res.Status === 'Failed') {
        this.errInfo = res.message;
      }
    }, (err: any) => {
      this.showLoader = false;
      this.errInfo = 'CONNECTION TIMED OUT!';
    })
  }

  camData: any = [];
  camerasListForSites(siteId: any) {
    this.siteSer.getCamerasForSiteId(siteId).subscribe((res: any) => {
      this.camData = res;
    });
  }

  actionTags: any = [];
  getTags() {
    this.metadaSer.getMetadataByType(36).subscribe((res: any) => {
      this.actionTags = res[0].metadata;
    })
  }

  eventData: any = [];
  newEventData: any = [];
  currentSite: any;
  navActive!: number;
  showLoader1: boolean = false;
  footageList(data: any, index: any) {
    this.camerasListForSites(data);
    this.currentSite = data;
    this.navActive = index;
    this.currentPage = 1;
    this.showLoader1 = true;
    this.siteSer.nvrList(data).subscribe((res: any) => {
      this.showLoader1 = false;
      if (res.statusCode == 200) {
        this.eventData = res.nvrDetails;
        this.newEventData = this.eventData;
        this.errInfo = null;
      } else {
        this.newEventData = [];
      }
    }, (err: any) => {
      this.showLoader1 = false;
      this.errInfo = 'CONNECTION TIMED OUT!';
    })
  }

  siteId: any = '';
  cameraId: any = '';
  actionTag: any = '';
  fromDate: any = '';
  toDate: any = '';
  filter() {
    this.currentPage = 1;
    this.showLoader = true;
    this.eventSer.incidentList({ siteId: this.currentSite?.siteId, cameraId: this.cameraId, actionTag: this.actionTag, fromDate: this.fromDate, toDate: this.toDate }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.newEventData = res.IncidentList.sort((a: any, b: any) => a.createdTime > b.createdTime ? -1 : a.createdTime < b.createdTime ? 1 : 0);
      } else {
        this.newEventData = [];
      }
    });
  }

  pageSize = 10;
  currentPage = 1;
  gotoPage!: number;
  get totalPages(): number {
    return Math.ceil(this.newEventData.length / this.pageSize);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.newEventData?.slice(start, end);
  }

  setPage(page: number): void {
    if (page <= this.totalPages && page !== 0) {
      this.showLoader1 = true;
      setTimeout(() => {
        this.showLoader1 = false;
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }, 300)
    } else {
      this.alertSer.error('Invalid Page');
    }
  }

  // get pages(): number[] {
  //   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  // }

  @ViewChild('editDialog') editDialog = {} as TemplateRef<any>;
  currentItem: any;
  openEditDialog(data: any) {
    this.currentItem = { ...data };
    this.matdialog.open(this.editDialog);
  }

  @ViewChild('confirmationDialog') confirmationDialog = {} as TemplateRef<any>;
  currentDeletingFile: any;
  openConfirmationDialog(data: any) {
    this.currentDeletingFile = data;
    this.matdialog.open(this.confirmationDialog);
  }

  updateIncidents() {
    this.showLoader = true;
    this.siteSer.updateNVRDetails(this.currentItem).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.alertSer.success(res.message)
        this.footageList(this.currentSite, this.navActive);
      } else {
        this.alertSer.error(res.message);
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  showAddRequest: boolean = false;
  show() {
    this.showAddRequest = true;
  }

  close() {
    this.showAddRequest = false;
  }

}
