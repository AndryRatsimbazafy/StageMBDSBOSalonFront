import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AssetEffects } from './asset.effect';
import { AssetReducer } from './asset.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('', AssetReducer),
    EffectsModule.forFeature([AssetEffects]),
  ],
})
export class AssetModule {}
