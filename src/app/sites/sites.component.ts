import { Component, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { SiteService } from 'src/services/site.service';

import { StorageService } from 'src/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
// import { UserService } from 'src/services/user.service';
import { EditCameraComponent } from '../edit-camera/edit-camera.component';
import { MetadataService } from 'src/services/metadata.service';
import { HttpClient } from '@angular/common/http';
import { CreateFormComponent } from '../create-form/create-form.component';
// import { AdvertisementsService } from 'src/services/advertisements.service';
import { Country, State, City }  from 'country-state-city';
import { AssetService } from 'src/services/asset.service';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  fields = [
    {
      key: 'siteId',
      label: 'Id',
      type: '',
      sort: true
    },
    {
      key: 'siteName',
      label: 'Name',
      type: '',
      sort: true
    },
    {
      key: 'unitId',
      label: 'Unit Id',
      type: 'array',
      call: (data: any) => data.centralBoxInfo,
      keyword: 'unitId',
      sort: true
    },

    // {
    //   key: 'centralBoxStatus',
    //   label: 'centralBoxStatus',
    //   type: '',
    //   sort: true
    // },
    // {
    //   key: 'accountName',
    //   label: 'Account Name',
    //   type: 'array',
    //   special: 'accountInfo',
    //   call: (data: any) => data.siteAssociatedAccounts,
    //   keyword: 'accountName',
    //   sort: true
    // },
    {
      key: 'Cameras',
      label: 'Cameras',
      type: 'button',
      sort: false,
      call: (data: any) => this.getCamerasForSiteId(data)
    },
    {
      key: 'Central Box',
      label: 'Central Box',
      type: 'button',
      sort: false,
      call: (data: any) => this.getCentalBox(data)
    },
    {
      key: 'Site Services',
      label: 'Site Services',
      type: 'button',
      sort: false,
      call: (data: any) => this.listSiteServices(data)
    },
    // {
    //   key: 'Site Validation',
    //   label: 'Site Validation',
    //   type: 'button',
    //   sort: false,
    //   call: (data: any) => this.listSiteCheckList(data)
    // },
    // {
    //   key: 'Events',
    //   label: 'Events',
    //   type: 'button',
    //   sort: false,
    //   call: (data: any) => this.getCameraEventsConfigData(data)
    // },
       {
      key: 'siteStatus',
      label: 'Status',
      type: '',
      sort: true
    },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['view', 'edit'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch(type) {
          case 'view':
            this.openViewPopup(data);
            break;
          case 'edit':
            this.openEditPopup(data);
            break;
          default:
        }
      }
    }
  ]

  eventFields = [
    {
      key: 'cameraId',
      label: 'Id',
      type: '',
      sort: true
    },
    {
      key: 'modelName',
      label: 'Model Name',
      type: '',
      sort: true
    },
    {
      key: 'modelPath',
      label: 'Model Path',
      type: '',
      sort: true,
    },
    {
      key: 'modelWidth',
      label: 'modelWidth',
      type: '',
      sort: true,
    },
    {
      key: 'modelHeight',
      label: 'modelHeight',
      type: '',
      sort: true,
    },
    {
      key: 'modelFps',
      label: 'modelFps',
      type: '',
      sort: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['view', 'edit'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch(type) {
          case 'view':
            this.eventViewDialog(data);
            break;
          case 'edit':
            this.eventEditDialog(data);
            break;
          default:
            break;
        }
      }
    }
  ]

  constructor(
    private siteSer: SiteService,
    private assetSer: AssetService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private fb:FormBuilder,
    private alertSer: AlertService,
    private userSer: UserService,
    private metaSer: MetadataService,
    private http: HttpClient,
    // private adver:AdvertisementsService
  ) {

  }

  status:any="";
  tableData: any = [];
  newTableData: any = [];
  showLoader: boolean = false;
  searchText: any;
  eventSearch: any;

  tempSite: any;
  createCenteralBox!: FormGroup;
  currentUser:any
  user:any
  role:any
  // newRoleData :any =[]
  roleDetails:any =[]
  adminData:any = []
  type:any = 1
  currentRole:any
  userName:any
  ngOnInit(): void {
    this.user = this.storageSer.getUser();
    this.role = this.storageSer.get('role');
    this.roleDetails = this.role?.filter((item: any) => item.categoryName == 'Member')[0]?.details;
    this.adminData = this.role?.filter((item: any) => item.categoryName == 'Admin')[0]?.details;
    this.currentRole = this.user?.roleList.filter((item:any) => item.department == 'IT-Config' && item.category == 'Admin')[0];
    this.currentUser = this.user.UserId;
    this.userName = this.user.UserName;
      this.gets3Bucket();

    // this.tempSite = this.storageSer.get('temp_sites');
    // this.siteData = this.storageSer.get('temp_sites')?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
    // this.tableData = this.siteData;
    // this.newTableData = this.tableData;
    this.getSitesListForUserName()
    this.onMetadataChange();

    this.createCenteralBox=this.fb.group({
      unitName: new FormControl('', Validators.required),
      siteId: new FormControl(''),
      unitId: new FormControl('', Validators.required),
      createdBy: new FormControl(''),
      description: new FormControl(''),
      password: new FormControl(''),
      centeralBoxUrl: new FormControl(''),
      noOfActiveCameras: new FormControl(1),
      remarks: new FormControl('')
    })
  }



