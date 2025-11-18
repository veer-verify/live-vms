import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient, private storageSer: StorageService) { }

  public getSites(payload?: any): any {
    let url = `${environment.site_url}/getSitesListForUserName_2_0/`;

    let user = this.storageSer.getData('session');
    let params = new HttpParams();

    params = params.set('userName', user?.UserName);
    params = params.set('siteStatus', 'Active');
    params = params.set('monitoring', 'True');

    if (payload?.page && !payload?.search) {
      params = params.set('page', payload?.page);
    }
    if (payload?.search) {
      params = params.set('search', payload?.search);
    }

    return this.http.get(url, { params: params });
  }

  public getCamerasForSiteId(payload: any): any {
    let url = `${environment.site_url}/getCamerasForSiteId_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }

  getCamerasForForPortal(payload: any) {
    let url =
      environment.site_url +
      `/getCamerasForSiteIdForPortal_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }

  getLiveCams(payload: any) {
    let url = `${environment.site_url}/getLiveInfoForSiteAndCamera_1_0`;
    let params = new HttpParams();

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.cameraId && payload.liveControl == 1) {
      params = params.set('cameraId', payload?.cameraId);
    }

    return this.http.get(url, { params });
  }

  public getCamerasshortDetailsForSiteId(payload: any): any {
    let url = `${environment.site_url}/getCameraShortDetailsForSiteId_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, { params: params });
  }

  getUrl(data: any) {
    return this.http.get(data?.httpUrl);
  }

  createGuardEmailsData(payload: any) {
    let url = `${environment.guard_monitoring_url}/createGuardEmailsData_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;

    return this.http.post(url, payload);
  }

  updateMonitoringStatus_1_0(payload: any) {
    let url = `${environment.site_url}/updateMonitoringStatus_1_0`;

    const data = payload.map((item: any) => ({
      cameraId: item.cameraId,
      monitoring: item.monitoring,
    }));

    return this.http.put(url, { cameras: data });
  }

  getMonitoringStatus_cameras(payload: any) {
    let url = `${environment.site_url}/getMonitoringCameras_1_0`;

    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, { params: params });
  }

  createCameraMonitoringHours_1_0(payload: any) {
    let url = `${environment.guard_monitoring_url}/createCameraMonitoringHours_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;

    return this.http.post(url, payload);
  }
  updateCameraMonitoringHours(payload: any) {
    let url = `${environment.guard_monitoring_url}/updateCameraMonitoringHours_1_0`;

    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;

    return this.http.put(url, payload);
  }

  // getSiteCameraCountsForUserName(): any {
  //   let url  = `${environment.site_url}/getSiteCameraCountsForUserName_1_0`;
  //   let user = this.storageSer.getData('session');
  //   let params = new HttpParams().set('username', user?.UserName);
  //   return this.http.get(url, {params: params});
  // }

  createActionTag(payload: any) {
    let url = `${environment.guard_monitoring_url}/createActionTag_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    return this.http.post(url, payload);
  }

  getMonitoringHoursForSite(payload: any) {
    let url = `${environment.guard_monitoring_url}/getMonitoringHoursForSite_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, { params: params });
  }
  getlistActionTags_1_0(payload: any) {
    let url = `${environment.guard_monitoring_url}/listActionTags_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, { params: params });
  }

  getOverAllView(payload: any) {
    let url = `${environment.guard_monitoring_url}/getMonitoringDetailsForSite_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, { params: params });
  }

  getTemplateData(payload: any) {
    let url = `${environment.guard_monitoring_url}/listGuardMasterData_1_0`;
    let params = new HttpParams();

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.alertTypeId) {
      params = params.set('alertTypeId', payload?.alertTypeId);
    }

    params = params.set('active', 'T');

    if (payload?.subTypeId) {
      params = params.set('subTypeId', payload?.subTypeId);
    }
    return this.http.get(url, { params: params });
  }
  // listtemplatemasterdata

  createGuardMasterData(payload: any) {
    let url = `${environment.guard_monitoring_url}/createMasterTemplateData_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;

    return this.http.post(url, payload);
  }

  listTemplatesData(payload: any) {
    let url = `${environment.guard_monitoring_url}/listMasterTemplatesData_1_0`;
    let params = new HttpParams();

    if (payload?.alertTypeId) {
      params = params.set('alertTypeId', payload?.alertTypeId);
    }
    if (payload?.subTypeId) {
      params = params.set('subTypeId', payload?.subTypeId);
    }
    return this.http.get(url, { params: params });
  }

  updateTemplate(payload: any) {
    let url = `${environment.guard_monitoring_url}/updateGuardMasterData_1_0`;
    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    return this.http.put(url, payload);
  }

  createTemplateSiteRlsp(payload: any) {
    let url = `${environment.guard_monitoring_url}/createTemplateSiteRlsp_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    return this.http.post(url, payload);
  }

  deleteoverallTemplate(payload: any) {
    let url = `${environment.guard_monitoring_url}/deleteMasterTemplateData_1_0`;
    let params = new HttpParams();
    params = params.set('guardMasterId', payload?.guardMasterId);

    // let user = this.storageSer.getData('session');
    // payload.modifiedBy = user?.UserId;
    // params = params.set('modifiedBy', payload?.modifiedBy);
    return this.http.delete(url, { params });
  }

  updatemasterTemplate(payload: any) {
    let url = `${environment.guard_monitoring_url}/updateMasterTemplate_1_0`;
    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    return this.http.put(url, payload);
  }

  getAlertCategoriesForSiteId(payload: any) {
    let url = `${environment.guard_monitoring_url}/getAlertCategoriesForSiteId_1_0`;
    let params = new HttpParams();

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }

    return this.http.get(url, { params });
  }

  deleteMonitoringhoursforSite(payload: any) {
    let url = `${environment.guard_monitoring_url}/deleteMonitoringHoursForSiteId_1_0`;
    let params = new HttpParams();

    if (payload) {
      params = params.set('siteId', payload);
    }
    return this.http.delete(url, { params });
  }

  deletetemplate(payload: any) {
    let url = `${environment.guard_monitoring_url}/inactiveTemplateForSiteId_1_0`;
    let params = new HttpParams();

    if (payload) {
      params = params.set('siteId', payload?.siteId);
      params = params.set('guardMasterId', payload?.guardMasterId);
    }
    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    params = params.set('modifiedBy', payload?.modifiedBy);

    return this.http.delete(url, { params });
  }

  deleteEmails(payload: any) {
    let url = `${environment.guard_monitoring_url}/inactiveGuardEmailsDataForSiteId_1_0`;
    let params = new HttpParams();

    if (payload) {
      params = params.set('siteId', payload?.siteId);
      params = params.set('guardSiteEmailId', payload?.guardSiteEmailId);
    }
    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    params = params.set('modifiedBy', payload?.modifiedBy);

    return this.http.delete(url, { params });
  }

  nvrList(payload: any) {
    let url = `${environment.guard_monitoring_url}/NVRList_1_0`;
    let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    return this.http.get(url, { params: params });
  }

  updateNVRDetails(payload: any) {
    let url = `${environment.guard_monitoring_url}/updateNVRDetails_1_0/${payload?.id}`;
    return this.http.put(url, payload);
  }

  addPlannedSiteActivity(payload:any){
    let url=`${environment.guard_monitoring_url}/addPlannedSiteActivity_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    return this.http.post(url, payload);

  }

  updatePlannedSiteActivity(payload:any){
    let url=`${environment.guard_monitoring_url}/updatePlannedSiteActivity_1_0`;
     let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    return this.http.put(url, payload);
  }
  getPlannedSiteActivity(payload:any){
      let url=`${environment.guard_monitoring_url}/getPlannedSiteActivity_1_0`;
       let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    if (payload?.status) {
      params = params.set('status', payload?.status)
    }
     return this.http.get(url,{params});
  }
InActive_ActivityStatus(payload:any){

  let url=`${environment.guard_monitoring_url}/inActivatePlannedSiteActivity_1_0`;

   let user = this.storageSer.getData('session');
      let params = new HttpParams();
      params = params.set('id', payload?.id);
      params = params.set('modifiedBy', user?.UserId);

  return this.http.delete(url,{params});
}


  }
