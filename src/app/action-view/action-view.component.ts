import { Component, Inject, Input, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { color } from 'echarts/core';
import { weekdays } from 'moment-timezone';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent {

  
 fields:any[]=[
  {
    serial:0,
    label:"S.no",
   showSerial:true
  },
  {
    serial:1,
    label:"Camera Id",
    id:"cameraId",
    sort:true,
    loop: []
    
  }
 ,
 {
   serial:2,
   label:"Camera Name",
   id:"cameraName",
   sort:true,
   loop: []
   
 },
 {
  serial:3,
  label:"Monitoring",
  id:"monitoring",
  sort:true,
  loop: [],
   
},
{
  serial:4,
  label:"Monitoring Hours",
  id:"monitoringHoursDetails",
  sort:false,
  loop: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
  weekdays: true
},
// {
//   serial:5,
//   label:"ActionTags",
//   id:"actionTags",
//   sort:true,
//   weekdays:true,
//   loop: [],
//   actiontag:true
  
// }
]

   @Input() cameraList!:any[];
   @Input() monitoringCameras!:any[];
   @Input() currentItem!:any;

   constructor( private siteser:SiteService,
                private metadaSer: MetadataService,
                private alaram:AlertService,
                @Inject(MAT_DIALOG_DATA) public data: any
                
   ){

     this.currentItem = {item: this.data};
   }

   templateData:any = [];

   ngOnInit(){
    // this.getTypes();
    this.getCurrentSiteAlerts();

    this.getOverAllView();
    //  this.getTemplateData();

   }  

  alldATA:any=[];
  escalation:any=[]
  escalation1:any=[]

   getOverAllView(){
   
    this.siteser.getOverAllView(this.currentItem?.item.siteId).subscribe((res:any)=>{
      if(res.statusCode==200){
      this.alldATA=res.cameras;
      this.escalation=res.escalation;
      this.escalation1 = res.escalation.map((item: any) => ({
        contactName: item.contactName,
        contactNumber:item.contactNumber,
        toEmails: item.toEmails ? item.toEmails.replace(/[\[\]']/g, '').split(',').map((e:any) => e.trim()).join(', ') : [],
        ccEmails: item.ccEmails ? item.ccEmails.replace(/[\[\]']/g, '').split(',').map((e:any) => e.trim()).join(', ') : [],
        bccEmails: item.bccEmails ? item.bccEmails.replace(/[\[\]']/g, '').split(',').map((e:any) => e.trim()).join(', '): [],
        days: item.days ? item.days.replace(/[\[\]']/g, '').split(', ').map((e:any) => e.trim()).join(', ') : [],
        hours: item.hours ? item.hours.replace(/[\[\]']/g, '') : '',
      }));

      }
      else{
        this.alldATA=[];
      }
  
    })
   }

   getCurrentSiteAlerts(){

    this.siteser.getAlertCategoriesForSiteId(this.currentItem?.item).subscribe((res:any)=>{
     this.alertTypes=res;
    })
  }

    onAlertChange(alertId: string) {
    
    const selectedAlert = this.alertTypes.find((a:any) => a.guardAlertTypeId === this.alert);
    this.alertSubTypes = selectedAlert ? selectedAlert.subAlerts : [];
  }


  //  getTypes() {

  //   this.metadaSer.getMetadata().subscribe((res: any) => {

  //     res.forEach((item: any) => {

  //       if (item.typeName === "GuardAlertType") {
  //         this.alertTypes = item.metadata;
          
  //       }
  //       if (item.typeName === "GuardSubTypeId") {
  //         this.alertSubTypes = item.metadata;
          
  //       }
        
  //     });
  //   });

  // }

alertField1:any;
subAlertfield1:any;
alert:any;
subalert:any;
alertTypes: any = [];
alertSubTypes: any = [];

getData(item:any){

  this.alertField1=item.value;

}
getData1(item:any){

  this.subAlertfield1=item.value;

}

getTemplateData(){
  let payload={
    "siteId": this.currentItem?.item.siteId,
    "alertTypeId": this.alert,
    "subTypeId": this.subalert,
  }

  this.siteser.getTemplateData(payload).subscribe((res:any)=>{
    
    if(res.statusCode==200){
      this.templateData=res.gaurdMasterData;
    }
    else{
      this.templateData=[];
      
      this.alaram.snackError(res.detail);
    }

  })

}

templateindex!:number;
templateedititem:any;
editTemplate(item:any,i:number){

  this.templateindex=i;

  this.templateedititem={...item};

}
SaveTemplate(){
  this.siteser.updateTemplate({siteId: this.currentItem?.item.siteId,...this.templateedititem}).subscribe((res:any)=>{

    if(res.statusCode==200){

      this.alaram.snackSuccess(res.message);
      this.templateindex=-1;
      this.getTemplateData();
    }
  })
}
   
}