// BharadwajAPIS
  currentItem: any;
  @ViewChild('viewCamerasDialog') viewCamerasDialog = {} as TemplateRef<any>;
  cameras: any = [];
  getCamerasForSiteId(data: any) {
    this.cameras = [];
    this.currentItem = data;
    this.dialog.open(this.viewCamerasDialog);
    this.siteSer.getCamerasForSiteId(data.siteId).subscribe((response: any) => {
      this.siteSer.cameras_sub.next(response);
      this.siteSer.cameras_sub.subscribe((res) => this.cameras = res);
    });

  }

  currentCamera: any;
  dropdownFields_camera: any = [
    {
      label: "status",
      // data: this.storageSer.getMetadataByType(4)
    },
    {
      label: "audioSpeakerType",
      // data: this.storageSer.getMetadataByType(3)
    },
    {
      label: "timezone",
      // data: this.storageSer.getMetadataByType(4)
    }
  ];
  openEditCamera(item: any) {

    this.storageSer.current_sub.next({ type: 'site', data: {...item} });
    this.dialog.open(EditCameraComponent);

    // this.storageSer.edit_sub.next({ data: item, dropdownData: this.dropdownFields_camera, updateUrl: 'camera/updateCameraData_1_0', getUrl: 'getCamerasForSiteId_1_0' });
    // this.dialog.open(EditFormComponent);
  }


  updateCamera() {
    // this.currentCamera.videoServerName = this.currentCamera.httpUrl;
    // delete this.currentCamera.httpUrl;
    // this.siteSer.updateCamera(this.currentCamera).subscribe((res:any) => {
    //   if(res.statusCode == 200) {
    //     this.getCamerasForSiteId(this.currentItem);
    //     this.alertSer.success(res.message)
    //   } else {
    //     this.alertSer.error(res.message);
    //   }
    // })
  }


  // BharadwajAPIS
  // getSiteFullDetails(item:any) {
  //   this.siteSer.getSiteFullDetails(item).subscribe((res:any)=> {
  //     // console.log(res);
  //   })
  // }


  final:any
  getSitesListForUserName() {
    // this.showLoader = true;
    this.storageSer.table_loader_sub.next(true);
    this.siteSer.getSitesListForUserName({siteId:this.siteNg,siteStatus: this.status}).subscribe((res: any) => {
      // this.showLoader = false;
      this.storageSer.table_loader_sub.next(false);
      if(res?.Status == 'Success') {
        this.tableData = res.sites
        // this.tableData = res.sites.sort((a:any, b:any) => a.siteId - b.siteId );
        this.newTableData = this.tableData.sort((a:any, b:any) => a.siteId < b.siteId  ? -1 : 1);
      }else{
        this.newTableData=[];
      }
      }, (err: any) => {
        // this.showLoader = false;
        this.storageSer.table_loader_sub.next(false);
    });
  }

  deviceData: any;
  inputToDevices: any;
  getDevices(siteId: any) {
    this.assetSer.listDeviceBySiteId(siteId).subscribe((res: any) => {
      this.deviceData = res.flatMap((item: any) => item.adsDevices);
      this.inputToDevices = this.deviceData;
      // console.log('site',this.inputToDevices);
    })
  }

  engineerDetail: any;
  onGetEngineer(id: any) {
    this.siteSer.getEngineer(id).subscribe((res: any) => {
      this.engineerDetail = res.Engineer_details;
      // console.log(this.engineerDetail);
    })
  }

  engineerId = 0;
  engineerView(e: any, i: any) {
    this.engineerId = i;
    var x = e.target.nextElementSibling;
    x.style.display == 'none' ? x.style.display = 'flex' : x.style.display = 'none';
  }

  @ViewChild('addCentralBoxDialog') addCentralBoxDialog = {} as TemplateRef<any>;
  openAddCentralbox() {
    this.createCenteralBox.reset({
  noOfActiveCameras: 1
});
    this.dialog.open(this.addCentralBoxDialog)
    this.siteSer.getCentralbox(this.currentItem).subscribe((res: any) => {
      })
    }

  @ViewChild('viewCentralBoxDialog') viewCentralBoxDialog = {} as TemplateRef<any>;
  onGetCentralboxDetail: any = [];
  getCentalBox(data: any) {
    this.onGetCentralboxDetail = [];
    this.currentItem = data
    this.siteSer.getCentralbox(data).subscribe((res: any) => {
      this.onGetCentralboxDetail = res.centralBox;
    });
    this.dialog.open(this.viewCentralBoxDialog)
  }

  createCentralBox() {
    if(!this.createCenteralBox.valid) return;
    this.createCenteralBox.value.siteId = this.currentItem.siteId;

    this.siteSer.addCentralBox(this.createCenteralBox.value).subscribe((res: any) => {
      if(res.statusCode === 200) {
        this.alertSer.success(res.message);
        this.dialog.closeAll();
        this.getCentalBox(this.currentItem);
      } else {
        this.alertSer.error(res.message)
      }
    });
  }

  saveSiteData(site: any) {
    this.storageSer.set('temp_sites', site);
  }

  @ViewChild('viewSiteServices') viewSiteServices = {} as TemplateRef<any>;
  listSiteServices(item: any) {
    this.currentItem = item;
    this.siteSer.listSiteServices(item).subscribe((res:any)=> {
      this.currentItem = res.siteServicesList
    })
    this.dialog.open(this.viewSiteServices)
  }

  updateSiteServices() {
    this.siteSer.updateSiteServices(this.currentItem).subscribe((res:any)=> {
      if(res.statusCode === 200) {
        this.alertSer.success(res.message);
        this.siteSer.listSiteServices(this.currentItem).subscribe((res:any)=> {
          this.currentItem = res.siteServicesList
        })
        // this.listSiteServices(this.currentItem)
      } else {
        this.alertSer.error(res.message)
      }
    })
  }



  validationChecklistData:any = []
  validationChecklistDataNew :any = [];

  @ViewChild('viewSiteValidation') viewSiteValidation = {} as TemplateRef<any>;
  listSiteCheckList(data:any) {
    this.validationChecklistDataNew = [];
    this.currentItem = data
    this.siteSer.listSiteCheckList(data).subscribe((res: any) => {

      if(res.statusCode==200){

        this.validationChecklistData = res;
        this.validationChecklistDataNew = this.validationChecklistData?.devices;
        this.sortValidationChecklists()
      }

    })
    this.dialog.open(this.viewSiteValidation)
  }

  sortValidationChecklists() {
    if (this.validationChecklistDataNew && Array.isArray(this.validationChecklistDataNew)) {
      this.validationChecklistDataNew?.forEach((device: any) => {
        if (device.validationChecklists && Array.isArray(device.validationChecklists)) {
          device.validationChecklists.sort((a: any, b: any) => {
            if (a.scope === false && b.scope !== false) {
              return 1; // a comes after b
            } else if (a.scope !== false && b.scope === false) {
              return -1; // b comes after a
            } else {
              return 0; // no change if both have the same scope
            }
          });
        } else {
          console.warn(`No validation checklists for device:`, device.deviceId);
        }
      });
    } else {
      // console.error('validationChecklistDataNew is undefined or not an array.');
    }
  }


  siteHistoryData:any = [];
  @ViewChild('viewSiteHistory') viewSiteHistory = {} as TemplateRef<any>;
  listSiteCheckListHistory(device: any, data: any) {
    this.siteSer.listSiteCheckListHistory({...device, ...data}).subscribe((res:any) => {
      this.siteHistoryData = res.history.sort((a: any, b: any) => {
        const timeA = new Date(a.modifiedTime || a.createdTime).getTime();
        const timeB = new Date(b.modifiedTime || b.createdTime).getTime();
        return timeB - timeA; // Descending order for latest first
      });
    })
    this.dialog.open(this.viewSiteHistory)
  }



  originalItemDevice:any = []
  currentItemDevice:any
  currentItemDeviceDetails:any = []
  @ViewChild('updateSiteCheckListForm') updateSiteCheckListForm = {} as TemplateRef<any>;
  openEdit(device:any) {
    this.currentItemDevice = {...device.dev, ...device.chk}
    this.originalItemDevice = JSON.parse(JSON.stringify(this.currentItemDevice));
    this.dialog.open(this.updateSiteCheckListForm)
  }
  updateSiteCheckList() {
      // Check for changes
  if (JSON.stringify(this.currentItemDevice) === JSON.stringify(this.originalItemDevice)) {
    this.alertSer.error("Please update a field to make changes");
    return;
  }
    this.siteSer.updateSiteCheckList(this.currentItemDevice).subscribe((res:any) => {
      if(res.statusCode === 200) {
        this.alertSer.success(res.message);
        this.siteSer.listSiteCheckList(this.currentItem).subscribe((res: any) => {
          this.validationChecklistData = res;
          this.validationChecklistDataNew = this.validationChecklistData.devices;
          this.sortValidationChecklists()
        })
        // this.listSiteCheckList(this.currentItem)
      } else {
        this.alertSer.error(res.message)
      }
    })
  }

  selectedAll: any;
  validationQuestions: any = [];
  selectAll(data: any) {
    // console.log(data)

    // if(data.scope == true || data.scope == 'T') {
    //   this.validationQuestions.push(data)
    // } else {
    //   this.validationQuestions = this.validationQuestions.filter((item: any) =>  item.scope != true)
    // }
    // for (var i = 0; i < this.validationChecklistDat.length; i++) {
    //   // this.validationChecklistDat[i].selected = this.selectedAll;
    //   if(this.validationChecklistDat[i].scope == true ) {
    //     this.validationQuestions.push(this.validationChecklistDat[i]);
    //   }
    // }
  }


  centralBoxData:any = []
  @ViewChild('addSiteCheckListForm') addSiteCheckListForm = {} as TemplateRef<any>;
  addSiteCheckList() {
    this.deviceFor = 'Defender'
    this.centralBoxData = [];
    this.siteSer.getCentralBoxForSiteId(this.currentItem).subscribe((res:any) => {
      this.centralBoxData = res.centralBox
    })
    // this.get()
    this.getValidationCheckListForCategory({name: 'Defender'})
    // this.listSupportAdminUsers()
    this.dialog.open(this.addSiteCheckListForm)
    this.myObj.deviceId = null
    this.myObj.assignedTo = null

  }

  validationChecklistDat:any = [];
  get() {
    // this.validationQuestions = [];
    this.siteSer.getValidationCheckList().subscribe((res: any) => {
      this.validationChecklistDat = res.validationChecklist;
      // console.log(this.validationChecklistDat)
    })
  }

  validationData:any = []
  getValidationCheckListForCategory(item?:any) {
    this.siteSer.getValidationCheckListForCategory(item).subscribe((res:any) => {
      // console.log(res);
      this.validationData = res.validationChecklist

    })
  }

  isDeviceAlreadySelected(deviceId: any): boolean {
    return this.validationData.some((item: any) => item.deviceId === deviceId);
  }

  newAdminData : any = []
  rolesDetailsData:any = [];
  get_roles(item:any) {
    // console.log(this.currentUser)
    this.userSer.get_roles(item).subscribe((res: any) => {
      this.rolesDetailsData = res.rolesDetails[0]?.details;
      this.newAdminData = this.rolesDetailsData.map((element:any) => element.email
      );
      // console.log(this.rolesDetailsData)
      // if(res.status == 'Success'){
      //   this.storageSer.set('role', res.rolesDetails)
      // }
    })
  }

  myObj:any = {
    siteId:null,
    deviceId:null,
    // category :null,
    createdBy:null,
    callingSystem: 'mgmt',
    assignedToMail:null,

    assignedTo: null,
    sentToReview:null,
    description:'Test',
    service_cat_id: 19,
    service_subcat_id:104,
    checklists: [],
    remarks: null,
    ccMails: [],
  }


  deviceFor:any = 'Defender';
  serviceCategories = [
    { id: 19, name: 'Site Validation' },
    { id: 20, name: 'Other Service' },

  ];

  serviceSubCategories = [
    { id: 104, name: 'Review' },
    { id: 105, name: 'Inspection' }
  ];

  categoriesSub = [
    { id: 21, name: 'Defender'},
    { id: 22, name: 'FixedInstall'},
  ];

  listSupportAdminUsersData : any =[]
  newSupport:any = []
  listSupportAdminUsers() {
    this.siteSer.listSupportAdminUsers().subscribe((res:any) => {
      // console.log(res)
      this.listSupportAdminUsersData = res.roleDetails?.flatMap((item:any) => item.users)
      this.newSupport = this.listSupportAdminUsersData.slice(-3);
      // console.log(this.newSupport)
    })
  }
