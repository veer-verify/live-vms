import { Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCameraComponent } from 'src/app/edit-camera/edit-camera.component';


@Component({
  selector: 'app-add-new-camera',
  templateUrl: './add-new-camera.component.html',
  styleUrls: ['./add-new-camera.component.css'],
  animations: [
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewCameraComponent {

  @Input() currentSiteFrom: any;
  @Input() centeralBoxFrom: any;
  @Output() newItemEvent = new EventEmitter<boolean>();
  user: any;

  constructor(
    private router: Router,
    private siteSer: SiteService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private alertSer: AlertService,
    public dialog: MatDialog,
  ) {

  }

  createCamera!: FormGroup;

  siteData: any = []
  ngOnInit(): void {
    this.siteData = this.storageService.get("siteIds");

    this.createCamera = this.fb.group({
      name: new FormControl(''),
      rtspUrl: new FormControl(''),
      userName: new FormControl('admin', Validators.required),
      password: new FormControl('123456', Validators.required),
      width: new FormControl(null),
      height: new FormControl(null),
      fps: new FormControl(1),
      hlsTunnel: new FormControl(`https://${this.centeralBoxFrom.unitId}hlslive-repo.pitunnel.com`),
      ptz: new FormControl('F'),
      priority: new FormControl(''),
      active: new FormControl('Y'),
      httpTunnel: new FormControl(''),
      videoServerName: new FormControl(`https://${this.centeralBoxFrom.unitId}live-repo.pitunnel.com`),
      portNo: new FormControl(0),
      centralBoxId: new FormControl(''),
      httpPortNo: new FormControl(0),
      indexNo: new FormControl(0),
      gtEnabled: new FormControl(''),
      displayName: new FormControl(''),
      internalIp: new FormControl(''),
      internalPort: new FormControl(0),
      s3RequestName: new FormControl(`${this.centeralBoxFrom.requestName}`),
      events: new FormControl('F'),
      eventsOnAWS: new FormControl(''),
      eventsOnCPE: new FormControl(''),
      eventsServerIp: new FormControl(''),
      audioSpeakerType: new FormControl(''),
      audioUrl: new FormControl(`https://${this.centeralBoxFrom.unitId}audio-repo.pitunnel.com/play/siren`),
      monitoring: new FormControl('T'),
      unitId: new FormControl(`${this.centeralBoxFrom.unitId}`, Validators.required),
      noOfCameras: new FormControl('', Validators.required),
      timelapse: new FormControl('F'),
      s3_server_host: new FormControl('2'),
      liveRestartUrl: new FormControl(`https://${this.centeralBoxFrom.unitId}liverestart-repo.pitunnel.com`),
      camera_config_url: new FormControl(`https://${this.centeralBoxFrom.unitId}camconfig-repo.pitunnel.com`)
    });

  }

  closeCamera() {
    this.newItemEvent.emit();
  }

  isShown: boolean = false;
  toggleShowOnOff() {
    this.isShown = !this.isShown;
  }

  Monitoring: boolean = false;
  toggleShowMonit() {
    this.Monitoring = !this.Monitoring;
  }

  Business: boolean = false;
  toggleShowBusiness() {
    this.Business = !this.Business;
  }

  cameras: any = [];
  showLoader: boolean = false;
  getCamerasForSiteId(data: any) {
    this.showLoader = true;
    this.siteSer.getCamerasForSiteId(data.siteId).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.cameras = res;
      this.addCamera(this.createCamera.value)
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  currentItem: any
  openEditPopup(item: any) {
    this.storageService.current_sub.next({ type: 'camera', data: item });
    this.dialog.open(EditCameraComponent);
  }

  camList: any = [];
  addCamera(data: any) {
    this.camList = [];
    for (let i = this.cameras.length; i < (data.noOfCameras + this.cameras.length); i++) {
      let initialIndex = (i + 1).toString().padStart(2, '0');
      let finalIndex;
      if (i < 9) {
        finalIndex = (i + 1).toString().padStart(2, 'C');
      } else {
        finalIndex = (i + 1).toString().padStart(3, 'C');
      }
      let x = `Camera ${initialIndex}`;
      let y = `${this.createCamera.value.unitId}${finalIndex}`;

      this.camList.push({
        cameraId: y,
        name: x,
        rtspUrl: this.createCamera.value.rtspUrl,
        userName: this.createCamera.value.userName,
        password: this.createCamera.value.password,
        width: this.createCamera.value.width,
        height: this.createCamera.value.height,
        fps: this.createCamera.value.fps,
        hlsTunnel: this.createCamera.value.hlsTunnel,
        indexNo: this.createCamera.value.indexNo,
        centralBoxId: this.centeralBoxFrom?.centralBoxId,
        ptz: this.createCamera.value.ptz,
        priority: this.createCamera.value.priority,
        active: this.createCamera.value.active,
        httpTunnel: this.createCamera.value.httpTunnel,
        videoServerName: this.createCamera.value.videoServerName,
        portNo: this.createCamera.value.portNo,
        httpPortNo: this.createCamera.value.httpPortNo,
        gtEnabled: this.createCamera.value.gtEnabled,
        displayName: x,
        internalIp: this.createCamera.value.internalIp,
        internalPort: this.createCamera.value.internalPort,
        s3RequestName: this.createCamera.value.s3RequestName,
        events: this.createCamera.value.events,
        eventsOnAWS: this.createCamera.value.eventsOnAWS,
        eventsOnCPE: this.createCamera.value.eventsOnCPE,
        eventsServerIp: this.createCamera.value.eventsServerIp,
        audioSpeakerType: this.createCamera.value.audioSpeakerType,
        audioUrl: this.createCamera.value.audioUrl,
        monitoring: this.createCamera.value.monitoring,
        unitId: this.createCamera.value.unitId,
        noOfCameras: this.createCamera.value.noOfCameras,
        timelapse: this.createCamera.value.timelapse,
        s3_server_host: this.createCamera.value.s3_server_host,
        liveRestartUrl: this.createCamera.value.liveRestartUrl,
        camera_config_url: this.createCamera.value.camera_config_url
      });
    }
  }

  btnLoader: any = null;
  submit(data: any, event: any) {
    if (!this.createCamera.valid) return;

    event.target.disabled = true;
    event.target.nextElementSibling.disabled = true;
    this.siteSer.createCamera(data).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.alertSer.success(res.message);
      } else {
        this.alertSer.error(res.message);
      }
    }, (err: any) => {
      this.alertSer.error(err);
    })
  }

  update() {
    this.siteSer.createCamera(this.currentItem).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.alertSer.success(res.message);
      } else {
        this.alertSer.error(res.message);
      }
    }, (err: any) => {
      this.alertSer.error(err);
    })
  }


  // unitId: string = '';
  // cameraconfigUrl: string = '';
  // snapshotsUrl: string = '';
  // webrtcUrl: string = '';
  // hlsTunnel: string = '';
  // audioUrl: string = '';

  // generateUrls(): void {
  //   this.cameraconfigUrl = this.unitId ? `${this.unitId}/camconfig-repo.pitunnel.com` : '';
  //   this.snapshotsUrl = this.unitId ? `${this.unitId}/snapshots-repo.pitunnel.com` : '';
  //   this.webrtcUrl = this.unitId ? `${this.unitId}/live-repo.pitunnel.com` : '';
  //   this.hlsTunnel = this.unitId ? `${this.unitId}/hlslive-repo.pitunnel.com` : '';
  //   this.audioUrl = this.unitId ? `${this.unitId}/audio-repo.pitunnel.com/play/siren` : '';
  // }

}
