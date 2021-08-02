import { createAction, props } from '@ngrx/store';
import {MediaChatState} from './media-chat.state';

const source = 'Media';

export const initMediaStore = createAction(
  `[${source}] init`
);

export const updateMediaStore = createAction(
  `[${source}] update`,
  props<{ entry: MediaChatState }>()
);
