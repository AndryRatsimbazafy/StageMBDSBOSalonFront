import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/@core/schema/chat-user.schema';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() userList: User[];
  @Output() selectedUser = new EventEmitter<any>()

  activeUser;

  constructor() { }

  ngOnInit(): void {
  }

  selectUser(user) {
    this.activeUser = user
    this.selectedUser.emit(user)
  }

}
