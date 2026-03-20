import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { formatDate } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdvertisementsService {

  constructor(private http:HttpClient,
    private storageSer: StorageService
  ) { }

  public ruleForDevice: BehaviorSubject<any> = new BehaviorSubject('');
  public addIdSub: BehaviorSubject<any> = new BehaviorSubject('');
  public addNameSub: BehaviorSubject<any> = new BehaviorSubject('');
  public deviceId: BehaviorSubject<any> = new BehaviorSubject('');
  public itemName = new BehaviorSubject<string>('')


getSites(payload:any){

  let url = `${environment.faqUrl}/ListDevicesForSiteId_1_0`;
  let params = new HttpParams();
  if(payload) {
    params = params.set('siteId', payload);
  }
 return this.http.get(url,{params:params})
}
getSiteslist(){

  let url = `${environment.faqUrl}/ListDevicesForSiteId_1_0`;

 return this.http.get(url)
}

  listofDeviceInfo(){

    let url=`${environment.adsUrl}/getSitesForAgent_1_0`;
    return this.http.get(url);
  }

   listIssueInfo(payload?: any) {


    // let url = `${environment.faqUrl}/listIssueInfo_v_1_0`;
    let url = `${environment.faqUrl}/listIssueInfo_1_0`;
    let params = new HttpParams();
    if(payload?.Category) {
      params = params.set('category', payload?.Category);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }

    if(payload?.subcategoryId) {
      params = params.set('subCategory', payload?.subcategoryId);
    }
    if(payload?.toDate) {
      params = params.set('toDate',formatDate(payload?.toDate, 'yyyy-MM-dd','en-us') );
    }
    if(payload?.fromDate) {
      params = params.set('fromDate', formatDate(payload?.fromDate, 'yyyy-MM-dd','en-us') );
    }
    if(payload?.siteId) {
      params = params.set('siteId',payload?.siteId);
    }




    return this.http.get(url, {params: params})
   }
   createIssueForFaq(payload: any, file: any) {
    // let url = `${environment.faqUrl}/createIssueForFaq_v_2_0`;
    let url = `${environment.faqUrl}/createIssueForFaq_1_0`;
  let user = this.storageSer.getUser();
    let formData: any = new FormData();
    if(file){
      formData.append('issueAttachment', file);
    }

    let issueDetails = {
      'issueCategoryId': payload?.issueCategoryId,
      'issueSubCategoryId': payload?.issueSubCategoryId,
      'dateOfEffected': formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'issueName' :payload?.issueName,
      'issueDescription':payload?.issueDescription,
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('issueDetails', JSON.stringify(issueDetails));
    return this.http.post(url, formData);
  }

  category() {
    // let url = 'http://usstaging.ivisecurity.com:8925/generic/categoryList_1_0';
    let url = `${environment.genericUrl}/categoryList_1_0`;
    return this.http.get(url);
  }

  updateIssue(payload:any, payload1:any) {
  let user = this.storageSer.getUser();
    // let url = `${environment.faqUrl}/updateIssue_v_2_0`;
    let url = `${environment.faqUrl}/updateIssue_1_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    let formData: any = new FormData();
    if(payload1){
      formData.append('UpadateAttachment', payload1);
    }

    let issueDetails = {
      'issueCategoryId': payload?.issueCategoryId,
      'issueSubCategoryId': payload?.issueSubCategoryId,
      'issueStatus': payload?.issueStatus,
      'dateOfEffected': payload?.dateOfEffected ? formatDate(payload?.dateOfEffected, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'issueName' :payload?.issueName,
      'issueDescription':payload?.issueDescription,
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('issueDetails', JSON.stringify(issueDetails));
    return this.http.put(url, formData,{params:params})
   }


   delete(payload:any) {
    // let url = `${environment.faqUrl}/updateIssue_v_2_0`;
    let url = `${environment.faqUrl}/updateIssue_1_0`;
    let user = this.storageSer.getUser();
    let formData: any = new FormData();
   let issueDetails = {

    'issueStatus': 6
   }
   formData.append('issueDetails', JSON.stringify(issueDetails));
   let params = new HttpParams();
   if(payload?.issueId) {
     params = params.set('issueId', payload?.issueId);
   }
   return this.http.put(url, formData,{params:params})
  }

  listCommentsForIssueId(payload:any) {
     let user = this.storageSer.getUser();
    // let url = `${environment.faqUrl}/listCommentsForIssueId_v_2_0`;
    let url = `${environment.faqUrl}/listCommentsForIssueId_1_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    return this.http.get(url, {params:params})
  }

  listApproachesForIssueId(payload:any) {
   let user = this.storageSer.getUser();
    // let url = `${environment.faqUrl}/listapproachesForIssueId_v_2_0`;
    let url = `${environment.faqUrl}/listapproachesForIssueId_1_0`;
    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    return this.http.get(url, {params:params})
  }

  listDevicesForIssueId(payload:any) {
    let url = `${environment.faqUrl}/listDevicesForIssueId_1_0`;

    let params = new HttpParams();
    if(payload?.issueId) {
      params = params.set('issueId', payload?.issueId);
    }
    return this.http.get(url, {params:params})
  }

  addDevicesforIssueId(payload:any){
    // console.log(payload)
    let url = `${environment.faqUrl}/addDeviceIdForissueId_1_0`;
    let user = this.storageSer.getUser();
    let tempDevice ={
      deviceId:payload.deviceId,
      issueId :payload.issueId,
      dateOfEffected:payload.date,
      remarks:payload.remarks,
      createdBy:user?.UserId,
      siteId:payload.siteId
    }

    return this.http.post(url,tempDevice)


  }


  addCommentForIssue(payload:any) {
    // let url = `${environment.faqUrl}/addCommentForIssue_v_2_0`;
    let url = `${environment.faqUrl}/addCommentForIssue_1_0`;
    return this.http.post(url,payload)
   }
   addApproachForIssue(payload:any) {
    // let url = `${environment.faqUrl}/addapproachForIssue_v_2_0`;
    let url = `${environment.faqUrl}/addapproachForIssue_1_0`;
    return this.http.post(url,payload)
   }

   EditApproachforIssue(payload:any){
    let url= `${environment.faqUrl}/updateApproachForIssueId_1_0`;
    return this.http.put(url,payload)
}

createSensorDevice(payload:any) {
  let user = this.storageSer.getUser();
  // let url = this.sensorUrl + '/linkSensorDeviceIdToSiteId_1_0'
  let url =`${environment.sensorUrl}/linkSensorDeviceIdToSiteId_1_0`;
  return this.http.post(url,payload)
 }

 listSensorDeviceDetails(payload?: any) {
    let user = this.storageSer.getUser();
  // console.log(payload)
  // let url = this.sensorUrl + '/listSensorDeviceDetails_1_0'
  let url = `${environment.sensorUrl}/listSensorDeviceDetails_1_0`;
  let params = new HttpParams();

    params = params.set('userId', user?.UserId);


  if(payload?.siteId && payload?.siteId !== 'All') {
    params = params.set('siteId', payload?.siteId);
  }
  if(payload?.zoneId && payload?.zoneId !== 'All') {
    params = params.set('zoneId', payload?.zoneId);
  }
  if(payload?.sensorDeviceId && payload?.sensorDeviceId !== 'All') {
    params = params.set('sensorDeviceId', payload?.sensorDeviceId);
  }
  return this.http.get(url, {params: params})
 }

 updateSensorDevice(payload:any) {
  let user = this.storageSer.getUser();
  // let url = this.sensorUrl + '/updateSensorDevice_1_0'
  let url =`${environment.sensorUrl}/updateSensorDevice_1_0`;
  return this.http.put(url,payload)
 }

 unmapSensorDevice(payload:any) {
  // console.log(payload)
  //  let url = this.sensorUrl + '/unmapSensorDeviceFromSite_1_0'
  let url = `${environment.sensorUrl}/unmapSensorDeviceFromSite_1_0`;
  let user = this.storageSer.getUser();
  let params = new HttpParams();
  if(payload?.sensorDeviceId) {
    params = params.set('SensorDeviceId', payload?.sensorDeviceId);
  }
  return this.http.post(url, null, {params:params})
}


listZonesForSiteId(payload?: any) {
  // let url = this.sensorUrl + '/listZonesForSiteId_1_0'
  let url = `${environment.sensorUrl}/listZonesForSiteId_1_0`;
  let params = new HttpParams();
  if(payload?.siteId && payload?.siteId !== 'All') {
    params = params.set('siteId', payload.siteId)
  }
  return this.http.get(url, {params: params});
}


listSensorDevices(payload?:any) {
  let url = `${environment.sensorUrl}/ListSensorDevicesForSiteId_1_0`;
  let params = new HttpParams();
  if(payload?.siteId && payload?.siteId != 'All') {
    params = params.set('siteId', payload?.siteId)
  }
  if(payload?.zoneId && payload?.zoneId != 'All') {
    params = params.set('zoneId', payload?.zoneId);
  }
  return this.http.get(url, {params: params});
}

linkZoneIdToSiteId(payload:any) {
  let user = this.storageSer.getUser();
  let url =`${environment.sensorUrl}/linkZoneIdToSiteId_1_0`;
  return this.http.post(url,payload)
 }

 listAvailableZones() {
  let url = `${environment.sensorUrl}/listAvailableZones_1_0`;
  return this.http.get(url);
}
createZone(payload:any) {
  // let url = this.sensorUrl + '/createZone_1_0'
  let url = `${environment.sensorUrl}/createZone_1_0`;
   let user = this.storageSer.getUser();
  payload.createdBy = user?.UserId;
  return this.http.post(url,payload)
 }

// listZonesForSiteId() {
//   let url = `${environment.adsUrl2}/listAvailableZones_1_0`;
//   return this.http.get(url);
// }



   createDevice(payload:any) {
    let url = environment.adsUrl + '/createDevice_1_0';
    return this.http.post(url,payload)
   }

   listDeviceInfo(payload?: any) {
    let url = environment.adsUrl + '/listDeviceInfo_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }

    if(payload?.deviceTypeId) {
      params = params.set('deviceTypeId', payload?.deviceTypeId);
    }

    return this.http.get(url, {params: params})
   }

   updateDeviceInfo(payload:any) {
  let user = this.storageSer.getUser();
    let url = environment.adsUrl + '/updateDeviceInfo_1_0';
    return this.http.put(url, payload)
   }

   deleteDevice(payload:any) {
  let user = this.storageSer.getUser();
    let url = environment.adsUrl + '/deleteDevice_1_0';
    let myObj = {
      'deviceId': payload?.deviceId,
      'modifiedBy': user?.UserId
    }
    return this.http.delete(url, {body:myObj})
   }

   updateRebootDevice(id: any) {
    let url = environment.adsUrl + '/flipRebootDevice_1_0';
    const params = new HttpParams().set('deviceId', id.toString()).set('modifiedBy', 1);

    return this.http.put(url, null, { params: params });
  }



  createAd(payload: any, file: any) {
    // console.log(payload);
    let url = environment.adsUrl + "/createAd_1_0";
  let user = this.storageSer.getUser();

    let formData: any = new FormData();
    formData.append('adFile', file);
    let assetData = {
      'deviceId': payload?.deviceId,
      'adName': payload?.adName,
      'fromDate': payload?.fromDate ? formatDate(payload?.fromDate, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'toDate': payload?.toDate ? formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-us') : '2999-12-31',
      'createdBy': user?.UserId,
      'remarks': payload?.remarks
    }
    formData.append('adDetails', JSON.stringify(assetData));
    return this.http.post(url, formData);
  }


  // emailUrl = environenvironment.adsUrl;

  postMail(payload:any, file:any) {
    // console.log(payload)
  let user = this.storageSer.getUser();
    let url = `${environment.genericUrl}/send_report_email_1_0`;

    let formData = new FormData();

    formData.append('recipientEmails',payload.recipientEmails),
    formData.append('Bcc', payload.Bcc ?? ''),
    formData.append('Cc', payload.Cc ?? ''),
    formData.append('name', payload.name),
    formData.append('subject', payload.subject),
    formData.append('body', payload.body),
    formData.append('fileName', payload.fileName),
    formData.append('footer', 'Thanks & regards.'),
    formData.append('createdBy', user?.UserId),
    formData.append('regardsFrom', payload.regardsFrom),
    formData.append('files', file);
    return this.http.post(url, formData);
  }

  listAdsInfo(payload?: any) {
    let url = environment.adsUrl + '/listAdsAndRules_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if(payload?.fromDate) {
      params = params.set('fromDate', formatDate(payload?.fromDate, 'yyyy-MM-dd', 'en-us'));
    }
    if(payload?.toDate) {
      params = params.set('toDate', formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-us'));
    }
    if(payload?.adName) {
      params = params.set('adName', payload?.adName);
    }
    return this.http.get(url, {params: params})
  }

  updateAd(payload:any) {
  let user = this.storageSer.getUser();
    let url = environment.adsUrl + '/updateAd_1_0';
    return this.http.put(url, payload)
   }

   user:any
   deleteAd(payload:any) {
     let url = `${environment.faqUrl}/updateIssue_v_2_0`;
     let user = this.storageSer.getUser();
    let myObj = {
      issueId: payload?.issueId,
      issueStatus: 5
    }
    return this.http.delete(url, {body:myObj})
   }

   createRule(payload:any) {
    let url = environment.adsUrl + '/createRule_1_0';
    return this.http.post(url,payload)
   }


   getSitesData(payload?:any) {
    let url = environment.genericUrl + '/allSitesInfo_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if(payload?.timeZone) {
      params = params.set('timeZone', payload?.timeZone);
    }
    if(payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }
    return this.http.get(url, {params: params})
   }




  //  Rushika Apis








}
