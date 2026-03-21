import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-camera-insights',
  templateUrl: './camera-insights.component.html',
  styleUrls: ['./camera-insights.component.css']
})
export class CameraInsightsComponent {
  // constructor(
  //   private fb: FormBuilder,
  // ) { }

  // @Output() closeModal: any = new EventEmitter<void>();
  // @Output() siteActions = new EventEmitter<any>();

  // // triggerSiteAction(data: any) {
  // //   console.log(data)

  // // }

  // roleList: any;

  // addUserForm!: FormGroup

  // ngOnInit() {

  // }

  // close() {
  //   this.closeModal.emit()
  // }

  constructor(
    private fb: FormBuilder,
  ) { }

  @Input() analyticsData: any;
  @Input() camera: any;
  @Output() closeModal: any = new EventEmitter<void>();
  @Output() siteActions = new EventEmitter<any>();
  roleList: any;
  addUserForm!: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCharts()
  }

  ngOnInit() {
    console.log(this.camera)
    this.generateCharts()
  }

  close() {
    this.closeModal.emit()
  }

  charts: any = [];
  generateCharts() {
    this.charts = this.analyticsData.map((section: any) => {
      const chartData = section.data.map((d: any) => ({
        label: `${d.type} (${d.total})`,
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
              outerRadiusRatio: 0.8,
              calloutLabel: {
                enabled: false
              }
            },
          ],
          legend: {
            position: 'right',
            maxWidth: 350,
            item: {
              label: {
                fontFamily: 'Neometric Medium',
                fontSize: 14
              }
            }
          },
        },
      };
    });
  }

}
