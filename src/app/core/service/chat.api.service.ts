import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  uploadUrl = `${environment.CHAT_SERVER_URL}/api/upload`;

  constructor(
    private socket: Socket,
    private mainService: MainService,
    private http: HttpClient
  ) {}

  listen(eventName: string): Observable<any> {
    console.log('listen to :', eventName);
    return this.socket.fromEvent(eventName);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  connectSocket(username: string, userID: string) {
    console.log('connection service ok..');
    this.socket.ioSocket.io.opts.query = { username, userID };
    this.socket.ioSocket.userID = userID;

    this.socket.connect();
  }

  disconnetSocket() {
    this.socket.disconnect();
  }

  upload(body: any): Observable<any> {
    return this.http.post(this.uploadUrl, body)
  }
}
