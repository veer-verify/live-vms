import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-device-form',
  templateUrl: './add-device-form.component.html',
  styleUrls: ['./add-device-form.component.css']
})
export class AddDeviceFormComponent {

  @Input() type: any;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private siteSer: SiteService
  ) { }

  addDevice: any =  FormGroup;

  user: any;
  siteDataForForm: any
  ngOnInit() {
    this.siteData = this.storageSer.get('temp_sites');
    this.siteDataForForm = this.storageSer.get('siteIds');
    this.user = this.storageSer.get('user');
    this.formCheck();
    this.getMetadata();
    // this.getCamerasForSiteId();
  }

  formCheck() {
    this.addDevice = this.fb.group({
      'siteId': new FormControl(''),
      'deviceDescription': new FormControl('', Validators.required),
      'deviceTypeId': new FormControl('', Validators.required),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'deviceLocId': new FormControl(0),
      'adsHours': new FormControl(''),
      'workingDays': new FormControl('', Validators.required),
      'createdBy': new FormControl(''),
      'softwareVersion': new FormControl(''),
      'socketServer': new FormControl(''),
      'socketPort': new FormControl(''),
      'weatherInterval': new FormControl(''),
      'cameraId': new FormControl(null),
      'modelName': new FormControl(''),
      'modelWidth': new FormControl(''),
      'modelHeight': new FormControl(''),
      'modelMaxResults': new FormControl(''),
      'modelThreshold': new FormControl(''),
      'modelObjectTypeId': new FormControl(''),
      "loggerFreq": new FormControl(''),
      "refreshRules": new FormControl(''),
      "debugOn": new FormControl(''),
      "debugLogs": new FormControl(''),
      'remarks': new FormControl(''),

      'cameraType': new FormControl(0),
      'morning': new FormControl(''),
      'afternoon': new FormControl(''),
      'evening': new FormControl(''),
      'night': new FormControl(''),
    });

    this.addDevice.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 3) {
        this.addDevice.get('modelObjectTypeId').setValidators(Validators.required);
      } else {
        this.addDevice.get('modelObjectTypeId').clearValidators();
      }
      this.addDevice.get('modelObjectTypeId').updateValueAndValidity();
    });

    // this.addDevice.get('cameraType').valueChanges.subscribe((val: any) => {
    //   if(val == 1) {
    //     this.addDevice.get('cameraId').setValidators(Validators.required);
    //   } else {
    //     this.addDevice.get('cameraId').clearValidators();
    //   }
    //   this.addDevice.get('cameraId').updateValueAndValidity();
    // });
  }

  cameras: any = [];
  getCamerasForSiteId(siteId: any) {
    this.siteSer.getCamerasForSiteId(siteId).subscribe((res: any) => {
      this.cameras = res;
    })
  }

  siteData: any;
  cameraType: any = 0
  adInfo: any = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    deviceLocId: 0,
    adsHours: '',
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
  deviceCountry: any;
  getMetadata() {
    this.dropDown.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 2) {
          this.deviceType = item.metadata;
        } else if(item.type == 1) {
          this.deviceMode = item.metadata;
        } else if(item.type == 6) {
          this.workingDay = item.metadata;
        } else if(item.type == 10) {
          this.tempRange = item.metadata;
        } else if(item.type == 13) {
          this.ageRange = item.metadata;
        } else if(item.type == 7) {
          this.modelObjectType = item.metadata;
        } else if(item.type == 18) {
          this.model = item.metadata;
        } else if(item.type == 19) {
          this.modelResolution = item.metadata;
        } else if(item.type == 20) {
          this.softwareVersion = item.metadata;
        } else if(item.type == 21) {
          this.weatherInterval = item.metadata;
        } else if(item.type == 4) {
          this.deviceStatus = item.metadata;
        } else if(item.type == 28) {
          this.deviceCountry = item.metadata;
        }
      }
    })
  }






  morning: any = {
    name: 'All',
    completed: false,
    subtasks: [
      {name: '00', completed: false},
      {name: '01', completed: false},
      {name: '02', completed: false},
      {name: '03', completed: false},
      {name: '04', completed: false},
      {name: '05', completed: false},
      {name: '06', completed: false},
      {name: '07', completed: false},
      {name: '08', completed: false},
      {name: '09', completed: false},
      {name: '10', completed: false},
      {name: '11', completed: false},
    ],
  };

  afternoon: any = {
    name: 'All',
    completed: false,
    subtasks: [
      {name: '12', completed: false},
      {name: '13', completed: false},
      {name: '14', completed: false},
      {name: '15', completed: false},
    ],
  };

  evening: any = {
    name: 'All',
    completed: false,
    subtasks: [
      {name: '16', completed: false},
      {name: '17', completed: false},
      {name: '18', completed: false},
    ],
  };

  night: any = {
    name: 'All',
    completed: false,
    subtasks: [
      {name: '19', completed: false},
      {name: '20', completed: false},
      {name: '21', completed: false},
      {name: '22', completed: false},
      {name: '23', completed: false}
    ],
  };

  morningAll: boolean = false;
  afternoonAll: boolean = false;
  eveningAll: boolean = false;
  nightAll: boolean = false;
  updateAllComplete(type: string) {
    if(type === 'morning') {
      this.morningAll = this.morning.subtasks != null && this.morning.subtasks.every((t: any) => t.completed);
    }
    if(type === 'afternoon') {
      this.afternoonAll = this.afternoon.subtasks != null && this.afternoon.subtasks.every((t: any) => t.completed);
    }
    if(type === 'evening') {
      this.eveningAll = this.evening.subtasks != null && this.evening.subtasks.every((t: any) => t.completed);
    }
    if(type === 'night') {
      this.nightAll = this.night.subtasks != null && this.night.subtasks.every((t: any) => t.completed);
    }
  }

  someComplete(type: string): boolean {
    if(type === 'morning') {
      if (this.morning.subtasks == null) {
        return false;
      }
      return this.morning.subtasks.filter((t: any)=> t.completed).length > 0 && !this.morningAll;
    }
    if(type === 'afternoon') {
      if (this.afternoon.subtasks == null) {
        return false;
      }
      return this.afternoon.subtasks.filter((t: any)=> t.completed).length > 0 && !this.afternoonAll;
    }
    if(type === 'evening') {
      if (this.evening.subtasks == null) {
        return false;
      }
      return this.evening.subtasks.filter((t: any)=> t.completed).length > 0 && !this.eveningAll;
    }
    if(type === 'night') {
      if (this.night.subtasks == null) {
        return false;
      }
      return this.night.subtasks.filter((t: any)=> t.completed).length > 0 && !this.nightAll;
    }
    return false;
  }

  setAll(completed: boolean, type: string) {
    if(type === 'morning') {
      this.morningAll = completed;
    if (this.morning.subtasks == null) {
      return;
    }
    this.morning.subtasks.forEach((t: any) => (t.completed = completed));
    }
    if(type === 'afternoon') {
      this.afternoonAll = completed;
    if (this.afternoon.subtasks == null) {
      return;
    }
    this.afternoon.subtasks.forEach((t: any) => (t.completed = completed));
    }
    if(type === 'evening') {
      this.eveningAll = completed;
    if (this.evening.subtasks == null) {
      return;
    }
    this.evening.subtasks.forEach((t: any) => (t.completed = completed));
    }
    if(type === 'night') {
      this.nightAll = completed;
    if (this.night.subtasks == null) {
      return;
    }
    this.night.subtasks.forEach((t: any) => (t.completed = completed));
    }
  }

  @ViewChild('createWorkingDays') createWorkingDays!: MatSelect;
  selectCreate: boolean = false;
  toggleCreateWorkingDays() {
    this.selectCreate = !this.selectCreate;

    if(this.selectCreate) {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.createWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
  }


  @ViewChild('modifyWorkingDays') modifyWorkingDays!: MatSelect;
  selectModify: boolean = false;
  toggleModifyWorkingDays() {
    this.selectModify = !this.selectModify;

    if(this.selectModify) {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.select());
    } else {
      this.modifyWorkingDays?.options.forEach((item : MatOption) => item.deselect());
    }
  }

  toAddDevice: any;
  isToogleClicked: boolean = false;
  onToAddDevice(e: any) {
    this.isToogleClicked = true;
    this.toAddDevice = e.value.length;
  }

  addDeviceDtl() {    
    if(this.addDevice.valid) {
      let morning = this.morning.subtasks;
      let afternoon = this.afternoon.subtasks;
      let evening = this.evening.subtasks;
      let night = this.night.subtasks;
      let results = [ ...morning, ...afternoon, ...evening, ...night];
      let finalResults = results?.filter(item=> item.completed);
      let taskNames = finalResults.map(task => task.name);
      this.adInfo.adsHours = taskNames?.sort((a: any, b: any) => a > b ? 1 : a < b ? -1 : 0).join(',');
      
      if(this.cameraType === 0) {
        this.adInfo.cameraId = 0;
      }
      if(this.type === 'add-device') {
        this.adInfo.siteId = this.siteData.siteId;
      }
      if(!this.isToogleClicked) {
        let arr: string = this.adInfo.workingDays.join(',');
        let myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      }
      if(this.isToogleClicked) {
        let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
        if(this.toAddDevice === 8) {
          var myString = arr.substring(1);
          this.adInfo.workingDays = myString;
        } else {
          this.adInfo.workingDays = arr;
        }
      }
      this.adInfo.createdBy = this.user?.UserId;
      this.alertSer.wait();
      this.assetSer.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        this.newItemEvent.emit();
        this.alertSer.success(res?.message ? res?.message : 'Device created successfully');
      }, (err: any) => {
        this.alertSer.error(err);
      })
    }
  }

}
