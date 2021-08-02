import {MediaChatState} from './media-chat.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export const selectStore = createFeatureSelector('media');

export const selectMediaChat = (key: string) => createSelector(
  selectStore,
  (state: MediaChatState) => state[key]
);

export const selectAudioVideoChat = createSelector(
  selectStore,
  (state: MediaChatState) => ({
    video: state.video,
    audio: state.audio,
    screenSharing: state.screenSharing
  })
);
