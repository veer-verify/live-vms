import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { LoginService } from 'src/services/login.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private loginSer: LoginService,
    public storageSer: StorageService,
    private alert_service: AlertService
  ) { }

  userData: any;
  isMenuOpen: boolean = false;
  ngOnInit() {
    this.userData = this.storageSer.getData('userData');
    this.storageSer.saveData('menu', this.isMenuOpen);
  }

  onMenuOpened() {
    this.isMenuOpen = true;
    this.storageSer.saveData('menu', this.isMenuOpen);
  }

  onMenuClosed() {
    this.isMenuOpen = false;
    this.storageSer.saveData('menu', this.isMenuOpen);
  }

  showLoader: boolean = false;
  logout() {
    const length = this.storageSer.events_sub.getValue();
    if (length !== 0) return this.alert_service.warn('Please clear the events before logout!');
    this.showLoader = true;
    this.loginSer.manageUserSession('logOut').subscribe({
      error: (err: any) => {
        this.showLoader = false;
        this.loginSer.logout();
      },
      complete: () => {
        this.showLoader = false;
        this.loginSer.logout();
      }
    })
  }

}
