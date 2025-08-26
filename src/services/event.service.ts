import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private storageSer: StorageService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  getDispatchData() {
    let url = `${environment.events_url}/get_dispatch_queue_data_1_0/`;
    let params = new HttpParams().set('queue_name', 'dispatch-queue');
    return this.http.get(url, { params: params })
  }

  write2Dispatch(payload: any) {
    let url = `${environment.events_url}/write2Dispatch_queue_data_1_0/`;
    let obj = {
      cameraId: payload?.cameraId,
      color: payload?.color,
      id: payload?.id,
      timestamp: payload?.dspTime,
      queue_name: "dispatch-queue",
      timezone: payload?.timezone,
      httpUrl: payload?.httpUrl,
      siteId: payload?.siteId
    }
    return this.http.post(url, obj);
  }

  updateEventFullDetails(payload: any) {
    let url = `${environment.events_url}/updateEventFullDetails_1_0/`;
    let user = this.storageSer.getData('userData');
    let path = this.router.url.split('/').at(-1);
    console.log(path);

    let obj = {
      siteName: 'dummy',
      siteId: payload?.siteId,
      objectName: payload?.objectName,
      cameraId: payload?.cameraId,
      eventTag: 'VMS-EVENTS',
      actionTag: payload?.actionTag,
      userLevels: path === 'events' ? 2 : 3,
      falseActivityTime: payload?.falseActivityTime ?? '',
      activityDetTime: '',
      suspiciousTime: '',
      callResponseTime: '',
      callNoResponseTime: '',
      emailTime: '',
      eventStartTime:  this.datePipe.transform(payload?.eventStartTime, 'yyyy-MM-dd hh:mm:ss:SSS'),
      eventEndtime: payload?.submitTime ?? '',
      httpUrl: '',
      videoFile: '',
      createdTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss:SSS'),
      createdBy: user?.UserId,
      remarks: '',
      landingTime: payload?.landingTime.toString(),
      eventType: 'Manual Wall'
    };

    return this.http.post(url, obj);
  }

    write2Queue(payload: any) {
    let url: string = `${environment.events_url}/write2Queue_1_0/`;
    let user = this.storageSer.getData('userData');
    let myObj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      cameraId: payload?.cameraId,
      objectName: payload?.objectName,
      eventTag: 'Camera-Event',
      eventTime: payload?.eventTime,
      actionTag: 'suspicious',
      actionTime: new Date().toString(),
      userLevels: user?.userLevel,
      httpUrl: payload?.httpUrl,
      imageUrl: payload?.imageUrl,
      queue_name: payload?.queue,
      landingTime: payload?.landingTime
    }
    return this.http.post(url, myObj);
  }

}
