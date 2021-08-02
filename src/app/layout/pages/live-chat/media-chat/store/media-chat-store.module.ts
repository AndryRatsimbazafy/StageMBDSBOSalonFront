import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {environment} from '../../../../../../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {MediaChatReducer} from './media-chat.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(
      'media', MediaChatReducer
    ),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class MediaChatStoreModule { }
