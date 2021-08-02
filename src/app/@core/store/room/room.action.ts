import { createAction, props } from '@ngrx/store';
import { RoomEntry } from '../../schema/room.shema';

const source = 'room';

// add room
export const addRoomRequested = createAction(
    `[${source}] add room requested`,
    props<{ input: RoomEntry }>()
);

export const addRoomSuccess = createAction(
    `[${source}] add room success`,
    props<{ entry: RoomEntry }>()
);

export const addRoomFail = createAction(
    `[${source}] add room fail`,
    props<{ errorMessage: any }>()
);

// Get room
export const getAllRoomsRequested = createAction(
    `[${source}] get rooms requested`
);

export const getAllRoomsSuccess = createAction(
    `[${source}] get room success`,
    props<{ entries: RoomEntry[] }>()
);

export const getAllRoomsFail = createAction(
    `[${source}] get room fail`,
    props<{ errorMessage: any }>()
);

// Get room by user
export const getRoomByUserRequested = createAction(
    `[${source}] get room by user requested`,
    props<{ input: string }>()
);

export const getRoomByUserSuccess = createAction(
    `[${source}] get room by user success`,
    props<{ entry: RoomEntry }>()
);

export const getRoomByUserFail = createAction(
    `[${source}] get room by user fail`,
    props<{ errorMessage: any }>()
);

// update room
export const updateRoomRequested = createAction(
    `[${source}] update room requested`,
    props<{ param: string, body: any }>()
);

export const updateRoomSuccess = createAction(
    `[${source}] update room success`,
    props<{ entry: RoomEntry }>()
);

export const updateRoomFail = createAction(
    `[${source}] update room fail`,
    props<{ errorMessage: any }>()
);
