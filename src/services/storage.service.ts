import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


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

    //ivis
  logo = 'assets/themes/logo.png';
  headerLogo = 'assets/themes/IVISsecurity_logo.png';
  accordianLogo = 'assets/icons/eye.svg';
  activeLogo = 'assets/icons/eye-blue.svg';
  inActiveLogo = 'assets/icons/eye-red.svg';

  //unv
  // logo = 'assets/images/UneeviuLogowhite (1).png';
  // headerLogo = 'assets/themes/Uneeviu Logo Blue png.png';
  // accordianLogo = 'assets/themes/CameraLogowhite.png';
  // activeLogo = 'assets/themes/Uneeviu Logo Blue png.png';
  // inActiveLogo = 'assets/themes/Uneeviu Logo Blue png.png';

  private readonly key = "verifai";

  constructor() { }

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

}
