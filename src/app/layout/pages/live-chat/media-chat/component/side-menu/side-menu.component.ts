import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';
import { updateMediaStore } from '../../store/media-chat.action';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  selectAudioVideoChat,
} from '../../store/media-chat.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { ChatNotifService } from '../../../chat.service';

const { RTCPeerConnection, RTCSessionDescription } = window;

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          position: 'absolute',
          right: 0,
          bottom: 0,
          background: '#cb3a5f',
          padding: '5px 13px',
          borderRadius: '10px',
          color: '#fff',
        })
      ),
      state(
        'hide',
        style({
          display: 'none',
        })
      ),
      transition('hide => show', [animate('0.3s ease')]),
      transition('show => hide', [animate('0.3s ease')]),
    ]),
  ],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @Input() usersInfo: any;
  @Output() closeModal = new EventEmitter<any>();
  @ViewChild('nameSheet') nameSheetTemplate: TemplateRef<any>;

  myVideoStream: MediaStream;
  room: { roomId: string; socketId: string; name: string } = {
    roomId: '',
    name: '',
    socketId: '',
  };
  videoGrid;
  selectedRoom;

  peerConnection: RTCPeerConnection;
  isAlreadyCalling = false;
  isAnswerMade = false;
  users: { name: string; socket: string }[] = [];
  userCalling = {
    socketId: null,
  };

  //constraints = { video : true, audio : true }
  //constraints = { video : true, audio : true }
  isCallMade: boolean = false;
  ringtone;

  myCaptureStream
  isScreeSharing = false;
  hasStarted = false;

  isSecondStreamRequest = false;
  lastStreamRequest = null;
  constructor(
    public socket: Socket,
    protected store: Store,
    readonly bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private chatNotif: ChatNotifService
    ) {
      console.log("initialize peer...")
      this.peerConnection = new RTCPeerConnection();
      console.log("peer initialized...")
      this.handleSocket();
    }

  // onTrack(stream): void {
  //   const remoteVideo: any = document.querySelector('.remote-video');
  //   if (remoteVideo) {
  //     remoteVideo.srcObject = stream;
  //     remoteVideo.play();
  //   }
  //   console.log('ON TRACK....');
  // }

  setRemoteVideo(stream): void {
    const remoteVideo: any = document.querySelector('.remote-video');
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
      remoteVideo.play();
    }
  }

  async callUser(socketId, options?): Promise<void> {
    console.log('call options', options);
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer)
    );
    console.log('Calling....', socketId);

    this.socket.emit('call-user', {
      offer,
      to: socketId,
      name: this.usersInfo.me.name,
      isFirstStep: options?.isFirstStep
    });
  }

  // async getPermissionCamera({ video = true, audio = true }): Promise<void> {
  //   await navigator.mediaDevices
  //     .getUserMedia({
  //       video,
  //       audio,
  //     })
  //     .then(this.listenMyStreamMedia)
  //     .catch((e) => {
  //       console.warn('caméra/micro désactivé', e);
  //       //alert("Vous n'avez de caméra ")
  //       //this.closeModal.emit("no device found")
  //     });
  // }

  _enableMyVideoStream({ video = true, audio = true }) {
    if (this.myVideoStream) {
      if (this.myVideoStream.getVideoTracks().length) {
        if (!video) {
          console.log('Here Video false');
          this.myVideoStream.getVideoTracks()[0].enabled = false;
        } else {
          this.myVideoStream.getVideoTracks()[0].enabled = true;
        }
      }

      if (this.myVideoStream.getAudioTracks().length) {
        if (!audio) {
          this.myVideoStream.getAudioTracks()[0].enabled = false;
        } else {
          this.myVideoStream.getAudioTracks()[0].enabled = true;
        }
      }
      //this.listenMyStreamMedia(this.myVideoStream)
      // this.setMyVideoStream(this.myVideoStream);
    } else {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          this.myVideoStream = stream;
          this.chatNotif.stream = stream;
          console.log('hohohohohoho', stream);

          this.myVideoStream.getAudioTracks()[0].enabled = audio;
          this.myVideoStream.getVideoTracks()[0].enabled = video;
          this.listenMyStreamMedia(this.myVideoStream);
        });
    }
  }

  async enableMyVideoStream({video = true, audio = true}): Promise<void> {
    await navigator.mediaDevices.getUserMedia({
        video, audio
    }).then(stream => {
      this.myVideoStream = stream;
      this.chatNotif.stream = stream;
      this.listenMyStreamMedia(this.myVideoStream);
    });
  }


  ngOnInit(): void {

    this.setUsers();
    // //this.socket.emit('create-private-room');
    // this.getPermissionCamera({ video: false, audio: false }).catch((e) =>
    //   alert('call get permission camera error' + e)
    // );


    this.store.select(selectAudioVideoChat)
      .subscribe(({video, audio, screenSharing}) => {
        this.lastStreamRequest = {video, audio, screenSharing};
        this.isScreeSharing = screenSharing;
        if (!screenSharing) {
          console.log('select audio video chat', video);
          if (this.usersInfo.isAnswer || video || (this.hasStarted && !this.usersInfo.isAnswer)) {
            this._enableMyVideoStream({ video, audio });
            this.hasStarted = true
          }
        } else {
          console.log('my capture screen', this.myCaptureStream);
          if (!this.myCaptureStream) {
            this.shareScreen();
          } else if (this.myCaptureStream) {
            this.stopScreenShare();
          }
        }

    });


    console.log("IS ANSWER =>", this.usersInfo.isAnswer)
    if (this.usersInfo && this.usersInfo.isAnswer) {
      console.log('init answering...');
      this.createAnswer(this.usersInfo.payload);
    } else {
      console.log('init calling..');
      this.callUser(this.usersInfo.remote.socket, {isFirstStep: true});
      this.startCallerRingtone();
      this.isCallMade = true;
    }
  }

  ngOnDestroy(): void {
    this.hangUp();
    this.stopCallerRingtone();
    this.socket.removeListener('call-made', this.handleCallMade);
    this.socket.removeListener('answer-made', this.handleAnswerMade);
  }


  setUsers() {
    this.room.name = this.usersInfo.me.name;
    this.room.roomId = this.usersInfo.me.socket;
    this.room.socketId = this.usersInfo.me.socket;

    this.users = [this.usersInfo.remote, this.usersInfo.me];
    this.setUserName();
    console.log('usersss', this.users);
  }

  handleSocket(): void {
    this.socket.on('call-made', this.handleCallMade);// moved to live-chat component
    this.socket.on('answer-made', this.handleAnswerMade);
  }


  handleCallMade = async (payload): Promise<any> => {
    console.log('Hannnndleeeeeeeeeeeeeeeeeeeeeeeeee')
    if(!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection();
    }
    this.createAnswer(payload)
  }

  async createAnswer(payload): Promise<void> {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.offer)
    );
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(answer)
    );

    console.log('OFFER =>', payload.offer);
    console.log('ANSWER =>', answer);

    console.log('Call made by =>.', payload.socket);
    this.userCalling.socketId = payload.socket;
    this.peerConnection.ontrack = ({streams: [stream]}) => this.setRemoteVideo(stream);

    this.socket.emit('make-answer', {
      answer,
      to: payload.socket,
    });
  }

  handleUsersConnected = async (payload): Promise<any> => {
    console.log('User connected', payload);
    this.users = payload.users;
  };

  handleAnswerMade = async (payload): Promise<any> => {
    console.log('Answerrrrrrr', payload)
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.answer)
    );

    this.isCallMade = false;
    this.stopCallerRingtone()

    if (!this.isAlreadyCalling) {
      console.log('Answer made by=>.', payload.socket);
      this.isAlreadyCalling = true;
    }
    this.peerConnection.ontrack = ({streams: [stream]}) => this.setRemoteVideo(stream);
  };

  setUserName(): void {
    console.log('setting user name');
    this.setStoreKeyValue('name', this.room.name);
  }

  setStoreKeyValue(key, value): void {
    this.store.dispatch(
      updateMediaStore({
        entry: {
          [key]: value,
        },
      })
    );
  }

  listenMyStreamMedia = (stream): void => {
    if (stream) {
      console.log("Streamm trigired")
      stream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, stream);
      });
      this.setMyVideoStream(stream);
    }
  };

  setMyVideoStream(stream): void {
    const selfVideo: HTMLVideoElement = document.querySelector('#self-video');
    selfVideo.srcObject = stream;
    selfVideo.addEventListener('loadedmetadata', () => selfVideo.play());
    this.callUser(this.userCalling.socketId);
    if (this.isSecondStreamRequest) {
      this.isSecondStreamRequest = false;
    } else {
      this.isSecondStreamRequest = true;
      this.store.dispatch(updateMediaStore({entry: this.lastStreamRequest}))
    }
}

  addVideoStream(video, stream): void {
    console.log('Add video Stream', video, stream);
    console.log('Online With', this.userCalling.socketId);
    if (this.userCalling.socketId) {
      this.callUser(this.userCalling.socketId, "ADD VIDEO STREAM");
    }
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    // this.videoGrid.append(video);
  }

  // setMyMediaVideo(stream: MediaStream, video: boolean, audio: boolean): void {
  //   const videoTrack: MediaStreamTrack = stream.getVideoTracks()[0];
  //   videoTrack.stop();
  //   this.myVideoStream = null;
  //   this.getPermissionCamera({ video, audio });
  // }

  startCallerRingtone() {
    this.ringtone = new Audio();
    this.ringtone.src = environment.RINGTONE_HAPPY;
    this.ringtone.load();
    this.ringtone.play();
    this.ringtone.loop = true;
  }

  stopCallerRingtone() {
    if(this.ringtone && !this.ringtone.paused) {
      this.ringtone.pause();
    }
  }

  hangUp() {
    if(this.peerConnection) {
      console.log("closing peer")
      this.peerConnection.close()
      console.log("peer closed")
      this.peerConnection = null;
      console.log("peer", this.peerConnection)
    }
  }

  async shareScreen(): Promise<void> {
    if(this.myVideoStream) {
      this.myVideoStream.getVideoTracks()[0].stop()
      this.myVideoStream = null
      this.chatNotif.stream = null
    }

    if (!this.myCaptureStream) {
      const mediaDevices: any = navigator.mediaDevices;
      mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      }).then(stream => {
        const videoTrack = stream.getVideoTracks()[0];
        this.myCaptureStream = stream;

        this.listenMyStreamMedia(this.myCaptureStream);

        videoTrack.onended = () => {
          this.stopScreenShare();
          if (this.myVideoStream) {
            this.listenMyStreamMedia(this.myVideoStream);
          }
        };

      }).catch(err => {
        console.log('Unable to get display media ' + err);
      });
    } else {
      this.listenMyStreamMedia(this.myCaptureStream);
    }
  }

  private stopScreenShare(): void {
    this.myCaptureStream = null;
    this.store.dispatch(updateMediaStore({entry: { screenSharing: false }}));
  }


  private stopMyVideoStream(): void {
    console.log("my stream", this.myVideoStream.getVideoTracks())
    this.store.dispatch(updateMediaStore({entry: { video: false }}));
  }
}
