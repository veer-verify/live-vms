import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
    private storageSer: StorageService,
    private datePipe: DatePipe
  ) { }

  siren_sub = new BehaviorSubject<boolean>(false);

  incidentList(payload?: any) {
    let url = `${environment.guard_monitoring_url}/incidentList_1_0`;
    let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    if (payload?.objectName) {
      params = params.set('objectName', payload?.objectName)
    }
    if (payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId)
    }
    if (payload?.actionTag) {
      params = params.set('actionTag', payload?.actionTag)
    }
    if (payload?.fromDate) {
      // let x = payload?.fromDate;
      // params = params.set('fromDate', `${x.year}-${x.month}-${x.day}`);
      params = params.set('fromDate', formatDate(payload?.fromDate, 'yyyy-MM-dd', 'en-us'));
    }
    if (payload?.toDate) {
      // let x = payload?.toDate;
      // params = params.set('toDate', `${x.year}-${x.month}-${x.day}`);
      params = params.set('toDate', formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-us'));
    }
    if (payload?.page) {
      params = params.set('page', payload.page);
    } else {
      params = params.set('page', 1);
    }

    return this.http.get(url, { params: params });
  }

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
    formData.append('timeStamp', payload?.time);
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

    for (var i = 0; i < payload?.files.length; i++) {
      formData.append("files", payload?.files[i]);
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

    formData.append('siteId', payload?.siteId);
    formData.append('cameraId', payload?.cameraId);
    formData.append('alertTypeId', payload?.alertTypeId);
    formData.append('alertSubTypeId', payload?.subTypeId);
    formData.append('objectName', payload?.objectName);
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

    return this.http.post(url, formData, { params: params });
  }

  eventsGenericEmail(payload: any) {
    let url = `${environment.guard_monitoring_url}/eventsGenericEmail_1_0`;
    let user = this.storageSer.getData('userData');
    let params = new HttpParams();

    // params = params.set('camerasList', payload?.camerasList);
    // params = params.set('alertTypeId', payload?.alertTypeId);
    // params = params.set('subTypeId', payload?.subTypeId);
    params = params.set('siteId', payload?.siteId);
    params = params.set('day', payload?.day);
    params = params.set('hour', payload?.hour);
    params = params.set('currentTime', payload?.currentTime);

    let formData = new FormData();

    formData.append('siteId', payload?.siteId);
    formData.append('cameraId', payload?.cameraId);
    formData.append('alertTypeId', payload?.alertTypeId);
    formData.append('alertSubTypeId', payload?.subTypeId);
    formData.append('objectName', payload?.objectName);
    formData.append('eventTag', 'Camera-Event');
    formData.append('eventFromTime', payload?.eventFromTime);
    formData.append('eventToTime', payload?.eventToTime);
    formData.append('actionTag', 'Information');
    formData.append('createdBy', user?.UserId);
    formData.append('subject', payload?.emailSubject);
    formData.append('body', payload?.emailBody);
    formData.append('fields', JSON.stringify(payload?.emailFields));
    formData.append('footer', payload?.emailFooter);
    formData.append('senderEmail', payload?.senderEmail);
    // formData.append('bcc', payload?.BCC);
    // formData.append('Cc', payload?.Cc);

    formData.append("recipientEmails", payload?.recipientEmails.join(', '));
    formData.append("Bcc", payload?.BCC.join(','));
    formData.append("Cc", payload?.Cc.join(','));
    for (var i = 0; i < payload?.screenshots.length; i++) {
      formData.append("files", payload?.screenshots[i].substring(payload?.screenshots[i].lastIndexOf('/') + 1));
    }

    return this.http.post(url, formData, { params: params });
  }


  getEmailData(payload: any) {
    let url = `${environment.guard_monitoring_url}/getEmailDataForVMSEvents_1_0`;
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
    params = params.set('imageName', payload?.imageName);
    return this.http.get(url, { params: params });
  }

  listActionTags(payload: any) {
    let url: string = `${environment.guard_monitoring_url}/listActionTags_1_0`;
    let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    return this.http.get(url, { params: params });
  }



  private readonly API_URL = 'https://api.800.com/message';
  private readonly receive_URL = 'https://api.800.com/companies/138829/conversations?updated_before=&updated_after=&search=&types[]=message&types[]=call&types[]=voicemail&types[]=fax&types[]=note&type_filter_last_item=0&is_archived=0';
  private readonly COMPANY_ID = '138829';
  private readonly MAX_FILE_SIZE = 600 * 1024;  // 600kb
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];



  private validateFile(file: File): boolean {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / 1024} KB limit`);
    }

    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} not supported. Allowed types: ${this.ALLOWED_FILE_TYPES.join(', ')}`);
    }

    return true;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `${error.status}\nMessage: ${error.message}`;

      // Specific 800.com error handling
      if (error.error?.error?.message) {
        errorMessage += `\n800.com Error: ${error.error.error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  sendMessage800(payload: any, file?: File): Observable<any> {
    try {
      // Validate inputs
      if (!payload.recipient) {
        throw new Error('Recipient is required');
      }

      const formData = new FormData();
      formData.append('sender', payload.sender);
      formData.append('recipient', payload.recipient);
      formData.append('message', payload.message);
      formData.append('company_id', this.COMPANY_ID);

      if (file) {
        this.validateFile(file);
        formData.append('media[0]', file);
      }

      const token = this.getSecureToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.post(this.API_URL, formData, {
        headers,
        reportProgress: true,
        observe: 'events'
      }).pipe(
        retry(3),
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getRecievedMsg() {
    const token = this.getSecureToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(this.receive_URL, { headers: headers });
  }

  private getSecureToken(): string {
    const token = `${environment.API_TOKEN}`;
    if (!token) {
      throw new Error('API token not configured');
    }
    return token;
  }

}
