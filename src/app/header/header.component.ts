import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { EventService } from 'src/services/event.service';
import { LoginService } from 'src/services/login.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private loginSer: LoginService,
    public storageSer: StorageService,
    private alert_service: AlertService,
    private event_service: EventService
  ) { }

  userData: any;
  showLoader: boolean = false;

  ngOnInit() {
    this.userData = this.storageSer.getData('session');
  }

  logout() {
    this.event_service.stopEventPooling();
    const length = this.storageSer.events_sub.getValue();
    if (length !== 0) return this.alert_service.warn('Please clear the events before logout!');

    this.showLoader = true;
    this.loginSer.manageUserSession('logOut').subscribe({
      error: () => {
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
