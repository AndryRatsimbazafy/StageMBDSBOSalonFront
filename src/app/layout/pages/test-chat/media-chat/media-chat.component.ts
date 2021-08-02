import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMediaChat } from './store/media-chat.selector';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatNotifService } from '../chat.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-media-chat',
  templateUrl: './media-chat.component.html',
  styleUrls: ['./media-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MediaChatComponent implements OnInit {
  hasMyVideoStream$: Observable<boolean>;
  name$: Observable<string>;
  users;
  constructor(
    protected store: Store,
    public dialogRef: MatDialogRef<MediaChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chatNotif: ChatNotifService,
    private socket: Socket
  ) {
    this.users = this.data;
    console.log('users info to inject =>', this.users);
  }

  ngOnInit(): void {
    this.hasMyVideoStream$ =
      this.store.select(selectMediaChat('hasMyVideoStream')) &&
      this.store.select(selectMediaChat('video'));

    this.hasMyVideoStream$.pipe().subscribe(value => console.log('hasMy video', value))

    this.name$ = this.store.select(selectMediaChat('name'));
    this.socket.on("hangup-made", this.hangup.bind(this))
  }

  closeModal(event?): void {
    if (this.chatNotif.stream) {
      this.chatNotif.stream.getTracks().forEach(el => el.stop());
    }
    this.socket.removeListener("hangup", this.hangup.bind(this))
    this.socket.emit("hangup", {to: this.users.remote.socket})
    this.dialogRef.close();
  }

  hangup(): void {
    if (this.chatNotif?.stream) {
      this.chatNotif.stream.getTracks().forEach(el => el.stop());
    }
    this.socket.removeListener("hangup", this.hangup.bind(this))
    this.socket.emit("hangup", {to: this.users.remote.socket})
    this.dialogRef.close();
  }

}
