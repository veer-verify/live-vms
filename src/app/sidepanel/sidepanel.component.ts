import { animate, style, transition, trigger } from '@angular/animations';
import { SiteService } from './../../services/site.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MetadataService } from 'src/services/metadata.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { FormControl, Validators } from '@angular/forms';
import { C, COMMA, CONTROL, ENTER, SPACE } from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css'],
  animations: [
    trigger('inOutPaneAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class SidepanelComponent {
  constructor(
    private matDialog: MatDialog,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService
  ) {}

  ngOnInit() {
    // this.getSitesforUser();
    this.getTypes();
  }

  @Input() isSidePanelOpen: any;

  // Output event to notify the parent that the side panel should be closed
  @Output() sidePanelClosed = new EventEmitter<boolean>();

  // Method to close the side panel
  closeSidePanel() {
    this.sidePanelClosed.emit(false); // Emit 'false' to close the side panel
  }

  // siteslist:any[]=[];
  @Input() devicesList!: any;
  @Input() details!: any;

  // getSitesforUser(){

  //   this.SiteSer.getSites().subscribe((res:any)=>{

  //    this.siteslist= res.sites;
  //   })
  // }

  // siteName: any;
  deviceName: any;

  // getCamerasforSiteId(site:any){

  //   this.SiteSer.getCamerasForSiteId(site).subscribe((res:any)=>{
  //     this.devicesList=res;

  //   })
  // }

  siteSearch: any;
  deviceSearch: any;

  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value;
  }
  searchDevices(event: any) {
    this.deviceSearch = (event.target as HTMLInputElement).value;
  }

  currentSite: any;
  currentCamera: any;

  // filter(type:any){
  //   this.currentSite=type;

  //   this.deviceName=null;
  //   this.getCamerasforSiteId(type);

  // }
  filterCam(type: any) {
    this.currentCamera = type;
  }

  templateDisplay: boolean = false;
  templateDisplay1: boolean = true;
  newTemplate() {
    this.templateDisplay = true;
  }
  clsTemplate() {
    this.templateDisplay = false;
  }
  Escalation() {
    this.templateDisplay1 = true;
  }
  clsEscalation() {
    this.to = [];
    this.cc = [];
    this.templateDisplay1 = false;
  }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  alertFields: any = [];
  alert: any;
  subalert: any;
  message: any;
  alertField: any = [1, 2, 3];
  footer: any;
  colorpicker: any;
  date: Date = new Date();

  clearFilledData() {
    this.message = null;
    this.footer = null;
    this.alertField = [1, 2, 3];
    this.alert = null;
    this.subalert = null;
    this.alertField1 = null;
    this.subAlertfield1 = null;
  }

  getTypes() {
    this.metadaSer.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        if (item.typeName === 'Action_Tag') {
          this.actionTags = item.metadata;
        }
        if (item.typeName === 'GuardAlertType') {
          this.alertTypes = item.metadata;
        }
        if (item.typeName === 'GuardSubTypeId') {
          this.alertSubTypes = item.metadata;
        }
        if (item.typeName === 'GuardDetailInfoFields') {
          this.alertFields = item.metadata;
        }
      });
    });
  }
  @ViewChild('emailDialog') emailDialog = {} as TemplateRef<any>;

  openPreview() {
    this.alertField.forEach((item: any) => {
      if (item.code == 1) {
        item.key = this.details?.item.siteName;
      }
      if (item.code == 2) {
        item.key = this.date;
      }
      if (item.code == 3) {
        item.key = this.date;
      }
      if (item.code == 4) {
        item.key = this.deviceName;
      }
    });

    this.matDialog.open(this.emailDialog);
  }

  getValById(id: number) {
    return this.alertFields.filter((item: any) => item.keyId === id);
  }

  alertField1: any;
  subAlertfield1: any;
  getData(item: any) {
    this.alertField1 = item.value;
  }
  getData1(item: any) {
    this.subAlertfield1 = item.value;
  }
  createGuardMasterData() {
    let alertMessage = `⚠️ ${this.alertField1} @ ${this.details?.item.siteName} - ${this.subAlertfield1} ⚠️`;
    let payload = {
      siteId: this.details?.item.siteId,
      guardAlertTypeId: this.alert,
      guardSubTypeId: this.subalert,
      emailSubject: alertMessage,
      emailBasicContent: this.message,
      emailFieldsId: JSON.stringify(this.alertField),
      emailFooter: this.footer,
      createdBy: 0,
    };

    if (
      this.details?.item.siteId &&
      this.alert &&
      this.subalert &&
      alertMessage &&
      this.message &&
      this.alertField
    ) {
      this.SiteSer.createGuardMasterData(payload).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.alaram.snackSuccess(res.message);
          // this.templateDisplay=false;
          this.alert = null;
          this.subalert = null;
          this.alertField1 = null;
          this.currentSite = null;
          this.subAlertfield1 = null;
          this.message = null;
          this.footer = null;
          this.colorpicker = null;
          this.deviceName = null;
          this.devicesList = [];
          // this.selectedFields=[];
        }
      });
    } else {
      this.alaram.snackSuccess('Please select alert,subalert & type message');
    }
  }

  createGuardEmailsData() {
    // this.addTimeSlot();


    let payload = {
      siteId: this.details?.item.siteId,
      toEmails: `['${this.to.join("','")}']`,
      ccEmails: `['${this.cc.join("','")}']`,
      bccEmails: `['${this.bcc.join("','")}']`,
      days: `['${this.selectedDays.join("','")}']`,
      hours: `[${this.timeSlots.join(',')}]`,
      remarks: null,
      createdBy: 0,
    };
    // let payload={

    //   "siteId": this.details?.item.siteId,
    //   "toEmails":  this.to,
    //   "ccEmails":  this.cc,
    //   "bccEmails":  this.bcc ,
    //   "days":  this.selectedDays,
    //   "hours": this.timeSlots ,
    //   "remarks":null,
    //   "createdBy": 0
    // }

    if (
      this.details?.item.siteName &&
      this.timeSlots.length != 0 &&
      this.selectedDays.length != 0 &&
      this.to.length !== 0
    ) {
      this.SiteSer.createGuardEmailsData(payload).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.alaram.snackSuccess(res.message);
           this.sidePanelClosed.emit(false);
          this.startTime = '00:00';
          this.endTime = '00:00';
        }
      });
    } else {
      this.alaram.snackSuccess(
        'Please fill mandatory fields - days,startTime,endTime & mails'
      );
    }


  }

  separatorKeysCodes: number[] = [ENTER];
  toCtrl = new FormControl('', Validators.required);
  bccCtrl = new FormControl('', Validators.required);
  ccCtrl = new FormControl('');

  to: string[] = [];
  contactNumber: any;
  contactName: any;
  bcc: string[] = [
    'vamsiv@ivisecurity.com',
    'danielh@ivisecurity.com',
    'nathanm@ivisecurity.com',
    'dominicp@ivisecurity.com',
    'guard@ivisecurity.com',
  ];
  cc: string[] = [];
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bccInput') bccInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ccInput') ccInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (event.input.name == 'to' && !this.to.includes(value)) {
        this.to.push(value);
      } else if (event.input.name == 'bcc' && !this.bcc.includes(value)) {
        this.bcc.push(value);
      } else if (event.input.name == 'cc' && !this.cc.includes(value)) {
        this.cc.push(value);
      }
    }

    event.chipInput!.clear();
    // this.toCtrl.setValue(null);
  }

  onInput(event: any): void {
    const value = event.target.value.trim();

    if (value.endsWith('.com')) {
      if (event.target.name == 'to' && !this.to.includes(value)) {
        this.to.push(value);
        this.toCtrl.setValue(null);
      } else if (event.target.name == 'bcc' && !this.bcc.includes(value)) {
        this.bcc.push(value);
        this.bccCtrl.setValue(null);
      } else if (event.target.name == 'cc' && !this.cc.includes(value)) {
        this.cc.push(value);
        this.ccCtrl.setValue(null);
      }
    }
  }

  remove(fruit: string, type: string): void {
    if (type == 'to') {
      const index = this.to.indexOf(fruit);
      if (index >= 0) {
        this.to.splice(index, 1);
        this.announcer.announce(`Removed ${fruit}`);
      }
    }
    if (type == 'bcc') {
      const index = this.bcc.indexOf(fruit);
      if (index >= 0) {
        this.bcc.splice(index, 1);
        this.announcer.announce(`Removed ${fruit}`);
      }
    }
    if (type == 'cc') {
      const index = this.cc.indexOf(fruit);
      if (index >= 0) {
        this.cc.splice(index, 1);
        this.announcer.announce(`Removed ${fruit}`);
      }
    }
  }

  // selectedFields:any=[];
  // alertfield2(item:any){

  //   let newData=item;
  //   const index = this.selectedFields.findIndex((existingItem:any) => existingItem.id === newData.id || existingItem.keyId === newData.keyId);

  //   // If newData already exists, remove it; otherwise, add it
  //   if (index !== -1) {
  //       // Remove the existing item
  //       this.selectedFields.splice(index, 1);
  //   } else {
  //       // Add the new data
  //       this.selectedFields.push(newData);
  //   }

  //   console.log(this.selectedFields)

  // }

  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDays: string[] = []; // Stores selected days before adding time
  timeSlots: any[] = []; // Stores final grouped time slots

  startTime: any = null;
  endTime: any = null;
  public exportTime: any = { hour: 10, minute: 10, meriden: 'PM', format: 24 };

  isChecked1(): boolean {
    return (
      this.selectedDays?.length > 0 &&
      this.daysOfWeek?.length === this.selectedDays?.length
    );
  }
  toggleSelection1(): void {
    const isAllSelected = this.isChecked1();
    if (isAllSelected) {
      this.selectedDays = [];
    } else {
      this.selectedDays = this.daysOfWeek.map((item: any) => item);
    }
  }

  // onChangeHour(event: any) {

  //   this.startTime=event.hour;
  //   this.timeSlots.push(
  //     this.startTime

  //    );

  // }

  // onChangeHour1(event: any) {

  //   this.endTime=event.hour;
  //   this.timeSlots.push(
  //   this.endTime
  //    );
  // }
  startTime1: any;
  endTime1: any;

  onTimeChange(timeType: string): void {
    if (timeType === 'start' && this.startTime) {
      this.startTime1 = this.formatTime(this.startTime);

    } else if (timeType === 'end' && this.endTime) {
      if (this.endTime == '00:00' || this.endTime == '23:00') {
        this.endTime = '23:59';
        // this.endTime1 = this.endTime;
        this.endTime1 = this.formatTime(this.endTime);
        if (this.startTime > this.endTime) {
          // Find the index of the first selected day in the daysOfWeek array
          return;
        }
      } else {
        const [hours, minutes] = this.endTime.split(':');
        this.endTime = `${hours}:00`;
        this.endTime1 = this.formatTime(this.endTime);
      }

      // if(this.endTime="00:00" ){
      //   this.endTime="23:59"
      // }
      // if(this.endTime="23:00" ){
      //   this.endTime="23:59"
      // }
      // else{
      //   console.log(this.endTime)
      //   const [hours, minutes] = this.endTime.split(':');
      //   this.endTime = `${hours}:00`;
      // }

      // this.endTime1 = this.formatTime(this.endTime);
    }
  }

  addHours() {


    this.timeSlots.push(`${this.startTime1}-${this.endTime1}`);

    this.startTime = '00:00';
    this.endTime = '00:00';
  }

  private formatTime(time: string): any {
    const hours = Number(time.split(':')[0]); // Extract just the hour part

    return hours; // Return the formatted time as just hours
  }

  // Toggle day selection
  toggleDaySelection(day: string) {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter((d) => d !== day);
    } else {
      this.selectedDays.push(day);
    }
  }

  addalert: any;
  addsubalert: any;
  addnew: boolean = false;
  addnew1: boolean = false;
  AddNew(item: string) {
    if (item == 'alert') {
      this.addnew = true;
    } else if (item == 'subalert') {
      this.addnew1 = true;
    }
  }
}
