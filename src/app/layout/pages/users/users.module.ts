import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAddModalComponent } from './user-add-modal/user-add-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvatarModule } from 'ngx-avatar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ComponentModule } from 'src/app/shared/component.module';
import { UserDetailModalComponent } from './user-detail-modal/user-detail-modal.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AvatarModule,
    MatPaginatorModule,
    ComponentModule,
    FlexLayoutModule
  ],
  declarations: [UsersComponent, UserEditModalComponent, UserAddModalComponent, UserDetailModalComponent]
})
export class UsersModule { }
