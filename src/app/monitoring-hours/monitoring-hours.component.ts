import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';

interface MonitoringHour {
  hours: string[];
  days: string[];
}


interface GroupedCamera {
  cameraId: string[];
  monitoringHours: MonitoringHour[];
}

@Component({
  selector: 'app-monitoring-hours',
  templateUrl: './monitoring-hours.component.html',
  styleUrls: ['./monitoring-hours.component.css']
})
export class MonitoringHoursComponent {

  fields:any[]=[
    {
      serial:0,
      label:"S.no",
     showSerial:true
    },
    {
      serial:1,
      label:"CameraName",
      id:"cameraName",
      sort:true,
      loop: []
    },
    {
      serial:2,
      label:"CentralBox Id",
      id:"centralBoxId",
      sort:true,
      loop: []
      
    },
    {
      serial:3,
      label:"Monitoring Hours",
      id:"monitoringHoursDetails",
      sort:false,
      loop: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
      weekdays: true
    },
    {     
      serial:4,
      key: 'actions',
      label: 'Actions',
      actions: ['delete'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch(type) {
          case 'view':
          //   this.openViewPopup(data);
            break;
          case 'edit':
            this.openEditPopup(data);
            break;
             case 'save':
            this.saveEditPopup();
            break;
             case 'cancel':
           this.cancelEditPopup();
            break;
          default:
            break;
        }
      }
    }
  ]

  constructor( private SiteSer : SiteService,
              private alert : AlertService
  ){

  }

  ngOnInit(): void {
   
    if(this.details.type=='view'){

      this.getMonitoringHoursForSite();
    }
    
  }

  monhoursindex:any;
  monhrseditindexdata:any;
  openEditPopup(item: any) {
 this.monhrseditindexdata={...item};

   this.monhoursindex= this.monhrCamera.indexOf(item);
  

  }
  cancelEditPopup(){
    this.monhoursindex=-1;
  }
  saveEditPopup(){
   this.SiteSer.updateCameraMonitoringHours(this.monhrseditindexdata).subscribe((res:any)=>{
    if(res.statusCode==200){

    }
   });
   
  }


  @Input() monitoringCameras!:any;
  @Input() details!:any;
  deviceName:any;
  daysOfWeek: string[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
  siteSearch: any;
  deviceSearch: any;
  public exportTime :any= { hour: 0, minute: 0, meriden: 'PM', format: 24 };
  selectedDays: string[] = [];
  startTime: any =null;
  endTime: any= null;
  currentCamera:any;
  timeSlots: any[] = [];
  cameraTimeSlots: any[] = [];

  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value;
  }
  searchDevices(event: any) {
    this.deviceSearch = (event.target as HTMLInputElement).value;
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

startTime1:any;
endTime1:any;

  onTimeChange(timeType: string): void {
  
    if (timeType === 'start' && this.startTime) {
      this.startTime1 = this.formatTime(this.startTime);
    } else if (timeType === 'end' && this.endTime) {

     
      if(this.endTime == '00:00' ) {
        this.endTime = '23:59';
        this.endTime1 = this.endTime;
        if (this.startTime > this.endTime) {
          // Find the index of the first selected day in the daysOfWeek array
          return;  
        }

        // if(this.selectedDays.length>1){
        //   this.selectedDays.splice(this.selectedDays.length-1,1);
        // }
      } else {
        const [hours, minutes] = this.endTime.split(':');
        this.endTime = `${hours}:00`;
        this.endTime1 = this.formatTime(this.endTime);
        if (this.startTime > this.endTime) {
          // Find the index of the first selected day in the daysOfWeek array
          const lastSelectedDay=this.selectedDays[this.selectedDays.length-1];
          const currentIndex = this.daysOfWeek.indexOf(lastSelectedDay);
        
          // Make sure we found a valid index
          if (currentIndex !== -1) {
            // Calculate the next day's index, wrapping around if needed
            const nextIndex = (currentIndex + 1) % this.daysOfWeek.length;
            const nextDay = this.daysOfWeek[nextIndex];
        
            // Add the next day to selectedDays if it's not already there
            if (!this.selectedDays.includes(nextDay)) {
              this.selectedDays.push(nextDay);
            }
          }
        }
      }
    }
    
  }


  // eventChange(event:any,timeType: string){
//   if (timeType === 'start') {
//     this.startTime=event;
//     this.startTime1 = this.formatTime(event);
//   } 
//   else if (timeType === 'end') {
    
//     if(event == '00:00') {
//       this.endTime = '23:59';
//       this.endTime1 = this.endTime;
//       // this.endTime1 = '23:59';
//     } else {
//       const [hours, minutes] = event.split(':');
//       this.endTime = `${hours}:00`;
//       this.endTime1 = this.formatTime(this.endTime);
//     }
//   }
// }

  private formatTime(time: string): string {
    // const hours = time.split(':')[0]; // Extract just the hour part
    const hours =time;
    
    return hours; // Return the formatted time as just hours
  }

  filterCam(type:any){

    this.currentCamera=type;

  }


  toggleDaySelection(day: string) {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays.push(day);
    }
  }


