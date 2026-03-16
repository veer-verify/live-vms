import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-camera-insights',
  templateUrl: './camera-insights.component.html',
  styleUrls: ['./camera-insights.component.css']
})
export class CameraInsightsComponent {
  constructor(
    private fb: FormBuilder,
  ) { }

  @Output() closeModal: any = new EventEmitter<void>();
  @Output() siteActions = new EventEmitter<any>();

  // triggerSiteAction(data: any) {
  //   console.log(data)

  // }

  roleList: any;

  addUserForm!: FormGroup

  ngOnInit() {

  }

  close() {
    this.closeModal.emit()
  }

}
