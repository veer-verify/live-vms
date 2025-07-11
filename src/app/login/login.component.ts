import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, from, fromEvent, last, take } from 'rxjs';
import { AlertService } from 'src/services/alert.service';
import { LoginService } from 'src/services/login.service';
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
    private storageSer: StorageService,
    private alertSer: AlertService
  ) { }
  
  loginForm!: FormGroup;
  ngOnInit() {
    this.storageSer.clearData();

    this.loginForm = this.fb.group({
      userName: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });

    // let credentials = new Map();
    // credentials.set('userName', 'john');
    // credentials.set('password', '123');
    // credentials.set('callingSystemDetail', 'vms');

    // let x = this.fb.group(Object.entries(credentials));
    // console.log(x.value);
  }

  showLoader: boolean = false;
  login() {
    if(!this.loginForm.valid) return;
      this.showLoader = true;
      this.loginSer.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.showLoader = false;
          if (res.Status === 'Success') {
            this.storageSer.saveData('userData', res);
            this.storageSer.saveData('acTok', res.AccessToken ?? '');
            this.manageUserSession();
            this.router.navigate(['/user-dashboard']);
            // this.router.navigate(['/dashboard']);
          } else if (res?.Status == 'Failed') {
            this.alertSer.snackError(res.message);
          }
        },
        error: (err: any) => {
          this.showLoader = false;
          this.alertSer.snackError(err?.error?.statusText);
        }
      })
  }

  manageUserSession() {
    this.loginSer.manageUserSession('logIn').subscribe((res: any) => {
      // console.log(res);
      localStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''))
    }, (err) => {
      console.log(err)
    })
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
