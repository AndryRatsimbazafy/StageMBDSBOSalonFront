import {MediaChatState} from './media-chat.state';
import {createReducer, on} from '@ngrx/store';
import * as MediaChatActions from './media-chat.action';

const initialState: MediaChatState = {
  room: undefined,
  name: undefined,
  socketId: undefined,
  peerId: undefined,
  hasMyVideoStream: false,
  audio: false,
  video: false,
  screenSharing: false,
  isCalling: false,
  isRinging: false,
  remoteSocketId: undefined,
  remoteUserName: undefined
};

export const MediaChatReducer = createReducer(
  initialState,
  on(MediaChatActions.initMediaStore, state => state),
  on(MediaChatActions.updateMediaStore, (state, payload) => {
    return {
      ...state,
      ...payload.entry
    };
  })
);
