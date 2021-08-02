import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient) {
  }

  _GET(path: string, param: any = '') {
    return this.http.get<any>(`${environment.SERVER_URL}${path}/${param}`);
  }

  _PUT(path: string, param: any, body: any, options = {}) {
    return this.http.put<any>(`${environment.SERVER_URL}${path}/${param}`, body, options);
  }

  _POST(path: string, body: any, options = {}) {
    return this.http.post<any>(`${environment.SERVER_URL}${path}`, body, options);
  }

  _DELETE(path: string, param: any) {
    return this.http.delete<any>(`${environment.SERVER_URL}${path}/${param}`);
  }
}
