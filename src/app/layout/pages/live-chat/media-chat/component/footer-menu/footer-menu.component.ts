import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {updateMediaStore} from '../../store/media-chat.action';
import { selectAudioVideoChat } from '../../store/media-chat.selector';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.scss']
})
export class FooterMenuComponent implements OnInit {

  isMuted = true;
  isVideoOff = true;
  @Output() closeModal = new EventEmitter<any>();

  constructor(protected store: Store) { }

  ngOnInit(): void {
  }

  audioClicked(): void{
    this.isMuted = !this.isMuted;
    this.store.dispatch(updateMediaStore({
      entry: {
        audio: !this.isMuted
      }
    }));
  }
  videoClicked(): void{
    this.isVideoOff = !this.isVideoOff;
    this.store.dispatch(updateMediaStore({
      entry: {
        video: !this.isVideoOff
      }
    }));
  }
  callClicked(): void{
    this.closeModal.emit()
  }

  startScreenSharing(): void {
    this.store.dispatch(updateMediaStore({
      entry: {
        screenSharing: true
      }
    }));
  }
}
