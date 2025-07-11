import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';



interface MessagePayload {
  sender: string;
  recipient: string;
  message: string;
  company_id: string;
}

@Injectable({
  providedIn: 'root'
})

export class CameraService {

  constructor(
    private http: HttpClient,
    private storageSer: StorageService
  ) { }

  public play(payload: any) {
    return this.http.get(payload?.audioUrl);
  }

  updateEventInfo(payload: any, obj: any) {
    let url = `${environment.guard_monitoring_url}/updateEventInfo_1_0`;
    let myObj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      cameraId: payload?.cameraId,
      objectName: obj?.objectName,
      eventTag: obj?.eventTag,
      eventTime: obj?.eventStartTime,
      actionTag: obj?.actionTag,
      userLevels: obj?.userLevels,
      falseActivityTime: obj?.falseActivityTime,
      activityDetTime: obj?.activityDetTime,
      suspiciousTime: obj?.suspiciousTime,
      callResponseTime: obj?.callResponseTime,
      callNoResponseTime: obj?.callNoResponseTime,
      emailTime: obj?.emailTime,
      eventEndtime: obj?.eventEndtime,
      httpUrl: payload?.httpUrl,
      videoFile: obj?.videoFile,
      createdTime: obj?.createdTime,
      createdBy: obj?.createdBy,
      remarks: obj?.remarks
    }
    return this.http.post(url, myObj);
  }

  addVehicleCount(payload: any) {
    let url: string = `${environment.guard_monitoring_url}/addVehicleCount_1_0`;
    let user = this.storageSer.getData('userData');
    payload.createdBy = user?.UserId;
    return this.http.post(url, payload);
  }

  screenshots(payload: any, file: any) {
    let url: string = `${environment.guard_monitoring_url}/screenshots_1_0`;
    let formData = new FormData();

    formData.append('screenshot', file);
    // formData.append('screenShotName', `${payload?.cameraId}-${payload?.name}-${moment().tz(payload?.timezone)?.format('YYYY-MM-DD HH:mm:ss')}.png`);
    formData.append('color', payload?.color);
    formData.append('id', payload?.id);
    formData.append('cameraId', payload?.cameraId);
    formData.append('timeStamp', moment().tz(payload?.timezone)?.format('YYYY-MM-DD HH:mm:ss'));
    return this.http.post(url, formData);
  }

  // get_vehicle_analytics() {
  //   let url = `${environment.analyticsUrl}/vehicle_analytics`;
  //   let params = new HttpParams().set('site',  3634).set('date', '2024-06-18');
  //   return this.http.get(url, {params: params});
  // }

  // getEmailDetails(payload: any) {
  //   let url = `${environment.guard_monitoring_url}/getEmailDetails_1_0`;
  //   let params = new HttpParams();
  //   params = params.set('id', payload?.id);
  //   params = params.set('siteId', payload?.siteId);
  //   params = params.set('cameraId', payload?.cameraId);
  //   return this.http.get(url, {params: params});
  // }

  send_guard_email(payload: any) {
    let url = `${environment.guard_monitoring_url}/send_guard_email_1_0`;
    let user = this.storageSer.getData('userData');
    let formData = new FormData();

    let actag = 'Information';
    let objName = 'Person';

    // let alertType: any = payload.listType === 4 ? 1 : payload.listType === 5 ? 1 : payload.alertType;
    // let alertSubType: any = payload.listType === 4 ? 1 : payload.listType === 5 ? 3 : payload.alertSubType;
    // let objectName: any = payload.listType === 4 ? 'Person' : payload.listType === 5 ? 'Vehicle' : 'Vehicle';

    formData.append('siteId', payload?.siteId);
    formData.append('cameraId', payload?.cameraId);
    formData.append('recipientEmails', payload?.recipientEmails);
    formData.append('bcc', payload?.bcc);
    formData.append('Cc', payload?.cc);
    formData.append('subject', payload?.subject);
    formData.append('body', payload?.body);
    formData.append('fields', JSON.stringify(payload?.fields));
    formData.append('footer', payload?.footer);
    formData.append('alertTypeId', payload?.alertType);
    formData.append('alertSubTypeId', payload?.alertSubType);
    formData.append('objectName', 'Person/Vehicle');
    formData.append('eventTag', 'Camera-Event');
    formData.append('eventFromTime', payload?.eventFromTime);
    formData.append('eventToTime', payload?.eventToTime);
    formData.append('actionTag', payload?.actionTag);
    formData.append('createdBy', user?.UserId);

    for(var i = 0; i < payload?.files.length; i++) {
      formData.append("files",  payload?.files[i]);
    }
    return this.http.post(url, formData);
  }

  email_with_incident(payload: any) {
    let url = `${environment.guard_monitoring_url}/email_with_incident_1_0`;
    let params = new HttpParams();
    // params = params.set('camerasList', payload?.camerasList);
    // params = params.set('alertTypeId', payload?.alertTypeId);
    // params = params.set('subTypeId', payload?.subTypeId);
    params = params.set('siteId', payload?.siteId);
    params = params.set('day', payload?.day);
    params = params.set('hour', payload?.hour);
    params = params.set('currentTime', payload?.currentTime);

    let user = this.storageSer.getData('userData');
    let formData = new FormData();

    // let alertType: any = payload.listType === 4 ? 1 : payload.listType === 5 ? 1 : 1;
    // let alertSubType: any = payload.listType === 4 ? 1 : payload.listType === 5 ? 3 : 1;
    let objectName: any = payload.listType === 4 ? 'Person' : 'Vehicle';
    let alertType = '1';
    let alertSubType = '10';

    formData.append('siteId', payload?.siteId);
    formData.append('cameraId', payload?.cameraId);
    formData.append('alertTypeId', alertType);
    formData.append('alertSubTypeId', alertSubType);
    formData.append('objectName', objectName);
    formData.append('eventTag', 'Camera-Event');
    formData.append('eventFromTime', payload?.eventFromTime);
    formData.append('eventToTime', payload?.eventToTime);
    formData.append('actionTag', 'Information');
    formData.append('createdBy', user?.UserId);

    // formData.append('bcc', payload?.bcc);
    // formData.append('Cc', payload?.cc);
    // formData.append('subject', payload?.subject);
    // formData.append('body', payload?.body);
    // formData.append('fields', JSON.stringify(payload?.fields));
    // formData.append('footer', payload?.footer);
    // for(var i = 0; i < payload?.files.length; i++) {
    //   formData.append("files",  payload?.files[i]);
    // }

    return this.http.post(url, formData, {params: params});
  }

  getEmailData(payload: any) {
    let url = `${environment.guard_monitoring_url}/getEmailData_1_0`;
    let timer;
    payload?.siteId == 36444 ? timer = 10 : timer = 120; 
    let params = new HttpParams();
    params = params.set('siteId', payload?.siteId);
    params = params.set('camerasList', payload?.camerasList);
    params = params.set('alertTypeId', payload?.alertTypeId);
    params = params.set('subTypeId', payload?.subTypeId);
    params = params.set('day', payload?.day);
    params = params.set('hour', payload?.hour);
    params = params.set('currentTime', payload?.currentTime);
    params = params.set('timer', timer);
    return this.http.get(url, {params: params});
  }

  listActionTags(payload: any) {
    let url: string = `${environment.guard_monitoring_url}/listActionTags_1_0`;
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    return this.http.get(url, {params: params});
  }
  
}
