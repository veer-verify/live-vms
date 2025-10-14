import { Component } from '@angular/core';
import { StorageService } from 'src/services/storage.service';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent {

  showSidenav = false;
  user: any;
  constructor(
    public storage_service: StorageService
  ) {
    this.user = this.storage_service.getData('userData');
  }

  collap_nav(){
    this.showSidenav =! this.showSidenav;
  }

}
