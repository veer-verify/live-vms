import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CameraService } from 'src/services/camera.service';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  constructor(
    public storage_service: StorageService,
    private metadata_service: MetadataService,
    private camera_service: CameraService,
    private event_service: EventService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.listActionTags();
    this.getTypes();
    this.getDispatchData();
  }

  actionForm!: FormGroup;
  initializeActionForm() {
    this.actionForm = this.fb.group({

    })
  }

  eventData: any = [];
  getDispatchData() {
    this.event_service.getDispatchData().subscribe({
      next: (res) => {
        this.eventData = res;
      }
    })
  }

  currentItem: any;
  actionTag: any;
  emailObject: any;
  alertType: any;
  alertSubType: any;
  displayCurrent(data: any) {
    this.currentItem = data;
    // let cameraCurrentTime = moment().tz(data.camera?.timezone)?.format('YYYY-MM-DD HH:mm:ss');
  }

  getEmailData() {

    let day = new Date().getDay();
    let hour = new Date().getHours();

    this.emailObject = {
      siteId: this.currentItem?.siteId,
      // camerasList: [],
      alertTypeId: this.alertType,
      subTypeId: this.alertSubType,
      day: this.storage_service.weekdays[day],
      hour: hour,
      currentTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:MM:SS'),
    };

    this.camera_service.getEmailData(this.emailObject).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.statusCode === 200) {
          // this.mannualEmailBody.recipientEmails = res.emailDetails.recipientEmails.join(', ');
          // this.mannualEmailBody.subject = res.emailDetails.emailSubject;
          // this.mannualEmailBody.body = res.emailDetails.emailBody;
          // this.mannualEmailBody.bcc = res.emailDetails.BCC.join(', ');
          // this.mannualEmailBody.cc = res.emailDetails.Cc.join(', ');
          // this.mannualEmailBody.fields = res.emailDetails.emailFields;
          // this.mannualEmailBody.footer = res.emailDetails.emailFooter;
          // this.mannualEmailBody.files = res.emailDetails.screenshots;
        }
      },
    });
  }

  listActionTags() {
    this.camera_service.listActionTags({ siteId: 36416 }).toPromise().then((res: any) => {
      if (res.statusCode === 200) {
        this.actionTags = res.data[0].actionTags;
      }
    });
  }

  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  getTypes() {
    this.metadata_service.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        if (item.type === 98) {
          this.alertTypes = item.metadata;
        }
        if (item.type === 99) {
          this.alertSubTypes = item.metadata;
        }
      });
    });
  }

}
