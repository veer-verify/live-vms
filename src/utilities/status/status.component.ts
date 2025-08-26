import { Component, Input } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {

  // @Input({required: true}) text!: string;

  constructor(public storage_service: StorageService) { }

}