  addTimeSlot() {

    if (this.deviceName?.length ==0 || this.selectedDays?.length === 0 || !this.startTime1 || !this.endTime1) {
      this.alert.snackError('Please select cameras, days and time  before adding.');
      return;
    }

    // const newStart = Number(this.startTime1);
    // const newEnd = Number(this.endTime1);
    // console.log(newEnd)
    // if (isNaN(newStart) || isNaN(newEnd)) {
    //   this.alert.snackError('Invalid time values.');
    //   return;
    // }

    // console.log(this.cameraTimeSlots)

// Check for a redundant time slot.

for (const slot of this.cameraTimeSlots) {

  // Compare cameras (sorting to ensure order does not matter).
  const sortedExistingCameras = [...slot?.cameraId].sort();
  const sortedNewCameras = [...this.deviceName].sort();
  if (JSON.stringify(sortedExistingCameras) === JSON.stringify(sortedNewCameras)) {
    // Check each monitoringHours entry for matching days.
    for (const monitoring of slot.monitoringHours) {
      const sortedExistingDays = [...monitoring.days].sort();
      const sortedNewDays = [...this.selectedDays].sort();
      if (JSON.stringify(sortedExistingDays) === JSON.stringify(sortedNewDays)) {
        // Check if any existing time range fully covers the new time range.
        for (const range of monitoring.hours) {
          // const [existingStart, existingEnd] = range.split('-').map(Number);
          const [existingStart, existingEnd] = range.split('-');
          
          if (existingStart <= this.startTime1 && existingEnd >= this.endTime1) {
            this.alert.snackError(`The new time slot is already covered by an existing time slot for this ${this.deviceName}`);
            return;
          }
        }
      }
    }
  }
}


    const timeSlot = {
      cameraId: this.deviceName,
      monitoringHours: [
        {
          hours: [`${this.startTime1}-${this.endTime1}`],
          days: this.selectedDays
        }
      ]
    };

    // console.log(timeSlot)

    // Push the time slot data for all selected cameras
    this.cameraTimeSlots.push(timeSlot);
    
    this.groupCameras();
    // this.selectedDays = [];
    this.startTime = '00:00'
    this.endTime ='00:00';
    this.startTime1 = null;
    this.endTime1 = null;
    
   
  }

  groupedCameras: GroupedCamera[] = [];

  monitoringColumns: string[] = ['hours', 'days'];

  groupCameras(): void {
    const groups: { [key: string]: GroupedCamera } = {};
  
    // First, group by sorted cameraId array
    for (const camera of this.cameraTimeSlots) {
      const sortedCameraIds = [...camera?.cameraId].sort();
      const key = JSON.stringify(sortedCameraIds);
  
      if (groups[key]) {
        // Add the monitoringHours from this camera into the existing group
   
        groups[key].monitoringHours.push(...camera.monitoringHours);
      } else {
        groups[key] = {
          cameraId: camera.cameraId.slice(), // shallow copy of cameraId
          monitoringHours: camera.monitoringHours.slice() // shallow copy of monitoringHours
        };
      }
    }
  
    // Now, merge monitoringHours entries that have the same days array
    Object.keys(groups).forEach(groupKey => {
      const mergedMonitoringHours: { [daysKey: string]: { hours: string[]; days: string[] } } = {};
  
      groups[groupKey].monitoringHours.forEach(entry => {
        // Sort the days array to generate a consistent key
        const sortedDays = [...entry.days].sort();
        const daysKey = JSON.stringify(sortedDays);
  
        if (mergedMonitoringHours[daysKey]) {
          // Merge the hours arrays (using a Set to avoid duplicates)
          mergedMonitoringHours[daysKey].hours = Array.from(new Set([
            ...mergedMonitoringHours[daysKey].hours,
            ...entry.hours
          ]));
        } else {
          mergedMonitoringHours[daysKey] = {
            hours: [...entry.hours],
            days: entry.days  // you can also store sortedDays if desired
          };
        }

      });
      // Replace the monitoringHours with the merged array
      groups[groupKey].monitoringHours = Object.values(mergedMonitoringHours);
    });


  
    this.groupedCameras = Object.values(groups);
    console.log("Grouped Cameras: ", this.groupedCameras);
  }

createCameraMonitoringHours(){

  let payload={
    "siteId": this.details.item.siteId,
    "cameraMonitoringHours":this.groupedCameras
  }

  this.SiteSer.createCameraMonitoringHours_1_0(payload).subscribe((res:any)=>{
    if(res.statusCode==200){
      
      this.alert.snackSuccess(res.message);
    }
    else{
      this.alert.snackError(res.message);
    }
   
  })
}

monhrCamera:any;
getMonitoringHoursForSite(){

  this.SiteSer.getMonitoringHoursForSite(this.details.item.siteId).subscribe((res:any)=>{
  
    if(res.statusCode==200){
      this.monhrCamera= res.cameraDetails;
    }
    else{

      this.alert.snackError(res.message);
    }
   
  })

}

allSelected: boolean = false; 
// isChecked(): boolean {
//   return  this.monitoringCameras?.length && this.deviceName?.length === this.monitoringCameras?.length;
// }

// toggleSelection(): void {
//   if (this.allSelected) {
//     this.deviceName = [];
//   } else {
//     this.deviceName = this.monitoringCameras.map((camera:any) => camera.cameraId);
//   }
//   this.allSelected = !this.allSelected;
// }
isChecked(): boolean {
  return (
    this.monitoringCameras?.length > 0 &&
    this.deviceName?.length === this.monitoringCameras?.length
  );
}

toggleSelection(): void {
  const isAllSelected = this.isChecked();
  if (isAllSelected) {
    this.deviceName = [];
  } else {
    this.deviceName = this.monitoringCameras.map((camera: any) => camera.cameraId);
  }
}
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


}
