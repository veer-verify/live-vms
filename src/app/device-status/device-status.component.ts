import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css']
})
export class DeviceStatusComponent {

  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private siteSer: SiteService,
    public dialog: MatDialog,
    // public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  ngOnInit(): void {
    // this.getSitesListForUserName()
    // this.listDeviceAdsInfo();
    // this.getStatus();
    // this.getData();
  }
  siteId: any;
  deviceId: any

  // current:any
  // currentItem1:any;
  getDataForDevice:any = [];
  newGetDataForDevice:any = [];
  showLoader1: boolean = false;

  // openDialog(): void {
  //   this.getData();
  //   const dialogRef = this.dialog.open(SensorDataComponent,{

  //     width: '100%',
  //     height:'90vh'

  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });

  // }

   /* searches */
    siteSearch: any;
    siteNg: any = 'All'
    searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
    }

    filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteId == site)
    } else {
      this.newTableData = this.tableData;
    }
  }

  tableData: any = [];
  newTableData: any = [];

  getSitesListForUserName() {
    // this.showLoader = true;
    // this.siteSer.getSitesListForUserName().subscribe((res: any) => {
    //   // console.log(res);
    //   this.showLoader = false;
    //   if(res?.Status == 'Success') {
    //     this.tableData = res?.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
    //     this.newTableData = this.tableData;
    //   }
    //   }, (err: any) => {
    //     this.showLoader = false;
    // });
  }

  searchText: any;
  deviceData: any = [];
  newDeviceData: any = [];
  active: any = [];
  inActive: any = [];

  upTime: any;

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDevicesFromChild(data: any) {
    this.newDeviceData = data;

    this.active = [];
    this.inActive = [];
    for(let item of data) {
      if(item.status == 1) {
        this.active.push(item);
      } else if(item.status == 2) {
        this.inActive.push(item);
      }
    }
  }

  getDevicesFromChild1(data: any) {
    this.newGetDataForDevice = data;
    console.log(data)
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }



  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  // rebootDevice(id: any) {
  //   this.alertSer.wait();
  //   this.assetSer.updateRebootDevice(id).subscribe((res: any) => {
  //     // console.log(res)
  //     if(res) {
  //       this.alertSer.success(res?.message);
  //     }
  //   }, (err: any) => {
  //     if(err) {
  //       this.alertSer.error(err?.error?.message);
  //     };
  //   });
  // }


  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any) {
    if(type == 'device') { this.showAddDevice = true }
    if(type == 'device-info') { this.showDeviceInfo = true }
  }

  closenow(type: any) {
    if(type == 'device') {this.showAddDevice = false}
    if(type == 'device-info') {this.showDeviceInfo = false}
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  currentItem: any;
  currentWorkingDays: any;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.viewSiteDialog);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    // console.log(item)
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editSiteDialog);
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newDeviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
  
}
