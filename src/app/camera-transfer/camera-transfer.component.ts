import { Component, Input, OnInit } from '@angular/core';
import { Camera, SystemType } from './camera.interface';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-camera-transfer',
  templateUrl: './camera-transfer.component.html',
  styleUrls: ['./camera-transfer.component.css'],
})
export class CameraTransferComponent {
  constructor(
    private siteSer: SiteService,
    private assetSer: AssetService,
    public dialog: MatDialog,
    private storageSer: StorageService,
    private alertSer: AlertService,
    private userSer: UserService,
    private metaSer: MetadataService,
    private http: HttpClient
  ) {}

  oldCameras: Camera[] = [];
  newCameras: Camera[] = [];
  newSystemName: string = 'New unitId';
  systemNameInput: string = '';
  draggedCamera: Camera | null = null;
  dragOverBox: SystemType | null = null;
  newUnitname: string = '';

  @Input() onGetCentralboxDetail: any;

  @Input() currentItem: any;

  ngOnInit(): void {

  }

  siteSearch: any;
  unitId: any;

  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value;
  }

  getcamerasforunitId() {
    this.newCameras=[];
    this.oldCameras=[];
    this.siteSer
      .getCamerasforunitId({
        siteId: this.currentItem?.siteId,
        unitId: this.unitId,
      })
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.oldCameras = res.camerasInfo;

        } else {
          this.oldCameras = res.camerasInfo;
        }
      });
  }

  // Camera Selection
  toggleCameraSelection(camera: Camera, system: SystemType): void {
    camera.selected = !camera.selected;
  }

  getSelectedCount(system: SystemType): number {
    const cameras = system === 'old' ? this.oldCameras : this.newCameras;
    return cameras.filter((c) => c.selected).length;
  }

  getSelectionInfoText(system: SystemType): string {
    const count = this.getSelectedCount(system);
    if (count === 0) {
      return '0 cameras selected - Click to select multiple cameras';
    }
    return `${count} camera${
      count > 1 ? 's' : ''
    } selected - Drag to move selected cameras`;
  }

  // Drag and Drop Events
  onDragStart(event: DragEvent, camera: Camera, system: SystemType): void {
    this.draggedCamera = camera;

    // If dragged camera is not selected, select only this one
    if (!camera.selected) {
      this.clearAllSelections();
      camera.selected = true;
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', camera.cameraId);
    }
  }

  onDragEnd(event: DragEvent): void {
    this.draggedCamera = null;
    this.dragOverBox = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent, system: SystemType): void {
    event.preventDefault();
    this.dragOverBox = system;
  }

  onDragLeave(event: DragEvent, system: SystemType): void {
    // Check if we're actually leaving the box
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      this.dragOverBox = null;
    }
  }

  onDrop(event: DragEvent, targetSystem: SystemType): void {
    event.preventDefault();
    this.dragOverBox = null;

    if (!this.draggedCamera) return;

    const sourceSystem: SystemType = this.oldCameras.includes(
      this.draggedCamera
    )
      ? 'old'
      : 'new';

    if (sourceSystem === targetSystem) return;

    this.transferSelectedCameras(sourceSystem, targetSystem);
  }

  // Transfer Functions
  private transferSelectedCameras(from: SystemType, to: SystemType): void {
    const sourceArray = from === 'old' ? this.oldCameras : this.newCameras;
    const targetArray = to === 'old' ? this.oldCameras : this.newCameras;

    const selectedCameras = sourceArray.filter((c) => c.selected);

    selectedCameras.forEach((camera) => {
      camera.selected = false;
      targetArray.push(camera);
    });

    // Remove transferred cameras from source
    if (from === 'old') {
      this.oldCameras = this.oldCameras.filter(
        (c) => !selectedCameras.includes(c)
      );
    } else {
      this.newCameras = this.newCameras.filter(
        (c) => !selectedCameras.includes(c)
      );
    }
  }

  transferAllCameras(from: SystemType, to: SystemType): void {
    const sourceArray = from === 'old' ? this.oldCameras : this.newCameras;
    const targetArray = to === 'old' ? this.oldCameras : this.newCameras;

    if (sourceArray.length === 0) return;

    // Clear selections and transfer all
    sourceArray.forEach((camera) => {
      camera.selected = false;
      targetArray.push(camera);
    });

    // Clear source array
    if (from === 'old') {
      this.oldCameras = [];
    } else {
      this.newCameras = [];
    }
  }

  // System Name Update
  updateSystemName(): void {
    const newName = this.systemNameInput.trim();
    if (newName && newName.length > 0) {
      this.newSystemName = newName;
    }
  }

  // Utility Functions
  private clearAllSelections(): void {
    this.oldCameras.forEach((c) => (c.selected = false));
    this.newCameras.forEach((c) => (c.selected = false));
  }

  getCameraCount(system: SystemType): number {
    return system === 'old' ? this.oldCameras.length : this.newCameras.length;
  }

  isTransferButtonDisabled(system: SystemType): boolean {
    return this.getCameraCount(system) === 0;
  }

  showSelectionInfo(system: SystemType): boolean {
    return this.getSelectedCount(system) > 0;
  }

  isDragOver(system: SystemType): boolean {
    return this.dragOverBox === system;
  }

  centralBoxInactive: any = '';

  migration() {
    this.centralBoxInactive = this.oldCameras?.length == 0 ? 'T' : 'F';
    let payload = {
      siteId: this.currentItem?.siteId,
      newUnitId: this.systemNameInput,
      newUnitName: this.newUnitname,
      oldUnitId: this.unitId,
      centralBoxInactiveFlag: this.centralBoxInactive,
      camerasList: this.newCameras,
      createdBy: 0,
    };

    this.siteSer.migrateCentralbox(payload).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.newCameras=[];
        this.systemNameInput="";
        this.newUnitname="";
        this.alertSer.success(res.message);
        this.dialog.closeAll();
      }
      else{
        this.alertSer.error(res.message);
      }
    });
  }

  migrateCentralbox() {
    let centralBoxInactive = this.oldCameras?.length == 0 ? 'T' : 'F';

    if (
      this.systemNameInput &&
      this.newUnitname &&
      this.newCameras.length != 0
    ) {
      if (centralBoxInactive == 'T') {
        this.alertSer
          .confirm(
            'You are migrating all cameras from the old central box to the new central box'
          )
          .then((res: any) => {
            if (res.isConfirmed) {
              this.migration();
            }
          });
      } else {
        this.alertSer
          .confirm(
            `You are migrating ${this.newCameras?.length} cameras from the old central box to the new central box`
          )
          .then((res: any) => {
            if (res.isConfirmed) {
              this.migration();
            }
          });
      }
    } else {
      this.alertSer.error(
        'Please fill in the Unit Name and Unit ID fields'
      );
    }
  }
}
