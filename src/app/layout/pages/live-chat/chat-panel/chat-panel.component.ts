import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { User } from 'src/app/core/schema/chat-user.schema';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent implements OnInit {

  @Input() user: User;
  @Input() unsent: any [];

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('container') container: ElementRef;

  serverUrl = `${environment.CHAT_SERVER_URL}/public/files/`
  imageExt = ['jpg', 'jpeg', 'png', 'gif']
  loadingImg = true

  constructor() {
  }

  ngOnInit(): void {
  }

  onImageLoaded() {
    this.loadingImg = false
    console.log("img loaded")
  }


  ngAfterViewInit(): void {
    this.scrollMessageToBottom();
    this.messages.changes.subscribe( _ => {
      this.scrollMessageToBottom()
    })
  }

  isFileAnImage(filename) {
    let res: boolean
    const filenameArray = filename.split(".")
    const ext = filenameArray.pop()
    res = this.imageExt.includes(ext.toLowerCase())
    return res
  }

  scrollMessageToBottom() {
    try {
      console.log("SCROLLING to BOTTOM")
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight
    } catch (error) {
      console.log("scrool error", error)
    }
  }




}
