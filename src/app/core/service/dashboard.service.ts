import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  visitByAssetType(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitByAssetType`);
  }

  visitByAsset(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitByAsset`);
  }
  
  visitTimeByExposant(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitTimeByExposant`);
  }
  
  visitByAges(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitByAges`);
  }
  
  visitByAssetsPerHours(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitByAssetsPerHours`);
  }

  visitAssetTypeByAges(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitAssetTypeByAges`);
  }
  
  visitAssetPerDays(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/visitAssetPerDays`);
  }

  usersByAge(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/usersByAge`);
  }

  usersByAgeByGender(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_URL}/api/dashboard/usersByAgeByGender`);
  }
}
