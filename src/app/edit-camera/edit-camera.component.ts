import { Component, OnInit, Output } from '@angular/core';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-edit-camera',
  templateUrl: './edit-camera.component.html',
  styleUrls: ['./edit-camera.component.css']
})
export class EditCameraComponent implements OnInit {

  constructor(
    private storageSer: StorageService,
    private alertSer: AlertService,
    private siteSer: SiteService
  ) { }

  type: any;
  currentCamera:any;
  currentitem: any;

  ngOnInit(): void {
    this.storageSer.current_sub.subscribe({
      next: (res: any) => {
        this.type = res.type;
        this.currentCamera =res.data;
        this.currentitem={...this.currentCamera}
      }
    })
   
  }

  getCamerasForSiteId(data: any) {
    this.siteSer.getCamerasForSiteId(data.siteId).subscribe((res: any) => {
      this.siteSer.cameras_sub.next(res);
    })
  }

  updateCamera() {
    if(this.type === 'camera') return;
    this.currentCamera.videoServerName = this.currentCamera.httpUrl;
    // delete this.currentCamera.httpUrl;
    this.siteSer.updateCamera(this.currentCamera,this.currentitem.cameraId).subscribe((res: any) => {
      if(res.statusCode == 200) {
        this.getCamerasForSiteId(this.currentCamera);
        this.alertSer.success(res.message)
      } else {
        this.alertSer.error(res.message);
      }
    })
  }

}
