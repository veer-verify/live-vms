import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-device',
  templateUrl: './add-new-device.component.html',
  styleUrls: ['./add-new-device.component.css'],
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
export class AddNewDeviceComponent implements OnInit {

  @Input() fromSites: any;
  @Output() newItemEvent = new EventEmitter<boolean>();
  
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
  searchText: any;
  siteData: any;

  adInfo = {
    siteId: null,
    deviceDescription: '',
    deviceTypeId: null,
    deviceCallFreq: 1,
    deviceModeId: null,
    deviceLocId: null,
    adsHours: '',
    workingDays: '',
    createdBy: null,
    softwareVersion: '',
    socketServer: 'ec2-18-213-63-73.compute-1.amazonaws.com',
    socketPort: 6666,
    remarks: '',
    weatherInterval: null, //BSR
    cameraId: 'Cam01', //ODR
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

  user: any;
  ngOnInit() {
    this.siteData = this.storageSer.get('siteIds');
    this.user = this.storageSer.get('user');

    this.addDevice = this.fb.group({
      'siteId': new FormControl('', Validators.required),
      'deviceDescription': new FormControl('', Validators.required),
      'deviceTypeId': new FormControl('', Validators.required),
      'deviceCallFreq': new FormControl('', Validators.required),
      'deviceModeId': new FormControl('', Validators.required),
      'deviceLocId': new FormControl('', Validators.required),
      'adsHours': new FormControl(''),
      'workingDays': new FormControl('', Validators.required),
      'createdBy': new FormControl(''),
      'softwareVersion': new FormControl(''),
      'socketServer': new FormControl(''),
      'socketPort': new FormControl(''),
      'weatherInterval': new FormControl(''),
      'cameraId': new FormControl(''),
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
    });

    this.addDevice.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 3) {
        this.addDevice.get('cameraId').setValidators(Validators.required);
        this.addDevice.get('modelObjectTypeId').setValidators(Validators.required);
      } else {
        this.addDevice.get('cameraId').clearValidators();
        this.addDevice.get('modelObjectTypeId').clearValidators();
      }
      this.addDevice.get('cameraId').updateValueAndValidity();
      this.addDevice.get('modelObjectTypeId').updateValueAndValidity();
    });
    this.getMetadata();
  }

  deviceData: any = [];
  deviceLength: any;

  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  closeAddDevice() {
    this.newItemEvent.emit();
  }

  deviceType: any;
  deviceMode: any;
  workingDay: any = [];
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
    let data = this.storageSer.get('metaData');
    data?.forEach((item: any) => {
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
    })
  }

  /* dynamic device view */
  // toChild: any
  // onMat(e: any) {
  //   this.toChild = this.deviceData.filter((el: any) => el.deviceId == e.tab.textLabel);
  //   console.log(this.toChild)
  // }

  /* create device */
  toAddDevice: any;
  onToAddDevice(e: any) {
    this.toAddDevice = e.value.length;
  }

  toppings = this.fb.group({
    '00': false,
    '01': false,
    '02': false,
    '03': false,
    '04': false,
    '05': false,
    '06': false,
    '07': false,
    '08': false,
    '09': false,
    '10': false,
    '11': false,
    '12': false,
    '13': false,
    '14': false,
    '15': false,
    '16': false,
    '17': false,
    '18': false,
    '19': false,
    '20': false,
    '21': false,
    '22': false,
    '23': false,
  });

  finalToopings: any;
  myToops: any = [];
  addDeviceDtl() {
    // console.log(this.addDevice);
    if(this.addDevice.valid) {
      this.newItemEvent.emit();

      this.finalToopings =this.toppings.value;
      for(const val in this.finalToopings) {
        if(this.finalToopings[val] === true) {
          this.myToops.push(val)
        }
      }
      this.adInfo.adsHours = this.myToops.join(',');
      let arr = JSON.parse(JSON.stringify(this.adInfo.workingDays)).join(',');
      if(this.toAddDevice == 8) {
        var myString = arr.substring(1);
        this.adInfo.workingDays = myString;
      } else {
        this.adInfo.workingDays = arr;
      }
      // this.alertSer.wait();
      this.adInfo.createdBy = this.user?.UserId;
      this.assetSer.createDeviceandAdsInfo(this.adInfo).subscribe((res: any) => {
        // console.log(res);
        this.alertSer.success(res?.message ? res?.message : 'Device created successfully');
      },
      (err: any) => {
        this.alertSer.error(err);
      })
    }
  }

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.workingDay.length; i++) {
      // console.log(this.workingDay[i])
      this.workingDay[i].selected = !this.workingDay[i].selected;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.workingDay.every(function (item: any) {
      return item.selected == true;
    })
  }


  @ViewChild('createSelect') createSelect!: MatSelect;
  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    if(this.allSelected) {
      this.createSelect?.options?.forEach( (item : MatOption) => item.select());
    } else {
      this.createSelect?.options?.forEach( (item : MatOption) => {item.deselect()});
    }
  }

  checkSelect() {

  }
}
