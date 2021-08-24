import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AccountEntry, AccountLogin, AccountLogout, AccountState } from '../schema/account.schema';
import { MainService } from './main.service';

@Injectable({
    providedIn: 'root',
})
export class UserManagementAPIService {
    constructor(private mainService: MainService) { }

    getAll(): Observable<any> {
        return this.mainService._GET('/api/users');
    }

    get(id: string): Observable<any> {
        return this.mainService._GET(`/api/users/${id}`);
    }

    getByStand(standnumber: number): Observable<any> {
        return this.mainService._GET(`/api/users/stand/${standnumber}`);
    }

    getCommercial(): Observable<any> {
        return this.mainService._GET(`/api/users/commercial`);
    }

    getExposant(): Observable<any> {
        return this.mainService._GET(`/api/users/exposants`);
    }

    getExposantNotSet(): Observable<any> {
        return this.mainService._GET(`/api/users/exposants/NotSet`);
    }

    add(user: AccountEntry): Observable<any> {
        return this.mainService._POST('/api/users/', user);
    }

    update(id, body): Observable<any> {
        return this.mainService._PUT('/api/users/', id, body);
    }

    delete(id: string): Observable<any> {
        return this.mainService._DELETE('/api/users/', id);
    }
}
