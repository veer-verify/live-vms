import { SiteService } from 'src/services/site.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-sitesettings',
  templateUrl: './sitesettings.component.html',
  styleUrls: ['./sitesettings.component.css'],
})
export class SitesettingsComponent {
  @Input() currentItem: any;
  @Input() cameraList: any;
  daysList = [
    'Monday',
    'Tueday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  contactForm!: FormGroup;
   smsForm!: FormGroup;
  enforcementform!: FormGroup;
  selectform: number = 1;

  constructor(
    private fb: FormBuilder,
    private siteser: SiteService,
    private alaram: AlertService
  ) {}

  ngOnInit() {

    if(this.currentItem.type=='add'){

  this.getsiteInfo();
}
if(this.currentItem.type=='view'){

  this.getSiteMonitoringInfoBySiteId();
}

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      priority: [null, Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
      alternateContactNo: ['',Validators.pattern(/^[0-9]{1,15}$/)],
      days: [[], [Validators.minLength(1)]],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    }
  );

      this.smsForm = this.fb.group({
      priority: [null, Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
      remarks:[''],
      days: [[], [Validators.minLength(1)]],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });

    this.enforcementform = this.fb.group({
      priority: [null, Validators.required],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
      description: [''],
    });

  this.watchContactNumbers();

  }


  watchContactNumbers(): void {
  const contactCtrl = this.contactForm.get('contactNo');
  const alternateCtrl = this.contactForm.get('alternateContactNo');

  this.contactForm.valueChanges.subscribe(() => {
    if (
      contactCtrl?.value &&
      alternateCtrl?.value &&
      contactCtrl.value === alternateCtrl.value
    ) {
      alternateCtrl.setErrors({ sameContact: true });
    } else {
      if (alternateCtrl?.hasError('sameContact')) {
        alternateCtrl.setErrors(null);
      }
    }
  });
}





toggleDay(form: FormGroup, day: string, checked: boolean): void {
  const control = form.get('days');
  const days = [...control?.value];

  if (checked && !days.includes(day)) {
    days.push(day);
  }

  if (!checked) {
    const index = days.indexOf(day);
    if (index > -1) {
      days.splice(index, 1);
    }
  }

  control?.setValue(days);
}

toggleAllDays(form: FormGroup, checked: boolean): void {
  const control = form.get('days') ;
  control?.setValue(checked ? [...this.daysList] : []);
}

isAllSelected(form: FormGroup): boolean {
  const days = (form.get('days'))?.value;
  return days.length === this.daysList.length;
}

isIndeterminate(form: FormGroup): boolean {
  const days = (form.get('days') )?.value;
  return days.length > 0 && days.length < this.daysList.length;
}


  setSelectForm(data: any) {
  if (data.callFlag === 'T') {
    this.selectform = 1;
  }
  else if (data.callFlag === 'F' && data.textFlag === 'T') {
    this.selectform = 2;
  }
  else if (
    data.callFlag === 'F' &&
    data.textFlag === 'F' &&
    data.lawEnforcementFlag === 'T'
  ) {
    this.selectform = 3;
  }
}

  siteconfig: any;
  getsiteInfo() {
    this.siteser
      .getSiteMonitoringInfo(this.currentItem?.item)
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {
          this.siteconfig = res.data;
          this.setSelectForm(this.siteconfig);
        }
      });
  }

  contactsArray: any[] = [];
  smsContactsArray:any[]=[];
  laweforce:any[]=[];




addOrUpdateContactCommon(
  formValue: any,
  contactsArray: any[],
  type: 'CONTACT' | 'SMS'
): void {

  const hourRange = `${formValue.startTime}-${formValue.endTime}`;
  const selectedDays = formValue.days;

  // 🔹 Find contact by contactNo
  let contact = contactsArray.find(
    c => c.contactNo === formValue.contactNo
  );

  // 🔹 Create new contact if not exists
  if (!contact) {

    if(type == 'CONTACT'){

      contact = {
        name: formValue.name || null,
        designation: formValue.designation || null,
        priority: formValue.priority,
        contactNo: formValue.contactNo,
        alternateContactNo: formValue.alternateContactNo || null,
        dayTimeLine: []
      };
    }
    if(type=='SMS'){
         contact = {
        priority: formValue.priority,
        dotComNo: formValue.contactNo,
        dayTimeLine: [],
        remarks:formValue.remarks
      };
    }
    contactsArray.push(contact);
  }

  // 🔹 Find timeline with same days
  let timeline = contact.dayTimeLine.find((dt: any) =>
    this.areDaysSame(dt.days, selectedDays)
  );

  if (timeline) {
    // 🔹 Add hours if not already present
    if (!timeline.hours.includes(hourRange)) {
      timeline.hours.push(hourRange);
    }
  } else {
    // 🔹 Create new timeline
    contact.dayTimeLine.push({
      days: [...selectedDays],
      hours: [hourRange]
    });
  }
}


