import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountState } from 'src/app/core/schema/account.schema';
import { selectAccountLoading, selectAccountErrorMessage } from 'src/app/core/store/account/account.selector';
import * as AccountAction from 'src/app/core/store/account/account.action';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public ForgotForm: FormGroup;
  public submitting$: Observable<boolean>;
  public errorMessage$: Observable<any>;
  public unsubscribeAll: Subject<boolean>;
  public loading$: Observable<boolean>;
  public forgotError: any;

  @Output() switchDisplayMode = new EventEmitter<any>();
  @Input() displayMode: any;

  constructor(protected store: Store<AccountState>, private router: Router) {
    this.ForgotForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });

    this.unsubscribeAll = new Subject();
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.submitting$ = this.store.pipe(
      select(selectAccountLoading),
      takeUntil(this.unsubscribeAll)
    );
    this.errorMessage$ = this.store.pipe(
      select(selectAccountErrorMessage),
      takeUntil(this.unsubscribeAll)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  onSubmitForgot(): void {
    this.store.dispatch(
      AccountAction.forgotPasswordRequested({ input: this.ForgotForm.value })
    );
    console.log('once');
    this.errorMessage$.subscribe(
      errorM => {
        this.forgotError = errorM;
      }
    );
  }

  onSwitch(displayMode): void {
    this.switchDisplayMode.emit(displayMode);
  }
}
