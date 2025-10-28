
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {


  constructor(private siteser : SiteService,
              private alert :AlertService,
              private matDialog:MatDialog,
  ){

  }

 @Input() cameras:any[]=[];
 @Input() details!:any;
  payload:any;
  @Output() event:any = new EventEmitter()
  newCameras:any;

ngOnInit(){

this.getMonitoringStatus_cameras()
this.newCameras=this.cameras;

}

ngOnChanges(){
  this.newCameras=this.cameras;
  this.updateSelectAll();
}



updateCameradetails(){

  this.siteser.getCamerasshortDetailsForSiteId({siteId:this.details?.item.siteId}).subscribe((res:any)=>{

    this.cameras=res.cameras;
    
    this.updateSelectAll();
  })
}

selectAll = false;

  toggleSelectAll() {
    this.newCameras.map((item:any) => item.monitoring = this.selectAll);

  }


  updateSelectAll() {
    this.selectAll = this.newCameras.every((item:any) => item.monitoring);
   
  }

 uploadCameradetails(){
 

    this.siteser.updateMonitoringStatus_1_0(this.newCameras).subscribe((res:any)=>{
    
    if(res.statusCode==200){
      this.selectAll=false;
      this.updateCameradetails();
      this.getMonitoringStatus_cameras();
      this.alert.snackSuccess(res.message);
    
    }
    else{
      this.alert.snackError(res.message);
    }
    
    })
  

 }

  @ViewChild('upload') upload: any = ElementRef;
 openDialog(){

this.alert.confirm("").then((res) => {

  if(res.isConfirmed) {
    this.uploadCameradetails();
  }
})
 }


 monitoringCameras:any[]=[];

 fields:any[]=[
  {
    serial:0,
    label:"S.no",
   showSerial:true
  },
   {
     serial:1,
     label:"Camera Name",
     id:"name",
     sort:true,
     loop: []
     
   }
  ,
  {
    serial:2,
    label:"Monitoring Cameras",
    id:"cameraId",
    sort:true,
    loop: []
    
  },
]

 getMonitoringStatus_cameras(){
  this.monitoringCameras = [];
  // this.cameras=[]
  this.siteser.getMonitoringStatus_cameras({siteId:this.details.item.siteId}).subscribe((res:any)=>{
    if(res.statusCode==200){
      this.monitoringCameras=res.cameras;
      
      this.pieOption();
      
    } else{
      this.monitoringCameras=[];
    }

  })
}

chartOption : any;


pieOption(){

  let ch = {
    title: {
      text: "",
      left: 'center',
  
    },
    tooltip: {
      trigger: 'item',
  
    
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      // data:[`Monitoring Cameras - ${this.monitoringCameras?.length}`,`Non Monitoring Cameras - ${this.cameras?.length - this.monitoringCameras?.length}`]
    },
   
    series: [{
      name: 'Status',
      type: 'pie',
      radius: '50%',
      center: ['58%', '50%'],
      showEmptyCircle: false,
      label: {
        formatter: '{b}-{c}',
      },
      data: [
        // { value: this.cameras?.length, name: `Total Cameras - ${this.cameras?.length}` },
        { value: this.monitoringCameras.length, name: `MonitoringCameras` },
        { value: (this.cameras?.length - this.monitoringCameras?.length), name: `NonMonitoringCameras` },
        
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  this.chartOption = ch;

}


legendselectchanged(event:any){


  this.siteser.getCamerasshortDetailsForSiteId({siteId:this.details?.item.siteId}).subscribe((res:any)=>{

    this.cameras=res.cameras;
    
  // If MonitoringCameras is selected, show monitoring cameras
  if (event.selected.MonitoringCameras && !event.selected.NonMonitoringCameras) {
    this.newCameras = this.filterData(true);  // Filter for monitoring cameras

    this.newCameras.length==this.cameras.length? this.selectAll=true:this.selectAll=false;
   
  }

  // If NonMonitoringCameras is selected, show non-monitoring cameras
  else if (!event.selected.MonitoringCameras && event.selected.NonMonitoringCameras) {
    this.newCameras = this.filterData(false);  // Filter for non-monitoring cameras
    this.selectAll=false;
 
  }

  // If both MonitoringCameras and NonMonitoringCameras are selected, show all cameras
  else if (event.selected.MonitoringCameras && event.selected.NonMonitoringCameras) {
    this.newCameras = this.cameras;  // Show all cameras
    this.updateSelectAll();
  }
  else if(!event.selected.MonitoringCameras && !event.selected.NonMonitoringCameras){
    this.newCameras = [];
    this.selectAll=false;
  }
})

}
filterData(monitoring:boolean) {

  return this.cameras.filter((camera: any) => camera.monitoring === monitoring);
}

}
