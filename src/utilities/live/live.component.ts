import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent {

  constructor(
    private siteSer: SiteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getCamerasForSiteId(this.data); 
    
  }

  liveData: any = [];
  statusTxt!: string;
  getCamerasForSiteId(data: any) {
    this.statusTxt = 'loading...';
    this.siteSer.getCamerasForSiteId(data).subscribe({
      next: (res: any) => {
        if(res.length === 0) {
          this.statusTxt = 'no cameras found!';
        } else {
          this.statusTxt = '';
          this.liveData = res;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.statusTxt = 'failed to load cameras!';
      }
    });
  }

}
