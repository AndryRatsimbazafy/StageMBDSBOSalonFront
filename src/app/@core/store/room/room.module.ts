import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RoomEffects } from './room.effect';
import { roomReducer } from './room.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('rooms', roomReducer),
    EffectsModule.forFeature([RoomEffects]),
  ],
})
export class RoomModule {}
