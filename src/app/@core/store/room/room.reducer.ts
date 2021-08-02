import { createReducer, on } from '@ngrx/store';
import * as roomActions from './room.action';

import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { RoomEntry, RoomState } from '../../schema/room.shema';

export const adapter: EntityAdapter<RoomEntry> = createEntityAdapter<RoomEntry>({
  selectId: (entry) => entry._id,
});

export const initialState: RoomState = adapter.getInitialState({
  loading: false,
  isSaving: false,
  errorMessage: undefined,
});

export const roomReducer = createReducer(
  initialState,
  on(roomActions.addRoomRequested, (state) => ({
    ...state,
    isSaving: true,
    errorMessage: undefined
  })),

  on(roomActions.getAllRoomsRequested, roomActions.getRoomByUserRequested, (state) => ({
    ...state,
    loading: true,
  })),

  on(roomActions.updateRoomRequested, (state) => ({
    ...state,
    isSaving: true,
  })),

  on(roomActions.addRoomSuccess, (state, { entry }) => {
    return adapter.addOne(entry, {
      ...state,
      isSaving: false,
    });
  }),

  on(roomActions.getAllRoomsSuccess, (state, { entries }) => {
    return adapter.setAll(entries, {
      ...state,
      loading: false,
    });
  }),

  on(roomActions.getRoomByUserSuccess, (state, { entry }) => ({
    ...state,
    loading: false,
    userRoom: entry
  })),

  on(roomActions.updateRoomSuccess, (state, { entry }) => {
    return adapter.updateOne(
      {
        id: entry._id,
        changes: entry,
      },
      {
        ...state,
        isSaving: false,
      }
    );
  }),

  on(
    roomActions.addRoomFail,
    roomActions.getAllRoomsFail,
    roomActions.updateRoomFail,
    roomActions.getRoomByUserFail,
    (state, { errorMessage }) => {
      return {
        ...state,
        loading: false,
        isSaving: false,
        errorMessage,
      };
    }
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
