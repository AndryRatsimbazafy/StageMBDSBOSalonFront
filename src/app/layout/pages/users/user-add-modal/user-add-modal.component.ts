import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { takeUntil } from 'rxjs/operators';
import { AccountEntry } from 'src/app/core/schema/account.schema';
import { RoomEntry } from 'src/app/core/schema/room.shema';
import { addRoomRequested, getRoomByUserRequested } from 'src/app/core/store/room/room.action';
import { selectAllRooms, selectUserRoom } from 'src/app/core/store/room/room.selector';
import { exposantLoadRequested, getUserByStandRequested, userAddedReset, userSaveRequested } from 'src/app/core/store/user/user.action';
import { selectListEntries, selectUserByStand, selectUserErrorMessage, selectUserLoading, selectUserSaved, selectUserSaving } from 'src/app/core/store/user/user.selector';
import { selectAccount, selectAccountErrorMessage } from '../../../../core/store/account/account.selector';

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.component.html',
  styleUrls: ['./user-add-modal.component.scss']
})
export class UserAddModalComponent implements OnInit, OnDestroy {

  public unsubscribeAll: Subject<boolean>;
  public AccountAddForm: FormGroup;
  hide = true;
  serverError: any;
  isSaving$: Observable<boolean>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;
  account$: Observable<AccountEntry>;
  userByStand$: Observable<AccountEntry>;
  userRoom$: Observable<RoomEntry>;
  userSaved$: Observable<any>;
  account: AccountEntry;
  room: RoomEntry;
  savedUser: AccountEntry;
  invalid = false;
  invalidMessage: string;

  constructor(protected store: Store, private dialogRef: MatDialogRef<UserAddModalComponent>) {
    this.AccountAddForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required, Validators.min(4)]),
      active: new FormControl(true, []),
      companyName: new FormControl('', [Validators.required]),
      standNumber: new FormControl(''/*, [Validators.required, Validators.pattern('^[0-9]*$')]*/),
    });
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.store.dispatch(userAddedReset());
    this.isSaving$ = this.store.pipe(
      select(selectUserSaving),
      takeUntil(this.unsubscribeAll)
    );

    this.loading$ = this.store.pipe(
      select(selectUserLoading),
      takeUntil(this.unsubscribeAll)
    );

    this.userByStand$ = this.store.pipe(
      select(selectUserByStand),
      takeUntil(this.unsubscribeAll)
    );

    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );

    this.userRoom$ = this.store.pipe(
      select(selectUserRoom),
      takeUntil(this.unsubscribeAll)
    );

    this.userSaved$ = this.store.pipe(
      select(selectUserSaved),
      takeUntil(this.unsubscribeAll)
    );

    this.account$.subscribe(acc => {
      if (acc) {
        this.account = acc;
        // if COMMERCIAL
        if (this.account.role === 'exposant') {
          this.AccountAddForm.get('companyName').setValue(this.account.companyName);
          this.AccountAddForm.get('standNumber').setValue(this.account.standNumber);
        }
        this.store.dispatch(getRoomByUserRequested({ input: this.account._id }));
      }
    });
    this.userRoom$.subscribe(room => {
      if (room) {
        this.room = JSON.parse(JSON.stringify(room));
      }
    });
    this.userSaved$.subscribe(saved => {
      if (saved) {
        this.savedUser = saved;
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
    if (this.AccountAddForm.invalid) {
      return;
    }

    // if COMMERCIAL
    if (this.account.role === 'exposant') {
      this.AccountAddForm.get('companyName').setValue(this.account.companyName);
      this.AccountAddForm.get('standNumber').setValue(this.account.standNumber);
    }

    this.store.dispatch(userSaveRequested({
      input: this.AccountAddForm.value
    }));

    this.isSaving$.subscribe(saving => {
      if (!saving) {
        this.errorMessage$.subscribe(error => {
          if (!error) { this.dialogRef.close(); }
        });
      }
    });
  }

  getErrorMessage(): any {
    if (
      this.AccountAddForm.get('email').hasError('required')
    ) {
      return 'Veuillez remplir ce champ';
    } else if (this.AccountAddForm.get('role').hasError('required')) {
      return 'Veuillez sélectionner un rôle';
    }

    return this.AccountAddForm.get('email').hasError('email') ? 'email invalide' : '';
  }

  existStandNumber(): any {
    const role = this.AccountAddForm.get('role').value;
    if (role) {
      this.invalidMessage = undefined;
      switch (role) {
        case 'exposant':
          const sn = this.AccountAddForm.get('standNumber').value;
          if (sn) {
            this.store.dispatch(getUserByStandRequested({ standnumber: sn }));
            this.loading$.subscribe(loading => {
              if (loading) {
                this.userByStand$.subscribe(user => {
                  if (user) {
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
          break;
        case 'admin':
          this.invalid = false;
          this.AccountAddForm.get('standNumber').setValue(401);
          break;
        case 'commercial':
          this.invalid = false;
          if (this.account.role === 'exposant') {
            this.AccountAddForm.get('standNumber').setValue(this.account.standNumber);
          } else {
            this.AccountAddForm.get('standNumber').setValue(301);
          }
          break;
        default:
          this.invalid = false;
          this.AccountAddForm.get('standNumber').setValue(301);
          break;
      }
    }
  }
}
