import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map } from 'rxjs';
import { LoginService } from './login.service';
import { DatePipe } from '@angular/common';
import CryptoJS from 'crypto-js';
import moment from 'moment-timezone';


@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private readonly key = "verifai";
  environment = environment;

  getFile(file: string) {
    return `assets/themes/${environment.env}/${file}`;
  }

  isEnabled: boolean = false;



  session_sub: BehaviorSubject<any> = new BehaviorSubject(null);
  metadat_sub: any = [];
  events_sub: BehaviorSubject<any> = new BehaviorSubject(0);
  status_text!: string;
  show_loader: boolean = false;

  weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  private date_pipe = inject(DatePipe);
  getTimeWithTimezone(timezone: string, options?: any): any {
    // const formatter = new Intl.DateTimeFormat([], {
    //   timeZone: timezone,
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    // });
    // const date = formatter.format(options?.time ? new Date(options?.time) : new Date());
    // return this.date_pipe.transform(date, options?.format === 12 ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd HH:mm:ss');
    // if(options?.format === 12) {
    //   return moment().tz(timezone).format('YYYY-MM-DD hh:mm:ss')
    // } else {
    //   return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
    // }
    return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  }

    getTimeWithTime(timezone: string, options?: any): any {

    // return moment().tz(timezone).format('HH:mm:ss');

      return interval(1000).pipe(
    map(() => moment().tz(timezone).format('HH:mm:ss'))
  );


  }

  getDay(timezone: string) {
    return moment().tz(timezone).day();
  }

  getHour(timezone: string) {
    return moment().tz(timezone).hours();
  }

  public saveData(name: any, data: any) {
    sessionStorage.setItem(name, JSON.stringify(data));
  }

  public getData(data: any) {
    return JSON.parse(sessionStorage.getItem(data)!);
  }

  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
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


  /** level of users */

  router = inject(Router);
  login_service = inject(LoginService);

  public getUser(): any {
    return this.getData('session');
  }

  public isSuperAdmin(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('SuperAdmin') ? true : false;
  }

  public isAdmin(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Admin') ? true : false;
  }

  public isUser(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.department);
    return (a.includes('Client') || a.includes('Site')) ? true : false;
  }

  public isFirstLevel(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Member-1st-Level') ? true : false;
  }

  public isSecondLevel(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('TeamLead-2nd-Level') ? true : false;
  }

  public isThirdLevel(): boolean {
    let user = this.getData('session');
    let a: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    return a.includes('Dispatch-3rd-Level') ? true : false;
  }

   timeZoneCountryList = [
  { timeZone: "Asia/Kolkata", countryCode: "IN" },
  { timeZone: "Asia/Tokyo", countryCode: "JP" },
  { timeZone: "Asia/Dubai", countryCode: "AE" },
  { timeZone: "Europe/London", countryCode: "GB" },
  { timeZone: "Europe/Paris", countryCode: "FR" },
  { timeZone: "Europe/Berlin", countryCode: "DE" },
  { timeZone: "America/New_York", countryCode: "US" },
  { timeZone: "America/Chicago", countryCode: "US" },
  { timeZone: "America/Denver", countryCode: "US" },
  { timeZone: "America/Los_Angeles", countryCode: "US" },
  { timeZone: "America/Toronto", countryCode: "CA" },
  { timeZone: "Australia/Sydney", countryCode: "AU" },
  { timeZone: "Australia/Melbourne", countryCode: "AU" },
  { timeZone: "Australia/Canberra", countryCode: "AU" },
  { timeZone: "Africa/Johannesburg", countryCode: "ZA" },
  { timeZone: "Asia/Singapore", countryCode: "SG" }
];


 public getCountry = (zone:any) => {
  return this.timeZoneCountryList.find((item) => item.timeZone === zone)?.countryCode || 'US';
}

public getZone = (timezone:any) => {

  if(!timezone) return;
  const date = new Date();
  const tz = new Intl.DateTimeFormat(`en-${this.getCountry(timezone)}`, {
    timeZone: timezone.toString(),
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
    return tz;

};

}
