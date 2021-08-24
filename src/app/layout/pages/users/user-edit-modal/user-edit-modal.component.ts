import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountEntry } from 'src/app/core/schema/account.schema';
import { selectAccount } from 'src/app/core/store/account/account.selector';
import { getUserByStandRequested, userUpdateRequested } from 'src/app/core/store/user/user.action';
import { selectUserByStand, selectUserErrorMessage, selectUserLoading, selectUserSaving } from 'src/app/core/store/user/user.selector';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModalComponent implements OnInit, OnDestroy {
  public AccountEditForm: FormGroup;
  public submitting$: Observable<boolean>;
  public errorMessage$: Observable<any>;
  public loading$: Observable<boolean>;
  public account$: Observable<AccountEntry>;
  public unsubscribeAll: Subject<boolean>;
  serverError: any;
  account: AccountEntry;

  invalid = false;
  invalidMessage: string;
  userByStand$: Observable<AccountEntry>;

  isSaving$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AccountEntry,
    protected store: Store,
    public dialogRef: MatDialogRef<UserEditModalComponent>
  ) {
    this.AccountEditForm = new FormGroup({
      // _id: new FormControl(data._id, []),
      email: new FormControl(data.email, [
        Validators.required,
        Validators.email,
      ]),
      companyName: new FormControl(data.companyName, [
        Validators.required,
      ]),
      standNumber: new FormControl(data.standNumber, [
        Validators.pattern('^[0-9]*$'),
      ]),
      firstName: new FormControl(data.firstName, [Validators.required]),
      lastName: new FormControl(data.lastName, [Validators.required]),
      password: new FormControl('', [])
    });
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.isSaving$ = this.store.pipe(
      select(selectUserSaving),
      takeUntil(this.unsubscribeAll)
    );
    this.userByStand$ = this.store.pipe(
      select(selectUserByStand),
      takeUntil(this.unsubscribeAll)
    );
    this.loading$ = this.store.pipe(
      select(selectUserLoading),
      takeUntil(this.unsubscribeAll)
    );
    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );
    this.account$.subscribe(acc => {
      if (acc) {
        this.account = acc;
        // if COMMERCIAL
        if (this.account.role === 'exposant') {
          this.AccountEditForm.get('companyName').setValue(this.account.companyName);
          this.AccountEditForm.get('standNumber').setValue(this.account.standNumber);
        }
      }
    });
    this.errorMessage$ = this.store.pipe(
      select(selectUserErrorMessage),
      takeUntil(this.unsubscribeAll)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  onSubmit(): void {
    if (this.AccountEditForm.status === 'VALID') {
      if (this.account.role === 'exposant') {
        this.AccountEditForm.get('companyName').setValue(this.account.companyName);
        this.AccountEditForm.get('standNumber').setValue(this.account.standNumber);
        this.AccountEditForm.get('password').setValue('');
      }
      this.store.dispatch(
        userUpdateRequested({
          param: this.data._id,
          body: this.AccountEditForm.value,
        })
      );
      this.isSaving$.subscribe((saving) => {
        if (!saving) {
          this.errorMessage$.subscribe(error => {
            if (!error) {
              this.dialogRef.close();
            }
          });
        }
      });
    }
  }

  getErrorMessage(): any {
    if (this.AccountEditForm.get('email').hasError('required')) {
      return 'Veuillez entrer un email';
    }

    return this.AccountEditForm.get('email').hasError('email')
      ? 'email invalide'
      : '';
  }

  existStandNumber(): any {
    if (this.data && this.data.role === 'exposant') {
      this.invalidMessage = undefined;
      const sn = this.AccountEditForm.get('standNumber').value;
      if (sn) {
        this.store.dispatch(getUserByStandRequested({ standnumber: sn }));
        this.loading$.subscribe(loading => {
          if (loading) {
            this.userByStand$.subscribe(user => {
              if (user && user._id !== this.data._id) {
                this.invalid = true;
                this.invalidMessage = 'ce stand est déjà pris';
              } else {
                this.invalidMessage = '';
                this.invalid = false;
              }
            });
          }
        });
      }
    }
  }
}