// Function to reset `deviceFor` when changing options
onDeviceChange(selectedValue: string) {
  this.deviceFor = selectedValue; // Update value when selection changes
}

  add(i: any, type: string) {
  const isAnyScopeTrue = this.validationData.some((item: any) => item.scope === true);
  if (!isAnyScopeTrue) {
    this.alertSer.error('Please Select at least one Scope');
    return; // Stop further execution if all scope are false
  }

    switch (i) {
      case 0:
        this.myObj.sentToReview = null;
        this.myObj.assignedToMail = null;
        this.myObj.assignedTo = null;
        this.myObj.ccMails = null;
        break;
      case 1:
        this.myObj.sentToReview = 'false';

        if (this.myObj.assignedTo && typeof this.myObj.assignedTo === 'object') {
          this.myObj.assignedToMail = this.myObj.assignedTo.email || null;
          this.myObj.assignedTo = this.myObj.assignedTo.UserId || null;
          this.myObj.ccMails = null;
        }
        break;
        case 2:
          this.myObj.sentToReview = 'true';
          if (this.myObj.assignedTo && typeof this.myObj.assignedTo === 'object') {
            this.myObj.assignedToMail = this.myObj.assignedTo.email ;
            this.myObj.assignedTo = this.myObj.assignedTo.UserId;
          } else {
            this.myObj.assignedToMail = null;
            this.myObj.assignedTo = null;
          }
          this.myObj.ccMails = this.newAdminData || null;
          break;
      default:
        break;
    }

    // Check if device is selected
    if (!this.myObj.deviceId) {
      this.alertSer.error('Please select Device');
      return;
    }

    // Check if "Assign To" is selected when type is 'assign'
    if (type === 'assign' && !this.myObj.assignedTo) {
      this.alertSer.error('Please select Assign To');
      return;
    }

    let data: any = JSON.parse(JSON.stringify(this.validationData));
    data.map((item: any) => {
      if (item.scope === false) {
        item.configured = false;
        item.working = false;
      }
      item.validationChecklistId = item.id;
      delete item.id;
      delete item.validationParameter;
      delete item.active;
      delete item.category;
    });


    this.myObj.siteId = this.currentItem.siteId;
    this.myObj.checklists = data;
    this.myObj.remarks = this.currentItem.remarks;
    this.myObj.createdBy = this.user?.UserId;


    this.showLoader = true;
    this.siteSer.addSiteCheckList(this.myObj).subscribe((res: any) => {
      this.dialog.closeAll();
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.alertSer.success(res.message);
        this.listSiteCheckList(this.currentItem);
      } else {
        this.alertSer.error(res.message);
      }
    });


  }

  isAllValid(): boolean {
  // Get all checked (true) and unchecked (false) scopes
  const totalScopes = this.editCheckList.length;
  const checkedScopes = this.editCheckList.filter((item: any) => item.scope === true);
  const uncheckedScopes = this.editCheckList.filter((item: any) => item.scope === false);

  // If no scopes exist, disable the button
  if (totalScopes === 0) {
    return false;
  }

  // If at least one scope is unchecked, allow enabling the button
  if (uncheckedScopes.length > 0) {
    // Ensure all checked scopes meet the conditions
    return checkedScopes.every((item: any) =>
      item.working === true &&
      item.configured === true &&
      item.reviewStatus === true
    );
  }

  // If all scopes are checked, follow the original rule (everything must be true)
  return checkedScopes.length === totalScopes && checkedScopes.every((item: any) =>
    item.working === true &&
    item.configured === true &&
    item.reviewStatus === true
  );
  }


  myObjForEdit:any = {
    deviceId:null,
    modifiedBy:null,
    assignedTo: null,
    assignedToMail:null,
    // reviewStatus:null,
    status:null,
    sentToReview: null,
    siteId:null,
    checklists: [],
    ccMails: []
  }

  currentDevice:any;
  finalData:any = []
  editCheckList: any = []
  editData:any=[];
  openEditForSiteValidation(data: any) {
    // console.log(data)
    // data.edit = true;
    this.currentDevice = data.deviceId;

    this.editCheckList =[];
    this.siteSer.listSiteCheckList(this.currentItem).subscribe((res: any) => {
      // console.log(res)
      this.editData = res.devices
      let arr: any = res.devices.filter((item: any) => item.deviceId == data.deviceId)[0]?.validationChecklists;
      this.editCheckList = arr;
      this.editCheckList.forEach((item: any) => {
        item.isChanged = false;
      });

      arr.map((item: any) => {
        if (item.scope === false) {
          item.configured = false;
          item.working = false;
        }
      });

      this.myObjForEdit.siteId = this.currentItem.siteId;
      this.myObjForEdit.deviceId = this.currentDevice;
      // this.myObjForEdit.checklists = this.editCheckList.filter((item: any) => item.isChanged == true);
      this.myObjForEdit.remarks = this.currentItem.remarks
      this.myObjForEdit.modifiedBy = this.user?.UserId
      this.dialog.open(this.editSiteCheckListForm);
      // this.listSupportAdminUsers();
    })

  }



  @ViewChild('editSiteCheckListForm') editSiteCheckListForm = {} as TemplateRef<any>;
  updateSiteCheckListFor(value:any) {
      // this.editData.forEach((device:any) => device.edit = false);

  // ✅ Check if all items have scope === false
  const allScopeFalse = this.editCheckList.every((item: any) => item.scope === false);

  if (allScopeFalse) {
    this.alertSer.error('At least one item should be in scope. Please select at least one.');
    return; // ❌ Stop API call if all scopes are false
  }

      switch (value) {
        case 0:
          this.myObjForEdit.sentToReview = null
          this.myObjForEdit.status = 1
          this.myObjForEdit.assignedToMail = null;
          this.myObjForEdit.assignedTo = null;
          this.myObjForEdit.ccMails = null;
        break;

        case 1:
          this.myObjForEdit.sentToReview = 'false'
          this.myObjForEdit.status = 2
          if (this.myObjForEdit.assignedTo && typeof this.myObjForEdit.assignedTo === 'object') {
            this.myObjForEdit.assignedToMail = this.myObjForEdit.assignedTo.email || null;
            this.myObjForEdit.assignedTo = this.myObjForEdit.assignedTo.UserId || null;
            this.myObjForEdit.ccMails = null;
          }
        break;
        case 2:
        this.myObjForEdit.sentToReview = 'true';
        this.myObjForEdit.status = 3;
        if (this.myObjForEdit.assignedTo && typeof this.myObjForEdit.assignedTo === 'object') {
          this.myObjForEdit.assignedToMail = this.myObjForEdit.assignedTo.email ;
          this.myObjForEdit.assignedTo = this.myObjForEdit.assignedTo.UserId;
        } else {
          this.myObjForEdit.assignedToMail = null;
          this.myObjForEdit.assignedTo = null;
        }
        this.myObjForEdit.ccMails = this.newAdminData || null;
        break;

        case 3:
          this.myObjForEdit.sentToReview = 'true'
          this.myObjForEdit.status = 4
          this.myObjForEdit.assignedToMail = null;
          this.myObjForEdit.assignedTo = null;
          this.myObjForEdit.ccMails = null;
        break;

          default:
          break;
      }

        // ✅ Loop over checklist and set configured & working false where scope is false
  this.editCheckList.forEach((item: any) => {
    if (item.scope === false) {
      item.configured = false;
      item.working = false;
      item.reviewStatus = false;
    }
  });
      // if(this.myObjForEdit.assignedTo) {
      //   this.myObjForEdit.assignedToMail = this.myObjForEdit.assignedTo.email ? this.myObjForEdit.assignedTo.email : null
      //   this.myObjForEdit.assignedTo = this.myObjForEdit.assignedTo.UserId? this.myObjForEdit.assignedTo.UserId : null;
      //   this.myObjForEdit.ccMail= this.newAdminData ?this.newAdminData : null
      // }


      this.myObjForEdit.checklists = this.editCheckList.filter((item: any) => item.isChanged == true);
      this.siteSer.updateSiteCheckListFor(this.myObjForEdit).subscribe((res:any) => {
        this.dialog.closeAll()
        this.showLoader = false
        if(res.statusCode === 200) {
          this.alertSer.success(res.message);
          this.listSiteCheckList(this.currentItem);
        } else {
          this.alertSer.error(res.message);
        }
      })
    // }

  }


  onScopeChange(value: any, data?: any): void {
    // console.log(value)
    if(!value) {
      data.working = false
    }

    if (value === false) {
      data.configured = false;
      data.working = false;
      data.reviewStatus = false;
      data.remarks = null;
    }
  }

  changedList: any = [];
  crrentObj: any;
  getChangedList(data: any) {
    data.isChanged = true;
    // console.log(this.editCheckList)
  }

  onCheckboxChange(isChecked: boolean) {
    if (isChecked) {
      this.myObjForEdit.sentToReview = true;
    } else {
      this.myObjForEdit.sentToReview = false;
    }
    // console.log("sentToReview:", this.myObjForEdit.sentToReview);
  }

  // getScope(item: any) {
  //   this.getChangedList('scope', item.scope, item);
  // }
  // getConf(item: any) {
  //   this.getChangedList('configured', item.configured, item);
  // }
  // getWork(item: any) {
  //   this.getChangedList('working', item.working, item);
  // }

  readonly panelOpenState = signal(false);
  formatSubtitle = (percent: number) : string => {
    if(percent >= 100){
      return "Congratulations!"
    } else if(percent >= 50){
      return "Half"
    } else if(percent > 0){
      return "Just began"
    } else {
      return "Not started"
    }
  }

  showHistory:boolean = false;
  openHistory() {
    this.showHistory = !this.showHistory
  }


  @ViewChild('assignFirst') assignFirst = {} as TemplateRef<any>;
  addService1() {
    this.myObj.assignedTo = null;
    this.dialog.open(this.assignFirst)
  }

  @ViewChild('assignFirstForReview') assignFirstForReview = {} as TemplateRef<any>;
  addReview() {
    this.myObj.assignedTo = null;
    this.dialog.open(this.assignFirstForReview)
  }


  @ViewChild('assignSecond') assignSecond = {} as TemplateRef<any>;
  addService2() {
    this.myObjForEdit.assignedTo = null;
    this.dialog.open(this.assignSecond)
  }

  @ViewChild('assignSecondForReview') assignSecondForReview = {} as TemplateRef<any>;
  addReview2() {
    this.myObjForEdit.assignedTo = null;
    this.dialog.open(this.assignSecondForReview)
  }



  /* searches */
  siteSearch: any;
  siteNg: any = ''
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteId == site);
    } else {
      this.newTableData = this.tableData;
    }
  }

  // siteObj: any;
  showEvent:boolean = false
  showAddSite: boolean = false;
  showAddDevice: boolean = false;
  showInstallation: boolean = false;
  showCamera: boolean = false;
  currentItem1: any;
  show(value: string, type?: any) {
    if(value == 'site') {
      this.showAddSite = true
    }
    if(value == 'device') {
      this.showAddDevice = true
    }
    if(value == 'installation') {
      this.showInstallation = true
    }
    if(value == 'camera') {
      this.showCamera = true;
      this.dialog.closeAll();
      this.currentItem1 = type;
    }
    if(value == 'event') {
      this.showEvent = true;
      this.formType = type;
    }
  }


  isAdded:boolean  = true
  closenow(type: string) {
    if (type == 'site') {
      this.showAddSite = false
    }
    if (type == 'device') {
      this.showAddDevice = false
    }
    if(type == 'installation') {
      this.showInstallation = false
    }
    if(type == 'camera') {
      this.showCamera = false
    }
    if(type == 'event') {
      this.showEvent = false
    }
  }

  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    // var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    // this.address = !this.address;
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    // console.log("Close-Click:: ",x);
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }

  masterSelected: boolean = false;
  SelectAll: boolean = false;


  checkIfAllSelected() {
    this.selectedAll = this.tableData.every(function (item: any) {
      // console.log(item)
      return item.selected == true;
    })
  }


  openViewPopup(data: any) {
    this.storageSer.login_loader_sub.next(true);
    this.siteSer.getSiteFullDetails(data).subscribe((res:any) => {
      this.storageSer.login_loader_sub.next(false);
      this.currentItem = res.siteDetails;
      this.dialog.open(CreateFormComponent, {
        data: {
          body: res.siteDetails,
          label: res.siteDetails.siteName
        }
      })
    })
  }

  currentSite:any;
  timeZones: any;
  getTimeZones() {
    this.siteSer.gettimeZones().subscribe((res: any) => {
      this.timeZones = res;
    })
  }


  currentSiteId:any
  @ViewChild('eventsDialog') eventsDialog = {} as TemplateRef<any>;
  cameraEventsDetailsData:any = [];
  getCameraEventsConfigData(data: any) {
    // console.log(data)
    this.cameraEventsDetailsData = [];

    this.currentItem = data;
    this.storageSer.login_loader_sub.next(true);
    this.siteSer.getCameraEventsConfigData(data?.siteId).subscribe((res: any) => {
          this.storageSer.login_loader_sub.next(false);
      if(res.statusCode == 200) {
        this.cameraEventsDetailsData = res.cameraEventsDetails;
        this.dialog.open(this.eventsDialog);
      } else {
        this.cameraEventsDetailsData = [];
        this.dialog.open(this.eventsDialog);
      }
    })
  }


  detailsForSecond:any
  eventViewDialog(cust:any) {
    // this.dialog.closeAll();
    this.detailsForSecond = cust;
    this.dialog.open(CreateFormComponent, {
      data: {
        body: cust,
        site: this.currentItem
      }
    })
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.siteSer.getSiteFullDetails(item).subscribe((res:any)=> {
      this.currentSite=res.siteDetails;
      this.getTimeZones();
    })
    this.dialog.open(this.editSiteDialog);

  }

  currentEvent:any
  // @ViewChild('eventsEditDialog') eventsEditDialog = {} as TemplateRef<any>;
  formType!: string;
  eventEditDialog(item:any) {
    console.log(item)
    this.dialog.closeAll();
    this.currentEvent = item;
    // this.showEvent = true;
    this.show('event', 'edit');
    this.formType = 'edit';

    // this.dialog.open(this.eventsEditDialog);
    // this.dialog.open(EditFormComponent,
    //   {
    //     data: {
    //       data: item,
    //       dropdownData: [],
    //       updateUrl: 'camera/updateCameraData_1_0',
    //       getUrl: 'getCamerasForSiteId_1_0'
    //     }
    //   });
  }

  updateCameraEventsConfigData() {
    this.siteSer.updateCameraEventsConfigData(this.currentEvent).subscribe((res:any) => {
      // console.log(res)
      if(res.status_code == 200) {
        this.getSitesListForUserName()
        this.alertSer.success(res?.message);
      } else {
        this.alertSer.error(res?.message)
      }
    })
  }

  resultSite:any;
  confirmEditRow() {
    this.siteSer.updateSiteDetails(this.currentSite).subscribe((res:any)=>{
      if(res.statusCode == 200) {
        this.getSitesListForUserName()
        this.alertSer.success(res?.message);
      } else {
        this.alertSer.error(res?.message)
      }
    })
  }

  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteSiteDialog);
  }

  confirmDeleteRow() {
    this.tableData = this.tableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
  }


  /* checkbox control */
  viewArray: any = [];
  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      // this.dialog.open(this.viewSiteDialog, this.dialog.open(this.editSiteDialog));
    }
  }

  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  editArray: any = [];
  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editSiteDialog, this.dialog.open(this.editSiteDialog));
    }
  }

  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    // console.log("Delete Multiple Records:: ", item);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }
    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.tableData.forEach((el: any) => {
        this.tableData = this.tableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

  // countryList: any;
  // getCountry() {
  //   this.http.get("assets/JSON/countryList.json").subscribe((res: any) => {
  //     this.countryList = res;
  //     this.filterState(this.currentSite?.country)
  //   });
  // }

  // stateList: any = [];
  // filterState(val: any) {
  //   let x = this.countryList.filter((el: any) => el.countryName == val);
  //   this.stateList = x.flatMap((el: any) => el.states);
  // }

    /** state country and city */
  countries: any = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  onCountryChange(): void {
    this.states = State.getStatesOfCountry(this.currentSite?.country);
  }

  onStateChange(): void {
    this.cities = City.getCitiesOfState(this.currentSite?.country, this.currentSite?.state);
  }


  sorted = false;
  sort(label:any) {
    this.sorted = !this.sorted;
    var x = this.siteHistoryData;
    if(this.sorted==false){
      x.sort((a:string, b:string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    }else{
      x.sort((a:string, b:string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
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


  siteUsers:any=[];
  getSiteUserDetails(data:any){
    this.userSer.getSiteUserDetails(data).subscribe((res:any)=>{
      this.siteUsers=res.usersDetails;
    })
  }
centralBoxupdate:any;

@ViewChild('centralboxupdate')  centralboxupdate = {} as TemplateRef<any>;

  openEditCentralBox(data:any){
    this.dialog.closeAll();
    this.dialog.open(this.centralboxupdate);
    this.centralBoxupdate=data;
  }

  centralboxupdatedata(){

    let payload={
      ...this.centralBoxupdate,
      ...this.currentItem,
        modifiedBy:0
    }

    this.siteSer.updateCentralbox(payload).subscribe((res:any)=>{


      if(res.statusCode==200){
        this.alertSer.success(res.message);
        // this.getCentalBox(this.currentItem);
      }
      else{
          this.alertSer.error(res.message);
      }
    },(err:any)=>{

    })

  }

@ViewChild('s3Default')  s3Default = {} as TemplateRef<any>;

s3defaultpath:any;
s3Defaultcreate:any;
s3select:any;

  openS3(data:any){
    this.s3select=null;
    this.s3Defaultcreate=data
    this.dialog.open(this.s3Default);
  }

  gets3Bucket(){

    this.siteSer.getS3BucketNames().subscribe((res:any)=>{
      if(res.statusCode==200){
        this.s3defaultpath=res.s3BucketNames;

      }
    });


  }

  s3Defaultcreateadd(){

    this.siteSer.creates3Defaultpath({bucketName:this.s3select,unitId:this.s3Defaultcreate.unitId}).subscribe((res:any)=>{
      if(res.statusCode==200){
        this.alertSer.success(res.message);
         this.getCentalBox(this.currentItem);
      }
      else{
        this.alertSer.error(res.message);
      }
    })


  }


  radiocheck:number=1;
radioselection(i:number){
switch(i) {
  case 1:
  this.radiocheck=1;
    break;
  case 2:
this.radiocheck=2;
    break;
  default:

}

}


}


