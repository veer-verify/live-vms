import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { LoginService } from 'src/services/login.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private fb: FormBuilder,
    private loginSer: LoginService,
    private router: Router,
    public storageSer: StorageService,
    private alertSer: AlertService,
    private metadata_service: MetadataService,
  ) { }

  loginForm!: FormGroup;
  ngOnInit() {
    this.storageSer.session_sub.next(null);

    const user = this.storageSer.getData('session');
    if (user) this.router.navigate(['/user-dashboard']);

    this.loginForm = this.fb.group({
      userName: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });

    const formatter = new Intl.DateTimeFormat([], {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }


  showLoader: boolean = false;
  login() {
    // const localData = this.storageSer.getData('session');
    // if(localData) return this.alertSer.warn('You have already opened the same application in another tab please open in New Window or Browser!');

    if (!this.loginForm.valid) return;
    this.showLoader = true;
    this.loginSer.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.storageSer.saveData('session', res);

          this.loginSer.manageUserSession('logIn').subscribe({
            next: (response) => {
              this.showLoader = false;
              let temp = this.storageSer.getData('session');
              this.storageSer.saveData('session', { ...temp, ...response });
              this.storageSer.session_sub.next({ ...res, ...response })
              this.router.navigate(['/nvr']);
            }
          })
        } else {
          this.showLoader = false;
          this.alertSer.snackError(res.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        this.alertSer.snackError(err?.error?.statusText ?? 'login failed!');
      }
    })
  }

  // manageUserSession() {
  //   this.loginSer.manageUserSession('logIn').subscribe({
  //     next: (res) => {
  //       sessionStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''));
  //       this.storageSer.session_sub.next(res.sessionId ?? '');
  //     }
  //   })
  // }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getMetadata() {
    this.metadata_service.getMetadata().subscribe({
      next: (res: any) => {
        this.storageSer.metadat_sub = res
      }
    })
  }

}
