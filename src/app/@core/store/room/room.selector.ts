import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoomState } from '../../schema/room.shema';
import * as fromRoom from './room.reducer';

export const getRouteState = createFeatureSelector<RoomState>('rooms');

export const selectRoomState = createSelector(
  getRouteState,
  (state) => state
);

export const selectAllRooms = createSelector(
  selectRoomState,
  fromRoom.selectAll
);

export const selectAllRoomIds = createSelector(
  selectRoomState,
  fromRoom.selectIds
);

export const selectRoomId = createSelector(selectAllRooms, (entries) => {
  return entries.map((entry) => entry._id);
});

export const selectRoom = createSelector(selectAllRooms, (entries, _id) => {
  return entries.filter((entry) => entry._id === _id).map((entry) => entry);
});

export const selectRoomLoading = createSelector(
  selectRoomState,
  ({ loading }) => loading
);

export const selectRoomSaving = createSelector(
  selectRoomState,
  ({ isSaving }) => isSaving
);

export const selectUserRoom = createSelector(
  selectRoomState,
  ({ userRoom }) => userRoom
);

export const selectRoomError = createSelector(
  selectRoomState,
  ({ errorMessage }) => errorMessage
);