AddSiteContact(): void {


    if (this.contactForm.value.contactNo && this.contactForm.value.alternateContactNo && this.contactForm.value.contactNo === this.contactForm.value.alternateContactNo) {
    this.alaram.error(
      "Contact number and alternate contact number cannot be the same"
    );
    return;
  }


  if (this.contactForm.invalid || !this.contactForm.value.days ||
  this.contactForm.value.days.length === 0) {
    this.alaram.error("Please fill (*) mandatory fields");
    return;
  }



  this.addOrUpdateContactCommon(
    this.contactForm.value,
    this.contactsArray,
    'CONTACT'
  );

  this.resetContactForm();
}

AddSmsContact(): void {

    if (this.smsForm.invalid || !this.smsForm.value.days ||
  this.smsForm.value.days.length === 0) {
    this.alaram.error("Please fill (*) mandatory fields");
    return;
  }


  this.addOrUpdateContactCommon(
    this.smsForm.value,
    this.smsContactsArray,
    'SMS'
  );

  this.resetSmsForm();
}

resetContactForm(): void {
  this.contactForm.reset({
    name: '',
    designation: '',
    priority: null,
    contactNo: '',
    alternateContactNo: '',
    days: [],
    startTime: null,
    endTime: null
  });
}


resetSmsForm(): void {
  this.smsForm.reset({
    priority: null,
    contactNo: '',
    remarks:'',
    days: [],
    startTime: null,
    endTime: null
  });
}

Addlaw(){

    if (this.enforcementform.invalid) {
    this.alaram.error("Please fill (*) mandatory fields");
    return;
  }


  this.laweforce.push(this.enforcementform.value);

   this.enforcementform.reset({
    priority: null,
    contact: '',
   description:''
  });

}

  areDaysSame(a: string[], b: string[]): boolean {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return a.every(day => b.includes(day));
  }


  submitsiteContact() {
    this.siteser
      .addSiteContact({
        siteId: this.currentItem?.item?.siteId,
        contacts: this.contactsArray,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.alaram.success(res.message);
          this.contactsArray=[];
        } else {
          this.alaram.error(res.message);
        }
      });
  }


    submitsmsContact() {
    this.siteser
      .addSmsDetails({
        siteId: this.currentItem?.item?.siteId,
        smsDetails: this.smsContactsArray,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.alaram.success(res.message);
          this.smsContactsArray=[];
        } else {
          this.alaram.error(res.message);
        }
      });
  }

  submitlaw(){

       this.siteser
      .addlawenforce({
        siteId: this.currentItem?.item?.siteId,
        lEFInfo: this.laweforce,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.alaram.success(res.message);
          this.laweforce=[];
        } else {
          this.alaram.error(res.message);
        }
      });

  }


  deleteTimeline(contactsArray:any[],contactIndex: number, timelineIndex?: number): void {

  // Remove selected timeline
  contactsArray[contactIndex].dayTimeLine.splice(timelineIndex, 1);

  // If no timelines left, remove the contact
  if (contactsArray[contactIndex].dayTimeLine.length === 0) {
    contactsArray.splice(contactIndex, 1);
  }
}

deletelawenforce(contactIndex: number){

  this.laweforce.splice(contactIndex,1);
}

siteContacts:any[] = [];
smsContactlist:any[] = [];
lawEnforcementList:any[] = [];

getSiteMonitoringInfoBySiteId(){
  this.siteser.getSiteMonitoringInfoBySiteId(this.currentItem?.item).subscribe((res:any)=>{
    if(res.statusCode===200){
         this.lawEnforcementList= res.lawEnforcement;
         this.smsContactlist=res.smsDetails;
         this.siteContacts=res.contacts;
    }
    else{
      this.lawEnforcementList=[];
      this.smsContactlist=[];
      this.siteContacts=[];
    }
  })
}


formatArray(value: string): string {
  if (!value) return '-';
  return value
    .replace(/[\[\]']/g, '')
    .replace(/,/g, ', ');
}




deleteSiteContact(i: any) {

  this.alaram.confirm("Do you want to continue ?").then((res:any)=>{

    if(res.isConfirmed){
      this.siteser.inactiveContactDetails(i).subscribe((res:any)=>{
        if(res.statusCode==200){
          this.alaram.success(res.message);
          this.getSiteMonitoringInfoBySiteId();
        }
      })

    }
  })

}

deleteSmsContact(i: any) {

  this.alaram.confirm("Do you want to continue ?").then((res:any)=>{
 if(res.isConfirmed){
 this.siteser.inactiveSmsDetails(i).subscribe((res:any)=>{
  if(res.statusCode==200){
    this.alaram.success(res.message);
      this.getSiteMonitoringInfoBySiteId();
  }
})
 }
  })
}

deleteLawEnforcement(i: any) {

this.alaram.confirm("Do you want to continue ?").then((res:any)=>{
 if(res.isConfirmed){

 this.siteser.inactiveLawEnforcementInfo(i).subscribe((res:any)=>{
  if(res.statusCode==200){
    this.alaram.success(res.message);
      this.getSiteMonitoringInfoBySiteId();
  }
})
}
  })
}


}
