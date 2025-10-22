import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgxCaptureService } from 'ngx-capture';
import { AlertService } from 'src/services/alert.service';
import { CameraService } from 'src/services/camera.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {

  @Input() videoData: any;
  @Input() camerasForPage: any;
  @Input() siteData: any;
  @Input() liveControl:any;

  @Output() screenshotEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private captureService: NgxCaptureService,
    private camSer: CameraService
  ) { }

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('image') image!: ElementRef;
  @ViewChild('videParent') videParent!: ElementRef;

  peerConnection!: RTCPeerConnection;
  restartTimeout: any = null;
  sessionUrl: string = '';
  queuedCandidates: RTCIceCandidate[] = [];
  offerData: any;

  hitStream: boolean = false;
  encoded: any;
  ngOnInit(): void {
    const username = "admin";
    const password = "verifai123789";
    let credentails = `${username}:${password}`;
    this.encoded = btoa(credentails);

    this.hitStream = true;
    this.requestICEServers();
  }

  ngAfterViewInit() {
    if (this.siteData?.siteId === 36585 || this.siteData?.siteId === 36591) {
      this.camSer.siren_sub.subscribe((res: any) => {
        if (res) {
          this.video.nativeElement.muted = false;
        } else {
          this.video.nativeElement.muted = true;
        }
      })
    } else {
      this.video.nativeElement.muted = true;
    }

    this.video.nativeElement.controls = false;
    this.video.nativeElement.autoplay = true;
    this.video.nativeElement.playsInline = true;
  }

  toggleMaximize() {
    if (this.camerasForPage === 2) {
      this.videParent.nativeElement.classList.add('h2');
    }
    else if (this.camerasForPage === 6) {
      this.videParent.nativeElement.classList.add('h6');
    }
    else if (this.camerasForPage === 9 || this.camerasForPage === 12) {
      this.videParent.nativeElement.classList.add('h9');
    }
    else {
      this.videParent.nativeElement.classList.add('h20');
    }

    this.videParent.nativeElement.classList.remove('tile-active');
  }

  showLoader: boolean = false;
  requestICEServers() {
    if (this.hitStream) {
      this.showLoader = true;
      fetch(this.videoData + "whep", {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Basic ${this.encoded}`
        }
      }).then((res) => {
        this.showLoader = false
        this.peerConnection = new RTCPeerConnection({
          iceServers: this.linkToIceServers(res.headers.get('Link')),
        });
        const direction = 'sendrecv';
        this.peerConnection.addTransceiver('video', { direction });
        this.peerConnection.addTransceiver('audio', { direction });
        this.peerConnection.onicecandidate = (evt: RTCPeerConnectionIceEvent) => this.onLocalCandidate(evt);
        this.peerConnection.oniceconnectionstatechange = () => this.onConnectionState();
        this.peerConnection.ontrack = (evt: RTCTrackEvent) => this.onTrack(evt);
        this.createOffer();
      }).catch((err) => {
        // this.hitStream = false;
        this.showLoader = false;
        this.onError(err.toString());
      });
    }
  }

  linkToIceServers(links: string | null): RTCIceServer[] {
    const ics: RTCIceServer[] = [];

    if (links !== null) {
      links.split(', ').forEach(link => {
        const m = link.match(/^<(.+?)>; rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i);
        if (m !== null) {
          let ic: RTCIceServer = {
            urls: [m[1]]
          };
          ic.urls = [m[1]];
          if (m[3] !== undefined) {
            ic.username = JSON.parse(`"${m[3]}"`)
            ic.credential = JSON.parse(`"${m[4]}"`)
          }
          ics.push(ic)
        }
      })
    }
    return ics;
  }

  onError(err: any) {
    if (this.restartTimeout === null) {
      this.peerConnection?.close();

      this.restartTimeout = window.setTimeout(() => {
        this.restartTimeout = null;
        this.requestICEServers();
      }, 2000);

      if (this.sessionUrl) {
        fetch(this.sessionUrl, {
          method: 'DELETE',
        });
      }
      this.sessionUrl = '';
      this.queuedCandidates = [];
    }
  };

  onLocalCandidate(evt: RTCPeerConnectionIceEvent): void {
    if (this.restartTimeout !== null) {
      return;
    }

    if (evt.candidate !== null) {
      if (this.sessionUrl === '') {
        this.queuedCandidates.push(evt.candidate);
      } else {
        this.sendLocalCandidates([evt.candidate])
      }
    }
  };

  onConnectionState() {
    if (this.restartTimeout !== null) {
      return;
    }
    if (this.peerConnection!.iceConnectionState === 'disconnected') {
      this.onError('peer connection disconnected');
    }
  };

  onTrack(evt: RTCTrackEvent) {
    this.video.nativeElement.srcObject = evt.streams[0];
  };

  createOffer() {
    this.showLoader = true;
    this.peerConnection!.createOffer()
      .then((offer: RTCSessionDescriptionInit) => {
        this.showLoader = false;
        this.editOffer(offer);
        this.offerData = this.parseOffer(offer.sdp!);
        this.peerConnection!.setLocalDescription(offer);
        this.sendOffer(offer);
      }).catch((err) => {
        this.showLoader = false
      });
  };

  editOffer(offer: RTCSessionDescriptionInit) {
    const sections = offer.sdp!.split('m=');
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.startsWith('audio')) {
        sections[i] = this.enableStereoOpus(section);
      }
    }
    offer.sdp = sections.join('m=');
  };

  parseOffer(offer: string) {
    const ret: any = {
      iceUfrag: '',
      icePwd: '',
      medias: [],
    };

    for (const line of offer.split('\r\n')) {
      if (line.startsWith('m=')) {
        ret.medias.push(line.slice('m='.length));
      } else if (ret.iceUfrag === '' && line.startsWith('a=ice-ufrag:')) {
        ret.iceUfrag = line.slice('a=ice-ufrag:'.length);
      } else if (ret.icePwd === '' && line.startsWith('a=ice-pwd:')) {
        ret.icePwd = line.slice('a=ice-pwd:'.length);
      }
    }
    return ret;
  };

  enableStereoOpus(section: any) {
    let opusPayloadFormat = '';
    let lines = section.split('\r\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('a=rtpmap:') && lines[i].toLowerCase().includes('opus/')) {
        opusPayloadFormat = lines[i].slice('a=rtpmap:'.length).split(' ')[0];
        break;
      }
    }

    if (opusPayloadFormat === '') {
      return section;
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('a=fmtp:' + opusPayloadFormat + ' ')) {
        if (!lines[i].includes('stereo')) {
          lines[i] += ';stereo=1';
        }
        if (!lines[i].includes('sprop-stereo')) {
          lines[i] += ';sprop-stereo=1';
        }
      }
    }

    return lines.join('\r\n');
  };

  sendOffer(offer: RTCSessionDescriptionInit) {
    this.showLoader = true;
    fetch(this.videoData + "whep", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sdp',
        'Authorization': `Basic ${this.encoded}`
      },
      body: offer.sdp,
    }).then((res: any) => {
      this.showLoader = false;
      switch (res.status) {
        case 201:
          break;
        case 404:
          throw new Error('stream not found');
        default:
          throw new Error(`bad status code ${res.status}`);
      }
      this.sessionUrl = new URL(res.headers.get('location'), this.videoData).toString();
      return res.text();
    }).then((sdp) => this.onRemoteAnswer(sdp)).catch((err) => {
      this.showLoader = false;
      this.onError(err.toString());
    });
  };

  onRemoteAnswer(sdp: string) {
    if (this.restartTimeout !== null) {
      return;
    }
    if (this.peerConnection?.signalingState !== 'closed') {
      this.peerConnection!.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp,
      }));
    }
    if (this.queuedCandidates.length !== 0) {
      this.sendLocalCandidates(this.queuedCandidates);
      this.queuedCandidates = [];
    }
  };

  sendLocalCandidates(candidates: RTCIceCandidate[]) {
    this.showLoader = true;
    fetch(this.sessionUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/trickle-ice-sdpfrag',
        'If-Match': '*',
      },
      body: this.generateSdpFragment(this.offerData, candidates),
    }).then((res) => {
      this.showLoader = false;
      switch (res.status) {
        case 204:
          break;
        case 404:
          throw new Error('stream not found');
        default:
          throw new Error(`bad status code ${res.status}`);
      }
    }).catch((err) => {
      this.showLoader = false;
      this.onError(err.toString());
    });
  };

  generateSdpFragment(od: any, candidates: RTCIceCandidate[]) {
    const candidatesByMedia: any = {};
    for (const candidate of candidates) {
      const mid = candidate.sdpMLineIndex;
      if (candidatesByMedia[mid!] === undefined) {
        candidatesByMedia[mid!] = [];
      }
      candidatesByMedia[mid!].push(candidate);
    }
    let frag = 'a=ice-ufrag:' + od.iceUfrag + '\r\n' + 'a=ice-pwd:' + od.icePwd + '\r\n';
    let mid = 0;

    for (const media of od.medias) {
      if (candidatesByMedia[mid] !== undefined) {
        frag += 'm=' + media + '\r\n' + 'a=mid:' + mid + '\r\n';

        for (const candidate of candidatesByMedia[mid]) {
          frag += 'a=' + candidate.candidate + '\r\n';
        }
      }
      mid++;
    }
    return frag;
  };



  async plainCapture(camera: any) {
    let finalWidth = 1280;
    let finalHeight = 720;
    await this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, finalWidth, finalHeight);
    const screenshotDataUrl = await this.canvas.nativeElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = `${camera?.cameraId}-${camera?.name}-${moment().tz(camera?.timezone)?.format('YYYY-MM-DD HH:mm:ss')}.png`
    link.click();
  }

  canvasWidth: any = 1280;
  canvasHeight: any = 720;
  async capture(camera: any, color: any, imgElement: any, btnItem: any) {
    let x = btnItem.x + 8;
    let y = btnItem.y + 25;
    let finalHeight = 720;
    let aspectRatio = btnItem.elementWidth / btnItem.elementHeight;
    let finalWidth = Math.round(aspectRatio * finalHeight);
    let widthScalingFactor = finalWidth / btnItem.elementWidth;
    let heightScalingFactor = finalHeight / btnItem.elementHeight;
    let finalX = Math.round(x * widthScalingFactor);
    let finalY = Math.round(y * heightScalingFactor);
    this.canvasWidth = finalWidth;
    this.canvasHeight = finalHeight;

    setTimeout(() => {
      this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, finalWidth, finalHeight);
      this.canvas.nativeElement.getContext("2d").drawImage(imgElement, finalX, finalY, 20, 20);
      this.canvas.nativeElement.toBlob((blob: any) => {
        let newObj = { ...camera, color, ...btnItem }
        this.screenshotEmitter.emit({ image: blob, camera: newObj });

        const screenshotDataUrl = this.canvas.nativeElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = screenshotDataUrl;
        link.download = `${camera?.cameraId}-${camera?.name}-${color ?? ''}-${moment().tz(camera?.timezone)?.format('YYYY-MM-DD HH:mm:ss')}.png`;
        link.click();
      });
    }, 500)

  }

  ngOnDestroy() {
    this.hitStream = false;
    this.peerConnection?.close();
  }
}
