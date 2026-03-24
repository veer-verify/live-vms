import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/services/event.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.css']
})
export class PlaybackInfoComponent {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
                private event : EventService,
                 private storage :StorageService){

  }

   @Output() myEvent = new EventEmitter<boolean>();

   time:any;

  ngOnInit(){
    console.log(this.data)

    this.getTypes();

    this.time = this.storage.getTimeWithTime(this.data?.timezone);
    console.log(this.time)

  }

  @ViewChild('videoPlayer') video!: ElementRef<HTMLVideoElement>;

  videos: string[] = [
    'assets/video1.mp4',
    'assets/video2.mp4',
    'assets/video3.mp4'
  ];

  currentIndex = 0;
  showControls = false;

  playbackvideoApi(){
     this.event.playbackvideo({...this.data,minutesBeforeEvent:this.playbacktime[0].value,currentTime:this.time}).subscribe((res:any)=>{
      console.log(res)
    })
  }

  nextVideo() {
    if (this.currentIndex < this.videos.length - 1) {
      this.currentIndex++;
      this.reloadVideo();
    }
  }

  prevVideo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.reloadVideo();
    }
  }

  reloadVideo() {
    const video = this.video.nativeElement;
    video.load();
    video.play();
  }

  closedialog(){
   this.myEvent.emit(false);
  }

  playbacktime:any=[];
    getTypes() {


   const metadata= this.storage.getmetaData('metaData');


      metadata.forEach((item: any) => {
        if (item.typeName === 'CustomPlaybackTime') {

          this.playbacktime = item.metadata;
          this.playbackvideoApi();
      }

      });

  }

}
