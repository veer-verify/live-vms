import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EventService } from 'src/services/event.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-playback-info',
  templateUrl: './playback-info.component.html',
  styleUrls: ['./playback-info.component.css']
})
export class PlaybackInfoComponent {

  constructor(
    private event: EventService,
    private storage: StorageService
  ) { }

  @Input() data: any
  @Output() myEvent = new EventEmitter<boolean>();
  @ViewChild('videoElement') videoElement!: ElementRef;
  time: any;
  currentIndex = 0;
  showControls = false;
  videos: any = [];
  playbacktime: any;

  ngOnChanges() {
    // console.log(this.data);
    this.time = this.storage.getTimeWithTimezone(this.data?.timezone);
    this.getTypes();
  }

  ngOnInit() {
  }

  showVideoControl = false;
  playbackvideoApi() {
    this.videos = [];
    this.videos.push('assets/clips/loading.mp4');
    this.showVideoControl = false;
    this.event.playbackvideo({ ...this.data, minutesBeforeEvent: this.playbacktime?.value, currentTime: this.time })
      .subscribe({
        next: (res: any) => {
          this.videos = [];
          if (res.statusCode === 200) {
            this.showVideoControl = true;
            this.videos = res.eventUrls;
          } else {
            this.videos.push('assets/clips/error.mp4');
          }
        },
        error: () => {
          this.videos = [];
          this.videos.push('assets/clips/error.mp4');
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
    const metadata = this.storage.getData('metaData');
    metadata.forEach((item: any) => {
      if (item.typeName === 'CustomPlaybackTime') {
        [this.playbacktime] = item.metadata;
      }
    });
    this.playbackvideoApi();
  }

}
