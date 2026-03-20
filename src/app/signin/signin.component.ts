import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { EventService } from 'src/services/event.service';
import { LoginService } from 'src/services/login.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginSer: LoginService,
    private storageSer: StorageService,
    private metadata_service: MetadataService,
    private alertSer: AlertService,
    private userser: UserService,
    private event: EventService
  ) { }

  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLogin = signal(true);

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      callingSystemDetail: [''],
    });
  }

  visiblePaswword() {
    this.showPassword = !this.showPassword;
  }

  saveMetaData() {
    this.metadata_service.getMetadata().subscribe({
      next: (res) => this.storageSer.saveData('metaData', res),
    });
  }

  eventsFlow() {
    this.event.getVMSEventFlow_1_0().subscribe((res: any) => {
      res.map((item: any) => {
        this.storageSer.saveData(item?.levelId, item?.queueName);
      });
    });
  }

  userData: any;
  showLoader: boolean = false;
  login() {
    // const localData = this.storageSer.getData('session');
    // if(localData) return this.alertSer.warn('You have already opened the same application in another tab please open in New Window or Browser!');

    if (!this.loginForm.valid) return;
    this.showLoader = true;
    this.loginSer.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.userData = res;
          this.storageSer.saveData('session', res);
          this.eventsFlow();
          this.get_roles();
          this.getMetadata();
          this.loginSer.manageUserSession('logIn').subscribe({
            next: (response) => {
              this.showLoader = false;
              if (response.statusCode == 200) {
                let temp = this.storageSer.getData('session');
                this.storageSer.saveData('session', { ...temp, ...response });

                // this.storageSer.session_sub.next({ ...res, ...response });
                this.router.navigate(['/user-dashboard/monitoring-info']);
              }
            },
          });
        } else {
          this.showLoader = false;
          this.alertSer.snackError(res.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        this.alertSer.snackError(err?.error?.statusText ?? 'login failed!');
      },
    });
  }

  rolesDetailsData: any = [];
  get_roles() {
    this.userser.get_roles(this.userData).subscribe((res: any) => {
      this.rolesDetailsData = res.rolesDetails;
      // console.log(this.rolesDetailsData)
      if (res.status == 'Success') {
        this.storageSer.set('role', res.rolesDetails)
      }
    })
  }

  // showPassword: boolean = false;
  // togglePasswordVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

  getMetadata() {
    this.metadata_service.getMetadata().subscribe({
      next: (res: any) => {
        this.storageSer.metadat_sub = res;
        this.storageSer.set('metaData', res);
      },
    });
  }

}
