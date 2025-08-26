import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
     private storageSer: StorageService
  ) { }

  getDispatchData() {
    let url = `${environment.events_url}/get_dispatch_queue_data_1_0/`;
    let params = new HttpParams().set('queue_name', 'dispatch-queue');
    return this.http.get(url, {params: params})
  }

  write2Dispatch(payload: any) {
    let url = `${environment.events_url}/write2Dispatch_queue_data_1_0/`;
    let obj = {
      cameraId: payload?.cameraId,
      color: payload?.color,
      id: payload?.id,
      timestamp: payload?.dspTime,
      queue_name: "dispatch-queue",
      siteId: payload?.siteId
    }
    return this.http.post(url, obj);
  }

  updateEventFullDetails(payload:any){
    console.log(payload)

    let url = `${environment.events_url}/updateEventFullDetails_1_0/`;
    let user = this.storageSer.getData('userData');

      let obj = {
      siteName: payload?.siteName,
      siteId: payload?.siteId,
      objectName: 'string',
      cameraId: payload?.cameraId,
      eventTag: 'string',
      eventStartTime: 'string',
      actionTag: 'string',
      userLevels: 'string',
      falseActivityTime: 'string',
      activityDetTime: 'string',
      suspiciousTime: 'string',
      callResponseTime: 'string',
      callNoResponseTime: 'string',
      emailTime: 'string',
      eventEndtime: 'string',
      httpUrl: 'string',
      videoFile: 'string',
      createdTime:"",
      createdBy: user?.UserId,
      remarks: 'string',
      landingTime: 'string',
    };
  
  
    return this.http.post(url, obj);

  }
}
