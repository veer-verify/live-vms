import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-monitoring-info',
  templateUrl: './monitoring-info.component.html',
  styleUrls: ['./monitoring-info.component.css']
})
export class MonitoringInfoComponent {
  constructor(
    private matDialog: MatDialog,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService
  ) { }

  sitesForSearch: any = [];
  ngOnInit() {
    this.getSitesforUser();

    // this.SiteSer.getSites().subscribe((res: any) => { this.sitesForSearch = res.sites });
  }

  siteName: any;
  siteSearch: any;
  siteSearch1: any;
  siteslist: any[] = [];
  fields: any[] = [
    {
      serial: 1,
      label: "Site Id",
      id: "siteId",
      sort: true
    },
    {
      serial: 2,
      label: "Site Name",
      id: "siteName",
      sort: true
    },
    {
      serial: 3,
      label: "Monitoring Cameras",
      id: "camera",
      sort: false,
      showCreate: true,
      showAddView: true,
      showunikView: true,
      showView: false
    },
    {
      serial: 4,
      label: "Monitoring Hours",
      id: "MonitoringHours",
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false
    },
    {
      serial: 5,
      label: "Escalation Matrix",
      id: "email",
      sort: false,
      showCreate: true,
      showunikView: false,
      showView: false
    },
    {
      serial: 6,
      label: "Action Tags",
      id: "Action tags",
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false
    },
    {
      serial: 7,
      label: "Actions",
      id: "Action",
      sort: false,
      showCreate: false,
      showunikView: false,
      showView: true
    }
  ]

  showLoader: boolean = false;
  totalPages: any;
  getSitesforUser() {
    this.showLoader = true;
    this.SiteSer.getSites({ page: this.currentPage ?? 1 }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.Status === 'Success') {
        this.count = res;
        this.totalPages = res.totalPages;
        this.siteslist = res.sites;
      }
    })
  }

  currentPage: any;
  getPaginatedData(data: number) {
    this.currentPage = data + 1;
    this.getSitesforUser();
  }

  count: any;
  siteId: any;
  currentItem: any;
  cameraList: any[] = [];
  monitoringCameras: any[] = [];
  checked: boolean = false;

  getCamerasForSiteId(siteId: any) {
    this.cameraList = [];
    this.checked = false;
    this.SiteSer.getCamerasshortDetailsForSiteId({ siteId: siteId }).subscribe((res: any) => {
      this.cameraList = res.cameras;
      this.checked = true;
      //  this.cameraList.map((item: any) => item.isChecked = false);
    })
  }

  getMonitoringStatus_cameras(siteId: any) {
    this.SiteSer.getMonitoringStatus_cameras({ siteId: siteId }).subscribe((res: any) => {
      this.monitoringCameras = res.cameras;
    })
  }


  @ViewChild('camera') cameraTemplate!: TemplateRef<any>;
  @ViewChild('monitoring') monitoringTemplate!: TemplateRef<any>;
  @ViewChild('email') emailTemplate!: TemplateRef<any>;
  @ViewChild('actionTag') actionTemplate!: TemplateRef<any>;
  @ViewChild('action') action!: TemplateRef<any>;

  handleChildEvent(item: any) {

    if (item?.field.serial == 3) {

      this.currentItem = item;
      this.siteId = item?.item.siteId;
      this.getCamerasForSiteId(this.siteId);
      this.matDialog.open(this.cameraTemplate);

    }
    if (item?.field.serial == 4) {

      this.currentItem = item;
      this.siteId = item?.item.siteId;
      this.getMonitoringStatus_cameras(this.siteId);
      this.matDialog.open(this.monitoringTemplate);

    }
    if (item?.field.serial == 5) {

      this.currentItem = item;
      this.siteId = item?.item.siteId;
      this.getCamerasForSiteId(this.siteId);
      this.isSidePanelOpen = true;

    }
    if (item?.field.serial == 6) {
      this.currentItem = item;
      this.siteId = item?.item.siteId;
      this.getCamerasForSiteId(this.siteId);
      this.matDialog.open(this.actionTemplate);
    }
    if (item?.field.serial == 7) {
      this.currentItem = item;
      this.siteId = item?.item.siteId;
      this.getCamerasForSiteId(this.siteId);
      this.matDialog.open(this.action);
    }

  }

  searchSites(event: any) {
    this.siteSearch = event.target.value;
  }

  isSidePanelOpen = false;
  onCloseSidePanel(event: boolean) {
    this.isSidePanelOpen = event;
  }

  isSidePanelOpen1 = false;
  onCloseSidePanel1(event: boolean) {
    this.isSidePanelOpen1 = event;
  }
  openTemplate() {
    this.isSidePanelOpen1 = true;
  }




}
