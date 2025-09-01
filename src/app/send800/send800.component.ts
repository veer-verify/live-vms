import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CameraService } from 'src/services/camera.service';
import { Observable, Subscription, fromEvent, tap, } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-send800',
  templateUrl: './send800.component.html',
  styleUrls: ['./send800.component.css']
})
export class Send800Component {


    constructor(
   
      private camSer: CameraService,
      private matDialog: MatDialog,
     
    ) { }

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
  
      @ViewChild('openmessage') openmessage: any = ElementRef;
    sender: string = '+18444384847';
    recipient: string = '';
    message: string = '';
    openMessageDialog() {
      this.recipient = '';
      this.message = '';
      this.progress = 0;
      this.selectedfile = null;
      this.matDialog.open(this.openmessage, { disableClose: true });
    }
  
    selectedfile: any;
    selected800File(event: any) {
      this.selectedfile = event.target.files[0];
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
