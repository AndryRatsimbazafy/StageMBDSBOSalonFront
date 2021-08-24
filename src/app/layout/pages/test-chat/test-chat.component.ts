import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/core/schema/chat-user.schema';
import { ChatService } from 'src/app/core/service/chat.api.service';
import { selectAccount } from 'src/app/core/store/account/account.selector';
import { MatDialog } from '@angular/material/dialog';
import { MediaChatComponent } from './media-chat/media-chat.component';
import { CallingComponent } from './media-chat/component/calling/calling.component';
import { environment } from 'src/environments/environment';
import { ChatNotifService } from './chat.service';
import moment from 'moment';
import 'moment/locale/fr';
import { ActivatedRoute } from '@angular/router';
import { updateMediaStore } from '../live-chat/media-chat/store/media-chat.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-test-chat',
  templateUrl: './test-chat.component.html',
  styleUrls: ['./test-chat.component.scss'],
})
export class TestChatComponent implements OnInit, OnDestroy {
  username: string;
  userID: string;
  users: User[] = [];
  selectedUserTochatWith: User;
  message: string;
  isUserConnected: boolean = false;
  user: User;
  unsubscribeAll: Subject<boolean>;

  isCallModalOpen: boolean = false;
  localMessages = [];
  isInCall = false;

  callDialog: any;

  mendezId = '6090e2cb6856b443279d3517';
  rantoId = '6094fd74022aec431051ff52';
  constructor(
    private chat: ChatService,
    private socket: Socket,
    private store: Store,
    private dialog: MatDialog,
    private chatNotif: ChatNotifService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUserNameAndConnect();
    this.getMessages();
    this.userWantToChat();
    this.saveSession();
    this.handleVideoChatSockets();
  }

