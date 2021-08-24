import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/schema/chat-user.schema';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit {
  @Input() user: User
  constructor() { }

  ngOnInit(): void {
  }

}
