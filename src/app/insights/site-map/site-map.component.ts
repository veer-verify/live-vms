import { SiteService } from 'src/services/site.service';
import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { CameraInsightsComponent } from "../camera-insights/camera-insights.component";
import { StorageService } from 'src/services/storage.service';
import { InsightService } from 'src/services/insight.service';

@Component({
  selector: 'app-site-map',
  templateUrl: './site-map.component.html',
  styleUrls: ['./site-map.component.css']
})
export class SiteMapComponent  {

  constructor(
    public storage_service: StorageService,
    private insight_service: InsightService,
    private SiteService:SiteService

  ) { }


  siteDetails: any;
  originalWidth = 9000;
  originalHeight = 7000;
  @Input() siteId: any;

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['siteId']) {

    this.getSiteFloorMapDetails(this.siteId);
  }
}

  ngOnDestroy(): void {

  }

  getSiteFloorMapDetails(data: any) {
    this.siteDetails = null;

    this.SiteService.getSiteFloorMapDetails(data).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.siteDetails = res.siteDetails;
          this.originalWidth = this.siteDetails.imageWidth;
          this.originalHeight = this.siteDetails.imageHeight;


          if (!this.siteDetails.siteImage) {

          }
        } else {

        }
      }
    })
  }

  currentCam: any;
  onCameraClick(cam: string) {
    this.currentCam = null;
    // this.addBtn = true;
    setTimeout(() => {
      this.currentCam = cam;
    }, 100)
  }

  findx(x: number) {
    return (x / this.originalWidth) * 100;
  }

  findy(y: number) {
    return (y / this.originalHeight) * 100;
  }

  addBtn = false
  closeAddUserModal(val: boolean) {
    this.addBtn = val;
  }

}
