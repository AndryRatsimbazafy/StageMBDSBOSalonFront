import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ContentEffects } from './content.effect';
import { contentReducer } from './content.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('contents', contentReducer),
    EffectsModule.forFeature([ContentEffects]),
  ],
})
export class ContentModule {}
