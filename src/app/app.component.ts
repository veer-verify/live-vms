import {
  Component
} from '@angular/core';
import { AsyncSubject, BehaviorSubject, first, last, ReplaySubject, Subject, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor() {
  }
}
