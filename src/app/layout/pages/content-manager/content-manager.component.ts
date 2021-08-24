import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ContentEntry } from 'src/app/core/schema/content.schema';
import {
  addContentRequested,
  getContentRequested,
  updateContentRequested,
} from 'src/app/core/store/content/content.action';
import {
  selectAllContents,
  selectContentMob,
  selectContentPersonnage,
  selectContentSaving,
  selectContentTypes,
  selectContentVariantes,
  selectDefaultContent,
} from 'src/app/core/store/content/content.selector';

@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss'],
})
export class ContentManagerComponent implements OnInit, OnDestroy {
  standTypeForm: FormGroup;
  standVarianteForm: FormGroup;
  mobForm: FormGroup;
  personnageForm: FormGroup;

  standTypes: FormArray = this.formBuilder.array([]);
  standVariantes: FormArray = this.formBuilder.array([]);
  mob: FormArray = this.formBuilder.array([]);
  personnages: FormArray = this.formBuilder.array([]);

  contentId: string;
  types = [];

  isSaving$: Observable<boolean>;

  unsubscribeAll: Subject<boolean>;

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.store.dispatch(getContentRequested());
    this.store
      .pipe(
        select(selectDefaultContent), 
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((result) => {
        if (result && result[0]) {
          this.types = result[0].types;
        }
      });

    this.getContentId();

    this.isSaving$ = this.store.select(selectContentSaving);

    this.createStandTypeForm();
    this.createStandVarianteForm();
    this.createMobForm();
    this.createPersonnage();

    this.initializeStandTypes();
    this.initializeStandVariantes();
    this.initializeMob();
    this.initializePersonnages();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  getContentId(): any {
    this.store
      .pipe(
        select(selectAllContents),
        map((result) => {
          if (result && result[0]) {
            return result[0]._id;
          }
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((result) => {
        if (result) {
          this.contentId = result;
        }
      });
  }

  createItem(formArray: FormArray): void {
    formArray.push(
      this.formBuilder.group({
        url: ['', Validators.required],
        idTypes: ['', Validators.required],
        name: ['', Validators.required],
      })
    );
  }

  createItemPersonnage(formArray: FormArray): void {
    formArray.push(
      this.formBuilder.group({
        url: ['', Validators.required],
        name: ['', Validators.required],
        types: ['', Validators.required],
      })
    );
  }

  createItemStandType(formArray: FormArray): void {
    formArray.push(
      this.formBuilder.group({
        url: ['', Validators.required],
        name: ['', Validators.required],
        maxPersonnage: ['1', Validators.required],
        maxEcran: ['1', Validators.required],
      })
    );
  }

  createItemVariantType(formArray: FormArray): void {
    formArray.push(
      this.formBuilder.group({
        url: ['', Validators.required],
        idTypes: ['', Validators.required],
        name: ['', Validators.required],
        videoPreviewUrl: ['', Validators.required],
      })
    );
  }

  removeItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  validateItems(form: FormGroup): void {
    if (form.invalid) {
      return;
    }
    this.store.dispatch(
      updateContentRequested({ param: this.contentId, body: form.value })
    );
  }

  createContentOnDatabase(): Observable<ContentEntry[]> {
    this.store.dispatch(addContentRequested({ input: { content: {} } }));
    return this.store.select(selectAllContents);
  }

  checkError(form: FormGroup, controlName: string, errorName: string): any {
    return form.controls[controlName].hasError(errorName);
  }

  /**
   * Create stand forms
   * initialize form Groupes with empty form arrays
   */
  createStandTypeForm(): void {
    this.standTypeForm = this.formBuilder.group({
      types: this.standTypes,
    });
  }

  createStandVarianteForm(): void {
    this.standVarianteForm = this.formBuilder.group({
      variantes: this.standVariantes,
    });
  }

  createMobForm(): void {
    this.mobForm = this.formBuilder.group({
      mob: this.mob,
    });
  }

  createPersonnage(): void {
    this.personnageForm = this.formBuilder.group({
      personnages: this.personnages,
    });
  }

  /**
   * initialize form arrays
   * get data from server and push to form arrays
   */

  initializeStandTypes(): void {
    this.store
      .pipe(
        select(selectContentTypes),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((contents) => {
        if (contents && contents[0]) {
          const types = contents[0];
          this.standTypes.clear();
          for (const type of types) {
            this.standTypes.push(
              this.formBuilder.group({
                _id: [type._id],
                name: [type.name, Validators.required],
                url: [type.url, Validators.required],
                maxPersonnage: [type.maxPersonnage, Validators.required],
                maxEcran: [type.maxEcran, Validators.required],
              })
            );
          }
        }
      });
  }

  initializeStandVariantes(): void {
    this.store
      .pipe(
        select(selectContentVariantes),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((contents) => {
        if (contents && contents[0]) {
          const types = contents[0];
          this.standVariantes.clear();

          for (const type of types) {
            this.standVariantes.push(
              this.formBuilder.group({
                name: [type.name, Validators.required],
                idTypes: [type.idTypes, Validators.required],
                url: [type.url, Validators.required],
                videoPreviewUrl: [type.videoPreviewUrl, Validators.required],
              })
            );
          }
        }
      });
  }

  initializeMob(): void {
    this.store
      .pipe(
        select(selectContentMob), 
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((contents) => {
        if (contents && contents[0]) {
          const types = contents[0];
          this.mob.clear();
          for (const type of types) {
            this.mob.push(
              this.formBuilder.group({
                name: [type.name, Validators.required],
                idTypes: [type.idTypes, Validators.required],
                url: [type.url, Validators.required],
              })
            );
          }
        }
      });
  }

  initializePersonnages(): void {
    this.store
      .pipe(
        select(selectContentPersonnage), 
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((contents) => {
        if (contents && contents[0]) {
          const types = contents[0];
          this.personnages.clear();
          for (const type of types) {
            this.personnages.push(
              this.formBuilder.group({
                name: [type.name, Validators.required],
                url: [type.url, Validators.required],
                types: [type.types, Validators.required],
              })
            );
          }
        }
      });
  }
}
