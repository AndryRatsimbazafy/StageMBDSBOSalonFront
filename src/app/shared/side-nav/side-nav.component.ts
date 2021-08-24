import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { decode } from 'querystring';
import { accountLogoutRequested } from 'src/app/core/store/account/account.action';
import { selectAccount } from 'src/app/core/store/account/account.selector';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit {

  accountType: string;
  account;
  userLabel = '';

  constructor(protected store: Store) { }

  ngOnInit(): void {
    this.store.select(selectAccount).subscribe(acc => {
      if (acc) {
        this.accountType = acc.role;
        this.userLabel = 'Liste des utilisateurs';
        this.account = acc;
      }
    });
  }

  logout(): void {
    const helper = new JwtHelperService();
    const token: any = helper.decodeToken(localStorage.getItem('access-token'));
    console.log("deconnection token", token)
    this.store.dispatch(accountLogoutRequested({
      input: token._id
    }));
  }

}
