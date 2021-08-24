import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorComponent } from './configurator.component';
import { MatSelectModule } from '@angular/material/select';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { ComponentModule } from 'src/app/shared/component.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ConfiguratorConfirmedComponent } from './configurator-confirmed/configurator-confirmed.component';
import { ConfiguratorConfirmedPreviewDialogComponent } from './configurator-confirmed-preview-dialog/configurator-confirmed-preview-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    NgxMatColorPickerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    ComponentModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    DeferLoadModule
  ],
  declarations: [ConfiguratorComponent, ConfiguratorConfirmedComponent, ConfiguratorConfirmedPreviewDialogComponent],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
})
export class ConfiguratorModule { }
