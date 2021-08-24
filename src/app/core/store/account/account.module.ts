import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AccountEffects } from './account.effect';
import { AccountReducer } from './account.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('account', AccountReducer),
    EffectsModule.forFeature([AccountEffects]),
  ],
})
export class AccountModule {}
