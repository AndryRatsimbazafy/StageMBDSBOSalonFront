import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { Observable, observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountEntry } from 'src/app/@core/schema/account.schema';
import { RoomEntry } from 'src/app/@core/schema/room.shema';
import { selectAccount } from 'src/app/@core/store/account/account.selector';
import {
  assetSaveRequested, assetUpdateItemRequested, assetUpdateRequested, uploadRequested
} from 'src/app/@core/store/asset/asset.action';
import {
  selectAsset,
  selectAssetError, selectAssetLoading,
  selectAssetUpload, selectAssetUploadedBytes
} from 'src/app/@core/store/asset/asset.selector';
import { getContentRequested } from 'src/app/@core/store/content/content.action';
import { selectDefaultContent } from 'src/app/@core/store/content/content.selector';
import { getRoomByUserRequested } from 'src/app/@core/store/room/room.action';
import { selectUserRoom } from 'src/app/@core/store/room/room.selector';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AssetEntry } from 'src/app/@core/schema/asset.schema';

@Component({
  selector: 'app-upload-assets',
  templateUrl: './upload-assets.component.html',
  styleUrls: ['./upload-assets.component.scss']
})
export class UploadAssetsComponent implements OnInit, OnDestroy {

  pdfPrev: any;
  loggedAccount: any;
  folderForm: FormGroup;
  logo: any;
  logoPreview: any;
  videoPreview = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  ]; // 10 videos MAX
  flyerPreview = [];
  errorMessage = '';
  serverError$: Observable<string>;
  confirmErrorMessage = '';
  private re = /(?:\.([^.]+))?$/; // for file extension
  loading$: Observable<boolean>;
  uploading$: Observable<boolean>;
  account$: Observable<AccountEntry>;
  room$: Observable<RoomEntry>;
  defaultContent$: Observable<any>;
  uploadedBytes$: Observable<number>;
  recentlyAddedAsset$: Observable<AssetEntry>;
  logoLoading = true;
  videoLoading = true;
  flyersLoading = true;
  galleryLoading = true;
  helpMe = false;
  assetOwnerId: string;
  roomType: any;
  imagePreviewForVideo: any;
  uploadProgress: number;
  totalUploadStats = {
    totalFiles: 0,
    uploadedFiles: 0,
    uploadedBytes: 0,
    totalBytes: 0
  };
  allVideoUploaded = false;
  loadingProgress: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  selectedLogoExt: string;

  public unsubscribeAll: Subject<boolean>;

  @ViewChild('flyerInput', { static: false }) flyerInput: ElementRef;
  flyerFiles = [];
  @ViewChild('galleryInput', { static: false }) galleryInput: ElementRef;
  galleryFiles = [];
  galleryPreview = [];
  @ViewChild('videoInput', { static: false }) videoInput: ElementRef;
  videoFiles = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadAssetsComponent>, private formBuilder: FormBuilder,
    protected store: Store, private domSanitizer: DomSanitizer) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.logo = undefined;
    this.flyerFiles = [];
    this.galleryFiles = [];
    this.videoFiles = [];

    this.logoPreview = undefined;
    this.videoPreview = [];
    this.flyerPreview = [];
    this.galleryPreview = [];

    this.folderForm = this.formBuilder.group({
      folderName: ['', []]
    });

    this.loading$ = this.store.pipe(
      select(selectAssetLoading),
      takeUntil(this.unsubscribeAll)
    );
    this.uploading$ = this.store.pipe(
      select(selectAssetUpload),
      takeUntil(this.unsubscribeAll)
    );
    this.serverError$ = this.store.pipe(
      select(selectAssetError),
      takeUntil(this.unsubscribeAll)
    );
    this.account$ = this.store.pipe(
      select(selectAccount),
      takeUntil(this.unsubscribeAll)
    );
    this.room$ = this.store.pipe(
      select(selectUserRoom),
      takeUntil(this.unsubscribeAll)
    );
    this.defaultContent$ = this.store.pipe(
      select(selectDefaultContent),
      takeUntil(this.unsubscribeAll)
    );
    this.uploadedBytes$ = this.store.pipe(
      select(selectAssetUploadedBytes),
      takeUntil(this.unsubscribeAll)
    );

    this.recentlyAddedAsset$ = this.store.pipe(
      select(selectAsset),
      takeUntil(this.unsubscribeAll)
    );

    this.store.dispatch(getContentRequested());

    this.account$.subscribe((acc) => {
      if (acc) {
        this.loggedAccount = acc;
        if (this.loggedAccount.role === 'superadmin' || this.loggedAccount.role === 'admin') {
          this.assetOwnerId = this.data.idExposant;
        } else {
          this.assetOwnerId = this.loggedAccount._id;
        }

        this.store.dispatch(getRoomByUserRequested({ input: this.assetOwnerId }));

        if (this.data) {

          if (this.data.logo) {
            this.loadFile(this.data.logo, 'logo');
          } else {
            this.logoLoading = false;
          }

          if (Array.isArray(this.data.flyers) && this.data.flyers.length) {
            this.data.flyers.forEach(element => {
              this.loadFile(element, 'flyer');
            });
          } else {
            this.flyersLoading = false;
          }

          if (Array.isArray(this.data.gallery) && this.data.gallery.length) {
            this.data.gallery.forEach(element => {
              this.loadFile(element, 'gallery');
            });
          } else {
            this.galleryLoading = false;
          }

          if (Array.isArray(this.data.videos) && this.data.videos.length && !this.data.videos.map(v => v.name).includes(undefined)) {
            if (this.videoFiles.length) {
              this.videoFiles = [];
            }
            this.recursiveLoadVideo(this.data.videos, 0);
            // this.data.videos.forEach(element => {
            //   this.loadFile(element.name, 'video', element.index - 1); // element.index - 1: CONVENTION
            // });
            this.videoPreview.slice(0, this.data.videos.length);
            this.videoFiles.slice(0, this.data.videos.length);
          } else {
            this.videoLoading = false;
          }

        } else {
          this.logoLoading = false;
          this.videoLoading = false;
          this.flyersLoading = false;
          this.galleryLoading = false;
        }
      }
    });

    this.defaultContent$.subscribe((content) => {
      if (content && content[0]) {
        this.room$.subscribe(room => {
          if (room) {
            this.roomType = content[0].types.filter(e => e._id === room.type._id);
            if (this.roomType) { this.roomType = this.roomType[0]; }
            if (this.roomType && !this.videoFiles.length) {
              for (let u = 0; u < this.roomType.maxEcran; u++) {
                this.videoFiles.push(undefined);
              }
            }
            const roomVariant = content[0].variantes.filter(e => e._id === room.variant._id);
            if (roomVariant && roomVariant[0]) {
              this.imagePreviewForVideo = roomVariant[0].videoPreviewUrl;
            }
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  cancel(): void {
    this.uploading$.subscribe(uploading => {
      if (!uploading) {
        this.dialogRef.disableClose = false;
        this.dialogRef.close({ userId: this.assetOwnerId });
      } else {
        this.dialogRef.disableClose = true;
      }
    });
  }

  async save(): Promise<any> {
    this.confirmErrorMessage = undefined;
    let countBytes = 0;
    this.uploadProgress = 0;

    if (this.logoLoading || this.videoLoading || this.flyersLoading || this.galleryLoading) {
      this.confirmErrorMessage = 'Veuillez patienter s\'il vous plait';
      return;
    }

    if (this.loggedAccount && !this.errorMessage) {
      const multipleformVideo = [];

      const formData = new FormData();
      formData.append('idExposant', this.assetOwnerId);
      const names = [];

      // Logo
      if (this.logo) {
        names.push(this.logo.name);
        formData.append('logo', this.logo, this.logo.name);
        countBytes += this.logo.size;
      } else {
        this.confirmErrorMessage = 'Veuillez sélectionner un logo';
        return;
      }

      // Flyers
      if (Array.isArray(this.flyerFiles) && this.flyerFiles.length) {
        this.flyerFiles.forEach(e => {
          const fileExt = this.re.exec(e.name)[1];
          formData.append('flyers', e, `${this.renameFileIfExist(names, e.name.replace(`.${fileExt}`, ''))}.${fileExt}`);
          countBytes += e.size;
        });
      } else {
        this.confirmErrorMessage = 'Veuillez sélectionner au moins un flyer';
        return;
      }

      // Gallery
      if (Array.isArray(this.galleryFiles) && this.galleryFiles.length) {
        this.galleryFiles.forEach(e => {
          const fileExt = this.re.exec(e.name)[1];
          formData.append('gallery', e, `${this.renameFileIfExist(names, e.name.replace(`.${fileExt}`, ''))}.${fileExt}`);
          countBytes += e.size;
        });
      }

      // Videos
      const videoNames = [];
      if (Array.isArray(this.videoFiles) && this.videoFiles.length && this.roomType) {
        for (let u = 0; u < this.roomType.maxEcran; u++) {
          if (!this.videoFiles[u] || !this.videoFiles[u].name) {
            this.confirmErrorMessage = 'Veuillez ajouter des vidéos';
            return;
          } else {
            const fileExt = this.re.exec(this.videoFiles[u].name)[1];

            // add multiple form data
            const videoFormData = new FormData();
            const videoNewFn = `${this.renameFileIfExist(names, this.videoFiles[u].name.replace(`.${fileExt}`, ''))}.${fileExt}`;
            videoFormData.append('file', this.videoFiles[u], videoNewFn);
            countBytes += this.videoFiles[u].size;
            multipleformVideo.push(videoFormData);

            // add uploaded video data instead of file to form data
            videoNames.push(videoNewFn);
          }
        }
      } else {
        this.confirmErrorMessage = 'Veuillez ajouter des vidéos';
        return;
      }
      formData.append('videos', JSON.stringify(videoNames));

      // upload videos here
      this.totalUploadStats.totalFiles = this.videoFiles.length;
      this.dialogRef.disableClose = false;

      this.store.dispatch(uploadRequested({
        input: multipleformVideo[this.totalUploadStats.uploadedFiles]
      }));

      let tempUploaded = 0;
      this.uploadedBytes$.subscribe((b) => {
        if (b) {
          tempUploaded = b;
          this.uploadProgress = +((this.totalUploadStats.uploadedBytes + tempUploaded) / countBytes * 100).toFixed(2);
        } else {
          this.totalUploadStats.uploadedBytes += tempUploaded;
          tempUploaded = 0;
        }
      });

      this.uploading$.subscribe(uploadingFile => {
        if (!uploadingFile) {
          this.totalUploadStats.uploadedFiles++;
          // once all videos are uploaded
          if (!this.allVideoUploaded && this.totalUploadStats.uploadedFiles === this.totalUploadStats.totalFiles) {
            this.allVideoUploaded = true;
            if (this.data && this.data._id) {
              formData.append('_id', this.data._id);
              this.store.dispatch(assetUpdateRequested({
                param: this.data._id,
                body: formData
              }));
            } else {
              this.store.dispatch(assetSaveRequested({
                input: formData
              }));
            }
            let lastUploadStarted = false;

            this.uploading$.subscribe(uploading => {
              if (!uploading && lastUploadStarted) {
                this.serverError$.subscribe(serverErrorMessage => {
                  if (serverErrorMessage) {
                    this.errorMessage = serverErrorMessage;
                  } else {
                    this.dialogRef.close({ userId: this.assetOwnerId });
                  }
                });
              } else {
                lastUploadStarted = true;
                this.dialogRef.disableClose = true;
              }
            });
          }
          if (!this.allVideoUploaded && multipleformVideo[this.totalUploadStats.uploadedFiles]) {
            this.store.dispatch(uploadRequested({
              input: multipleformVideo[this.totalUploadStats.uploadedFiles]
            }));
          }
        }
      });
    }
  }

  selectFile(event, type): void {
    if (!event.target.files[0]) return;

    this.errorMessage = undefined;
    const reader = new FileReader();

    switch (type) {
      case 'logo': {
        this.selectedLogoExt = undefined;
        if (!this.validateExtension(event.target.files[0], ['svg', 'pdf', 'ai', 'eps'])) {
          this.errorMessage = 'Extension du logo invalide';
        } else {
          this.selectedLogoExt = this.re.exec(event.target.files[0].name)[1].toLowerCase();
          this.logoPreview = undefined;
          this.logo = event.target.files[0];
          reader.onload = e => this.logoPreview = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
          reader.readAsDataURL(this.logo);
          if (this.logo) {
            this.uploadFileOnSelect(event.target.files[0], 'logo');
          } else {
            this.confirmErrorMessage = 'Veuillez sélectionner un logo';
            return;
          }
        }
        break;
      }
    }
  }

  selectMultipleFile(type): void {
    this.errorMessage = undefined;
    let fileUpload;
    let arrayFiles;
    let extensionArray = [];
    let error = '';
    switch (type) {
      case 'flyer': {
        fileUpload = this.flyerInput.nativeElement;
        arrayFiles = this.flyerFiles;
        extensionArray = ['pdf'];
        error = 'Extension du flyer invalide';
        break;
      }
      case 'gallery': {
        fileUpload = this.galleryInput.nativeElement;
        arrayFiles = this.galleryFiles;
        extensionArray = ['png', 'jpg', 'jpeg'];
        error = 'Extension de l\'image invalide.';
        break;
      }
      case 'video': {
        fileUpload = this.videoInput.nativeElement;
        arrayFiles = this.videoFiles;
        extensionArray = ['mp4', 'avi'];
        error = 'Extension de la video invalide.';
        break;
      }
    }
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        if (!this.validateExtension(file, extensionArray)) {
          this.errorMessage = error;
        } else {
          const reader = new FileReader();
          arrayFiles.push(file);
          fileUpload.value = '';
          if (type === 'gallery') {
            reader.onload = e => this.galleryPreview.push(reader.result);
            reader.readAsDataURL(file);
            this.uploadFileOnSelect(file, 'gallery', arrayFiles.length - 1);
          } else if (type === 'flyer') {
            reader.onload = e => this.flyerPreview.push(this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any)));
            this.uploadFileOnSelect(file, 'flyer', arrayFiles.length - 1);
            reader.readAsDataURL(file);
          }
          //  else if (type === 'video') {
          //   reader.onload = e => this.videoPreview.push(this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any)));
          //   reader.readAsDataURL(file);
          //   this.uploadFileOnSelect(file, 'video', index);
          // }
        }
      }
    };
    fileUpload.click();
  }

  selectVideoFile(index): void {
    this.errorMessage = undefined;
    let fileUpload;
    let arrayFiles;
    let extensionArray = [];
    let error = '';
    fileUpload = this.videoInput.nativeElement;
    arrayFiles = this.videoFiles;
    extensionArray = ['mp4', 'avi'];
    error = 'Extension de la video invalide.';
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < fileUpload.files.length; i++) {
        const file = fileUpload.files[i];
        if (!this.validateExtension(file, extensionArray)) {
          this.errorMessage = error;
        } else if (file && file.size > 125000000) {
          this.errorMessage = 'La vidéo doit être inférieure à 125 Mo';
        } else {
          const reader = new FileReader();
          arrayFiles[index] = file;
          fileUpload.value = '';
          reader.onload = e => this.videoPreview[index] = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
          reader.readAsDataURL(file);
          this.uploadFileOnSelect(file, 'video', index); // ATTENTION: upload video by screen
        }
      }
    };
    fileUpload.click();
  }

  removeFile(type, i): void {

    let name;
    switch (type) {
      case 'flyer': {
        name = this.flyerFiles[i].name;
        this.flyerFiles.splice(i, 1);
        this.flyerPreview.splice(i, 1);
        break;
      }
      case 'gallery': {
        name = this.galleryFiles[i].name;
        this.galleryFiles.splice(i, 1);
        this.galleryPreview.splice(i, 1);
        break;
      }
    }

    if (this.data && this.data._id) {

      switch (type) {
        case 'flyer': {
          const newArray = this.data.flyers.slice().filter(item => item !== name);
          this.data.flyers = newArray;
          break;
        }
        case 'gallery': {
          const newArray = this.data.gallery.slice().filter(item => item !== name);
          this.data.gallery = newArray;
          console.log(`fn: ${name}; gallery =>`, this.data.gallery)
          break;
        }
      }

      this.store.dispatch(assetUpdateRequested({ param: this.data._id, body: this.data }));
      this.dialogRef.disableClose = true;
      this.uploading$.subscribe(uploading => {
        if (!uploading) {
          this.serverError$.subscribe(serverErrorMessage => {
            if (serverErrorMessage) {
              this.errorMessage = serverErrorMessage;
              this.dialogRef.disableClose = false;
            } else {
              this.dialogRef.disableClose = false;
            }
          });
        }
      });
    }
  }

  async loadFile(fileName, owner, index?): Promise<any> {
    if (fileName) {
      // this.downloadReport.startTime = new Date();
      const source = `${environment.SERVER_URL}/public/data/assets/${this.assetOwnerId}/${fileName}`;
      /**
       * PROGRESS
       */
      const response = await fetch(source);
      const responseReader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      const contentType = response.headers.get('Content-Type');
      let receivedLength = 0; // received that many bytes at the moment
      const chunks = []; // array of received binary chunks (comprises the body)
      while (true) {
        const { done, value } = await responseReader.read();
        if (done) {
          const responsePromised = new Promise((resolve, reject) => {
            if (response.ok) {
              const blb = new Blob(chunks, { type: contentType });
              resolve(blb);
            } else {
              reject(new Error('Something went wrong'));
            }
          });
          responsePromised
            .then((blob) => {
              const b: any = blob;
              b.lastModifiedDate = new Date();
              b.name = fileName;
              return b as File;
            })
            .then((file) => {
              const reader = new FileReader();
              switch (owner) {
                case 'logo': {
                  this.logo = file;
                  // reader.onload = e => this.logoPreview = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
                  // reader.readAsDataURL(this.logo);
                  this.selectedLogoExt = this.re.exec(fileName)[1].toLowerCase();
                  this.logoPreview = this.domSanitizer.bypassSecurityTrustResourceUrl(source);
                  this.logoLoading = false;
                  break;
                }
                case 'flyer': {
                  this.flyerFiles.push(file);
                  this.flyerPreview.push(
                    this.domSanitizer.bypassSecurityTrustResourceUrl(source)
                  );
                  this.flyersLoading = false;
                  break;
                }
                case 'video': {
                  this.videoFiles[index] = file;
                  reader.onload = e => this.videoPreview[index] = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
                  reader.readAsDataURL(file);
                  this.videoLoading = false;
                  break;
                }
                case 'gallery': {
                  this.galleryFiles.push(file);
                  this.galleryPreview.push(encodeURI(source));
                  this.galleryLoading = false;
                  break;
                }
              }
              // this.downloadReport.endTime = new Date();
            })
            .catch((error) => {
              console.log('error', error);
              switch (owner) {
                case 'logo': {
                  this.logo = undefined;
                  this.logoLoading = false;
                  break;
                }
                case 'flyer': {
                  this.flyersLoading = false;
                  break;
                }
                case 'video': {
                  this.videoFiles[index] = undefined;
                  break;
                }
                case 'gallery': {
                  this.galleryLoading = false;
                  break;
                }
              }
            });
          break;
        }
        // await this.delay(600);
        chunks.push(value);
        receivedLength += value.length;
        if (owner === 'video') {
          this.loadingProgress[index] = Math.round(receivedLength / contentLength * 100);
        }
      }
    }
  }

  validateExtension(file, expectedExtensions): boolean {
    let valid = true;
    if (!file
      || !file.name
      || !this.re.exec(file.name)[1]
      || !expectedExtensions.includes(this.re.exec(file.name)[1].toLowerCase())) {
      valid = false;
    }
    return valid;
  }

  closeDialog(): void {
    this.logo = undefined;
    this.flyerFiles = [];
    this.galleryFiles = [];
    this.videoFiles = [];

    this.logoPreview = undefined;
    this.videoPreview = [];
    this.flyerPreview = [];
    this.galleryPreview = [];
    this.dialogRef.close();
  }

  counter(i: number): number[] {
    return new Array(i);
  }

  renameFileIfExist(names, filename, level?): any {
    let newFn = filename;
    if (filename) {
      if (!level) {
        level = 0;
      }
      if (names.includes(filename)) {
        level++;
        const spliter = `(${level - 1})`;
        newFn = level === 0 ? `${filename} (${level})` : `${filename.split(spliter)[0].trim()} (${level})`;
        const existFn = this.renameFileIfExist(names, newFn, level);
        if (!existFn) {
          names.push(newFn);
        } else {
          newFn = existFn;
        }
      } else {
        if (level === 0) {
          names.push(newFn);
        } else {
          return undefined;
        }
      }
    }
    return newFn;
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getEstimatedTimeLeft(secondsLeft): any {
    if (secondsLeft) {
      if (secondsLeft > 3600) {
        // hours
        return (
          ' ' +
          moment(
            moment.duration(secondsLeft, 'seconds').asMilliseconds()
          ).format('HH:mm') +
          ' heure(s) restante(s)'
        );
      } else if (secondsLeft > 60) {
        // minutes
        return (
          ' ' +
          moment(
            moment.duration(secondsLeft, 'seconds').asMilliseconds()
          ).format('mm:ss') +
          ' minute(s) restante(s)'
        );
      } else if (secondsLeft < 1) {
        return ' < 1 seconde';
      } else {
        // seconds
        return (
          ' ' +
          moment(
            moment.duration(secondsLeft, 'seconds').asMilliseconds()
          ).format('ss') +
          ' seconde(s) restante(s)'
        );
      }
    }
    return null;
  }

  recursiveLoadVideo(videoList, index): any {
    if (Array.isArray(videoList) && videoList[index]) {
      if (!index) {
        index = 0;
      }
      this.loadFile(videoList[index].name, 'video', videoList[index].index - 1) // videoList[index].index - 1: CONVENTION
        .then(ok => {
          index = index + 1;
          if (index === videoList.length - 1) {
            this.videoLoading = false;
          }
          if (Array.isArray(videoList) && videoList[index]) {
            this.recursiveLoadVideo(videoList, index);
          }
        });
    }

  }

  uploadFileOnSelect(file, type, index?): any {
    let uploadState = 0;
    const asset: any = {};
    const fileFormData = new FormData();

    asset.idExposant = this.assetOwnerId;
    if (this.data && this.data._id) {
      asset._id = this.data._id;
    }

    const fileNewName = `${file.name.split('.').slice(0, -1).join('.')}_${Date.now()}.${this.re.exec(file.name)[1].toLowerCase()}`;
    let fileSize = 0;

    switch (type) {
      case 'logo':
        fileFormData.append('file', this.logo, fileNewName);
        asset.logo = fileNewName;
        fileSize = this.logo.size;
        break;
      case 'flyer':
        fileFormData.append('file', this.flyerFiles[index], fileNewName);
        asset.flyer = fileNewName;  // SEND a SINGLE element
        fileSize = this.flyerFiles[index].size;
        break;
      case 'gallery':
        fileFormData.append('file', this.galleryFiles[index], fileNewName);
        asset.gallery = fileNewName;  // SEND a SINGLE element
        fileSize = this.galleryFiles[index].size;
        break;
      case 'video':
        fileFormData.append('file', this.videoFiles[index], fileNewName);
        asset.video = {  // SEND a SINGLE element
          name: fileNewName,
          index: index + 1
        };
        fileSize = this.videoFiles[index].size;
        break;
    }

    this.store.dispatch(uploadRequested({
      input: fileFormData
    }));
    uploadState = 1;
    this.dialogRef.disableClose = true;

    this.uploadedBytes$.subscribe((b) => {
      if (b && uploadState == 1) {
        this.uploadProgress = +(b / fileSize * 100).toFixed(2);
      }
    });

    this.uploading$.subscribe(uploading => {
      if (!uploading && uploadState === 1) {
        this.uploadProgress = 0;
        uploadState = 2;
        this.totalUploadStats = {
          totalFiles: 0,
          uploadedFiles: 0,
          uploadedBytes: 0,
          totalBytes: 0
        };
        if (this.assetOwnerId) {
          const id = (this.data && this.data._id) ? this.data._id : 'undefined';

          this.store.dispatch(assetUpdateItemRequested({
            param: id,
            body: asset
          }));
        }
      } else if (!uploading && uploadState === 2) {
        uploadState = 3;
        this.serverError$.subscribe(serverErrorMessage => {
          if (serverErrorMessage) {
            this.errorMessage = serverErrorMessage;
            this.dialogRef.disableClose = false;
          } else {
            this.recentlyAddedAsset$.subscribe(asset => {
              if (asset) {
                this.data = JSON.parse(JSON.stringify(asset));
              }
            });
            this.dialogRef.disableClose = false;
            return;
          }
        });
      }
    });
  }
}
