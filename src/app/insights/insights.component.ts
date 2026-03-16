import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AgChartOptions,
} from 'ag-charts-community';

import {
  GridOptions,
} from 'ag-grid-community';
import { filter, Subject, takeUntil } from 'rxjs';
import { AgCharts } from "ag-charts-angular";
import { InsightService } from 'src/services/insight.service';
import { StorageService } from 'src/services/storage.service';
import { gridOptions } from 'src/grid.config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SiteService } from 'src/services/site.service';
@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit, OnDestroy {

  constructor(
    private insight_service: InsightService,
    public storage_service: StorageService,
    private siteSer: SiteService,
    private fb: FormBuilder
  ) { }

  columnDefs = [
    {
      field: 'type',
      flex: 2,
      cellRenderer: (params: any) => {
        return `<span class="type-cell">${params.value}</span>`
      }
    },
    {
      field: 'total',
      flex: 1,
      cellClass: 'count-cell'
    }
  ];

  destroy$ = new Subject<void>();
  currentSite: any;
  today = new Date();
  gridOptions!: GridOptions;
  analyticsData: any = [];
  charts: any[] = [];
  myForm!: FormGroup;
  userData: any;


  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('session')!);
    this.gridOptions = gridOptions;

    // this.storage_service.currentSite$
    //   .pipe(
    //     filter((site) => !!site),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((site) => {
    //     this.currentSite = site;
    //     this.getNonWorkingDays();
    //   });
    this.myForm = this.fb.group({
      siteId: [''],
      cameraId: [''],
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.getSitesListForUserName()

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  page: string = 'list';
  setPage(page: string) {
    this.page = page;

    if (page === 'map') return;
    this.getNonWorkingDays();
  }

  siteIdToNav: Array<any> = new Array();
  // errInfo: any;
  getSitesListForUserName() {
    this.storage_service.status_text = 'loading...';
    this.siteSer.getSites(this.userData).subscribe(
      (res: any) => {
        if (res.Status === 'Success') {
          this.storage_service.status_text = '';
          this.siteIdToNav = res?.sites.sort((a: any, b: any) =>
            a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0
          );
          // this.siteId = this.siteIdToNav[0].siteId;
          // this.getCurrentSiteAlerts(this.siteIdToNav[0])
          this.myForm.get('siteId')?.setValue(this.siteIdToNav[0].siteId);
          this.getNonWorkingDays();
        } else if (res.Status === 'Failed') {
          this.storage_service.status_text = 'no data!';
          // this.errInfo = res.message;
        }
      },
      (err: any) => {
        this.storage_service.status_text = 'failed to load data!';
        // this.errInfo = 'CONNECTION TIMED OUT!';
      }
    );
  }

  camList: any = [];
  getCamerasForSiteId(data: any) {
    this.camList = [];
    this.siteSer.getCamerasForSiteId(data).subscribe({
      next: (res: any) => {
        this.camList = res;
      }
    });
  }

  getNonWorkingDays() {
    // this.storage_service.info$.next('');
    this.analyticsData = [];
    this.charts = [];
    this.insight_service.getNonWorkingDays({ siteId: this.myForm.get('siteId')?.value }).subscribe({
      next: (res) => {
        if (res.status === "Success") {
          this.myForm.get('fromDate')?.setValue(new Date(res.LastWorkingDay));
          this.biAnalyticsReport();
          this.getCamerasForSiteId({ siteId: this.myForm.get('siteId')?.value });
        } else {
          // this.storage_service.info$.next(res.message);
        }
      }
    })
  }

  biAnalyticsReport() {
    // this.storage_service.info$.next('');
    this.insight_service.biAnalyticsReport(this.myForm.value).subscribe({
      next: (res) => {
        if (res.Status === "Success") {
          this.analyticsData = res.AnalyticsReportList;
          this.generateCharts()
          if (this.analyticsData.length === 0) {
            // this.storage_service.info$.next('no data!');
          }
        } else {
          // this.storage_service.info$.next('no data!');
        }
      }
    })
  }

  generateCharts() {
    this.charts = this.analyticsData.map((section: any) => {
      const chartData = section.data.map((d: any) => ({
        label: d.type,
        value: Number(d.total)
      }));

      return {
        title: section.name,
        options: {
          data: chartData,
          series: [
            {
              type: 'donut',
              angleKey: 'value',
              calloutLabelKey: 'label',
              innerRadiusRatio: 0.6,
              calloutLabel: {
                enabled: false
              }
            }
          ],
          legend: {
            position: 'right'
          }
        }
      };
    });
  }

}
