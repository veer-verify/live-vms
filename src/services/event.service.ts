import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private http: HttpClient,
    private storageSer: StorageService,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  getDispatchData() {
    let url = `${environment.events_url}/getVms_DispatchQueueData_1_0/`;
    let path = this.router.url.split('/').at(-1);
    let params = new HttpParams().set(
      'queue_name',
      path === 'pre-dispatch'
        ? this.storageSer.getData(2)
        : path === 'observer'
          ? this.storageSer.getData(4)
          : this.storageSer.getData(3),
    );
    return this.http.get(url, { params: params });
  }

  addQueusInfoRedis(payload: any) {
    let url = `${environment.event_tags_url}/addConsoleEvents_1_0`;
    let user = this.storageSer.getData('session');
    payload.userId = user?.UserId;
    payload.level = `Level${user?.userLevel}`;
    payload.consoleType = 'manual-console';
    payload.queueName = user?.queueName;
    payload.sessionId = user?.sessionId;
    payload.userName = user?.UserName;
    return this.http.post(url, payload);
  }

  write2Dispatch(payload: any) {
    let url = `${environment.events_url}/write2Vms_DispatchQueue_1_0/`;
    let obj = {
      cameraId: payload?.cameraId,
      color: payload?.color,
      id: payload?.id,
      timestamp: payload?.time,
      eventType: payload?.eventType ?? 'Manual_Wall',
      queue_name: payload?.queue_name,
      timezone: payload?.timezone,
      httpUrl: payload?.httpUrl,
      siteId: payload?.siteId,
      siteName: payload?.siteName,
      userName: payload?.userName,
      actionTag: payload?.actionTag ?? '',
      nativeApp: payload?.nativeApp,
      actionTime: this.storageSer.getTimeWithTimezone(payload?.timezone),
      eventTag: payload?.eventTag ?? '',
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
      userLevels: 0,
    };
    return this.http.post(url, obj);
  }

  write2Dispatchcustomevent(payload: any) {
    // let url = `${environment.events_url}/writeCustomEvent_1_0/`;
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
      actionTime: this.storageSer.getTimeWithTimezone(payload?.timezone),
      eventTag: 'LIVE-VMS',
      eventType: 'Custom_Event',
      nativeApp: payload?.nativeApp,
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
      userLevels: 0,
    };
    return this.http.post(url, obj);
  }

  updateEventFullDetails(payload: any) {
    let url = `${environment.event_tags_url}/updateEventFullDetails_1_0/`;
    let user = this.storageSer.getData('session');
    let path = this.router.url.split('/').at(-1);
    // let eventStart = this.datePipe.transform(new Date(payload?.timestamp), 'yyyy-MM-dd hh:mm:ss');
    let currentTime = this.storageSer.getTimeWithTimezone(payload?.timezone);

    let obj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      objectName: payload?.objectName,
      cameraId: payload?.cameraId,
      eventTag: 'LIVE-VMS',
      actionTag: payload?.actionTag,
      userLevels: path === 'pre-dispatch' ? 2 : 3,
      falseActivityTime: payload?.type == 1 ? payload?.actionTagTime : '',
      suspiciousTime: payload?.type !== 1 ? payload?.actionTagTime : '',
      // activityDetTime: payload?.activityDetTime,
      callResponseTime: '',
      callNoResponseTime: '',
      eventStartTime: payload?.timestamp,
      eventEndtime: currentTime,
      emailTime: typeof payload?.type === 'number' ? '' : currentTime,
      httpUrl: payload?.httpUrl,
      videoFile: payload?.imageName,
      createdBy: user?.UserId,
      remarks: '',
      // createdTime: currentTime,
      // landingTime: payload?.landingTime,
      eventType: payload?.eventType,
      timezone: payload?.timezone,
      subActionTag: payload?.subActionTag,
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
    };

    return this.http.post(url, obj);
  }

  getActionTagCategories(payload?: any) {
    let url = `${environment.event_tags_url}/getActionTagCategories_1_0`;
    let path = this.router.url.split('/').at(-1);
    let params = new HttpParams();
    params = params.set('userLevel', path === 'pre-dispatch' ? 2 : 3);
    if (payload?.actionTagId) {
      params = params.set('actionTagId', payload?.actionTagId);
    }
    return this.http.get(url, { params: params });
  }

  getCameraEventDetails(payload: any) {
    let url = `${environment.guard_monitoring_url}/getMonitoringInfoForSiteAndCamera_1_0`;
    let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }

    return this.http.get(url, { params: params });
  }

  userLogin() {
    const url = `${environment.event_tags_url}/userLogin`;
    let user = this.storageSer.getData('session');
    let payload = {
      userId: 0,
      userLevel: '',
    };
    payload.userId = user?.UserId;
    payload.userLevel = `Level${user?.userLevel}`;
    return this.http.post(url, payload);
  }

  aliveUser() {
    const url = `${environment.event_tags_url}/userActiveStatus_1_0`;
    let user = this.storageSer.getData('session');
    let payload = {
      userId: 0,
      sessionId: 0,
    };
    payload.userId = user?.UserId;
    payload.sessionId = user?.sessionId;
    return this.http.post(url, payload);
  }

  refreshUser() {
    const url = `${environment.event_tags_url}/refresh`;
    let user = this.storageSer.getData('session');
    let payload = {
      userId: 0,
    };
    payload.userId = user?.UserId;
    return this.http.post(url, payload);
  }

  consumeConsoleEvents(payload: any) {
    const url = `${environment.event_tags_url}/consumeConsoleEvents_1_0`;
    let user = this.storageSer.getData('session');

    payload.userId = user?.UserId;
    payload.sessionId = user?.sessionId;
    payload.consoleType = 'manual-console';
    return this.http.put(url, payload);
  }
  getMonitoringInfo(payload: any) {
    let url = `${environment.guard_monitoring_url}/getMonitoringInfo_1_0`;

    let user = this.storageSer.getData('session');

    let params = new HttpParams();

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }
    params = params.set('level', user?.userLevel);

    params = params.set('timezone', payload?.timezone);

    return this.http.get(url, { params });
  }

  getVMSEventFlow_1_0() {
    const url = `${environment.event_tags_url}/getVmsEventFlow_1_0`;
    let params = new HttpParams();
    params = params.set('callingSystemDetail', 'vms');
    return this.http.get(url, { params });
  }

  getImagesForCameraId(payload: any) {
    const url = `${environment.site_url}/getCameraImagesForCameraId_1_0`;

    let params = new HttpParams();
    params = params.set('cameraId', payload?.cameraId);
    return this.http.get(url, { params });
  }

  audioDisable(payload: any) {
    const url = `${environment.guard_monitoring_url}/checkCameraAudio_1_0`;
    let params = new HttpParams();
    params = params.set('cameraId', payload?.cameraId);
    params = params.set('siteId', payload?.siteId);
    return this.http.get(url, { params });
  }

  playbackvideo(payload:any){
    const url=`${environment.download_url}/custom_playback_urls_1_0`;
     let params = new HttpParams();
    params = params.set('cameraId', payload?.cameraId);
    params = params.set('siteId', payload?.siteId);
    params = params.set('eventTime', this.datePipe.transform(payload?.actionTime,'yyyy-MM-dd HH:mm:ss')!);
    params=params.set('minutesBeforeEvent',payload?.minutesBeforeEvent);
    params=params.set('currentTime',payload?.currentTime);
    return this.http.get(url, { params });
  }
}
