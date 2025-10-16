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
  ) {}

  userData: any;
  ngOnInit() {
    this.userData = this.storageSer.getData('userData');
  }

  isHidden: boolean = false;
  lastScrollTop: number = 0;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const currentScroll = window.scrollY || document.documentElement.scrollTop;
  //   console.log(currentScroll)
  //   if (currentScroll > this.lastScrollTop) {
  //     this.isHidden = true; // Scrolling down, hide the header
  //   } else {
  //     this.isHidden = false; // Scrolling up, show the header
  //   }
  //   this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  // }

  showLoader: boolean = false;
  logout() {
    const length = this.storageSer.events_sub.getValue();
    if(length !== 0) return this.alert_service.warn('Please clear the events before logout!');
    this.showLoader = true;
    this.loginSer.manageUserSession('logOut').subscribe({
      error: (err: any) => {
        this.showLoader = false;
        this.router.navigateByUrl('/login');
        localStorage.clear();
      },
      complete: () => {
        this.showLoader = false;
        this.router.navigateByUrl('/login');
        localStorage.clear();
      }
    })
  }

}
