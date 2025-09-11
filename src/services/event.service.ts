import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

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
    let url = `${environment.events_url}/getVms_DispatchQueueData_1_0/`;
    let path = this.router.url.split('/').at(-1);
    let params = new HttpParams().set('queue_name', path === 'events' ? 'dispatch-2nd-level' : 'dispatch-3rd-level');
    return this.http.get(url, { params: params })
  }

  write2Dispatch(payload: any) {
    let url = `${environment.events_url}/write2Vms_DispatchQueue_1_0/`;
    let obj = {
      cameraId: payload?.cameraId,
      color: payload?.color,
      id: payload?.id,
      timestamp: payload?.time,
      queue_name: payload?.queue_name,
      timezone: payload?.timezone,
      httpUrl: payload?.httpUrl,
      siteId: payload?.siteId,
      siteName: payload?.siteName,
      actionTag: payload?.actionTag ?? '',
      actionTime: moment().tz(payload?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS'),
      eventTag: '',
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
      userLevels: 0
    }
    return this.http.post(url, obj);
  }

  updateEventFullDetails(payload: any) {
    let url = `${environment.events_url}/updateEventFullDetails_1_0/`;
    let user = this.storageSer.getData('userData');
    let path = this.router.url.split('/').at(-1);
    let eventStart = this.datePipe.transform(new Date(payload?.timestamp), 'yyyy-MM-dd hh:mm:ss:SSS');
    let currentTime = moment().tz(payload?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');

    let obj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      objectName: payload?.objectName,
      cameraId: payload?.cameraId,
      eventTag: 'LIVE-VMS',
      actionTag: payload?.actionTag,
      userLevels: path === 'events' ? 2 : 3,
      falseActivityTime: payload?.falseActivityTime ?? '',
      activityDetTime: '',
      suspiciousTime: payload?.suspiciousTime ?? '',
      callResponseTime: '',
      callNoResponseTime: '',
      eventStartTime: eventStart,
      eventEndtime: currentTime,
      emailTime: currentTime,
      httpUrl: payload?.httpUrl,
      videoFile: '',
      createdTime: currentTime,
      createdBy: user?.UserId,
      remarks: '',
      landingTime: payload?.landingTime,
      eventType: 'Manual Wall',
      timezone: payload?.timezone,
      subActionTag: payload?.subActionTag,
      userLevelAlarmInfo: payload?.userLevelAlarmInfo
    };

    return this.http.post(url, obj);
  }

  //   write2Queue(payload: any) {
  //   let url: string = `${environment.events_url}/write2Queue_1_0/`;
  //   let user = this.storageSer.getData('userData');
  //   let myObj = {
  //     siteName: payload?.siteName,
  //     siteId: payload?.siteId,
  //     cameraId: payload?.cameraId,
  //     objectName: payload?.objectName,
  //     eventTag: 'Camera-Event',
  //     eventTime: payload?.eventTime,
  //     actionTag: 'suspicious',
  //     actionTime: new Date().toString(),
  //     userLevels: user?.userLevel,
  //     httpUrl: payload?.httpUrl,
  //     imageUrl: payload?.imageUrl,
  //     queue_name: payload?.queue,
  //     landingTime: payload?.landingTime
  //   }
  //   return this.http.post(url, myObj);
  // }

  getActionTagCategories(payload?: any) {
    // let url = `${environment.event_tags_url}/event_tags_url`;
    let url = 'http://192.168.0.232:3000/getActionTagCategories_1_0';
    let path = this.router.url.split('/').at(-1);
    let params = new HttpParams();
    if (payload?.actionTagId) {
      params = params.set('actionTagId', payload?.actionTagId)
    }
    // if (payload?.userLevel) {
      params = params.set('userLevel',  path === 'events' ? 2 : 3,)
    // }
    return this.http.get(url, { params: params })
  }

}
