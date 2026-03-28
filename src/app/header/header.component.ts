import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { EventService } from 'src/services/event.service';
import { LoginService } from 'src/services/login.service';
import { StorageService } from 'src/services/storage.service';
import { ManualprocessComponent } from '../manualprocess/manualprocess/manualprocess.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private loginSer: LoginService,
    public storageSer: StorageService,
    private event_service: EventService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  userData: any;
  showLoader: boolean = false;
  path: any;
  ngOnInit() {
    this.userData = this.storageSer.getData('session');
  }

  ngDoCheck() {
    this.path = this.router.url.split('/').at(-1);
  }

  openManualevent() {
    this.dialog.open(ManualprocessComponent, {
      width: '600px',
      maxHeight: '600px',
      disableClose: true,
      panelClass: 'custom-dialog'
    });
  }

  logout() {
    this.event_service.stopEventPooling();
    const length = this.storageSer.events_sub.getValue();
    if (length !== 0) return alert('Please clear the events before logout!');

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
