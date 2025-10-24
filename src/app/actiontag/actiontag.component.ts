import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-actiontag',
  templateUrl: './actiontag.component.html',
  styleUrls: ['./actiontag.component.css']
})
export class ActiontagComponent {

  fields:any[]=[
    {
      serial:0,
      label:"S.no",
     showSerial:true
    },
    {
      serial:1,
      label:"Site/Camera Id",
      id:"cameraName",
      sort:true,
    
     
    },
    {
      serial:2,
      label:"Action Tags",
      id:"value",
      sort:true,
    }
  ]
  actionTags: any;


constructor(private siteser :SiteService,
  private metadaSer:MetadataService,
  private alert : AlertService
){

}


ngOnInit(){
this.getTypes();
if(this.details.type=='view'){

  this.getActiontags();
}
}
optionselect: string="Site"
renderoption: string[] = ['Site', 'Cameras'];
  @Input() cameralist!:any;
  @Input() monitoringCameras!:any;
  @Input() details!:any;
  deviceName:any;
 announcer = inject(LiveAnnouncer);

    
    deviceSearch: any;
    currentCamera:any;
    searchDevices(event: any) {
      this.deviceSearch = (event.target as HTMLInputElement).value;
    }

    
  filterCam(type:any){

    this.currentCamera=type;

  }

  
    separatorKeysCodes: number[] = [ENTER, COMMA];
    toCtrl = new FormControl('', Validators.required);
    to: string[] = [];
     @ViewChild('fruitInput') fruitInput !: ElementRef<HTMLInputElement>;

  remove(fruit: string, type: string): void {
    
    if(type =='to') {
      const index = this.to.indexOf(fruit);
      if (index >= 0) {
        this.to.splice(index, 1);
        this.announcer.announce(`Removed ${fruit}`);
      }
    } 
    
  }
    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
  
      if(value){
  
        if (event.input.name == 'to' && !this.to.includes(value)) {
          this.to.push(value);
        }
         
      }
      event.chipInput!.clear();
    }
    actionTag:any;

    createActionTag(){

      let payload={
        siteId: this.details.item.siteId,
        cameraActionTags: [
          {
            cameraId: 
              this.deviceName
            ,
            actionTagId: 
              this.actionTag
            
          }
        ]
      }

      if(this.details.item.siteId && this.actionTag){

        this.siteser.createActionTag(payload).subscribe((res:any)=>{

          if(res.statusCode==200){

            this.alert.snackSuccess(res.message);
            this.deviceName=null;this.actionTag=null;
          }
          else{
            this.alert.snackError(res.message);
          }
        })
      }
      else{

        this.alert.snackError("Please select Action Tag")
      }
    
    }
    
    getTypes() {

      this.metadaSer.getMetadata().subscribe((res: any) => {
  
        res.forEach((item: any) => {
  
          if (item.typeName === "Action_Tag") {
            this.actionTags = item.metadata;
          }
        
        });
      });
  
    }
actionTagData:any;
    getActiontags(){

      this.siteser.getlistActionTags_1_0(this.details.item.siteId).subscribe((res:any)=>{
       if(res.statusCode==200){

         this.actionTagData=res.data[0].actionTags;

       }
       else{
        this.actionTagData=[];
        // this.alert.snackError(res.message);
       }

      })
    }
  
}
