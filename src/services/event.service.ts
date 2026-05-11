import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { catchError, EMPTY, Subject, switchMap, takeUntil, timer } from 'rxjs';
import moment from 'moment';

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

  eventPooling$ = new Subject<void>();
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
    return timer(0, 3000).pipe(
      switchMap(() => this.http.get(url, { params: params })),
      takeUntil(this.eventPooling$)
    )
  }

  stopEventPooling() {
    this.eventPooling$.next();
    this.eventPooling$.complete();
    this.eventPooling$ = new Subject<void>()
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
    const url = `${environment.events_url}/write2Vms_DispatchQueue_1_0/`;
    const user = this.storageSer.getData('session');

    const obj = {
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
      userName: user?.UserName,
      actionTag: payload?.actionTag ?? '',
      nativeApp: payload?.nativeApp,
      actionTime: this.storageSer.getTimeWithTimezone(payload?.timezone),
      eventTag: payload?.eventTag ?? '',
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
      userLevels: 0,
    };
    return this.http.post(url, obj);
  }

  writeVms_To_Console(payload: any) {
    // const url = 'http://192.168.0.110:8002/writeVms_To_Console_1_0';
    const url = `${environment.events_url}/writeVms_To_Console_1_0`;
    const user = this.storageSer.getData('session');

    const obj = {
      cameraId: payload?.cameraId,
      color: payload?.color,
      id: payload?.id,
      timestamp: payload?.time,
      eventType: payload?.eventType ?? 'Manual_Wall',
      queue_name: user?.routingQueueName,
      timezone: payload?.timezone,
      httpUrl: payload?.httpUrl,
      siteId: payload?.siteId,
      siteName: payload?.siteName,
      userName: user?.UserName,
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
    const url = `${environment.event_tags_url}/updateEventFullDetails_1_0/`;
    const user = this.storageSer.getData('session');
    const path = this.router.url.split('/').at(-1);
    const currentTime = this.storageSer.getTimeWithTimezone(payload?.timezone);

    const obj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      objectName: payload?.objectName,
      cameraId: payload?.cameraId,
      eventTag: 'LIVE-VMS',
      actionTag: payload?.actionTag,
      userLevels: path === 'pre-dispatch' ? 2 : 3,
      falseActivityTime: payload?.type == 1 ? payload?.userActionTime : '',
      suspiciousTime: payload?.type !== 1 ? payload?.userActionTime : '',
      callResponseTime: '',
      callNoResponseTime: '',
      eventStartTime: payload?.timestamp,
      eventEndtime: currentTime,
      emailTime: typeof payload?.type === 'number' ? '' : currentTime,
      httpUrl: payload?.httpUrl,
      videoFile: payload?.imageName,
      createdBy: user?.UserId,
      remarks: '',
      eventType: payload?.eventType,
      timezone: payload?.timezone,
      subActionTag: payload?.subActionTag,
      userLevelAlarmInfo: payload?.userLevelAlarmInfo,
    };

    return this.http.post(url, obj);
  }

  getActionTagCategories(payload?: any) {
    const url = `${environment.event_tags_url}/getActionTagCategories_1_0`;
    const path = this.router.url.split('/').at(-1);
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

  userPooling$ = new Subject<void>();
  aliveUser() {
    this.stopUserPooling();

    const url = `${environment.event_tags_url}/userActiveStatus_1_0`;
    return timer(0, 60000).pipe(
      switchMap(() => {
        const user = this.storageSer.getData('session');
        const payload = {
          userId: user?.UserId,
          sessionId: user?.sessionId,
        };

        return this.http.post(url, payload).pipe(
          catchError(() => EMPTY),
        );
      }),
      takeUntil(this.userPooling$)
    )
  }

  stopUserPooling() {
    this.userPooling$.next();
    this.userPooling$.complete();
    this.userPooling$ = new Subject<void>()
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

  playbackvideo(payload: any) {
    const url = `${environment.download_url}/custom_playback_urls_1_0`;
    let params = new HttpParams();
    params = params.set('cameraId', payload?.cameraId);
    params = params.set('siteId', payload?.siteId);
    params = params.set('eventTime', this.datePipe.transform(payload?.actionTime, 'yyyy-MM-dd HH:mm:ss')!);
    params = params.set('minutesBeforeEvent', payload?.minutesBeforeEvent ?? 2);
    params = params.set('currentTime', payload?.currentTime);
    return this.http.get(url, { params });
  }


  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  getHour(timezone: string) {
    return moment.tz(timezone).hours();
  }
  getDay(timezone: string) {
    return moment.tz(timezone).day();
  }

  getEmailDataForVMSEvents(payload: any) {

    let url = `${environment.guard_monitoring_url}/getEmailDataForVMSEvents_1_0`;

    let params = new HttpParams();
    params = params.set("siteId", payload?.siteId);
    params = params.set("siteName", payload?.siteName);
    params = params.set("cameraId", payload?.cameraId);
    params = params.set("alertTypeId", payload?.alertTypeId);
    params = params.set("subTypeId", payload?.subTypeId);
    params = params.set("day", payload?.day);
    params = params.set("hour", payload?.hour);
    params = params.set(
      "currentTime",
      this.datePipe.transform(payload?.currentTime, "yyyy-MM-dd HH:mm:ss")!,
    );
    params = params.set("callingSystemDetail", "dashboard");

    return this.http.get(url, { params: params });
  }


  sendResolution(payload: any) {
    console.log(payload);
    let url = `${environment.guard_monitoring_url}/sendResolutionEmail_1_0`;


    let user = this.storageSer.getUser();
    payload.createdBy = user?.UserId;



    const formData = new FormData();
    formData.append("senderEmail", payload?.senderEmail);
    formData.append(
      "recipientEmails",
      JSON.stringify(payload?.recipientEmails ?? []),
    );
    formData.append("bcc", JSON.stringify(payload?.BCC ?? []));
    formData.append("cc", JSON.stringify(payload?.Cc ?? []));
    formData.append("subject", payload?.emailSubject);
    formData.append("body", payload?.emailBody);
    if (payload?.selectedFiles?.length) {
      payload.selectedFiles.forEach((file: File) => {
        formData.append("files", file);
      });
    }



    formData.append("fields", JSON.stringify(payload?.emailFields));
    formData.append("siteId", payload?.siteId);
    formData.append("cameraId", payload?.cameraId);

    formData.append("actionsTaken", payload?.action);
    formData.append("notes", payload?.resolution);
    formData.append("eventId", payload?.eventId);
    formData.append("createdBy", user?.UserId);
    formData.append("alerTagId", payload?.alertTagId1);
    formData.append("subAlertTagId", payload?.subTypeId1);
    formData.append("timeZone", payload?.timezone);


    return this.http.post(url, formData);
  }
}
