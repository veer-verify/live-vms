import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-monitoring-info',
  templateUrl: './monitoring-info.component.html',
  styleUrls: ['./monitoring-info.component.css'],
})
export class MonitoringInfoComponent {
  constructor(
    private matDialog: MatDialog,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService,
    private fb: FormBuilder
  ) {}

  sitesForSearch: any = [];
  ngOnInit() {
    this.getSitesforUser();


    // this.SiteSer.getSites().subscribe((res: any) => { this.sitesForSearch = res.sites });
    this.flagsForm = this.fb.group({
      callFlag: ['F'],
      emailFlag: ['F'],
      textFlag: ['F'],
      lawEnforcementFlag: ['F'],
    });

  }

  siteName: any = '';
  siteSearch: any;
  siteSearch1: any;
  siteslist: any[] = [];
  fields: any[] = [
    {
      serial: 1,
      label: 'Site Id',
      id: 'siteId',
      sort: true,
    },
    {
      serial: 2,
      label: 'Site Name',
      id: 'siteName',
      sort: true,
    },
    {
      serial: 3,
      label: 'Monitoring Cameras',
      id: 'camera',
      sort: false,
      showCreate: true,
      showAddView: true,
      showunikView: true,
      showView: false,
    },
    {
      serial: 4,
      label: 'Monitoring Hours',
      id: 'MonitoringHours',
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false,
    },
    {
      serial: 5,
      label: 'Escalation Matrix',
      id: 'email',
      sort: false,
      showCreate: true,
      showunikView: false,
      showView: false,
    },

    {
      serial: 6,
      label: 'Action Tags',
      id: 'Action tags',
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false,
    },
    {
      serial: 7,
      label: 'Planned site Activity',
      id: 'planned',
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false,
    },
    {
      serial: 8,
      label: 'Guard Services',
      id: '',
      sort: false,
      showCreate: true,
      showunikView: true,
      showView: false,
    },
    {
      serial: 9,
      label: 'Actions',
      id: 'Action',
      sort: false,
      showCreate: false,
      showunikView: false,
      showView: true,
      actions: ['settings'],
      key: 'actions',
      type: 'actions',
      call: (data: any, type: string) => {
        switch (type) {
          case 'settings':
            this.settings(data);
            break;
          default:
            break;
        }
      },
    },
  ];

  showLoader: boolean = false;
  totalPages: any;
  getSitesforUser() {
    this.showLoader = true;
    this.SiteSer.getSites({
      page: this.currentPage ?? 1,
      search: this.siteName,
    }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.Status === 'Success') {
        this.count = res;
        this.totalPages = res.totalPages;
        this.siteslist = res.sites;
      }
    });
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
    this.SiteSer.getCamerasshortDetailsForSiteId({ siteId: siteId }).subscribe(
      (res: any) => {
        this.cameraList = res.cameras;
        this.checked = true;
        //  this.cameraList.map((item: any) => item.isChecked = false);
      }
    );
  }

  getMonitoringStatus_cameras(siteId: any) {
    this.SiteSer.getMonitoringStatus_cameras({ siteId: siteId }).subscribe(
      (res: any) => {
        this.monitoringCameras = res.cameras;
      }
    );
  }

  @ViewChild('camera') cameraTemplate!: TemplateRef<any>;
  @ViewChild('monitoring') monitoringTemplate!: TemplateRef<any>;
  @ViewChild('email') emailTemplate!: TemplateRef<any>;
  @ViewChild('actionTag') actionTemplate!: TemplateRef<any>;
  @ViewChild('action') action!: TemplateRef<any>;
  @ViewChild('planned') planned!: TemplateRef<any>;
  @ViewChild('sitesetting') sitesetting!: TemplateRef<any>;

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
      this.matDialog.open(this.planned, { disableClose: true });
    }
    if (item?.field.serial == 8) {
      this.currentItem = item;
      this.siteId = item?.item.siteId;
      // this.getCamerasForSiteId(this.siteId);
      this.matDialog.open(this.sitesetting, { disableClose: true });
    }
    if (item?.field.serial == 9) {
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

  flagsForm!: FormGroup;

  @ViewChild('settingspopup') settingspopup!: TemplateRef<any>;
  settings(data: any) {
    this.currentItem = data;
    this.getsiteInfo()
    this.matDialog.open(this.settingspopup, { disableClose: true });
  }


  siteconfig:any;
  getsiteInfo(){

    this.SiteSer.getSiteMonitoringInfo(this.currentItem).subscribe((res:any)=>{
     if(res?.statusCode==200){
      this.siteconfig=res.data;
      this.flagsForm.patchValue(this.siteconfig);
     }
    })

  }

  submitSiteConfig() {
    this.SiteSer.addSiteMonitoringInfo({
      ...this.flagsForm.value,
      siteId: this.currentItem?.siteId,
    }).subscribe((res: any) => {
      if (res?.statusCode == 200) {
        this.alaram.success(res.message);
        this.matDialog.closeAll();

      } else {
        this.alaram.error(res.message);
      }
    });
  }
}
