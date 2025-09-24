import { trigger, transition, style, animate } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  animations: [
    trigger('inOutPaneAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class TemplateComponent {
  constructor(
    private matDialog: MatDialog,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService
  ) {}

  ngOnInit() {
    this.getTypes();
  }

  @Input() isSidePanelOpen: any;

  // Output event to notify the parent that the side panel should be closed
  @Output() sidePanelClosed = new EventEmitter<boolean>();

  // Method to close the side panel
  closeSidePanel() {
    this.sidePanelClosed.emit(false); // Emit 'false' to close the side panel
  }

  getTypes() {
    this.metadaSer.getMetadata().subscribe((res: any) => {
      res.forEach((item: any) => {
        if (item.typeName === 'Action_Tag') {
          this.actionTags = item.metadata;
        }
        if (item.typeName === 'GuardAlertType') {
          this.alertTypes = item.metadata;
        }
        if (item.typeName === 'GuardSubTypeId') {
          this.alertSubTypes = item.metadata;
        }
        if (item.typeName === 'GuardDetailInfoFields') {
          this.alertFields = item.metadata;
        }
      });
    });
  }

  @Input() devicesList!: any;
  @Input() details!: any;
  actionTags: any = [];
  alertTypes: any = [];
  alertSubTypes: any = [];
  alertFields: any = [];
  alert: any;
  subalert: any;
  message: any;
  alertField: any = [1,2, 3];
  footer: any;
  alertField1: any;
  subAlertfield1: any;
  currentCamera: any;
  date: Date = new Date();
  deviceName: any;

  clearFilledData() {
    this.message = null;
    this.footer = null;
    this.alertField = [1,2,3];
    this.alert = null;
    this.subalert = null;
    this.alertField1 = null;
    this.subAlertfield1 = null;
  }

  @ViewChild('emailDialog') emailDialog = {} as TemplateRef<any>;

  openPreview() {
    this.alertField.forEach((item: any) => {
      if (item.code == 1) {
          item.key = this.details?.item.siteName;

      }
      if (item.code == 2) {
        item.key = this.date;
      }
      if (item.code == 3) {
        item.key = this.date;
      }
      if (item.code == 4) {
        item.key = this.deviceName;
      }
    });

    this.matDialog.open(this.emailDialog);
  }

  getValById(id: number) {
    return this.alertFields.filter((item: any) => item.keyId === id);
  }
  getData(item: any) {
    this.alertField1 = item.value;
  }
  getData1(item: any) {
    this.subAlertfield1 = item.value;
  }

  createGuardMasterData() {
    let alertMessage = `⚠️ ${this.alertField1} @ ${this.details?.item.siteName} - ${this.subAlertfield1} ⚠️`;
    let payload = {
      siteId: this.details?.item.siteId,
      guardAlertTypeId: this.alert,
      guardSubTypeId: this.subalert,
      emailSubject: alertMessage,
      emailBasicContent: this.message,
      emailFieldsId: JSON.stringify(this.alertField),
      emailFooter: this.footer,
      createdBy: 0,
    };

    if (
      this.details?.item.siteId &&
      this.alert &&
      this.subalert &&
      alertMessage &&
      this.message &&
      this.alertField
    ) {
      this.SiteSer.createGuardMasterData(payload).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.alaram.snackSuccess(res.message);

          this.alert = null;
          this.subalert = null;
          this.alertField1 = null;
          this.subAlertfield1 = null;
          this.message = null;
          this.footer = null;
          this.deviceName = null;
          this.devicesList = [];
        }
      });
    } else {
      this.alaram.snackSuccess('Please select alert,subalert & type message');
    }
  }
}
