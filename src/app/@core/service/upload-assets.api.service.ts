import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AssetEntry } from '../schema/asset.schema';
import { MainService } from './main.service';

@Injectable({
    providedIn: 'root',
})
export class UploadAssetsAPIService {
    constructor(private mainService: MainService) { }

    getAll(): Observable<any> {
        return this.mainService._GET('/api/assets');
    }

    get(id: string): Observable<any> {
        return this.mainService._GET(`/api/assets/${id}`);
    }

    getByExhibitor(id: string): Observable<any> {
        return this.mainService._GET(`/api/assets/exhibitor/${id}`);
    }

    add(formData): Observable<any> {
        return this.mainService._POST('/api/assets/', formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    update(id, formData): Observable<any> {
        return this.mainService._PUT('/api/assets', id, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    delete(id: string): Observable<any> {
        return this.mainService._DELETE('/api/assets/', id);
    }

    updateItem(id, formData): Observable<any> {
        return this.mainService._PUT('/api/assets/item', id, formData);
    }

    upload(formData): Observable<any> {
        return this.mainService._POST('/api/upload/', formData, {
            reportProgress: true,
            observe: 'events'
        });
    }
}
