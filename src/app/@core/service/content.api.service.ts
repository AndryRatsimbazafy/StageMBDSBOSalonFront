import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Content, ContentEntry } from '../schema/content.schema';

import { MainService } from './main.service';

@Injectable({
  providedIn: 'root',
})
export class ContentAPIService {
  constructor(private service: MainService) {}

  createContent(body: ContentEntry): Observable<any> {
    return this.service._POST('/api/contents', body);
  }

  getContent(): Observable<any> {
    return this.service._GET('/api/contents');
  }

  updateContent(id: string, body: any): Observable<any> {
      return this.service._PUT('/api/contents', id, body);
  }
}
