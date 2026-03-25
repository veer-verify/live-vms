import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/services/event.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.css']
})
export class PlaybackInfoComponent {

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private event: EventService,
    private storage: StorageService
  ) { }

  @Input() data: any
  @Output() myEvent = new EventEmitter<boolean>();
  @ViewChild('videoElement') videoElement!: ElementRef;
  time: any;
  currentIndex = 0;
  showControls = false;
  videos: any = [
    // '/assets/clips/clip-1.mp4',
    // '/assets/clips/clip-2.mp4',
    // '/assets/clips/clip-3.mp4',
  ];
  playbacktime: any;

  ngOnChanges() {
    // console.log(this.data);
    this.time = this.storage.getTimeWithTimezone(this.data?.timezone);
    this.getTypes();
  }

  ngOnInit() {
  }

  showLoader = false;
  playbackvideoApi() {
    this.videos = [];
    this.videos.push('/assets/clips/loading.mp4');
    this.showLoader = true;
    this.event.playbackvideo({ ...this.data, minutesBeforeEvent: this.playbacktime.value, currentTime: this.time })
      .subscribe({
        next: (res: any) => {
          this.showLoader = false;
          if (res.statusCode === 200) {
            this.videos = [];
            this.videos = res.eventUrls;
          } else {
            this.videos.push('/assets/clips/clip-1.mp4');
          }
        },
        error: (err) => {
          this.showLoader = false;
        }
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
    const video = this.videoElement.nativeElement;
    video.load();
    video.play();
  }

  closedialog() {
    this.myEvent.emit(false);
  }

  getTypes() {
    const metadata = this.storage.getmetaData('metaData');
    metadata.forEach((item: any) => {
      if (item.typeName === 'CustomPlaybackTime') {
        [this.playbacktime] = item.metadata;
        this.playbackvideoApi();
      }
    });
  }

}
