import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeConfigurationComponent } from './liste-configuration.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentModule } from 'src/app/@shared/component.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [ListeConfigurationComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    ComponentModule,
    MatPaginatorModule
  ]
})
export class ListeConfigurationModule { }
