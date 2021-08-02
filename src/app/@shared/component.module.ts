import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardCheckableComponent } from './card-checkable/card-checkable.component';
import { MatCardImage, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImgLoaderComponent } from './img-loader/img-loader.component';
import { SimpleCardClickableComponent } from './simple-card-clickable/simple-card-clickable.component';
import { PreviewCardComponent } from './preview-card/preview-card.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    SideNavComponent,
    ConfirmDialogComponent,
    SnackbarComponent,
    CardCheckableComponent,
    SearchBarComponent,
    ImgLoaderComponent,
    SimpleCardClickableComponent,
    PreviewCardComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatRippleModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    SnackbarComponent,
    SideNavComponent,
    CardCheckableComponent,
    SearchBarComponent,
    SimpleCardClickableComponent,
    PreviewCardComponent,
  ],
})
export class ComponentModule {}
