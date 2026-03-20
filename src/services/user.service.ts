import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  can_getdata: any = new EventEmitter();
  error$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageSer: StorageService
  ) { }

  loginNew(payload: any) {
    let url = environment.login_url + `/user_login_1_0`;
    let credentials = new Map();
    credentials.set('userName', payload?.userName);
    credentials.set('password', this.storageSer.encrypt(payload?.password));
    // credentials.set('password', payload?.password);
    credentials.set('callingSystemDetail', 'mgmt');
    return this.http.post(url, Object.fromEntries(credentials));
  }

  logout() {
    this.router.navigate(['./login']);
  }

  getAuthStatus() {
    let user = this.storageSer.getUser();
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error-page');
  }

  listUsers(userId?: number) {
    let url = environment.login_url + '/listUsers_1_0';
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId)
    }
    return this.http.get(url, {params: params});
  }

  listUsersByRole() {
    let url = environment.login_url + '/listUsersByRole_1_0';
    let params = new HttpParams().set('roleId', 30);
    return this.http.get(url, { params: params });
  }

  createUser(payload: any) {
    let url = `${environment.login_url}/createUser_1_0`;
    var user: any = this.storageSer.getUser();
    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  getUserInfoForUserId(payload: any) {
    var user: any = this.storageSer.getUser();
    let url = `${environment.login_url}/getUserInfoForUserId_1_0/${payload?.userId}`;
    return this.http.get(url);
  }

  updateUser(payload: any) {
    let url = `${environment.login_url}/updateUser_1_0/${payload?.userId}`;

    return this.http.put(url, payload);
  }

  deleteUser(payload: any) {
    let url = `${environment.login_url}/deactivateUser_1_0/${payload?.user_id}`;
    return this.http.post(url, null);
  }

  applySitesMapping(payload: any) {
    let url = `${environment.login_url}/applySitesMapping_1_0`;
    return this.http.post(url, payload);
  }

  unassignSiteForUser(payload: any) {
    let url = `${environment.login_url}/unassignSiteForUser_1_0`;
    return this.http.post(url, payload);
  }

  getSiteUserDetails(payload: any) {
    let url = `${environment.login_url}/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    return this.http.get(url);
  }

  // getSitesListforUser(payload: any) {
  //   var user: any = this.storageSer.get('user');
  //   let url = `${this.baseUrl}/getSitesListforUser_1_0/${payload?.userId}`;
  //   return this.http.get(url);
  // }

  // getSitesListForUserName(payload: any) {
  //   let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
  //   let params = new HttpParams().set('userName', payload?.UserName);
  //   return this.http.get(url, {params: params});
  // };


  get_roles(payload: any) {
    let url = `${environment.login_url}/getRolesByUserId_1_0`;
    let params = new HttpParams()
    if (payload.UserId) {
      params = params.set('userId', payload.UserId)
    }
    if (payload.roleId) {
      params = params.set('roleId', payload.roleId)
    }
    // if(payload.deptId){
    //   params = params.set('deptId', payload.deptId)
    // }
    return this.http.get(url, { params: params })
  }

  getSitesListForGlobalAccountId(payload: any) {
    let url = environment.login_url + '/getSitesListForGlobalAccountId_1_0/';
    // var user = this.storageService.get('user');
    let params = new HttpParams();
    if (payload?.userId) {
      params = params.set('userId', payload?.userId)
    }
    if (payload?.loginId) {
      params = params.set('loginId', payload?.loginId)
    }
    if (payload?.assigned !== null) {
      params = params.set('assigned', payload?.assigned)
    }
    params = params.set('callingSystemDetail', 'mgmt')
    return this.http.get(url, { params: params });
  }

  getAccessforRefreshToken(payload: any): Observable<any> {
    let url = environment.login_url + '/getAccessforRefreshToken';
    let params = new HttpParams().set('refresh_token', payload?.RefreshToken).set('modifiedBy', payload?.UserId);
    return this.http.post(url, null, { params: params });
  }


  createUserWithShortDetails(payload: any) {
    let url = `${environment.login_url}/createUserWithShortDetails_1_0`;
    // var user: any = this.storageSer.get('user');
    // payload.accountId = user?.accountId ?? 0;
    // payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  userDetailslistRoles_1_0() {
    let url = `${environment.login_url}/listRoles_1_0`;
    return this.http.get(url);
  }

  getDepartments(payload?: any) {
    let url = `${environment.login_url}/getDepartments_1_0`;
    let params = new HttpParams();
    if (payload) {
      params = params.set('department', payload)
    }

    return this.http.get(url, { params: params });
  }

  getPasswordbyUser(payload:any){

    let url = `${environment.login_url}/getPassword_1_0`;
    let params = new HttpParams();
    if (payload) {
      params = params.set('userName', payload.User_Name);
    }

    return this.http.get(url, { params: params });

  }

}
