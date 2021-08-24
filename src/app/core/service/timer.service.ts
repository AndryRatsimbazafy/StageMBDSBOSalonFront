import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private mainService: MainService) {
  }

  get(): Observable<any> {
    return this.mainService._GET('/api/unity/timer');
  }

  post(data): Observable<any> {
    return this.mainService._POST('/api/unity/timer/', data);
  }

}
