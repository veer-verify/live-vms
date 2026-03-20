import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SiteService {

    cameras_sub: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private storageSer: StorageService,private datePipe: DatePipe) { }

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

    let url = `${environment.site_url}/getCamerasForSiteId_1_0/${payload}`;
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
      params = params.set('siteId', payload?.siteId);
    }
    return this.http.get(url, { params: params });
  }

  updateNVRDetails(payload: any) {
    let url = `${environment.guard_monitoring_url}/updateNVRDetails_1_0/${payload?.id}`;
    return this.http.put(url, payload);
  }

  addPlannedSiteActivity(payload: any) {
    let url = `${environment.guard_monitoring_url}/addPlannedSiteActivity_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    return this.http.post(url, payload);
  }

  updatePlannedSiteActivity(payload: any) {
    let url = `${environment.guard_monitoring_url}/updatePlannedSiteActivity_1_0`;
    let user = this.storageSer.getData('session');
    payload.modifiedBy = user?.UserId;
    return this.http.put(url, payload);
  }
  getPlannedSiteActivity(payload: any) {
    let url = `${environment.guard_monitoring_url}/getPlannedSiteActivity_1_0`;
    let params = new HttpParams();
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.status) {
      params = params.set('status', payload?.status);
    }
    return this.http.get(url, { params });
  }
  InActive_ActivityStatus(payload: any) {
    let url = `${environment.guard_monitoring_url}/inActivatePlannedSiteActivity_1_0`;

    let user = this.storageSer.getData('session');
    let params = new HttpParams();
    params = params.set('id', payload?.id);
    params = params.set('modifiedBy', user?.UserId);

    return this.http.delete(url, { params });
  }

  // site configuration



  addSiteMonitoringInfo(payload: any) {
    let url = `${environment.guard_monitoring_url}/addSiteMonitoringInfo_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    payload.siteId = payload.siteId;
    return this.http.post(url, payload);
  }

  getSiteMonitoringInfo(payload: any) {
    let url = `${environment.guard_monitoring_url}/getSiteMonitoringInfo_1_0`;
    let params = new HttpParams();
    params = params.set('siteId', payload?.siteId);

    return this.http.get(url, { params });
  }

  addSiteContact(payload: any) {

    let url = `${environment.guard_monitoring_url}/addContactDetails_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    payload.siteId = payload.siteId;
    return this.http.post(url, payload);
  }

  addSmsDetails(payload: any) {
    let url = `${environment.guard_monitoring_url}/addSmsDetails_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    payload.siteId = payload.siteId;
    return this.http.post(url, payload);
  }
  addlawenforce(payload: any) {
    let url = `${environment.guard_monitoring_url}/addLawEnforcementDetails_1_0`;
    let user = this.storageSer.getData('session');
    payload.createdBy = user?.UserId;
    payload.siteId = payload.siteId;
    return this.http.post(url, payload);
  }


  getSiteMonitoringInfoBySiteId(payload: any) {
    let url = `${environment.guard_monitoring_url}/getMonitoringEscalationInfoBySiteId_1_0`;
    let params = new HttpParams();
    params = params.set('siteId', payload?.siteId);
    return this.http.get(url, { params });
  }

  inactiveLawEnforcementInfo(payload: any) {
    let url = `${environment.guard_monitoring_url}/inactiveLawEnforcementInfo_1_0`;
    let user = this.storageSer.getData('session');
    let params = new HttpParams();
    params = params.set('modifiedBy', user?.UserId);
    params = params.set('id', payload?.lawEnforcementId);
    return this.http.put(url, null, { params });
  }
  inactiveSmsDetails(payload: any) {
    let url = `${environment.guard_monitoring_url}/inactiveSmsDetails_1_0`;
    let user = this.storageSer.getData('session');
    let params = new HttpParams();
    params = params.set('modifiedBy', user?.UserId);
    params = params.set('id', payload?.smsId);
    return this.http.put(url, null, { params });
  }
  inactiveContactDetails(payload: any) {

    let url = `${environment.guard_monitoring_url}/inactiveContactDetails_1_0`;
    let user = this.storageSer.getData('session');
    let params = new HttpParams();
    params = params.set('modifiedBy', user?.UserId);
    params = params.set('contactId', payload?.contactId);
    return this.http.put(url, null, { params });
  }

    getSiteFloorMapDetails(payload: any): Observable<any> {
    let url = `${environment.site_url}/getSiteFloorMapDetails_1_0`;
    let params = new HttpParams().set('siteId', payload);
    return this.http.get(url, { params });
  }


  // site configuration


  //mgmt client

  getCentralBoxForSiteId(payload: any) {
    let url = `${environment.site_url}/getCentralBox_1_0/${payload?.siteId}`;

    return this.http.get(url, payload)
  }


    getSitesListForUserName(payload?: any) {
    let url = `${environment.site_url}/getSitesListForUserName_2_0/`;
    let user = this.storageSer.getUser();

    let params = new HttpParams();

    if (user) {
      params = params.set('userName', user?.UserName);
    }

    if (payload?.siteStatus) {
      params = params.set('siteStatus', payload?.siteStatus);
    }

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    return this.http.get(url, ({ params: params }));
  }


  getEngineer(id: any) {
    let url = environment.site_url + '/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url);
  }

  getCentralbox(payload: any) {
    let url = `${environment.site_url}/getCentralBox_1_0/${payload.siteId}`;

        return this.http.get(url);
  }

    addCentralBox(payload: any) {
    let url = `${environment.site_url}/addCentralBox_1_0`;
    let user = this.storageSer.getUser();

    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

    listSiteServices(payload: any) {
    let url = `${environment.site_url}/listSiteServices_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, { params: params });
  }

  updateSiteServices(payload: any) {
    let url = `${environment.site_url}/updateSiteServices_1_0/${payload.siteId}`;
    return this.http.post(url, payload)
  }

    listSiteCheckList(payload: any) {
    let url = `${environment.site_url}/listSiteCheckList_1_0/`;
    let user = this.storageSer.getUser();

    let params = new HttpParams();
    params = params.set('userId', user?.UserId);

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if (payload?.validationChecklistId) {
      params = params.set('validationChecklistId', payload?.validationChecklistId);
    }
    return this.http.get(url, { params: params })
  }

    listSiteCheckListHistory(payload: any) {
    let url = `${environment.site_url}/listSiteCheckListHistory_1_0/`;
    let params = new HttpParams();
    if (payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if (payload?.validationChecklistId) {
      params = params.set('validationChecklistId', payload?.validationChecklistId);
    }
    return this.http.get(url, { params: params })
  }



  updateSiteCheckList(payload: any) {
    let url = `${environment.site_url}/updateSiteCheckList_1_0/`;
    let user = this.storageSer.getUser();
    let myObj = {
      "validationChecklistId": payload?.validationChecklistId,
      "deviceId": payload?.deviceId,
      "scope": payload?.scope,
      "configured": payload?.configured,
      "working": payload?.working,
      "remarks": payload?.remarks,
      "modifiedBy": user?.UserId

    }
    return this.http.put(url, myObj)
  }

    getValidationCheckList() {
    let url = `${environment.site_url}/getValidationCheckList_1_0/`;
    return this.http.get(url)
  }


    getValidationCheckListForCategory(payload: any) {
    let url = `${environment.site_url}/getValidationCheckList_1_0/`;
    let params = new HttpParams();
    if (payload?.name) {
      params = params.set('category', payload?.name);
    }
    // if(payload?.deviceId) {
    //   params = params.set('deviceId', payload?.deviceId);
    // }
    // if(payload?.validationChecklistId) {
    //   params = params.set('validationChecklistId', payload?.validationChecklistId);
    // }
    return this.http.get(url, { params: params })
  }

    listSupportAdminUsers() {
    let url = `${environment.login_url}/listSupportAdminUsers_1_0`;
    let params = new HttpParams();
    params = params.set('type', '35');
    return this.http.get(url, { params: params })
  }


  addSiteCheckList(payload: any) {
    let url = `${environment.site_url}/addSiteCheckList_1_0/`;
    return this.http.post(url, payload)
  }

    updateSiteCheckListFor(payload: any) {
    let url = `${environment.site_url}/updateSiteCheckList_1_0/`;
    let user = this.storageSer.getUser()

    return this.http.put(url, payload)
  }


   getSiteFullDetails(payload: any) {
    let url = `${environment.site_url}/getSiteFullDetails_1_0/${payload.siteId}`;
    return this.http.get(url)
  }

   gettimeZones() {
    return this.http.get("assets/JSON/timezones.json");
  }


  getCameraEventsConfigData(payload: any) {
    let url = `${environment.site_url}/getCameraEventsDataforSiteId_1_0`;
    let params = new HttpParams();
    params = params.set('siteId', payload);
    return this.http.get(url, { params: params });
  }

    updateCameraEventsConfigData(payload: any) {
    let url = `${environment.site_url}/updateCameraEventsConfigData_1_0/${payload?.cameraId}`;
    return this.http.put(url, payload)
  }

    updateSiteDetails(payload: any) {
    let url = `${environment.site_url}/updateSiteDetails_1_0/${payload.siteId}`;
    return this.http.put(url, payload)
  }

     updateCentralbox(payload:any){


     let url = `${environment.site_url}/updateCentralBox_1_0`;
     let user = this.storageSer.getUser();
     payload.modifiedBy = user?.UserId;
    payload.installationDate = this.datePipe.transform(
  payload.installationDate,
  'yyyy-MM-dd HH:mm:ss'

);

    return this.http.post(url,payload);

   }


     getS3BucketNames(){

    let url =`${environment.login_url}/getS3BucketNames_1_0`;

    return this.http.get(url);

  }
  creates3Defaultpath(payload:any){

    let url =`${environment.login_url}/addS3defaultPath_1_0`;
    let user = this.storageSer.getUser();
    // payload.createdBy = user?.UserId;
    return this.http.post(url,payload);

  }

    addCameraEventsConfigData(payload: any) {
    let url = `${environment.site_url}/addCameraEventsConfigData_1_0`;
    return this.http.post(url, payload)
  }

    getAccountData() {
    let url = `${environment.site_url}/getAccountData_1_0`
    return this.http.get(url)
  }

    createSite(payload: any) {
    let url = `${environment.site_url}/addSite_1_0`;
    let user = this.storageSer.getUser();

    payload.createdBy = user.UserId;
    return this.http.post(url, payload)
  }

    updateCamera(payload: any,payload1:any) {

    let url = `${environment.site_url}/updateCameraData_1_0/${payload1}`;
    // delete payload.httpUrl;
    return this.http.put(url, payload)
  }


  getCamerasforunitId(payload:any){

    let url=`${environment.site_url}/getCamerasForUnitId_1_0`;
    let params = new HttpParams();
    params = params.set('siteId', payload?.siteId);
    params = params.set('unitId', payload?.unitId);
    return this.http.get(url,{params});
  }

  migrateCentralbox(payload:any){

    let url =`${environment.site_url}/replaceCentralBox_1_0`;
    let user = this.storageSer.getUser();
    payload.createdBy = user?.UserId;
    return this.http.post(url,payload);

  }

    createCamera(payload: any) {
    let url = `${environment.site_url}/addCamera_1_0`;
    return this.http.post(url, payload)
  }

    //mgmt client
}
