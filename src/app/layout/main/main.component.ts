import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountEntry } from '../../core/schema/account.schema';
import { select, Store } from '@ngrx/store';
import { selectAccount } from '../../core/store/account/account.selector';
import { accountLogoutRequested, getUserRequested } from '../../core/store/account/account.action';
import decode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {

  public menus = [];
  public account: AccountEntry;
  public unsubscribeAll: Subject<boolean>;
  public selectAccount$: Observable<any>;
  displayIdentity: string;

  constructor(private route: ActivatedRoute, protected store: Store) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (localStorage.getItem('access-token')) {
      const token: any = decode(localStorage.getItem('access-token'));
      this.store.dispatch(getUserRequested({ input: { _id: token._id } }));
    }

    this.selectAccount$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );

    this.selectAccount$.subscribe(acc => {
      if (acc) {
        this.displayIdentity = acc.email;
        if (acc.lastName) {
          this.displayIdentity = acc.lastName;
          if (acc.firstName) {
            this.displayIdentity = acc.firstName + ' ' + acc.lastName;
          }
        } else if (acc.firstName) {
          this.displayIdentity = acc.firstName;
        }
        this.account = acc;
        this.menus = [
          {
            name: 'Home',
            url: '/home'
          },
        ];
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  logout(): void {
    const token: any = decode(localStorage.getItem('access-token'));
    this.store.dispatch(accountLogoutRequested({
      input: token._id
    }));
  }

}
