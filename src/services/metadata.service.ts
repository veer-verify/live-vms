import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private http: HttpClient) { }

  getMetadata() {
    let url = `${environment.common_url}/getValuesListByType_1_0`;
    return this.http.get(url);
  }

  getMetadataByType(payload: any) {
    let url = `${environment.common_url}/getValuesListByType_1_0`;
    let params = new HttpParams().set('type', payload);
    return this.http.get(url, {params: params});
  }

  downloadFile(payload: any) {
    let url = `${environment.common_url}/downloadFile_1_0`;
    let params = new HttpParams();
    params = params.set('assetName', 'BarbeePharmacySuspiciousIncident.mp4');
    params = params.set('requestName', 'incidents');
    return this.http.get(url, {params: params});
  }

}
