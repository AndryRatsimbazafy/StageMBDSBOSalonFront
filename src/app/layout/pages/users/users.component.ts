import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AccountEntry } from 'src/app/core/schema/account.schema';
import { selectAllUsers } from 'src/app/core/store/user/user.selector';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { UserAddModalComponent } from './user-add-modal/user-add-modal.component';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import * as userAction from 'src/app/core/store/user/user.action';
import { selectAccount } from 'src/app/core/store/account/account.selector';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { userUpdateRequested } from 'src/app/core/store/user/user.action';
import { RoomEntry } from 'src/app/core/schema/room.shema';
import { selectUserRoom } from 'src/app/core/store/room/room.selector';
import {Column, Workbook} from 'exceljs';
import * as fs from 'file-saver';
import * as _ from 'lodash';
import { getRoomByUserRequested } from 'src/app/core/store/room/room.action';
import {UserDetailModalComponent} from './user-detail-modal/user-detail-modal.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['avatar', 'email', 'companyName', 'standNumber', 'role', 'active', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  users$: Observable<AccountEntry[]>;
  users: AccountEntry[];
  account$: Observable<AccountEntry>;
  room$: Observable<RoomEntry>;
  public unsubscribeAll: Subject<boolean>;

  userLabel: string;
  account: string;
  nbCharacters: number;

  constructor(public dialog: MatDialog, private store: Store) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );

    this.room$ = this.store.pipe(
      select(selectUserRoom),
      takeUntil(this.unsubscribeAll)
    );

    this.account$.subscribe(acc => {
      if (acc) {
        this.account = acc.role;
        this.userLabel = 'Liste des utilisateurs';
        this._loadByRole();
        this.store.dispatch(getRoomByUserRequested({ input: acc._id }));
        this.room$.subscribe(room => {
          if (room && room.characters) {
            this.nbCharacters = room.characters.length;
          }
        });
      }
    });

    this.users$ = this.store.select(selectAllUsers);

    this.users$.subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  addUser(): void {
    this.dialog.open(UserAddModalComponent, {});
  }

  editUser(user): void {
    const editModal = this.dialog.open(UserEditModalComponent, {
      data: user
    });
    editModal.afterClosed().subscribe(() => {
      this._loadByRole();
    });
  }

  exportAll(): void {
    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('salon');

    const COLUMNS = [
      {
        key: 'firstName',
        header: 'Nom',
        width: 20,
      },
      {
        key: 'lastName',
        header: 'Prénom',
        width: 20,
      },
      {
        key: 'email',
        header: 'Email',
        width: 30,
      },
      {
        key: 'phoneNumber',
        header: 'Téléphone',
        width: 20,
      },
      {
        key: 'postalCode',
        header: 'Code postal',
        width: 10,
      },
      {
        key: 'projects',
        header: 'Projets',
        width: 40,
      },
      {
        key: 'conferences',
        header: 'Conférence',
        width: 50,
      },
      {
        key: 'coachingDate',
        header: 'Date coaching',
        width: 20,
      },
      {
        key: 'coachingHour',
        header: 'Heure Coaching',
        width: 20,
      },
      {
        key: 'regReason',
        header: 'Raison de votre visite',
        width: 20,
      },
    ];

    worksheet.columns = COLUMNS;

    const objectKeys = ['projects', 'conferences'];

    for (const user of this.users) {
      const u = {
        ...user,
        coachingDate: user?.coachings?.coachingDate,
        coachingHour: user?.coachings?.coachingHour
      };
      let lineBreak = 20;
      let lineCount = 1;
      for (const key of objectKeys) {
        if (typeof user[key] === 'object') {
          lineCount = lineCount < user[key].lenght && user[key].length;
          Object.assign(u, {[key]: user[key].join('\n')});
        }
      }
      lineBreak = 20 * lineCount;
      const row = worksheet.addRow(u);
      row.height = lineBreak;
      row.alignment = {wrapText: true, vertical: 'middle'};
    }

    /* save to file */
    const fileName = `Liste-Utilisateurs-Salon-virtuel-2021-${new Date().valueOf()}.xlsx`;
    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    });
  }

  openDetail(user: AccountEntry): void {
    const detailModal = this.dialog.open(UserDetailModalComponent, {
      data: user,
      width: '700px',
      maxHeight: '90vh'
    });
  }

  deleteObject(user): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete',
        message: 'Voulez-vous vraiment supprimer cet utilisateur?',
        icon: 'warning',
        color: 'red'
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.result && res.result === 'confirmed') {
        this.store.dispatch(userAction.userDeleteRequested({ id: user._id }));
      }
    });
  }

  private _loadByRole(): void {
    switch (this.account) {
      case 'exposant':
        this.store.dispatch(userAction.commercialLoadRequested());
        break;
      default:
        this.store.dispatch(userAction.userLoadRequested());
        break;
    }
  }

  getFilteredData(data): void {
    data.subscribe((entries) => {
      this.dataSource = new MatTableDataSource<AccountEntry>(entries);
      this.dataSource.paginator = this.paginator;
    });
  }
}
