import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dummy-video',
  templateUrl: './dummy-video.component.html',
  styleUrls: ['./dummy-video.component.css']
})
export class DummyVideoComponent {

  @Input() camerasForPage: any;
  
}
