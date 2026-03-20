import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/services/storage.service';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent {

  environment = environment;

  constructor(
    public storage_service: StorageService
  ) {
    this.user = this.storage_service.getData('session');
  }

  // ngDoCheck(): void {
  //   let user = this.storage_service.getData('session');
  //   let tempUser = this.storage_service.session_sub.getValue();
  //   if (!user) {
  //     this.storage_service.saveData('session', this.storage_service.session_sub.getValue());
  //   }
  //   if (!tempUser) {
  //     this.storage_service.session_sub.next(this.storage_service.getData('session'));
  //   };
  // }

  showSidenav = false;
  user: any;


  collap_nav() {
    this.showSidenav = !this.showSidenav;
  }

}
