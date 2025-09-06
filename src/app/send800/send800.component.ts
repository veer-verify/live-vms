import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CameraService } from 'src/services/camera.service';
import { Observable, Subscription, fromEvent, switchMap, tap, } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-send800',
  templateUrl: './send800.component.html',
  styleUrls: ['./send800.component.css']
})
export class Send800Component {

  env = environment;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private camSer: CameraService,
    private matDialog: MatDialog,
    private http: HttpClient,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getUrl();
    this.message = this.data?.emailBody
  }

  openChat: boolean = false;
  hidden: boolean = false;
  count: number = 0;
  latestMsg: any;
  latestMsg1: any;


  openChatbot1() {
    this.camSer.getRecievedMsg().subscribe((res: any) => {
      this.latestMsg1 = res.data;

      this.count = this.latestMsg1
        .flatMap((el: any) => el.latestItem)
        .filter((item: any) => item.isInbound)?.length;
    });
  }

  openChatbot() {
    this.camSer.getRecievedMsg().subscribe((res: any) => {
      this.latestMsg = res.data;
    });
    this.openChat = !this.openChat;
    this.hidden = true;
  }

  // @ViewChild('openmessage') openmessage: any = ElementRef;
  sender: string = '+18444384847';
  recipient: string = '';
  message: string = '';
  // file: any;
  // openMessageDialog() {
  //   this.recipient = '';
  //   this.message = '';
  //   this.progress = 0;
  //   this.selectedfile = null;
  //   this.matDialog.open(this.openmessage, { disableClose: true });
  // }

  selectedfile: any;
  selected800File(event: any) {
    // this.selectedfile = event.target.files[0];
    this.selectedfile = this.env + this.data?.imageName
  }

  async getUrl() {
    this.http.get(this.env.guard_monitoring_url + '/download_1_0/' + this.data?.imageName, { responseType: 'blob' })
      // .pipe(
      //   switchMap((blob: any) => this.convertBlobToBase64(blob))
      // )
      .subscribe((res: any) => {
        this.selectedfile = res
      });

      // await fetch(this.env.guard_monitoring_url + this.data?.imageName)
      // .then(response => response.arrayBuffer())
      // .then(arrayBuffer => {
      //   const binaryData = new Uint8Array(arrayBuffer);
      //   console.log(binaryData);
      // })
      // .catch(error => console.error('Error fetching image:', error));
  }

  convertBlobToBase64(blob: Blob) {
    return Observable.create((observer: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        console.log(event.target.result);
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        console.log(event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

  progress: number = 0;
  async sendMessage() {
    let obj = {
      sender: this.sender,
      recipient: this.recipient,
      message: this.message,
    };

    try {
      const response = await this.camSer
        .sendMessage800(obj, this.selectedfile)
        .pipe(tap((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.progress = progress;
          }
        })
        )
        .toPromise();
      alert('Message sent successfully');
    }
    catch (error) {
      alert(`Failed to send message:${error}`);
      this.progress = 0;
    }
  }

}
