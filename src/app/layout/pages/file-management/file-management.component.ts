import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountEntry } from 'src/app/core/schema/account.schema';
import { AssetEntry } from 'src/app/core/schema/asset.schema';
import { RoomEntry } from 'src/app/core/schema/room.shema';
import { SnackbarService } from 'src/app/core/service/snackbar.service';
import { selectAccount } from 'src/app/core/store/account/account.selector';
import { assetUpdateRequested, getAssetByExhibitorRequested } from 'src/app/core/store/asset/asset.action';
import { selectAsset, selectAssetLoading, selectAssetState, selectAssetUpload } from 'src/app/core/store/asset/asset.selector';
import { getRoomByUserRequested } from 'src/app/core/store/room/room.action';
import { selectRoomLoading, selectUserRoom } from 'src/app/core/store/room/room.selector';
import { exposantLoadRequested, exposantNotSetLoadRequested } from 'src/app/core/store/user/user.action';
import { selectAllUsers } from 'src/app/core/store/user/user.selector';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment';
import { UploadAssetsComponent } from './upload-assets/upload-assets.component';
import * as roomActions from '../../../core/store/room/room.action';
import { AuthAPIService } from 'src/app/core/service/auth.api.service';
import { getNewAccessTokenRequested } from 'src/app/core/store/account/account.action';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit, OnDestroy {

  ColumnMode = ColumnMode;
  rows = [];
  columns = [{ prop: 'nom' }, { name: 'date' }, { name: 'Actions' }];
  mainFolder = [];
  flyersFolder = [];
  galleryFolder = [];
  videosFolder = [];
  asset: AssetEntry;
  accountLogged: any;
  isLoading$: Observable<boolean>;
  isUploading$: Observable<boolean>;
  roomLoading$: Observable<boolean>;
  account$: Observable<AccountEntry>;
  users$: Observable<AccountEntry[]>;
  asset$: Observable<AssetEntry>;
  room$: Observable<RoomEntry>;
  users = [];
  selectedUser: any;
  initial = true;
  room: any;
  public unsubscribeAll: Subject<boolean>;

  disableUpload = true;
  noRoomForUserMessage: string;

  constructor(
    public dialog: MatDialog,
    protected store: Store,
    private authAPI: AuthAPIService,
    private snackbar: SnackbarService) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );
    this.asset$ = this.store.pipe(
      select(selectAsset),
      takeUntil(this.unsubscribeAll)
    );
    this.room$ = this.store.pipe(
      select(selectUserRoom),
      takeUntil(this.unsubscribeAll)
    );
    this.roomLoading$ = this.store.pipe(
      select(selectRoomLoading),
      takeUntil(this.unsubscribeAll)
    );

    this.users$ = this.store.pipe(
      select(selectAllUsers),
      takeUntil(this.unsubscribeAll)
    );

    this.account$.subscribe(acc => {
      if (acc) {
        this.accountLogged = acc;
        if (this.accountLogged.role === 'admin' || this.accountLogged.role === 'superadmin') {
          this.store.dispatch(exposantLoadRequested());
          this.users$.subscribe(users => {
            if (users) { this.users = users.filter(e => e.companyName); }
          });
        } else {
          this.store.dispatch(getNewAccessTokenRequested());
          this.loadAssets(this.accountLogged._id);
          this.store.dispatch(getRoomByUserRequested({ input: this.accountLogged._id }));
          this.roomLoading$.subscribe(loading => {
            if (!loading) {
              this.room$.subscribe(room => {
                if (room && room.variant) {
                  this.room = room;
                  this.disableUpload = false;
                  this.noRoomForUserMessage = undefined;
                } else {
                  this.disableUpload = true;
                  if (!this.initial && !this.asset) {
                    this.noRoomForUserMessage = 'Veuillez configurer votre stand dans le menu \"Configurateur\" s\'il vous plaît';
                  }
                }
              });
            }
          });
        }
      }
    });

    this.isLoading$ = this.store.pipe(
      select(selectAssetLoading),
      takeUntil(this.unsubscribeAll)
    );

    this.asset$.subscribe(asset => {
      this.initial = false;
      if (asset) {
        this.assetBuilder(asset);
      }
    });

    this.isUploading$ = this.store.pipe(
      select(selectAssetUpload),
      takeUntil(this.unsubscribeAll)
    );

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openElement(item): void {
    if (item.type === 'file') {
      window.open(
        `${environment.SERVER_URL}/public/data/assets/${this.asset.idExposant}/${item.url}`,
        '_blank'
      );
    } else if (item.type === 'return') {
      this.rows = this.mainFolder;
    } else {
      this.rows = item.target;
    }
  }

  deleteObject(category, index): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete',
        message: 'Êtes-vous sûr de bien vouloir supprimer cet élément?',
        icon: 'warning',
        color: 'red'
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.result && res.result === 'confirmed') {
        switch (category) {
          case 'flyers':
            if (this.asset.flyers.length < 2) {
              this.snackbar.openSnackBarAlert('error', 'Il vous faut au moins un flyer');
              return;
            }
            this.asset.flyers.splice(index, 1);
            break;
          case 'gallery':
            this.asset.gallery.splice(index, 1);
            break;
          case 'videos':
            this.snackbar.openSnackBarAlert('error', 'Vous ne pouvez pas supprimer cet élément');
            return;
            break;
        }
        this.store.dispatch(assetUpdateRequested({ param: this.asset._id, body: this.asset }));
        this.isUploading$.subscribe(uploading => {
          if (!uploading) {
            this.asset$.subscribe(asset => {
              if (asset && (asset as any).body) {
                this.assetBuilder((asset as any).body);
              }
            });
          }
        })
      }
    });
  }

  upload(): void {
    let dialog;
    if (this.asset) {
      dialog = this.dialog.open(UploadAssetsComponent, {
        data: this.asset
      });
    } else {
      dialog = this.dialog.open(UploadAssetsComponent, {
        data: {
          idExposant: (this.accountLogged.role === 'superadmin' || this.accountLogged.role === 'admin')
            ? this.selectedUser._id : this.accountLogged._id,
        }
      });
    }

    if (dialog) {
      dialog.afterClosed().subscribe(data => {
        if (data && data.userId) {
          this.loadAssets(data.userId);
          this.asset$.subscribe(asset => {
            this.initial = false;
            if (asset) {
              this.assetBuilder((asset as any).success ? (asset as any).body : asset);
            }
          });
        }
      });
    }
  }

  loadAssets(userid): void {
    this.store.dispatch(getAssetByExhibitorRequested({ input: { _id: userid } }));
  }

  onOptionsSelected(value): void {
    this.asset = undefined;
    this.mainFolder = [];
    this.rows = [];
    this.selectedUser = this.users.find(({ _id }) => _id === value);
    this.loadAssets(this.selectedUser._id);
    this.store.dispatch(getRoomByUserRequested({ input: this.selectedUser._id }));

    this.roomLoading$.subscribe(loading => {
      if (!loading) {
        this.room$.subscribe(room => {
          if (room && room.variant) {
            this.disableUpload = false;
            this.noRoomForUserMessage = undefined;
          } else {
            this.disableUpload = true;
            this.noRoomForUserMessage = 'Veuillez configurer le stand de l\'utilisateur sélectionné dans le menu \"Configurateur\" s\'il vous plaît';
          }
        });
      }
    });
  }

  assetBuilder(asset): void {
    this.asset = JSON.parse(JSON.stringify(asset));

    // flyers
    this.flyersFolder = [
      { name: '...', date: asset.createdAt, type: 'return', target: this.mainFolder }
    ];
    if (asset.flyers) {
      asset.flyers.forEach(e => this.flyersFolder.push({
        name: e.replace(/^.*[\\\/]/, ''), date: asset.createdAt, type: 'file', category: 'flyers', url: e
      }));
    }

    // gallery
    this.galleryFolder = [
      { name: '...', date: asset.createdAt, type: 'return', target: this.mainFolder }
    ];
    if (asset.gallery) {
      asset.gallery.forEach(e => this.galleryFolder.push(
        { name: e.replace(/^.*[\\\/]/, ''), date: asset.createdAt, type: 'file', category: 'gallery', url: e }
      ));
    }

    // videos
    this.videosFolder = [
      { name: '...', date: asset.createdAt, type: 'return', target: this.mainFolder }
    ];
    if (asset.videos && !asset.videos.map(v => v.index).includes(undefined) && !asset.videos.map(v => v.name).includes(undefined)) {
      asset.videos.forEach(e => this.videosFolder.push(
        { name: e.name.replace(/^.*[\\\/]/, ''), date: asset.createdAt, type: 'file', category: 'videos', url: e.name }
      ));
    }

    // main folder
    this.mainFolder = [
      { name: 'flyers', date: asset.createdAt, type: 'folder', target: this.flyersFolder },
      { name: 'galerie', date: asset.createdAt, type: 'folder', target: this.galleryFolder },
      { name: 'vidéos', date: asset.createdAt, type: 'folder', target: this.videosFolder },
    ];
    if (asset.logo) {
      this.mainFolder.push({
        name: asset.logo.replace(/^.*[\\\/]/, ''), date: asset.createdAt, category: 'logo', type: 'file', url: asset.logo
      });
    }
    // console.log('this.mainFolder', this.mainFolder)
    this.rows = this.mainFolder;

    this.rows = this.rows ? [...this.rows] : [];
  }
}
