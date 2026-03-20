import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DevicesComponent } from 'src/app/devices/devices.component';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { AddDeviceComponent } from '../add-device/add-device.component';

@Component({
  selector: 'app-edit-device-form',
  templateUrl: './edit-device-form.component.html',
  styleUrls: ['./edit-device-form.component.css']
})
export class EditDeviceFormComponent {

  @Input() currentItem: any;

  constructor(
    private fb: FormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService,
    private devices: DevicesComponent,
    private addDeviceComp: AddDeviceComponent
  ) { }


  user: any;
  siteData: any
  currentWorkingDays: any;
  currentAdHours: any
  ngOnInit() {
    this.user = this.storageSer.get('user');
    this.siteData = this.storageSer.get('temp_sites');
    this.getMetadata();
    this.getCamerasForSiteId();
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.currentAdHours = JSON.parse(JSON.stringify(this.currentItem.adsHours.split(',')));
  }

  cameras: any = [];
  getCamerasForSiteId() {
    this.siteSer.getCamerasForSiteId(this.currentItem?.siteId ? this.currentItem?.siteId : this.currentItem?.siteId).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  checkBoxItems = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

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
      for (let item of res) {
        if (item.type == 2) {
          this.deviceType = item.metadata;
        }
        else if (item.type == 1) {
          this.deviceMode = item.metadata;
        }
        else if (item.type == 6) {
          this.workingDay = item.metadata;
        }
        else if (item.type == 10) {
          this.tempRange = item.metadata;
        }
        else if (item.type == 13) {
          this.ageRange = item.metadata;
        }
        else if (item.type == 7) {
          this.modelObjectType = item.metadata;
        }
        else if (item.type == 18) {
          this.model = item.metadata;
        }
        else if (item.type == 19) {
          this.modelResolution = item.metadata;
        }
        else if (item.type == 20) {
          this.softwareVersion = item.metadata;
        }
        else if (item.type == 21) {
          this.weatherInterval = item.metadata;
        }
        else if (item.type == 4) {
          this.deviceStatus = item.metadata;
        }
        else if (item.type == 28) {
          this.deviceCountry = item.metadata;
        }
      }
    })
  }

  originalObject: any;
  changedKeys: any[] = [];
  isChekboxTouched: boolean = false;
  onCheckbox(data: any, event: any) {
    this.isChekboxTouched = true;
    if(event.checked && (!this.currentAdHours.includes(data))) {
      this.currentAdHours.push(data);
    } else {
      const filteredItems = this.currentAdHours.filter((item: any) => item !== data);
      this.currentAdHours = filteredItems;
    }

    let x = event.source.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onRadioChange(event: any) {
    let x = event.source.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  toAddDevice: any;
  isToogleClicked: boolean = false;
  onSelectChange(event: any) {
    this.isToogleClicked = true;
    this.toAddDevice = event.value.length;

    let x = event.source.ngControl.name;
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if (!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  cameraType: any = 0;
  finalAdHours: any = [];
  updateDeviceDtl() {
    this.originalObject = {
      "deviceId": this.currentItem.deviceId,
      "deviceCallFreq": this.currentItem.deviceCallFreq,
      "deviceDescription": this.currentItem.deviceDescription,
      "remarks": this.currentItem.remarks,
      "weatherInterval": this.currentItem.weatherInterval,
      // "loggerFreq": this.currentItem.loggerFreq,
      "modelWidth": this.currentItem.modelWidth,
      "modelHeight": this.currentItem.modelHeight,
      "deviceModeId": this.currentItem.deviceModeId,
      "softwareVersion": this.currentItem.softwareVersion,
      // "deviceTypeId": this.currentItem.deviceTypeId,
      "adsHours": this.currentItem.adsHours,
      "workingDays": this.currentItem.workingDays,
      "status": this.currentItem.status,
      "cameraId": this.currentItem.cameraId,
      "modelName": this.currentItem.modelName,
      "modelObjectTypeId": this.currentItem.modelObjectTypeId,
      "debugOn": this.currentItem.debugOn,
      "debugLogs": this.currentItem.debugLogs,
      "refreshRules": this.currentItem.refreshRules,
      "modifiedBy": this.user?.UserId,
    };

    if(this.cameraType === 0) {
      this.currentItem.cameraId = 0;
    }
    if(this.isChekboxTouched) {
      this.originalObject.adsHours = this.currentAdHours.sort((a: any, b: any) => a > b ? 1 : a < b ? -1 : 0).join(',');
    }
    // this.currentItem.createdBy = this.user?.UserId;
    if (this.changedKeys.length > 0) {
      let arr = this.currentWorkingDays.join(',');
      if (this.toAddDevice === 8) {
        var myString = arr.substring(1);
        this.originalObject.workingDays = myString;
      } else {
        this.originalObject.workingDays = arr;
      }
    }
    this.alertSer.wait();
    this.assetSer.updateDeviceAdsInfo({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      this.devices.listDeviceAdsInfo();
      this.addDeviceComp.listDeviceAdsInfo();
      this.alertSer.success(res.message ? res.message : 'Device updated successfully');
    }, (err: any) => {
      this.alertSer.error(err);
    })
  }

}
