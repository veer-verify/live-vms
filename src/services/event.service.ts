import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
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
}
