import { SiteService } from './../../services/site.service';
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
import { StorageService } from 'src/services/storage.service';

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
    private alaram: AlertService,
    public storage: StorageService
  ) { }

  @Input() isSidePanelOpen: any;
  @Output() sidePanelClosed = new EventEmitter<boolean>();

  ngOnInit() {
    this.getTemplateData();
  }

  closeSidePanel() {
    this.sidePanelClosed.emit(false);
  }

  siteName: any;
  siteSearch: any;
  siteSearch1: any;
  siteslist: any;

  getSitesforUser() {
    this.SiteSer.getSites().subscribe((res: any) => {
      if (res.Status === 'Success') {
        this.siteslist = res.sites;
      }
    });
  }
  searchSites(event: any) {
    this.siteSearch = event.target.value;
  }

  isChecked(): boolean {
    return (
      this.siteslist?.length > 0 &&
      this.siteslist?.length === this.siteName?.length
    );
  }

  toggleSelection(): void {
    const isAllSelected = this.isChecked();
    if (isAllSelected) {
      this.siteName = [];
    } else {
      this.siteName = this.siteslist.map((site: any) => site.siteId);
    }
  }
  selectAll = false;

  toggleSelectAll() {
    this.templateData.map((item: any) => item.selectedtemplate = this.selectAll);
    this.selectedGuardIds = this.templateData.filter((item: any) => item.selectedtemplate).map((item: any) => item.guardMasterId);

  }
  selectedGuardIds: any;

  updateSelectAll() {
    this.selectAll = this.templateData.every((item: any) => item.selectedtemplate);

    this.selectedGuardIds = this.templateData.filter((item: any) => item.selectedtemplate).map((item: any) => item.guardMasterId);


  }


  getTypes() {
    const metadata = this.storage.getData('metaData')
    metadata.forEach((item: any) => {
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
  alertField: any = [1, 2, 3];
  footer: any;
  alertField1: any;
  subAlertfield1: any;
  currentCamera: any;
  date: Date = new Date();
  deviceName: any;

  clearFilledData() {
    this.message = null;
    this.footer = null;
    this.alertField = [1, 2, 3];
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
    let alertMessage = `⚠️ ${this.alertField1} @  - ${this.subAlertfield1} ⚠️`;
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
  templateData: any = [];
  showTemplate: any = 2;
  openTemplate(i: any) {
    switch (i) {
      case 1:
        this.showTemplate = 1;
        this.alert = null,
          this.subalert = null;
        this.templateData = [];
        break;
      case 2:
        this.showTemplate = 2;
        this.alert = null,
          this.subalert = null;
        this.siteName = null;
        this.getTemplateData();
        break;
      default:
    }
  }

  getTemplateData() {
    let payload = {
      alertTypeId: this.alert,
      subTypeId: this.subalert,
    };

    this.SiteSer.listTemplatesData(payload).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.getTypes();
        this.getSitesforUser();
        this.templateData = res.templateData;
        this.selectAll = false;
      } else {
        this.templateData = [];

        this.alaram.snackError(res.detail);
      }
    });
  }

  templateindex!: number;
  templateedititem: any;
  editTemplate(item: any, i: number) {
    this.templateindex = i;

    this.templateedititem = { ...item };
  }

  SaveTemplate() {
    this.SiteSer.updatemasterTemplate({ ...this.templateedititem }).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          this.alaram.snackSuccess(res.message);
          this.templateindex = -1;
          this.getTemplateData();
        }
      }
    );
  }

  showLoader: boolean = false;
  mapTemplates() {

    let payload = {
      guardMasterId: this.selectedGuardIds,
      siteId: this.siteName,
      createdBy: 0
    }
    this.showLoader = true;
    this.SiteSer.createTemplateSiteRlsp(payload).subscribe((res: any) => {

      if (res.statusCode == 200) {
        this.alaram.success(res.message);
        this.showLoader = false;
      }
      else {
        this.alaram.snackError(res.message);
        this.showLoader = false;
      }
    })

  }
  deleteTemplate(item: any) {

    this.SiteSer.deleteoverallTemplate({ modifiedBy: 0, guardMasterId: item.guardMasterId }).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.alaram.success(res.message);
        this.getTemplateData();
      }
      else {
        this.alaram.snackError(res.message);

      }
    })

  }

}
