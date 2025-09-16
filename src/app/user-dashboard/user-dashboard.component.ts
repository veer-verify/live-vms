import { Component } from '@angular/core';
import { StorageService } from 'src/services/storage.service';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent {

  showSidenav = false;
  constructor(
    public storage_service: StorageService
  ) {}

  collap_nav(){
    this.showSidenav =! this.showSidenav;
  }

}
