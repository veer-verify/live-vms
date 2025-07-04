import { Component } from '@angular/core';

@Component({
  selector: 'app-day-range-slider',
  templateUrl: './day-range-slider.component.html',
  styleUrls: ['./day-range-slider.component.css']
})
export class DayRangeSliderComponent {
  disabled = false;
  max = 23;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;


  ngOnInit():void{
  
  }


  dayChange(item:any,day:any){

    if(day=='start'){
       
    
    }
    else{
       
     
    }

  }

 

}
