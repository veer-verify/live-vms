import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-manualprocess',
  templateUrl: './manualprocess.component.html',
  styleUrls: ['./manualprocess.component.css'],
  animations: [
    trigger('inOutPaneAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }), //apply default styles before animation starts
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(100%)' }),
        ),
      ]),
    ]),
  ],
})
export class ManualprocessComponent {
  selectedDate: any;
  dateTimeForm!: FormGroup;

  constructor(
    private matDialog: MatDialog,
    private SiteSer: SiteService,
    private metadaSer: MetadataService,
    private alaram: AlertService,
    public storage: StorageService,
    private fb: FormBuilder,
  ) {
    this.dateTimeForm = this.fb.group({
      date: [''],
      hours: ['00'],
      minutes: ['00'],
      seconds: ['00'],
      site: [null],
      camera: [null],
      files: [[]],
    });
  }

  @Input() isSidePanelOpen: any;

  @Output() sidePanelClosed = new EventEmitter<boolean>();

  Cameras: any[] = [];
 Sites: any=[];
  site: any;
  camera: any;

  ngOnInit() {
    this.getSitesforUser();
  }


    getSitesforUser() {

    this.SiteSer.getSites().subscribe((res: any) => {

      if (res.Status === 'Success') {

        this.Sites = res.sites;
      }
    });
  }

  closeSidePanel() {
    this.sidePanelClosed.emit(false);
  }

  getFormattedDateTime() {
    const { date, hours, minutes, seconds } = this.dateTimeForm.value;

    if (!date) return null;

    const formattedDate = new Date(date).toISOString().split('T')[0];

    return `${formattedDate} ${hours}:${minutes}:${seconds}`;
  }

  selectedFiles: any[] = [];

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const files: File[] = Array.from(input.files);

    this.handleFiles(files);

    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer?.files) return;

    const files: File[] = Array.from(event.dataTransfer.files);

    this.handleFiles(files);
  }

  handleFiles(files: File[]) {
    const existingFiles: File[] = this.dateTimeForm.get('files')?.value || [];

    files.forEach((file: File) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.selectedFiles.push({
            file,
            name: file.name,
            type: file.type,
            preview: e.target?.result,
          });

          // 👇 Update form control
          const updatedFiles = [...existingFiles, file];
          this.dateTimeForm.patchValue({ files: updatedFiles });
        };

        reader.readAsDataURL(file);
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);

    const updatedFiles = this.selectedFiles.map((f) => f.file);

    this.dateTimeForm.patchValue({
      files: updatedFiles,
    });
  }
}
