import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatNotifService {
  newMessageNotif: HTMLAudioElement;
  stream: any;
  constructor() {
    this.initAudioElement();
  }

  initAudioElement() {
    this.newMessageNotif = this.createAudioElement('assets/notif-new-message.ogg');
  }

  createAudioElement(src: string) {
    const audioElement = document.createElement('audio');
    audioElement.style.display = 'none';
    audioElement.src = src;
    document.body.appendChild(audioElement);
    return audioElement;
  }

  
  async enableMyVideoStream({video = true, audio = true}): Promise<void> {
    await navigator.mediaDevices.getUserMedia({
        video, audio
    }).then(stream => {
      this.stream = stream;
    });
  }
}
