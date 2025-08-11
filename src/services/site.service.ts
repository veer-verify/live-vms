import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    private http: HttpClient,
    private storageSer: StorageService
  ) { }

  public getSites(payload?: any): any {
    let url  = `${environment.site_url}/getSitesListForUserName_1_0/`;
    let user = this.storageSer.getData('userData');
    let params = new HttpParams();

    params = params.set('userName', user?.UserName);
    params = params.set('siteStatus', 'Active');
    if(payload?.page) {
      params = params.set('page', payload?.page);
    }
    // if(payload?.siteStatus) {
    //   params = params.set('siteStatus', payload?.siteStatus);
    // }
    return this.http.get(url, {params: params});
  }

  public getCamerasForSiteId(payload: any): any {
    let url  = `${environment.site_url}/getCamerasForSiteId_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }

  getCamerasForForPortal(payload: any) {
    let url = environment.site_url + `/getCamerasForSiteIdForPortal_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }

  public getCamerasshortDetailsForSiteId(payload: any): any {
    let url  = `${environment.site_url}/getCameraShortDetailsForSiteId_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url,{params: params});
  }


  getUrl(data: any) {
    return this.http.get(data?.httpUrl);
  }

  createGuardMasterData(payload:any){
    let url=`${environment.guard_monitoring_url}/createGuardMasterData_1_0`;
    let user = this.storageSer.getData('userData');
    payload.createdBy=user?.UserId;

    return this.http.post(url,payload);
  }
  createGuardEmailsData(payload:any){

    let url=`${environment.guard_monitoring_url}/createGuardEmailsData_1_0`;
    let user = this.storageSer.getData('userData');
    payload.createdBy=user?.UserId;

    return this.http.post(url,payload);

  }

  updateMonitoringStatus_1_0(payload:any) {

    let url=`${environment.site_url}/updateMonitoringStatus_1_0`;

    const data=payload.map((item:any)=> ({cameraId:item.cameraId,monitoring:item.monitoring}));

    return this.http.put(url,{cameras:data});
  }



  getMonitoringStatus_cameras(payload:any) {

    let url=`${environment.site_url}/getMonitoringCameras_1_0`;

    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url,{params: params});
    
  }

  createCameraMonitoringHours_1_0(payload:any) {

    let url=`${environment.guard_monitoring_url}/createCameraMonitoringHours_1_0`;
    let user = this.storageSer.getData('userData');
    payload.createdBy=user?.UserId;

    return this.http.post(url,payload);
  }
  updateCameraMonitoringHours(payload:any){
    //  let url=`${environment.guard_monitoring_url}/updateCameraMonitoringHours_1_0`;
      let url=`http://192.168.0.103:3009/updateCameraMonitoringHours_1_0`;
    let user = this.storageSer.getData('userData');
    payload.modifiedBy=user?.UserId;

    return this.http.put(url,payload);
  }

  // getSiteCameraCountsForUserName(): any {
  //   let url  = `${environment.site_url}/getSiteCameraCountsForUserName_1_0`;
  //   let user = this.storageSer.getData('userData');
  //   let params = new HttpParams().set('username', user?.UserName);
  //   return this.http.get(url, {params: params});
  // }

  createActionTag(payload:any){
    let url=`${environment.guard_monitoring_url}/createActionTag_1_0`;
    let user = this.storageSer.getData('userData');
    payload.createdBy=user?.UserId;
    return this.http.post(url,payload);
  }

  getMonitoringHoursForSite(payload:any) {

    let url  = `${environment.guard_monitoring_url}/getMonitoringHoursForSite_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, {params: params});
  }
  getlistActionTags_1_0(payload:any) {
    let url  = `${environment.guard_monitoring_url}/listActionTags_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, {params: params});
  }

  getOverAllView(payload:any) {
    let url  = `${environment.guard_monitoring_url}/getMonitoringDetailsForSite_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, {params: params});
  }

  getTemplateData(payload:any) {
    let url  = `${environment.guard_monitoring_url}/listGuardMasterData_1_0`;
    let params = new HttpParams();

    if(payload?.siteId){
      params = params.set('siteId', payload?.siteId);
    }
    if( payload?.alertTypeId){
      params = params.set('alertTypeId', payload?.alertTypeId);
    }
    if( payload?.subTypeId){
      params = params.set('subTypeId', payload?.subTypeId);
    }
    return this.http.get(url, {params: params});
  }
  updateTemplate(payload:any){
    let url  = `${environment.guard_monitoring_url}/updateGuardMasterData_1_0`;
    let user = this.storageSer.getData('userData');
    payload.modifiedBy=user?.UserId;
    return this.http.put(url, payload);
  }

}
