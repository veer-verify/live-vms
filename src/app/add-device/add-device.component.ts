import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
// import { EditDeviceFormComponent } from '../edit-device-form/edit-device-form.component';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})

export class AddDeviceComponent implements OnInit {
  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  addDevice: any =  FormGroup;
  searchText: any;

  constructor(
    private fb: FormBuilder,
    private assetSer:AssetService ,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService
  ) { }

  siteData: any;

  user: any;
  ngOnInit() {
    this.siteData = this.storageSer.get('temp_sites');
    this.user = this.storageSer.getUser();
    this.listDeviceAdsInfo();
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.siteData?.siteId).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  deviceData: any = [];
  deviceLength: any;
  convertedArray: any;
  days: any
  // deviceMap: any;
  listDeviceAdsInfo() {
    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      this.getMetadata();
      for(let item of res) {
        if(this.siteData.siteId == item.siteId) {
          this.deviceData = item.adsDevices;
          this.deviceData.forEach((item: any) => {
            // item.adsHours.split(',');
            // item.workingDays.split(',');
            this.days = JSON.parse(JSON.stringify(item.workingDays.split(',').map((val: any) => +val)));
          })
          this.deviceLength = this.deviceData.length;
          // console.log(this.deviceData);
        }
      }
    })

    // this.deviceData = this.fromSites;
    // this.deviceLength = this.deviceData.length;
  }

  getCurrentDevice(data: any) {
    // console.log('hello')
    this.assetSer.listDeviceByDeviceId(data?.deviceId).subscribe((res: any) => {
      // console.log(res)
    })
  }


  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit(false);
  }


  deviceType: any;
  deviceMode: any;
  workingDay: any;
  tempRange: any;
  ageRange: any;
  modelObjectType: any;
  model: any;
  modelResolution: any;
  softwareVersion: any;
  weatherInterval: any;
  deviceStatus: any;
  deviceCountry: any
  getMetadata() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 2) {
          this.deviceType = item.metadata;
        }
        else if(item.type == 1) {
          this.deviceMode = item.metadata;
        }
        else if(item.type == 6) {
          this.workingDay = item.metadata;
        }
        else if(item.type == 10) {
          this.tempRange = item.metadata;
        }
        else if(item.type == 13) {
          this.ageRange = item.metadata;
        }
        else if(item.type == 7) {
          this.modelObjectType = item.metadata;
        }
        else if(item.type == 18) {
          this.model = item.metadata;
        }
        else if(item.type == 19) {
          this.modelResolution = item.metadata;
        }
        else if(item.type == 20) {
          this.softwareVersion = item.metadata;
        }
        else if(item.type == 21) {
          this.weatherInterval = item.metadata;
        }
        else if(item.type == 4) {
          this.deviceStatus = item.metadata;
        }
        else if(item.type == 28) {
          this.deviceCountry = item.metadata;
        }
      }
    })
  }


  @ViewChild('editDeviceDialog') editDevice = {} as TemplateRef<any>;
  currentWorkingDays: any;
  currentItem: any;
  openEditDevice(item: any) {
    this.currentItem = item;
    // this.currentItem.workingDays = this.currentItem.workingDays.toString().split(',');
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editDevice);
  }

  /* create device */
  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

}
