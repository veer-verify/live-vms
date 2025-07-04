import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // themes = [
  //   {
  //     company: 'ivis',
  //     logo: '/assets/images/logo.png',
  //     headerLogo: '/assets/images/IVISsecurity_logo.png',
  //     icon: ''
  //   },
  //   {
  //     company: 'unv',
  //     logo: '/assets/images/Uneeviu Logo Blue png.png',
  //     headerLogo: '/assets/images/Uneeviu Logo Blue png.png',
  //     icon: ''
  //   }
  // ]

  constructor() { }

  public saveData(name: any, data: any) {
    // let x = btoa(encodeURIComponent(JSON.stringify(data)));
    // localStorage.setItem(name, x);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public getData(data: any) {
    // let x: any = localStorage.getItem(data);
    // return JSON.parse(decodeURIComponent(atob(x)));
    return JSON.parse(localStorage.getItem(data)!);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

}
