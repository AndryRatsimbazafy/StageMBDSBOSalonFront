import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
    providedIn: 'root',
})
export class RoomAPIService {
    constructor(private mainService: MainService) { }

    getAll(): Observable<any> {
        return this.mainService._GET('/api/rooms');
    }

    get(id: string): Observable<any> {
        return this.mainService._GET(`/api/rooms/${id}`);
    }

    getByUser(id: string): Observable<any> {
        return this.mainService._GET(`/api/rooms/user/${id}`);
    }

    add(item): Observable<any> {
        return this.mainService._POST('/api/rooms', item);
    }

    update(id, item): Observable<any> {
        return this.mainService._PUT('/api/rooms/', id, item);
    }

    delete(id: string): Observable<any> {
        return this.mainService._DELETE('/api/rooms/', id);
    }
}
