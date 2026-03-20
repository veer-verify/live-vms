import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  @Input() data: any
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private storageSer: StorageService,
    private alertSer: AlertService,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private siteSer: SiteService
  ) { }

  siteData: any;
  adInfo: any = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    deviceLocId: null,
    adsHours: '00-23',
    workingDays: ['',0,1,2,3,4,5,6],
    createdBy: null,
    softwareVersion: 'v1.0.1',
    socketServer: 'ec2-18-213-63-73.compute-1.amazonaws.com',
    socketPort: 6666,
    remarks: '',
    weatherInterval: null, //BSR
    cameraId: null, //ODR
    modelName: 'Yolov8', //ODR
    modelWidth: 640, //ODR
    modelHeight: 720, //ODR
    modelMaxResults: 3, //ODR
    modelThreshold: 0.6, //ODR
    modelObjectTypeId: null, //ODR
    refreshRules: 0,  //ODR
    debugOn: 0,  //ODR
    debugLogs: 0, //ODR
    loggerFreq: 60,  //ODR
  }

  user: any
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    // console.log(this.data)
    this.getMetadata();
    this.getCamerasForSiteId();
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.siteData?.siteId).subscribe((res: any) => {
      this.cameras = res;
    })
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

  /* popup */
  @ViewChild('editDeviceDialog') editDevice = {} as TemplateRef<any>;
  currentWorkingDays: any;
  // newdeviceId: any;
  // devDataToEdit: any;
  currentItem: any;
  openEditDevice(item: any) {
    this.currentItem = item;
    // this.currentItem.workingDays = this.currentItem.workingDays.toString().split(',');
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editDevice);
  }

  originalObject: any;
  changedKeys: any[] = [];
  onRadioChange(event: any) {
    let x = event.source.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  /* update device */
  updateDeviceDtl() {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,
      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,
      "deviceModeId": this.currentItem.deviceModeId,
      "softwareVersion": this.currentItem.softwareVersion,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,
      "modifiedBy": this.user?.UserId,
    };

    this.adInfo.createdBy = this.user?.UserId;
    if(this.changedKeys.length > 0) {
      // this.alertSer.wait();
      let arr = this.currentItem.workingDays.join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    this.newItemEvent.emit();
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      this.alertSer.success(res?.message ? res?.message : 'Device updated successfully');
    }, (err: any) => {
      this.alertSer.error(err);
    })
  }

  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
    // console.log(e.value.length)
  }

}