  ngOnDestroy() {
    this.chat.disconnetSocket();
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  getUserNameAndConnect() {
    // this.store
    //   .select(selectAccount)
    //   .pipe(takeUntil(this.unsubscribeAll))
    //   .subscribe((account) => {
    //     if (account) {
    //       if (!account.firstName && !account.lastName && account.email) {
    //         this.username = account.email;
    //       }
    //       if (account.firstName || account.lastName) {
    //         this.username = `${account.lastName ? account.lastName : ''} ${
    //           account.firstName ? account.firstName : ''
    //         }`.trim();
    //       }

    //       this.userID = account._id;
    //       this.connect(this.username, this.userID);
    //     }
    //   });
    this.route.params.subscribe(value => {
      if (value.id === '1') {
        this.username = "Mendez";
        this.userID = this.mendezId;
        this.selectedUserTochatWith = {userID: this.rantoId, username: 'Ranto'} as User
      } else {
        this.username = "AndryPatrick";
        this.userID = this.rantoId;
        this.selectedUserTochatWith = {userID: this.mendezId, username: 'Mendez'} as User
      }
      this.connect(this.username, this.userID);
    })
  }

  connect(username, userId) {
    console.log('connectiong socket....', username);
    this.chat.connectSocket(username, userId);
    this.isUserConnected = true;
  }

  getUsers() {
    console.log('GETTING USER');
    this.chat
      .listen('users')
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        console.log("list from 'users' emition:", data);
        console.log('socket id', this.socket.ioSocket.id);
        data.forEach((user) => {
          user.self = user.userID === this.socket.ioSocket.id;
          if (user.userID === this.socket.ioSocket.id) {
            this.user = user;
            console.log('MYSELF', this.user);
          }
        });

        this.users = [...data];
      });
  }

  chatToUser(user: User) {
    console.log('chat to..', user);
    this.selectedUserTochatWith = user;
    user.hasNewMessage = false;
  }

  getMessages() {
    this.chat
      .listen('private message')
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(({ content, from, to, files, upperDate, createdAt, indexInLocal }) => {
        for (let i = 0; i < this.users.length; i++) {
          const user: User = this.users[i];
          const fromSelf = this.socket.ioSocket.userID === from;
          if (user.userID === (fromSelf ? to : from)) {
            console.log('new mess', indexInLocal, this.localMessages);
            if (user.messages) {
              // console.log('has messages', indexInLocal);
              if (indexInLocal !== undefined && fromSelf) { // Message is sent by actual user
                (user.messages as any).push({
                  content,
                  files,
                  fromSelf,
                  upperDate,
                  fromUnsent: true
                });
                this.localMessages[indexInLocal].unsent = false;
                console.log(user.messages);
                user.messages = user.messages;
              } else {
                user.messages.push({
                  content,
                  files,
                  fromSelf,
                  upperDate,
                  createdAt
                });
              }
            }

            if (user !== this.selectedUserTochatWith) {
              user.hasNewMessage = true;
              this.chatNotif.newMessageNotif.play();
            }
            break;
          }
        }
      });
  }

  sendMessage(event) {
    if (this.selectedUserTochatWith) {
      if (event && !event.message && !event.files.length) {
        return;
      }
      const sendTime = new Date();
      const upperDate = moment(sendTime).format('Do MMMM, HH:mm');
      let files = event.files ? this.getFileNames(event.files) : [];

      const content = event.message ? event.message.trim() : '';

      let messageContent = {
        content,
        fromSelf: true,
        upperDate,
        files,
        createdAt: sendTime,
      };

      let message: any = {
        content,
        to: this.selectedUserTochatWith.userID,
        upperDate,
        createdAt: sendTime,
        indexInLocal: this.localMessages.length,
        unsent: true
      };

      if (event.files) {
        const formData = new FormData();
        event.files.forEach((element) => {
          formData.append('files', element);
        });
        message.files = event.files;
        this.chat.upload(formData).subscribe((res) => {
          if (res && res.success) {
            message.files = res.data;
            this.chat.emit('private message', message);
            console.log('filesss', message.files, this.localMessages[message.indexInLocal].files)
          }
        });
      } else {
        this.chat.emit('private message', message);
      }

      this.localMessages.push(message);
      // For change detection
      this.localMessages = this.localMessages;
    }
  }

  updateMessages(content: any) {
    console.log('chat', content);
    // this.selectedUserTochatWith.messages = [
    //   ...this.selectedUserTochatWith.messages,
    //   content,
    // ];
  }

  getFileNames(files) {
    let res = [];
    files.forEach((element) => {
      res.push(element.name);
    });
    return res;
  }

  userWantToChat() {
    console.log('NEW USER CONNECTED');
    this.chat
      .listen('chat with you')
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((user) => {
        console.log('should push', user);
        user.self = user.userID === this.socket.ioSocket.id;
        let userExists = this.users.filter((u) => u.userID === user.userID);
        console.log('DO USER EXISTS', userExists);
        if (!userExists.length) {
          this.users.push(user);
        }
      });
  }

  saveSession() {
    console.log('should have session...');
    this.chat
      .listen('session')
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attemps
        console.log('saving sessions....', { sessionID, userID });
        this.socket.ioSocket.io.opts.query = { sessionID };

        // store session on local storage
        localStorage.setItem('sessionID', sessionID);
        // save the id of the user
        this.socket.ioSocket.id = userID;
      });
  }

  openCallDialog(isAnswer?: boolean, payload?: any) {
    //console.log("call", event)
    if (this.selectedUserTochatWith && this.username && this.userID) {
      this.isCallModalOpen = true;
      const dialogRef = this.dialog.open(MediaChatComponent, {
        height: ' 80vh',
        width: '90vw',
        data: {
          remote: {
            name: this.selectedUserTochatWith.username,
            socket: this.selectedUserTochatWith.userID,
          },
          me: {
            name: this.username,
            socket: this.userID,
          },
          isAnswer,
          payload,
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((_) => {
        console.log('call ended');
        this.isCallModalOpen = false;
        // this.store.dispatch(updateMediaStore({entry: {video: false, audio: false, screenSharing: false}}))
      });
    }
  }

  handleVideoChatSockets() {
    this.socket.on('call-made', this.handleCallMade);
    this.socket.on('busy-made', this.handleBusyMade);
  }

  handleCallMade = async (payload): Promise<any> => {
    if (!this.isCallModalOpen && !this.isInCall) {
      const ringtone = new Audio();
      ringtone.src = environment.RINGTONE_HAPPY;
      ringtone.load();
      ringtone.play();
      ringtone.loop = true;
      this.isInCall = true
      this.callDialog = this.dialog.open(CallingComponent, {
        width: '350px',
        height: '284px',
        data: {
          name: payload.name,
          socket: payload.socket
        },
      });

      this.callDialog.afterClosed().subscribe(async (response) => {
        console.log('Response call', response);
        console.log('response payload', payload);
        ringtone.pause();
        if (response) {
          this.isCallModalOpen = true;
          this.openCallDialog(true, payload);
        }
        this.isInCall = false;
      });

    } else {
      if(payload.isFirstStep) {
        console.log('I AM BUSY....');
        this.socket.emit("busy", {to: payload.socket})
      }
    }
  };

  handleBusyMade = (payload) => {
    if(this.callDialog) {
      this.callDialog.close()
    }
    this.snackBar.open("La personne que vous tentez de joindre est occupée!", 'Terminer')
  }


}
