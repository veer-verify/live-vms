import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(
    private http: HttpClient,
    private storageSer: StorageService
  ) { }

  login(payload: any): Observable<any> {
    let url = `${environment.login_url}/user_login_1_0`;
    let credentials = new Map();
    credentials.set('userName', payload?.userName);
    credentials.set('password', btoa(JSON.stringify(payload?.password)));
    credentials.set('callingSystemDetail', 'vms');
    return this.http.post(url, Object.fromEntries(credentials));
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
