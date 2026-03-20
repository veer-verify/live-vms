import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartService } from 'src/services/chart.service';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class DeviceInfoComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    private chartservice: ChartService,
  ) { }

  ngOnInit(): void {
    this.mychart();
  }

  mychart() {
    var charttype = 'line';
    var title = 'TEMPERATURE';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    var categories = ['2AM', '4AM', '6Am', '8Am', '12Am', '2AM', '4AM', '6AM', '8AM']
    var elementid = 'chart';
    var antype = 'time';
    var data = [
      ['50', 50],
      ['70', 70],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.devicesChart(charttype, title, data, elementid, antype, categories)
  }

  closeAddDevice() {
    this.newItemEvent.emit();
  }

}
