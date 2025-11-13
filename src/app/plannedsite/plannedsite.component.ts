import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plannedsite',
  templateUrl: './plannedsite.component.html',
  styleUrls: ['./plannedsite.component.css']
})
export class PlannedsiteComponent {

  @Input() cameraList!:any;
  @Input() currentItem!:any;

  ngOnInit(){
   
  }

}
