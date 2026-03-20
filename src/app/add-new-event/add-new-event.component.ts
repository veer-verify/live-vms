import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-event',
  templateUrl: './add-new-event.component.html',
  styleUrls: ['./add-new-event.component.css'],
    animations:[
      trigger("inOutPaneAnimation", [
        transition(":enter", [
          style({ opacity: 0, transform: "translateX(100%)" }),
          animate(
            "500ms ease-in-out",
            style({ opacity: 1, transform: "translateX(0)" })
          )
        ]),
        transition(":leave", [
          style({ opacity: 1, transform: "translateX(0)" }),
          animate(
            "500ms ease-in-out",
            style({ opacity: 0, transform: "translateX(100%)" })
          )
        ])
      ])
    ]
})
export class AddNewEventComponent {
  constructor(
      private router: Router,
      private fb: FormBuilder,
      private assetSer: AssetService,
      private dropDown: MetadataService,
      private alertSer: AlertService,
      private siteService: SiteService,
      private storageSer: StorageService,
      private siteSer: SiteService,
      private adver:AdvertisementsService
    ) { }



    @Output() newItemEvent: any = new EventEmitter();
    @Input() currentSite: any;
    @Input() data: any;
    @Input() type!: string;

    addAssetForm!: FormGroup;
    searchText: any;
    currentDate = new Date();

    /* Asset Object */
    siteId: any;
    minDate: Date = new Date();

    personshow : boolean = false;
    toggleShowOnOff() {
      this.personshow = !this.personshow;
    }

    awsType:any = 2;
    // motionTrue:any = 1
    // objectTrue:any = 1

    objectNames: any[] = []
    adFor: any = null;
    enableDemo: boolean = false;

    // deviceIdFromStorage: any;
    user: any;
    ngOnInit(): void {
      this.user = this.storageSer.getUser();
      // this.deviceIdFromStorage = this.storageSer.get('add_body');
      if(this.type === 'create') {
        this.addAssetForm = this.fb.group({
          "cameraId": new FormControl('', Validators.required),
          "modelName": new FormControl(''),
          "modelPath": new FormControl(''),
          "modelWidth": new FormControl(0),
          "modelHeight": new FormControl(0),
          "modelFps": new FormControl(''),
          "skipFrames": new FormControl(0),
          "eventsMinHits": new FormControl(0),
          "eventsThreshold": new FormControl(0),
          "maskIn": new FormControl(''),
          "maskOut": new FormControl(''),
          "eventsPolygonPoints": new FormControl(''),
          "eventsDeviceName": new FormControl(''),
          "eventsAwsServer": new FormControl(''),
          "eventsAwsPort": new FormControl(''),
          "eventsImageUrl": new FormControl('202.53.67.75:8088'),
          "motionDetection": new FormControl('T'),
          "motionDetectionArea": new FormControl(0),
          "objectDetection": new FormControl('T'),
          "remarks": new FormControl(''),
          "eventDelayTime": new FormControl(0),
          "objectNames": new FormControl([]),
          "eventsQueueName": new FormControl(''),
          "dummyEventsTime": new FormControl(0),
          "awsType":new FormControl(2),
        });


        // this.addAssetForm.get('motionDetection')!.valueChanges.subscribe((val: any) => {
        //   if(val == 'T') {
        //     this.addAssetForm.get('motionDetectionArea')!.setValidators(Validators.required);
        //   } else {
        //     this.addAssetForm.get('motionDetectionArea')!.clearValidators();
        //   }
        //   this.addAssetForm.get('motionDetectionArea')!.updateValueAndValidity();
        // });

        // this.addAssetForm.get('objectDetection')!.valueChanges.subscribe((val: any) => {
        //   if(val == 'T') {
        //     this.addAssetForm.get('motionDetectionArea')!.setValidators(Validators.required);
        //   } else {
        //     this.addAssetForm.get('motionDetectionArea')!.clearValidators();
        //   }
        //   this.addAssetForm.get('motionDetectionArea')!.updateValueAndValidity();
        // });

      } else if(this.type === 'edit') {
        let config: any = {};
        this.data.awsType = 1;
        Object.keys(this.data).map((item: any) => {
          config[item] = new FormControl(this.data[item]);
        })

        this.addAssetForm = this.fb.group(config);
      }

      this.getSitesListForUserName();
      this.onMetadataChange();
      this.category();
      this.getCentralBoxForSiteId();
    };

    unitIdDw:any;
    getCentralBoxForSiteId(){

      this.siteSer.getCentralBoxForSiteId(this.currentSite).subscribe((res:any)=>{
        if(res.statusCode==200){
          this.unitIdDw=res.centralBox;
        }
      })

    }

    clearNums(names: any) {
      if(this.type == 'edit') return;
      names.forEach((item: any) => {
        this.addAssetForm.get(item)?.setValue(0);
      })
    }

    clearVals(names: any) {
      if(this.type == 'edit') return;
      names.forEach((item: any) => {
        this.addAssetForm.get(item)?.setValue('');
      })
    }

    currentDeviceType: any;
    getDeviceType(data: any) {
      this.currentDeviceType = data.deviceTypeId;
    }

