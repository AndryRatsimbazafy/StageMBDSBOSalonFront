import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountState } from 'src/app/core/schema/account.schema';
import { selectAccountLoading, selectAccountErrorMessage } from 'src/app/core/store/account/account.selector';
import * as AccountAction from 'src/app/core/store/account/account.action';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  @Input() token: string;
  public ResetForm: FormGroup;
  public submitting$: Observable<boolean>;
  public errorMessage$: Observable<any>;
  public unsubscribeAll: Subject<boolean>;
  public hide = true;
  public hideConfirm = true;
  public loading$: Observable<boolean>;
  public loginError: any;

  @Output() switchDisplayMode = new EventEmitter<any>();
  @Input() displayMode: any;

  constructor(protected store: Store<AccountState>, private router: Router, private route: ActivatedRoute) {
    this.ResetForm = new FormGroup({
      // email: new FormControl({ value: null, disabled: true }, [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required]),
    });

    this.unsubscribeAll = new Subject();
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(selectAccountLoading),
      takeUntil(this.unsubscribeAll)
    );
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

  onSubmit(): void {
    this.loginError = undefined;
    if (this.ResetForm.invalid) {
      return;
    }
    if (this.ResetForm.get('password').value !== this.ResetForm.get('passwordConfirm').value) {
      this.loginError = 'les mots de passe ne correspondent pas';
      return;
    }
    this.store.dispatch(
      AccountAction.resetPasswordRequested({
        param: this.token, body: {
          password: this.ResetForm.get('password').value
        }
      })
    );
    this.submitting$.subscribe(
      submitting => {
        if (!submitting) {
          this.errorMessage$.subscribe(
            errorM => {
              if (!errorM) {
                // this.switchDisplayMode.emit(this.displayMode.Login);
                window.location.href = 'https://w3dsalonvituelreno2021.fr/';
              } else {
                this.loginError = errorM;
              }
            }
          );
        }
      }
    );
  }

}
