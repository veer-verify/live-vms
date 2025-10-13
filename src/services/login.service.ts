import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private storageSer: StorageService,
    private datePipe: DatePipe
  ) { }

  login(payload: any): Observable<any> {
    let url = `${environment.login_url}/user_login_1_0`;
    let credentials = new Map();
    credentials.set('userName', payload?.userName);
    // credentials.set('password', btoa(JSON.stringify(payload?.password)));
    credentials.set('password', this.storageSer.encrypt(payload?.password));
    credentials.set('callingSystemDetail', 'vms');
    return this.http.post(url, Object.fromEntries(credentials));
  }

  manageUserSession(type: string): Observable<any> {
    let url = environment.login_url + `/manageUserSession_1_0`;
    var user = this.storageSer.getData('userData');
    let sessionId = JSON.parse(localStorage.getItem('sId')!);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let obj = new Map();
    obj.set('userName', user?.UserName);
    obj.set('UidToken', user?.UidToken);
    obj.set('type', type);
    obj.set('time', this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss', timezone));
    obj.set('timeZone', timezone);
    obj.set('createdBy', user?.UserId);
    obj.set('callingSystemDetail', 'portal');
    if (type === 'logOut') {
      obj.set('sessionId', sessionId);
    };

    let payload = Object.fromEntries(obj);
    return this.http.post(url, payload) ;
  }


  isLoggedin() {
    let user = this.storageSer.getData('userData');
    return user !== null ? true : false
  }

  getAccessforRefreshToken(payload: any): Observable<any> {
    let url = environment.login_url + '/getAccessforRefreshToken';
    let params = new HttpParams().set('refresh_token', payload?.RefreshToken).set('modifiedBy', payload?.UserId);
    return this.http.post(url, null, { params: params });
  }


}
