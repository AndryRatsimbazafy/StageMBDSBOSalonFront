import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountEntry } from 'src/app/@core/schema/account.schema';
import { ContentEntry, ContentValue } from 'src/app/@core/schema/content.schema';
import { RoomEntry, RoomState } from 'src/app/@core/schema/room.shema';
import { selectAccount } from 'src/app/@core/store/account/account.selector';
import { getContentRequested } from 'src/app/@core/store/content/content.action';
import {
  selectAllContents, selectDefaultContent,
} from 'src/app/@core/store/content/content.selector';
import { addRoomRequested, getRoomByUserRequested } from 'src/app/@core/store/room/room.action';
import { selectAllRooms, selectRoom, selectRoomError, selectRoomLoading, selectRoomSaving, selectRoomState, selectUserRoom } from 'src/app/@core/store/room/room.selector';
import { exposantLoadRequested, exposantNotSetLoadRequested, userLoadRequested, userUpdateRequested } from 'src/app/@core/store/user/user.action';
import { selectAllUsers } from 'src/app/@core/store/user/user.selector';
import { ConfirmDialogComponent } from 'src/app/@shared/confirm-dialog/confirm-dialog.component';
import { ConfiguratorConfirmedPreviewDialogComponent } from './configurator-confirmed-preview-dialog/configurator-confirmed-preview-dialog.component';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit, OnDestroy {

  selectedType: any;
  selectedUser: any;
  selectedVariante: any;
  selectedColor: any;
  selectedMob: any;
  selectedPersonnages = [];
  validSelection = false;
  errorMessage: string;
  isLinear = true;
  typeFormGroup: FormGroup;
  varianteFormGroup: FormGroup;
  mobFormGroup: FormGroup;
  personnageFormGroup: FormGroup;
  maxReached = false;
  maxPerso = 0;
  initial = true;
  companyName: string;

  room: RoomEntry;
  loggedUser: any;
  asset: any;
  modifiable = true;
  isSaving$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  errorMassage$: Observable<string>;
  account$: Observable<AccountEntry>;
  defaultContent$: Observable<any>;
  roomState$: Observable<RoomState>;
  userRoom$: Observable<RoomEntry>;
  users$: Observable<AccountEntry[]>;
  saveState: number;
  users = [];

  loadTypeImages = false;
  loadVariantImages = false;
  loadMobImages = false;
  loadPersoImages = false;

  public unsubscribeAll: Subject<boolean>;

  originalContent = {
    types: [],
    variantes: [],
    mob: [],
    personnages: [],
  };
  content = {
    types: [],
    variantes: [],
    mob: [],
    personnages: [],
  };
  surfaces = [
    '12m²',
    '24m²',
    '48m²',
    '72m²',
  ];

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  // tslint:disable-next-line: variable-name
  constructor(public dialog: MatDialog, protected store: Store, private _formBuilder: FormBuilder) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.saveState = 0;

    this.typeFormGroup = this._formBuilder.group({
      selectExp: new FormControl('', [Validators.required]),
      surface: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
    });
    this.varianteFormGroup = this._formBuilder.group({
      variant: ['', Validators.required]
    });
    this.mobFormGroup = this._formBuilder.group({
      mob: ['', Validators.required]
    });
    this.personnageFormGroup = this._formBuilder.group({
      characters: ['', Validators.required]
    });

    this.store.dispatch(getContentRequested());

    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );

    this.users$ = this.store.pipe(
      select(selectAllUsers),
      takeUntil(this.unsubscribeAll)
    );

    this.account$.subscribe(acc => {
      if (acc) {
        this.loggedUser = acc;
        this.store.dispatch(getRoomByUserRequested({ input: this.loggedUser._id }));
        this.initial = false;
        this.companyName = this.loggedUser.companyName;
        if (this.loggedUser.role === 'admin' || this.loggedUser.role === 'superadmin') {
          this.store.dispatch(exposantNotSetLoadRequested());
          this.users$.subscribe(users => {
            if (users) { this.users = users.filter(e => e.companyName); }
          });
        } else {
          this.typeFormGroup.get('selectExp').setValue(this.loggedUser.email);
        }
      }
    });

    this.defaultContent$ = this.store.pipe(
      select(selectDefaultContent),
      takeUntil(this.unsubscribeAll)
    );

    this.userRoom$ = this.store.pipe(
      select(selectUserRoom),
      takeUntil(this.unsubscribeAll)
    );

    this.defaultContent$.subscribe((result) => {
      if (result && result[0]) {
        this.originalContent = JSON.parse(JSON.stringify(result[0] as any));
        this.content = JSON.parse(JSON.stringify(result[0] as any));
        this.userRoom$.subscribe(room => {
          if (room) {
            this.room = room;
            if (this.room.type && this.loggedUser && this.loggedUser.role !== 'admin' && this.loggedUser.role !== 'superadmin') {
              // [CONVENTION]: room is modifiable if type is not set
              this.modifiable = false;
            }
          }
        });
      }
    });

    this.isSaving$ = this.store.pipe(
      select(selectRoomSaving),
      takeUntil(this.unsubscribeAll)
    );
    this.isLoading$ = this.store.pipe(
      select(selectRoomLoading),
      takeUntil(this.unsubscribeAll)
    );
    this.errorMassage$ = this.store.pipe(
      select(selectRoomError),
      takeUntil(this.unsubscribeAll)
    );
    this.roomState$ = this.store.pipe(
      select(selectRoomState),
      takeUntil(this.unsubscribeAll)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  submit(): void {
    if (this.modifiable) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          action: 'Confirm',
          message: `Vous ne pourrez plus modifier votre sélection. Êtes-vous certains(es) de vouloir confirmer?`,
          icon: 'warning',
          color: '#cb3a5f'
        },
      });

      dialogRef.afterClosed().subscribe((res) => {

        if (res && res.result && res.result === 'confirmed') {

          this.errorMessage = undefined;

          // Validation
          if (this.typeFormGroup.invalid) { return; }
          if (this.varianteFormGroup.invalid) { return; }
          if (this.mobFormGroup.invalid) { return; }
          if (this.personnageFormGroup.invalid) { return; }

          //  ADMIN CASE
          let concernedUserId;
          if (this.loggedUser?.role === 'admin' || this.loggedUser?.role === 'superadmin') {
            if (!this.selectedUser) {
              this.errorMessage = 'Veuillez sélectionner une société exposante';
              return;
            }
            concernedUserId = this.selectedUser._id;
          } else if (this.loggedUser?.role === 'exposant') {
            concernedUserId = this.loggedUser._id;
          }

          // Everything is OK
          delete this.selectedType.selected;
          delete this.selectedVariante.selected;
          delete this.selectedMob.selected;
          this.selectedPersonnages.forEach(element => {
            delete element.selected;
          });

          this.room = {
            user_id: concernedUserId,
            type: this.selectedType,
            variant: this.selectedVariante,
            mob: this.selectedMob,
            color: `#${this.typeFormGroup.get('color').value.hex}`,
            characters: (this.selectedPersonnages as any),
            commercial: this.room ? this.room.commercial : ([] as any)
          };
          this.store.dispatch(addRoomRequested({ input: this.room }));

          this.roomState$.subscribe(state => {
            if (!state.isSaving && !state.errorMessage) {
              if (this.loggedUser?.role !== 'admin' && this.loggedUser.role !== 'superadmin') { this.modifiable = false; }
              if (this.loggedUser?.role === 'admin' && this.loggedUser.role !== 'superadmin' && !this.selectedUser.companyName) {
                this.store.dispatch(userUpdateRequested({
                  param: this.selectedUser._id, body: {
                    ... this.selectedUser,
                    companyName: this.typeFormGroup.get('name').value
                  }
                }));
              } else if (this.loggedUser?.role === 'exposant' && !this.loggedUser.companyName) {
                this.store.dispatch(userUpdateRequested({
                  param: this.loggedUser._id, body: {
                    ... this.loggedUser,
                    companyName: this.typeFormGroup.get('name').value
                  }
                }));
              }
              if (this.loggedUser?.role === 'admin' || this.loggedUser.role === 'superadmin') {
                this.typeFormGroup.reset();
                this.varianteFormGroup.reset();
                this.mobFormGroup.reset();
                this.personnageFormGroup.reset();
                const prevDialog = this.dialog.open(ConfiguratorConfirmedPreviewDialogComponent, {
                  data: {
                    room: this.room,
                    companyName: this.selectedUser.companyName
                  },
                  maxHeight: '95vh'
                });
                prevDialog.afterClosed().subscribe(() => {
                  window.location.reload();
                });
              }
            }
          });
        }
      });

    }
  }

  toggle(newValue: boolean, item: ContentValue, type: string): void {
    if (item && item._id) {
      this.errorMessage = undefined;
      switch (type) {
        case 'type':
          this.typeFormGroup.get('surface').setValue(undefined);
          this.content.variantes = this.originalContent.variantes;
          this.content.mob = this.originalContent.mob;
          this.content.personnages = this.originalContent.personnages;
          this.content.types.forEach(element => {
            element.selected = false;
          });
          this.selectedType = null;
          if (newValue) {
            item.selected = true;
            this.selectedType = item;
            this.typeFormGroup.get('surface').setValue(item.name);
            this.content.variantes = this.originalContent.variantes.filter(e => e.idTypes === item._id);
            this.content.mob = this.originalContent.mob.filter(e => e.idTypes === this.selectedType._id);
            this.content.personnages = this.originalContent.personnages.filter(e => e.types.includes(this.selectedType.name));

            this.selectedVariante = undefined;
            this.selectedColor = undefined;
            this.selectedMob = undefined;
            this.selectedPersonnages = [];
            this.maxPerso = this.selectedType.maxPersonnage;
            this.maxReached = false;

            this.originalContent.personnages.forEach(p => {
              p.uncheckable = false;
              p.selected = false;
            });
          }
          break;
        case 'variante':
          this.varianteFormGroup.get('variant').setValue(undefined);

          this.content.variantes.forEach(element => {
            element.selected = false;
          });
          this.selectedVariante = null;
          if (newValue) {
            item.selected = true;
            this.selectedVariante = item;
            this.varianteFormGroup.get('variant').setValue(item.name);

          }
          break;
        case 'mob':
          this.mobFormGroup.get('mob').setValue(undefined);

          this.content.mob.forEach(element => {
            element.selected = false;
          });
          this.selectedMob = null;
          if (newValue) {
            item.selected = true;
            this.selectedMob = item;
            this.mobFormGroup.get('mob').setValue(item.name);

          }
          break;
        case 'personnage':
          this.personnageFormGroup.get('characters').setValue(undefined);
          const selected = this.selectedPersonnages.find(i => i._id === item._id);
          if (newValue && !selected) {
            if (!this.maxReached) {
              this.selectedPersonnages.push(item);
              item.selected = true;
              if (this.selectedPersonnages.length === this.selectedType.maxPersonnage) {
                this.maxReached = true;
                this.originalContent.personnages.forEach(p => {
                  const exist = this.selectedPersonnages.find(i => i._id === p._id);
                  if (!exist) {
                    p.uncheckable = true;
                    p.selected = false;
                  }
                });
              }
            }
          } else {
            if (selected) {
              this.selectedPersonnages.splice(this.selectedPersonnages.findIndex(i => i._id === item._id), 1);
              item.selected = false;
              if (this.selectedPersonnages.length < this.selectedType.maxPersonnage) {
                this.maxReached = false;
                this.originalContent.personnages.forEach(p => {
                  p.uncheckable = false;
                });
              }
            }
          }

          if (this.selectedPersonnages.length > 0 || this.maxReached) {
            console.log('this.selectedPersonnages', this.selectedPersonnages)
            this.personnageFormGroup.get('characters').setValue('ok');
          }
          break;
      }
      this.validSelection = (this.selectedType && this.selectedVariante) ? true : false;
    }
  }

  submitSingleForm(formControl): void {
    formControl.markAllAsTouched();
  }

  onOptionsSelected(value): void {
    this.selectedUser = this.users.find(({ _id }) => _id === value);
  }
}
