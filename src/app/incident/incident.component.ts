import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent {

  @Input() currentItem: any;
  @Output() closeEvent: any = new EventEmitter();

  constructor(
    private storageSer: StorageService,
    private camSer: CameraService,
    private dialog: MatDialog,
    private alertSer: AlertService,
    private fb: FormBuilder,
  ) { }

  toppings!: FormGroup;

  ngOnInit() {
    // this.clearValues();
    // this.selectedAction = null;
    // this.selectedEvent = null;

    this.setStartTime()
    this.toppings = this.fb.group({
      callToClientRes: false,
      callToClientNotRes: false,
      emailToClient: false,
      arrest: false,
      activityDettered: false,
      policeIntervenction: false
    });
  }

  clearValues() {
    this.toppings.get('callToClientRes')?.setValue(false);
    this.toppings.get('callToClientNotRes')?.setValue(false);
    this.toppings.get('emailToClient')?.setValue(false);
    this.toppings.get('activityDettered')?.setValue(false);
    this.eventObj.callResponseTime = '';
    this.eventObj.callNoResponseTime = '';
    this.eventObj.emailTime = '';
    this.eventObj.activityDetTime = '';
  }

  // closeActionDialog() {
  //   this.showActionDialog = false;
  // }

  actionTypes = [
    { id: 1, value: 'Suspicous Activity' },
    { id: 2, value: 'False Activity' }
  ]

  selectedAction: any;
  selectedEvent: any;
  setStartTime() {
    let map = { time: formatDate(new Date(), 'medium', 'en-us') };
    this.eventObj.createdTime = map?.time;
    this.eventObj.eventStartTime = map?.time;
  }

  setActionTime(type: any) {
    this.clearValues();
    let map = { time: formatDate(new Date(), 'medium', 'en-us') };
    if (type == 'Suspicous Activity') {
      this.eventObj.suspiciousTime = map?.time;
    }
    if (type == 'False Activity') {
      this.eventObj.falseActivityTime = map?.time;
    }
  }

  setEventTime(type: any) {
    let map = { time: formatDate(new Date(), 'medium', 'en-us') };
    if (type == 'callResponseTime') {
      if (this.toppings.value.callToClientRes == true) {
        this.eventObj.callResponseTime = map?.time;
      } else {
        this.eventObj.callResponseTime = '';
      }
    }
    if (type == 'callNoResponseTime') {
      if (this.toppings.value.callToClientNotRes == true) {
        this.eventObj.callNoResponseTime = map?.time;
      } else {
        this.eventObj.callNoResponseTime = '';
      }
    }
    if (type == 'emailTime') {
      if (this.toppings.value.emailToClient == true) {
        this.eventObj.emailTime = map?.time;
      } else {
        this.eventObj.emailTime = '';
      }
    }
    if (type == 'activityDetTime') {
      if (this.toppings.value.activityDettered == true) {
        this.eventObj.activityDetTime = map?.time;
      } else {
        this.eventObj.activityDetTime = '';
      }
    }
    // console.log(this.eventObj);
  }

  setEndTime() {
    let map = { time: formatDate(new Date(), 'medium', 'en-us') };
    this.eventObj.eventEndtime = map?.time;
  }

  closeActionDialog() {
    this.closeEvent.emit(false);
  }

  eventObj: any = {
    createdTime: '',
    eventStartTime: '',

    actionTag: null,
    userLevels: '1stLevel',
    objectName: "Person",
    eventTag: "Camera_Event",
    videoFile: '',
    suspiciousTime: '',
    falseActivityTime: '',

    callResponseTime: '',
    callNoResponseTime: '',
    emailTime: '',
    activityDetTime: '',
    eventEndtime: '',
    createdBy: 1,
    remarks: ''
  }

  updateEventInfo(data: any) {
    this.setEndTime();
    this.eventObj.actionTag = this.selectedAction;
    this.camSer.updateEventInfo(data, this.eventObj).subscribe((res: any) => {
      // this.showActionDialog = false;
      this.alertSer.snackSuccess('Alert Sent Successfully');
    }, (err: any) => {
      // this.showActionDialog = false;
      this.alertSer.snackError('Failed');
    })
  }

}
