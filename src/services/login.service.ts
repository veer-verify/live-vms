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
    private datePipe: DatePipe,
    private router: Router
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

  logout() {
    this.storageSer.clearData();
    this.router.navigate(['./login']);
  }

  manageUserSession(type: string): Observable<any> {
    let url = environment.login_url + `/manageUserSession_1_0`;
    let  session = this.storageSer.getData('session');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let obj = new Map();
    obj.set('userName', session?.UserName);
    obj.set('UidToken', session?.UidToken);
    obj.set('type', type);
    obj.set('time', this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss', timezone));
    obj.set('timeZone', timezone);
    obj.set('createdBy', session?.UserId);
    obj.set('callingSystemDetail', 'portal');
    if (type === 'logOut') {
      obj.set('sessionId', session?.sessionId);
    };

    let payload = Object.fromEntries(obj);
    return this.http.post(url, payload);
  }


  isLoggedin() {
    let user = this.storageSer.getUser();
    return user !== null ? true : false
  }

  getAccessforRefreshToken(payload: any): Observable<any> {
    let url = environment.login_url + '/getAccessforRefreshToken';
    let params = new HttpParams().set('refresh_token', payload?.RefreshToken).set('modifiedBy', payload?.UserId);
    return this.http.post(url, null, { params: params });
  }


}