    showLoader:boolean = false;
    Active:any= [];
    inactive:any = [];
    newlistDeviceInfoData:any = [];
    listDeviceInfoData:any


    /* create Asset */
    addId:any;
    lastSubmittedItemId:any = []
    submit: boolean = false;



    addName:any
    addCameraEventsConfigData() {
      if(this.type == 'create') {
        if(!this.addAssetForm.valid) return;
        const { objectDetection, motionDetection } = this.addAssetForm.value;
        if (objectDetection === 'F' && motionDetection === 'F') {
          this.alertSer.error("At least one detection type must be enabled.");
          return;
        }
          // this.alertSer.wait();
          this.showLoader=true;
          this.siteSer.addCameraEventsConfigData(this.addAssetForm.value).subscribe((res: any) => {
            this.showLoader=false;
            if(res?.status_code == 200 ) {
              this.newItemEvent.emit();
              this.alertSer.success(res?.message)
            } else {
              this.alertSer.error(res?.message)
            }
          },(error:any)=> {
            this.showLoader=false;
            this.alertSer.error(error?.err?.message)
          });
      } else if(this.type == 'edit') {
        this.showLoader=true;
          this.siteSer.updateCameraEventsConfigData(this.addAssetForm.value).subscribe((res:any) => {
            this.showLoader=false;
            if(res.status_code == 200) {
              // this.getSitesListForUserName()
              this.newItemEvent.emit();
              this.alertSer.success(res?.message);
            } else {
              this.alertSer.error(res?.message)
            }
          })
      }
    }

    newCategoryList:any = []
    categoryList:any = [];
    category() {
      this.adver.category().subscribe((res:any) => {
        // console.log(res)
        this.categoryList = res.categoryList
        this.newCategoryList = this.categoryList.flatMap((item:any) => item.subCategoryList)
      })
    }



    siteData: any = [];
    getSitesListForUserName() {
      this.siteSer.getSitesListForUserName().subscribe((res: any) => {
        // console.log(res)
        if(res?.Status == 'Success') {
          this.siteData = res.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        }
      });
      this.getCamerasForSiteId()
    }

    cameras: any = [];
    getCamerasForSiteId() {
      this.showLoader = true;
      this.siteSer.getCamerasForSiteId(this.currentSite?.siteId).subscribe((res: any) => {
        // console.log(res);
        this.showLoader = false;
        this.cameras = res;
      }, (err: any) => {
        this.showLoader = false;
      })
    }

    filteredDevices: any = [];
    filterAdvertisements() {
      this.assetSer.listDeviceBySiteId({siteId: this.siteId}).subscribe((res: any) => {
        this.filteredDevices = res.flatMap((item: any) => item.adsDevices);
      });
    }

    /* searches */
    siteSearch: any;
    searchSites(event: any) {
      this.siteSearch = (event.target as HTMLInputElement).value
    }

    // data: any;
    siteIdList: any;
    deviceIdList: any;
    getRes() {
      this.siteService.getSitesListForUserName().subscribe((res: any) => {
        // console.log(res);
        this.siteIdList = res.sites;
      })

      this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
        const assets = res.flatMap((item: any) => item.adsDevices);
        // console.log(assets);
        this.deviceIdList = assets;
      })
    }

    /* file upload */
    selectedFile: any;
    // selectedFiles: any = [];
    isAudio: boolean = false;
    onFileSelected(event: any) {
      let x = event.target.files[0];
      if(x.size <= 5242880){

        if(typeof(event) == 'object') {
          this.selectedFile = x.size <= 5242880 ? x : null;
        }

      }
      else{

        this.alertSer.error("File Size should be lessthan 5MB")
      }
    }

    deleteFile() {
      this.isAudio = false
      this.selectedFile = null;
      // this.assetData.file = null;
    }

    closeForm() {
      this.newItemEvent.emit();
    }

    Model_Width: any;
    Model_Height: any;
    workingDay: any;
    Object_Names: any;
    ageRange: any;
    modelObjectType: any;
    model: any;
    modelResolution: any;
    softwareVersion: any;
    weatherInterval: any;
    Queue_Name: any;
    onMetadataChange() {
      let data = this.storageSer.get('metaData');
      data?.forEach((item: any) => {
        if(item.type == 131) {
          this.Model_Width = item.metadata;
        } else if(item.type == 130) {
          this.Model_Height = item.metadata;
        }  else if(item.type == 132) {
          this.Object_Names = item.metadata;
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
        } else if(item.type == 129) {
          this.Queue_Name = item.metadata;
        }
      })
    }

      // currentData:any = {
      //   objectNames: [] as string[]
      // };



    /* Search for Get Site and Device Id's */
    sit: string = '';
    dev: string = '';
    siteSearchh(e: Event) {
      this.sit = (e.target as HTMLInputElement).value;
    }

    deviceSer(e: Event) {
      this.dev = (e.target as HTMLInputElement).value;
    }


    newDeviceData:any = []
    Category:any ;
    deviceId:any = "";
    adName:any = 'All';
     subcategoryId:any;
     newSiteData: any = []

    subCategoryList:any=[]

    openSubcategoryList(item:any) {
      this.subCategoryList = item.subCategoryList
    }


}
