import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { selectAccountErrorMessage, selectAccountLoading } from 'src/app/core/store/account/account.selector';
import * as AccountAction from 'src/app/core/store/account/account.action';
import { AccountState } from 'src/app/core/schema/account.schema';

enum DisplayMode {
  Login,
  Forgot,
  Reset
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public AccountForm: FormGroup;
  public submitting$: Observable<boolean>;
  public errorMessage$: Observable<any>;
  public unsubscribeAll: Subject<boolean>;
  public hide = true;
  public loading$: Observable<boolean>;
  public loginError: any;
  public mode = DisplayMode.Login;
  public displayMode = DisplayMode;
  token: string;

  constructor(protected store: Store<AccountState>, private router: Router, private route: ActivatedRoute) {
    this.AccountForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.unsubscribeAll = new Subject();
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.loading$ = this.store.select(selectAccountLoading);
    this.submitting$ = this.store.pipe(
      select(selectAccountLoading),
      takeUntil(this.unsubscribeAll)
    );
    this.errorMessage$ = this.store.pipe(
      select(selectAccountErrorMessage),
      takeUntil(this.unsubscribeAll)
    );

    this.getToken();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  onSubmit(): void {
    this.loginError = undefined;
    if (this.AccountForm.invalid) {
      return;
    }
    this.store.dispatch(
      AccountAction.accountLoginRequested({ input: this.AccountForm.value })
    );
    this.errorMessage$.subscribe(
      errorM => {
        this.loginError = errorM;
      }
    );
  }

  onSwitch(displayMode): void {
    this.mode = displayMode;
  }

  getToken(): any {
    this.route.params
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(param => {
        if (param && param.token) {
          this.token = param.token;
          this.mode = DisplayMode.Reset;
        }
      });
  }
}
