import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MetadataService } from './metadata.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly key = "verifai";
  environment = environment;

  metadat_sub: any = [];
  status_text!: string;
  show_loader: boolean = false;

  constructor() { }

  weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  public saveData(name: any, data: any) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  public getData(data: any) {
    return JSON.parse(localStorage.getItem(data)!);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  public decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

  public getAlertTypes() {
    return this.metadat_sub.filter((item: any) => item.type === 98).map((el: any) => el.metadata)
  }

  public getSubAlertTypes() {
    return this.metadat_sub.filter((item: any) => item.type === 99).map((el: any) => el.metadata)
  }

  public isSuperAdmin(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('SuperAdmin') ? true : false;
  }

  public isAdmin(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Admin') ? true : false;
  }

  public isFirstLevel(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Member-1st-Level') ? true : false;
  }

  public isSecondLevel(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('TeamLead-2nd-Level') ? true : false;
  }

  public isThirdLevel(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Dispatch-3rd-Level') ? true : false;
  }

  public isUser(): boolean {
    const user = this.getData('userData');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.department);
    return (a.includes('Client') || a.includes('Site')) ? true : false;
  }

}
