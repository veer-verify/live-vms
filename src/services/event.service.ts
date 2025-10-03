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
    let params = new HttpParams().set('queue_name', path === 'events' ? 'dispatch-2nd-level' : path==='observer'?'observer-wall': 'dispatch-3rd-level');
    return this.http.get(url, { params: params })
  }

  addQueusInfoRedis(payload:any){
      let url = `${environment.events_url}/addQueusInfoRedis_1_0`;
      let user = this.storageSer.getData('userData');
      payload.userId= user?.UserId;
    return this.http.post(url, payload)
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
      userName: payload?.userName,
      actionTag: payload?.actionTag ?? '',
      actionTime: moment().tz(payload?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS'),
      eventTag: '',
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
      userLevels: 0
    }
    return this.http.post(url, obj);
  }

  updateEventFullDetails(payload: any) {
    let url = `${environment.event_tags_url}/updateEventFullDetails_1_0/`;
    let user = this.storageSer.getData('userData');
    let path = this.router.url.split('/').at(-1);
    // let eventStart = this.datePipe.transform(new Date(payload?.timestamp), 'yyyy-MM-dd hh:mm:ss:SSS');
    let currentTime = moment().tz(payload?.timezone)?.format('YYYY-MM-DD hh:mm:ss:SSS');

    let obj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      objectName: payload?.objectName,
      cameraId: payload?.cameraId,
      eventTag: 'LIVE-VMS',
      actionTag: payload?.actionTag,
      userLevels: path === 'events' ? 2 : 3,
      falseActivityTime: payload?.type == 1 ? payload?.actionTagTime : '',
      suspiciousTime: payload?.type !== 1 ? payload?.actionTagTime : '',
      // activityDetTime: payload?.activityDetTime,
      callResponseTime: '',
      callNoResponseTime: '',
      eventStartTime: payload?.timestamp,
      eventEndtime: currentTime,
      emailTime: currentTime,
      httpUrl: payload?.httpUrl,
      videoFile: payload?.imageName,
      createdBy: user?.UserId,
      remarks: '',
      // createdTime: currentTime,
      // landingTime: payload?.landingTime,
      eventType: 'Manual_Wall',
      timezone: payload?.timezone,
      subActionTag: payload?.subActionTag,
      userLevelAlarmInfo: payload?.userLevelAlarmInfo
    };

    return this.http.post(url, obj);
  }

  getActionTagCategories(payload?: any) {
    let url = `${environment.event_tags_url}/getActionTagCategories_1_0`;
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

  getCameraEventDetails(payload:any){
        let url = `${environment.guard_monitoring_url}/getCameraEventDetails_1_0`;
        let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
     if (payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }
   
   return this.http.get(url, { params: params })
  }

}
