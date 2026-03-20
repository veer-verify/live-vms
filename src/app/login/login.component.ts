import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { LoginService } from 'src/services/login.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import { EventService } from 'src/services/event.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  subject = new BehaviorSubject<number>(0);
  intervalId: any;
  constructor(
    private fb: FormBuilder,
    private loginSer: LoginService,
    private userser:UserService,
    private router: Router,
    public storageSer: StorageService,
    private alertSer: AlertService,
    private metadata_service: MetadataService,
    private event: EventService
  ) {
    // this.subject.pipe().subscribe((res) => console.log(res));
    // this.intervalId = setInterval(() => {
    //   this.subject.next(Math.random() * 10);
    // }, 1000);

    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     clearInterval(this.intervalId);
    //     this.subject.unsubscribe();
    //     console.log(this.subject.closed);
    //   }
    // })
  }

  loginForm!: FormGroup;
  ngOnInit() {
    // this.storageSer.session_sub.next(null);

    const user = this.storageSer.getData('session');
    if (user) this.router.navigate(['/user-dashboard']);

    this.loginForm = this.fb.group({
      userName: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });

    // const formatter = new Intl.DateTimeFormat([], {
    //   timeZone: 'America/New_York',
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    // });
  }

  eventsFlow() {
    this.event.getVMSEventFlow_1_0().subscribe((res: any) => {
      res.map((item: any) => {
        this.storageSer.saveData(item?.levelId, item?.queueName);
      });
    });
  }
userData:any;
  showLoader: boolean = false;
  login() {
    // const localData = this.storageSer.getData('session');
    // if(localData) return this.alertSer.warn('You have already opened the same application in another tab please open in New Window or Browser!');

    if (!this.loginForm.valid) return;
    this.showLoader = true;
    this.loginSer.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.userData=res;
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
              // if (response.statusCode == 409) {
              // let temp=this.storageSer.getData('session');
              // this.storageSer.saveData('session',{...temp,sessionId:response.sessionId})
              //   this.alertSer.confirm(response.message).then((res: any) => {
              //     if (res?.isConfirmed) {
              //       this.showLoader = false;
              //       this.loginSer.manageUserSession('logOut').subscribe((res:any)=>{
              //         if(res.statusCode==200){
              //           this.alertSer.success(res.message);
              //           this.showLoader = false;
              //           this.loginSer.logout();
              //         }
              //         else{
              //            this.showLoader = false;
              //           this.loginSer.logout();
              //         }
              //       })
              //     }
              //     else{
              //         this.showLoader = false;
              //     }
              //   });
              // }
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

  // manageUserSession() {
  //   this.loginSer.manageUserSession('logIn').subscribe({
  //     next: (res) => {
  //       sessionStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''));
  //       this.storageSer.session_sub.next(res.sessionId ?? '');
  //     }
  //   })
  // }


    rolesDetailsData:any = [];
  get_roles() {
    this.userser.get_roles(this.userData).subscribe((res: any) => {
      this.rolesDetailsData = res.rolesDetails;
      // console.log(this.rolesDetailsData)
      if(res.status == 'Success'){
        this.storageSer.set('role', res.rolesDetails)
      }
    })
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getMetadata() {
    this.metadata_service.getMetadata().subscribe({
      next: (res: any) => {
        this.storageSer.metadat_sub = res;
         this.storageSer.set('metaData', res);
      },
    });
  }
}
