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

  @Input() data: any;
  @Output() myEvent = new EventEmitter<boolean>();
  @ViewChild('videoElement') videoElement!: ElementRef;
  time: any;
  currentIndex = 0;
  showControls = false;
  videos: any = [];
  playbacktime: any;
  state: 'loading' | 'empty' | 'data' = 'loading';

  ngOnChanges() {
    this.time = this.storage.getTimeWithTimezone(this.data?.timezone);
    this.getTypes();
  }

  playbackvideoApi() {
    this.videos = [];
    this.state = 'loading';
    this.event.playbackvideo({ ...this.data, minutesBeforeEvent: this.playbacktime?.value, currentTime: this.time })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.state = 'data';
            this.videos = res.eventUrls;
          }
          else {
            this.state = 'empty';
          }
        },
        error: () => {
          this.state = 'empty';
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
