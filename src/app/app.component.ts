import { Component, HostListener, inject } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // @HostListener('window:beforeunload')
  // onBeforeUnload() {
  //   return false;
  // }

  // storage_service = inject(StorageService);

  ngOnInit() {
    // let user = this.storage_service.getData('session');
    // this.storage_service.user_sub.next(user);
    // this.storage_service.user_sub.subscribe({
    //   next: (res) => {
    //     console.log(res);
    //   }
    // })
  }

}
